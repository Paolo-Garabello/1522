<script lang="ts">
    import type { ActionResult } from '@sveltejs/kit';
    import { deserialize } from '$app/forms';
    import { sha512 } from 'js-sha512';
    import { toCrypted, importPublicKey } from '$lib/crypto';

    let {logged = $bindable(), display=$bindable(), login=$bindable()} = $props();

    function toggleLogIn() {
        login = !login;
    }

    let name:string = $state(""), surname:string = $state(""), password:string = $state(""), mail:string = $state("");
    function check() {
        if(name == "")
            name == null;
        if(surname == "")
            surname == null;
    }

	async function handleLogin(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}) {
		event.preventDefault();

        const user = new FormData();
        user.set("email", mail);
		const res = await fetch("?/challenge", { method: 'POST', body: user});
        const ack: ActionResult = deserialize(await res.text());

		if (ack.type === 'success' && (ack.data) && ack.data.request == "challenge") {
            user.set("password", sha512(sha512(password) + ack.data.timestamp));
		    const response = await fetch("?/login", { method: 'POST', body: user});
            const end: ActionResult = deserialize(await response.text());
        
            if (end.type === "success" && end.data?.code == 200) {
                logged = true;
                display = false;
            } 
		}
	}   

    async function handleRegister(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}) {
		event.preventDefault();
        check();
		const data = new FormData(event.currentTarget);

        /**
         * gets server public key and create a Form data with encrypted password using 
         * server's public key, then sends a request to the server with the encrypted
         * password
         * */ 
        const keyRes = await fetch("?/key", {method: "POST", body: new FormData()});
        let serverKey = importPublicKey(await JSON.parse(JSON.parse(await keyRes.text()).data)[2]);
        data.set("password", String(await toCrypted(await serverKey, sha512(password))));
		const res = await fetch("?/signup", { method: 'POST', body: data});
        const end: ActionResult = deserialize(await res.text());
        
            if (end.type === "success" && end.data?.code == 200) {
                logged = true;
                display = false;
            }
	}   

</script>


<form method="POST" onsubmit="{login ? handleLogin : handleRegister}" class="{login ? "loginSize" : "signupSize"}">
    {#if !login}
        <label>
            nome
            <input type="text" name="name" bind:value={name}>
        </label>
        <label>
            cognome
            <input type="text" name="surname" bind:value={surname}>
        </label>
    {/if}
    <label>
        email
        <input type="email" name="email" required bind:value={mail}>
    </label>
    <label>
        password
        <input type="password" name="password" required bind:value={password}>
    </label>
    <div>
        {#if login}
            <button type="submit">LogIn</button>
            <button type="button" onclick={toggleLogIn}>SignUp</button>
        {:else}
            <button type="button" onclick={toggleLogIn}>LogIn</button>
            <button type="submit">SignUp</button>
        {/if}
    </div>
</form>


<style>
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 2vh;
        padding-bottom: 2vh;
        background-color: rgb(238, 238, 238);
    }
    div {
        display: flex;
        flex-direction: row;
    }
    label {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    input {
        border-radius: 5px;
    }

    button {
        background-color: none;
        border: 1px solid black;
        border-radius: 3px;
        color: black;
        text-decoration: none;
    }
</style>    