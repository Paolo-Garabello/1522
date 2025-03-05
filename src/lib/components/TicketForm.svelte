<script lang="ts">
	import Header from "./Header.svelte";

    export let data: {logged: boolean, name: string, surname: string, email:string};
    let name:string, surname:string, email:string;
    let logged = data.logged;
    if(logged) {
        name = String(data.name);
        surname = String(data.surname);
        email = String(data.email);
    }
</script>

<Header {logged}/>
<form method="POST" action="?/open">
    <h1>Nuovo Ticket</h1>
    <label>
        nome
        <input name="name" type="text" required value="{name}">
    </label>
    <label>
        cognome
        <input name="surname" type="text" required value="{surname}">
    </label>
    <label>
        email
        <input name="email" type="email" required value="{email}">
    </label>
    <label>
        titolo
        <input name="title" type="text" placeholder="titolo di problema" required>
    </label>
    <label>
        descrizione 
        <textarea name="description" placeholder="descrizione del problema" required></textarea>
    </label>
    <button>Apri un ticket</button>
</form>

<style>
    form {
        font-size: medium;
        display: flex;
        flex-direction: column;
        width: 25vw;
        height: 70vh;
        justify-content: space-between;
        align-items: center;
        margin: 0 37.5vw;
        background-color: rgb(238, 238, 238);;
        border-radius: 30px;
        padding: 1vh;
        border: 2px solid black;
    }
    label {
        display: flex;
        flex-direction: column;
        align-items: left;
        justify-content: left;
        width: 20vw;
        height: 10vh;
        border-radius: 20px;
    }
    input {
        min-width: 98%;
        max-width: 98%;
        min-height: 4vh;
        font-size: large;
        background-color: #ffff;
    }

    textarea {
        max-width: 20vw;
        min-width: 20vw;
        max-height: 8vh;
        min-height: 6vh;
    }

    button {
        background-color: none;
        text-decoration: none;
        width: 8vw;
        height: 3vh;
        font-size: large;
        border-radius: 6px;
    }
</style>