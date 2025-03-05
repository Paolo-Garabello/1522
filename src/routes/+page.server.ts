import type { Actions } from './$types';
import { LogIn, Challenge, Key, SingUp } from "$lib/server/utility";

export const actions = {
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

export function load({ cookies }) {
    try {
        if(cookies.get("session"))
            return {logged: true};
    } catch (error) {
        cookies.delete("session", {path: "/" });   
    }
    
    return {logged: false};
} 