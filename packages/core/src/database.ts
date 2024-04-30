import pg from "./postgres";
import mysql from "./mysql";


export default {
    create: async (databaseProvider: string | undefined, databaseUrl: string | undefined, record: any): Promise<any> => {
        return databaseProvider === "postgresql" ? pg.create(databaseUrl, record) : mysql.create(databaseUrl, record);
    },
    update: async (databaseProvider: string | undefined, databaseUrl: string, id: string| undefined, record: any): Promise<any> => {
        return databaseProvider === "postgresql" ? pg.update(databaseUrl, id ?? '', record) : mysql.update(databaseUrl, id ?? '', record);
    },
    list: async (databaseProvider: string | undefined, databaseUrl: string, limit: string | null = null, offset: string | null = null): Promise<any> => {
        return databaseProvider === "postgresql" ? pg.list(databaseUrl, limit, offset) : mysql.list(databaseUrl, limit, offset);
    },
    get: async (databaseProvider: string | undefined, databaseUrl: string, id: string | undefined): Promise<any> => {
        return databaseProvider === "postgresql" ? pg.get(databaseUrl, id ?? '') : mysql.get(databaseUrl, id ?? '');
    },
    delete: async (databaseProvider: string | undefined, databaseUrl: string, id: string | undefined): Promise<any> => {
        return databaseProvider === "postgresql" ? pg.delete(databaseUrl, id ?? '') : mysql.delete(databaseUrl, id ?? '');
    }
}