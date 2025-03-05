import mysql from "mysql2/promise";
import type { Connection } from 'mysql2/promise';
import { DB_NAME, DB_URL, DB_USER, DB_PASSWORD, SECRET } from '$env/static/private';
import type { Cookies } from "@sveltejs/kit";
import { sha512 } from "js-sha512";
import jwt from 'jsonwebtoken';
import { generateKeyPairSync, privateDecrypt, constants } from "crypto";

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  

export function openCon():Promise<Connection> {
    return mysql.createConnection({
        host: DB_URL,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
    });
}

export let challenges:Map<string, number> = new Map();

export async function Challenge(request: Request) {
    const data = await request.formData();
    let time = Date.now();
    challenges.set(`${data.get('email')}`,time);
    return {request: "challenge", timestamp: time}
}

export async function LogIn(cookies: Cookies, request: Request) {

    let conn = await openCon();
    const data = await request.formData();
    try {       
        const [pwd] = await conn.query<mysql.RowDataPacket[]>(`SELECT password FROM users WHERE email=?;`, [data.get('email')]);
        conn.end();
        if(sha512(pwd[0].password + challenges.get(String(data.get("email")))) == data.get("password")) {
            cookies.set("session", jwt.sign({ data: data.get("email") }, SECRET, { expiresIn: '1h' }), { path: "/"});
            challenges.delete(String(data.get("email")));
            return {request: "login", code:200, description: "ok"};
        } else {
            return {request: "login", code: 500, description: "fail"};
        }
    } catch (error) {
        console.error("Got an error!!!");
        console.log(error);
        conn.end();
        return {request: "login", code: 500, description: "fail"};
    }
}

export async function Key() {
    return {request: "key", key: publicKey};
}

export async function SingUp(cookies: Cookies, request: Request) {
    let conn = await openCon()
    const data = await request.formData();
    let cypher = data.get("password"); 
    const plain = (privateDecrypt(
        {
            key: privateKey,
            padding: constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
          }, 
          Buffer.from(String(cypher), "base64")));
    try {
        await conn.query(`INSERT INTO users(email, password, name, surname) VALUES (?,?,?,?);`, [data.get('email'), plain, data.get('name'), data.get('surname')]);
        cookies.set("session", jwt.sign({ data: data.get("email") }, SECRET, { expiresIn: '1h' }), { path: "/"});
        return {request: "signup", code:200, description: "ok"};
    } catch (error) {
        console.error("Got an error!!!");
        console.log(error);
        conn.end();
        return error;
    }
}