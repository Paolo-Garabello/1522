import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {

    try {
        if(cookies.get("session"))
            return {logged: true};
    } catch (error) {
        cookies.delete("session", {path: "/" });   
    }
    
    return {logged: false};
};
