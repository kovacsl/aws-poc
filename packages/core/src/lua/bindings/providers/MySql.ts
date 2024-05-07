import { ConnectionString } from 'connection-string';
import mysql from "mysql2/promise";

import { DbConfig } from '../types/DbConfig';
import { DbConnection } from '../types/DbConnection';

export default class MySql implements DbConnection {
    private _client: mysql.Connection;
    private _connected: boolean = false;

    constructor(client: mysql.Connection) {
        this._client = client;
        this._connected = true;

        this._client.on("error", (err:Error) => {
            this._connected = false;
            console.debug(err);
        });

        this._client.on("release", () => {
            this._connected = false;
        });
    }

    public static async create(config: DbConfig): Promise<DbConnection>  {
        const { hosts, path } = new ConnectionString(config.name);

        const client = await mysql.createConnection({
            host: hosts?.shift()?.name,
            port: hosts?.shift()?.port,
            user: config.user,
            password: config.password,
            database: path?.shift(),
        });

        await client.connect();

        return new MySql(client);
    }

    check(): boolean {
        return this._connected;
    }

    async query(sqlCmd: string): Promise<any> {
        return await this._client.query(sqlCmd);
    }

    async execute(sqlCmd: string): Promise<any> {
        return await this._client.execute(sqlCmd);
    }

    async close(): Promise<void> {
        return new Promise((resolve) => this._client.destroy());
    }
}
