import handler from "@patients/core/handler";
import { APIGatewayProxyEvent } from "aws-lambda";
import dynamoDb from "@patients/core/dynamodb";

import { LuaFactory } from "wasmoon";
import { connect } from "@patients/core/lua/bindings/database";
import { DbConfig } from "@patients/core/lua/bindings/types/DbConfig";
import { DbConnection } from "@patients/core/lua/bindings/types/DbConnection";
import { Table } from "sst/node/table";
import { ClientType } from "src/types/ClientType";


export const main = handler(async (event: APIGatewayProxyEvent) => {
    const luaOpts = {
        openStandardLibs: true,
        injectObjects: true,
        enableProxy: false,
        traceAllocations: false,
    };

    // Create the lua environment
    const factory = new LuaFactory();
    const lua = await factory.createEngine(luaOpts);

    await factory.mountFile('db.lua', `
        local db = {}

        db.POSTGRES = "postgresql"
        db.MY_SQL = "mysql"


        do -- Create scope
            local DbContext = {}

            function DbContext.new(client)
                local instance = {client = client}
            
                return setmetatable(instance, {__index = DbContext})
            end

            function DbContext:check()
                return self.client.check():await()
            end

            function DbContext:query(sqlCmd)
                return self.client.query(sqlCmd):await()
            end

            function DbContext:execute(sqlCmd)
                return self.client.execute(sqlCmd):await()
            end

            function DbContext:close()
                self.client.close():await()
            end

            function db.connect(config)
                local client =  js_connect(config):await()

                local dbContext = DbContext.new(client)

                return dbContext
            end
        end

        return db
    `);

    let db: DbConnection | undefined;

    const params = {
        TableName: Table.Clients.tableName,
        // 'Key' defines the partition key and sort key of
        // the item to be retrieved
        Key: {
            clientId: event?.pathParameters?.id, // The id of the client
        },
    };

    const result = await dynamoDb.get(params);
    if (!result.Item) {
        throw new Error("Item not found.");
    }

    const client: ClientType = result.Item;

    try {
        lua.global.set('js_connect', async (config: DbConfig) => {
            db = await connect(config);

            return {
                close: () => db?.close(),
                check: () => db?.check(),
                query: (sqlCmd: string, values: []) => db?.query(sqlCmd, values),
                execute: (sqlCmd: string, values: []) => db?.execute(sqlCmd, values),
            }
        });

        await lua.doString('db = require("db")');

        await lua.doString(`${client.luaScript}`);

        const result = await lua.doString(`
            return main();
        `);

        return JSON.stringify(result);
    } finally {
        await db?.close();
        lua.global.close();
    }
});