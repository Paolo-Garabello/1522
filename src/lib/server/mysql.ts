import mysql from "mysql2/promise";
import type { Connection } from 'mysql2/promise';
import { DB_NAME, DB_URL, DB_USER, DB_PASSWORD } from '$env/static/private';


export function openCon():Promise<Connection> {
    return mysql.createConnection({
        host: DB_URL,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
    });
}