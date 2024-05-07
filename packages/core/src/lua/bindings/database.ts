import { DbApi } from "./types/DbApi";
import { DbConfig } from "./types/DbConfig";
import { DbConnection } from "./types/DbConnection";
import MySql from "./providers/MySql";
import Postgres from "./providers/Postgres";

export async function connect(config: DbConfig): Promise<DbConnection> {
    if (config.api === DbApi.POSTGRES) {
        return Postgres.create(config);
    }

    return MySql.create(config);
}