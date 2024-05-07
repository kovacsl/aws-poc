export interface DbConnection {
    query: (sqlCmd: string, values?: []) => Promise<any>;
    execute: (sqlCmd: string, values?: []) => Promise<any>;
    close: () => Promise<void>;
    check: () => boolean;
}