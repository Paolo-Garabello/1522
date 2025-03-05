import type { Actions } from './$types';
import { openCon } from "$lib/server/mysql";
import jwt from 'jsonwebtoken';
import { sha512 } from 'js-sha512';
import mysql from "mysql2/promise";
import { generateKeyPairSync, privateDecrypt, constants } from "crypto";
import { SECRET } from '$env/static/private';

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

let challenges:Map<string, number> = new Map();

export const actions = {
    challenge: async ({request}) => {
        const data = await request.formData();
        let time = Date.now();
        challenges.set(`${data.get('email')}`,time);
        return {request: "challenge", timestamp: time}
    },
	login: async ({ cookies, request}) => {
        let conn = await openCon();
        const data = await request.formData();
        try {       
            const [pwd] = await conn.query<mysql.RowDataPacket[]>(`SELECT password FROM users WHERE email=?;`, [data.get('email')]);
            conn.end();
            if(sha512(pwd[0].password + challenges.get(String(data.get("email")))) == data.get("password")) {
            cookies.set("session", jwt.sign({ data: data.get("email") }, SECRET, { expiresIn: '1h' }), { path: "/"});
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
	},
    key: async () => {
        return {request: "key", key: publicKey};
    },
    signup: async ({cookies, request}) => {
        let conn = await openCon()
        const data = await request.formData();
        let cypher = data.get("password"); 
        const plain = (privateDecrypt(
            {
                key: privateKey,
                padding: constants.RSA_PKCS1_OAEP_PADDING, // Explicitly set OAEP padding
                oaepHash: "sha256", // Must match the encryption hash!
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
    },
    signout: async ({cookies}) => {
        cookies.delete("session", {path: "/"});
    }

} satisfies Actions;

export function load({ cookies }) {
    try {
        if(cookies.get("session"))
            return {logged: true};
    } catch (error) {
        cookies.delete("session", {path: "/" });   
    }
    
    return {logged: false};
} 