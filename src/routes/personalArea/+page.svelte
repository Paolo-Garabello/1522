<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Ticket from '$lib/components/Ticket.svelte';

    let { data } = $props();

    let addOp = $state(false);
    function addop() {
        addOp = !addOp;
    }

</script>
<section>
    {#if data.logged}
        <Header logged={data.logged}/>
        <h1>Ciao {data.name}, Benvenuto nella tua area personale
            {#if data.role == "admin"}
            <button onclick={addop} class="add"><img src="/add.svg" alt="add"></button>
            {/if}
        </h1>
        <form method="POST" action="?/addOp" class="{addOp ? "flex" : "hidden"}">
            <label>
                email
                <input type="email" name="email" required>
            </label>
            <label>
                nome
                <input type="text" name="name">
            </label>
            <label>
                cognome
                <input type="text" name="surname">
            </label>
            <label>
                password
                <input type="password" name="password" required>
            </label>
            <button>Add</button>
        </form>
        <article>
            {#each data.tickets as ticket}
                <Ticket data={ticket as any} role={data.role}/>
            {/each}
        </article>
    {:else}
        <h3>User non loggato</h3>
        <a href="/">Home</a>
    {/if}
</section>

<style>
    h1 {
        background-color: #ffff;
        box-shadow: 0 4px 6px #0000001a;
        border-radius: 20px;
        padding: 2%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    article {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    form {
        flex-direction: column;
        position: relative;
        background-color: rgb(238, 238, 238);
        border-radius: 10px;
        width: 14vw;
        height: 25vh;
        margin-left: 43vw;
        justify-content: center;
        align-items: center;
    }
    label {
        display: flex;
        flex-direction: column;
        width: 90%;
    }
    .hidden {
        display: none;
    }
    .flex {
        display: flex;
    }
    img {
        background-color: none;
        border: none;
        background: none;
        width: 3vw;
    }
    .add {
        text-decoration: none;
        border: none;
        background: none;
    }
    .add:hover {
        cursor: pointer;
    }
</style>