import pg from 'pg';
import { DbConfig } from '../types/DbConfig';
import { DbConnection } from '../types/DbConnection';

import dayjs from 'dayjs';

const { Client, types } = pg;

pg.types.setTypeParser(types.builtins.TIMESTAMPTZ, (value) => {
    const parsed = dayjs(value);

    return parsed.format();
});

pg.types.setTypeParser(types.builtins.DATE, (value) => {
    const parsed = dayjs(value);

    return parsed.format('YYYY-MM-DD');
});


export default class Postgres implements DbConnection {
    private _client: pg.Client;
    private _connected: boolean = false;

    constructor(client: pg.Client) {
        this._client = client;
        this._connected = true;

        this._client.on("error", (err: Error) => {
            this._connected = false;
            console.debug(err);
        });

        this._client.on("end", () => {
            this._connected = false;
        });
    }

    public static async create(config: DbConfig): Promise<DbConnection> {
        const connectionString = `${config.api}://${config.user}:${config.password}@${config.name}`;
        const timeout = (config?.timeout ?? 300) * 1000;

        const client = new Client({
            connectionString: connectionString,
            query_timeout: timeout,
            ssl: {
                rejectUnauthorized: false,
            }
        });

        await client.connect();

        return new Postgres(client);
    }

    check(): boolean {
        return this._connected;
    }

    async query(sqlCmd: string, values?: []): Promise<any> {
        const query = {
            // give the query a unique name
            name: `lua-postgres-query`,
            text: sqlCmd,
            values: values ?? []
        }

        const { fields, rows } = await this._client.query(query);

        return rows;
    }

    async execute(sqlCmd: string, values?: []): Promise<any> {
        const query = {
            // give the query a unique name
            name: `lua-postgres-query`,
            text: sqlCmd,
            values: values ?? []
        }

        return this._client.query(query);
    }

    async close(): Promise<void> {
        await this._client.end();
    }
}
