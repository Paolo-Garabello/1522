<script lang="ts">
    import { deserialize } from '$app/forms';
    let { logged = $bindable(), display=$bindable()} = $props();

    async function signout()  {
        const res = await fetch("?/signout", {method: "POST", body: new FormData()});
        if (deserialize(await res.text()).type === 'success') {
            display = false;
            logged = false;
        }
    }
</script>

<div>
    <a href="/personalArea"> Area personale</a>

    <button onclick="{signout}">Sign out</button>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    a {
        text-decoration: none;
        color: black;
        border: 1px solid black;
        font-size: medium;
        width: 8vw;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        margin-top: 1.5vh;
        margin-bottom: 1.5vh;
    }
    button {
        background: none;
        text-decoration: none;
        border: 1px solid black;
        color: black;
        font-size: medium;
        width: 8vw;
        border-radius: 3px;
        margin-bottom: 1vh;
    }

    button:hover {
        cursor: pointer;
    }
    
</style>