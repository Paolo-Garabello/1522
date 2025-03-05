<script lang="ts">
    export let data: {id: number, name:string, surname: string, email:string, title:string, description:string, open: number, assignedTo: string};
    export let role = "user";
    const change = () => {
        data.open = ((data.open + 1) % 2);
        const info = new FormData();
        info.set("id", String(data.id));
        info.set("status", String(data.open));
        fetch("?/changeStatus", {method: "POST", body: info});
    }
</script>

<article class="{role=="admin" ? "adminColumns" : "otherColumns"}">
    <div>
        <span>nome:</span>
        <span>{data.name}</span>
    </div>
    <div>
        <span>cognome:</span>
        <span>{data.surname}</span>
    </div>
    <div>
        <span>titolo:</span> 
        <span>{data.title}</span>
    </div>
    <div>
        <span>descrizione:</span> 
        <textarea readonly>{data.description}</textarea>
    </div>
    {#if role != "user"}
        <div>
            <span>email:</span> 
            <span>{data.email}</span>
        </div>
        <div>
            <span>stato:</span>
            <button onclick="{change}"><img class="hover" src="/{Boolean(data.open) ? "open.svg":"closed.svg"}" alt="{Boolean(data.open) ? "aperto":"chiuso"}"></button> 
        </div>
    {:else}
    <div>
        <span>stato:</span>
        <img src="/{Boolean(data.open) ? "open.svg":"closed.svg"}" alt="{Boolean(data.open) ? "aperto":"chiuso"}">
    </div>
    {/if}
    {#if role != "operator"}
        <div>
            <span>operatore assegnato:</span>
            <span>{data.assignedTo}</span>
        </div>
    {/if}

</article>

<style>
    article {
        display: grid;
        background-color: blue;
        width: 70vw;
        height: 15vh;
        border: 3px solid black;
        border-radius: 20px;
        padding: 2vh;
        grid-template-columns: 1fr 1fr 2fr 3fr 1fr 1fr;
        align-items: center;
        background-color: #ffff;
        box-shadow: 0 4px 6px #0000001a;
        margin-top: 1vh;
    }
    .adminColumns {
        grid-template-columns: 1fr 1fr 2fr 3fr 1fr 1fr 1fr;
    }
    .otherColumns {
        grid-template-columns: 1fr 1fr 2fr 3fr 1fr 1fr;
    }
    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;
    }
    img {
        width: 5vw;
        height: 5vh;
    }
    .hover:hover {
        cursor: pointer;
    }
    button {
        text-decoration: none;
        border: none;
        background: none;
    }
    textarea {
        min-width: 8vh;
        max-width: 30vh;
        max-height: 10vh;
        min-height: 5vh;
    }
</style>