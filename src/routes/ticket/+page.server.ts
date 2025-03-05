import type { Actions } from './$types';
import { openCon } from '$lib/server/mysql';
import jwt from "jsonwebtoken";
import { SECRET } from '$env/static/private';
import mysql from "mysql2/promise";

 
export async function load({ cookies }) {
	let res = {logged: false, name: "", surname: "", email: ""};
	try {
		if(cookies.get("session")) {
			const conn = await openCon();
			try {
				const email = (jwt.verify(String(cookies.get("session")), SECRET) as any).data;
				const [data] = await conn.query<mysql.RowDataPacket[]>("SELECT name, surname FROM users WHERE email=?;", [email]);
				conn.end()
				return {logged: true, name: data[0].name, surname: data[0].surname, email: email}
			} catch (error) {
				console.log(error);
				conn.end();
				return res;
			}
		} else {
			return res
		}
	} catch (error) {
        cookies.delete("session", {path: "/"});
		return res
	}
};


export const actions = {
	open: async ({ request }) => {
		const data = await request.formData();
		const conn = await openCon();
		try {       
			const [op] = await conn.query<mysql.RowDataPacket[]>("SELECT u.id op, COUNT(t.id) as openTicket FROM users u LEFT JOIN tickets t ON u.id = t.assigned AND t.open = 1 WHERE u.role = 'operator' GROUP BY u.id ORDER BY openTicket ASC LIMIT 1;");
			console.log(op);
			conn.query("INSERT INTO tickets(name, surname, email, title, description, assigned) VALUES(?,?,?,?,?,?);", [data.get("name"), data.get("surname"), data.get("email"), data.get("title"), data.get("description"), op[0].op]);
			conn.end();
			return { success: true };
		} catch (error) {
			console.error("Got an error!!!");
			console.log(error);
			conn.end();
			return error;
		}
	}
} satisfies Actions;	
