import { DbApi } from "./DbApi.js";

export interface DbConfig {
    api: DbApi;
    name: string;
    user: string;
    password: string;
    live?: boolean;
    use_unicode?: boolean;
    timeout?: number;
}
