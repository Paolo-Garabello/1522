import { SECRET } from '$env/static/private';
import type { Actions } from './$types';
import { openCon } from '$lib/server/utility.js';
import mysql from "mysql2/promise";
import jwt from 'jsonwebtoken';
import { sha512 } from 'js-sha512';
import { LogIn, Challenge, Key, SingUp } from "$lib/server/utility";

export async function load({ cookies }) {
    const errRes = {logged: false, email: "email", name: "name", surname: "surname", role: "role", tickets: []};
    try {
        if(cookies.get("session")) {
            const email = (jwt.verify(String(cookies.get("session")), SECRET) as any).data;
            if(email) {
                const conn = await openCon();
                try {   
                    const [user] = await conn.query<mysql.RowDataPacket[]>(`SELECT name, surname, role FROM users WHERE email=?;`, [email]);
                    let res = {logged: true, email: email, name: user[0].name, surname: user[0].surname, role: user[0].role, tickets: [{}]}
                    let tickets: mysql.RowDataPacket[];
                    if(user[0].role == "user") {
                        [tickets] = await conn.query<mysql.RowDataPacket[]>('SELECT t.name, t.surname, title, description, open, users.email as assignedTo FROM tickets t JOIN users ON assigned=users.id WHERE t.email=?', [email]);
                    } else if (user[0].role == "operator") {
                        [tickets] = await conn.query<mysql.RowDataPacket[]>('SELECT id, name, surname, title, description, open, email FROM tickets WHERE assigned=(SELECT id FROM users WHERE email=?)', [email]);
                    } else {
                        [tickets] = await conn.query<mysql.RowDataPacket[]>('SELECT t.id,t.name, t.surname, title, description, open, t.email, users.email as assignedTo FROM tickets t JOIN users ON assigned=users.id');
                    }
                    res.tickets = tickets;
                    conn.end();
                    return res;
                } catch (err) {
                    console.log(err);
                    conn.end();
                    return errRes;
                }
            } else {
                return errRes;

            }
        }
    } catch (err) {
        cookies.delete("session", {path: "/"});
        return errRes;
    }
} 

export const actions = {
    addOp: async ({ request }) => {
        let conn = await openCon();
        const data = await request.formData();
        try {
            await conn.query(`INSERT INTO users(email, password, name, surname, role) VALUES ('${data.get('email')}','${sha512(String(data.get('password')))}','${data.get('name')}','${data.get('surname')}', 'operator');`);
            conn.end();
        } catch (error) {
            console.error("Got an error!!!");
            console.log(error);
            conn.end();
            return error;
        }
    },
    changeStatus: async ({ request }) => {
        let conn = await openCon();
        const data = await request.formData();
        try {
            await conn.query("UPDATE tickets SET open=? WHERE id=?", [Number(data.get("status")), data.get("id")]);
            conn.end();
        } catch (error) {
            conn.end();
            console.log(error);
        }
    },
    challenge: async ({request}) => {
        return Challenge(request);
    },
    login: async ({ cookies, request}) => {
        return await LogIn(cookies, request);
    },
    key: async () => {
        return Key();
    },
    signup: async ({cookies, request}) => {
        return SingUp(cookies, request);
    },
    signout: async ({cookies}) => {
        cookies.delete("session", {path: "/"});
    }
} satisfies Actions;