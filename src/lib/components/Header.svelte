<script lang="ts">
	import HeaderPopUp from "./HeaderPopUp.svelte";
    let { logged = $bindable() } = $props();
    let display = $state(false);
    function toggleForm() {
        display = !display;
    }
</script>

<header>
    <div>
        <a href="/#{"Info"}">Info</a>
        <a href="/#{"Credii"}">Crediti</a>
        <a href="/ticket">Ticket</a>
        <span>
            <button onclick={toggleForm}>{logged ? "Area Personale" : "Login"}</button>
            <HeaderPopUp bind:display={display} bind:logged={logged} />
        </span>
    </div>
    <a href="https://www.1522.eu/">
        <img src="/1522.png" alt="1522">   
    </a>
</header>


<style>
    header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 4vh;
        margin: 1.25% 12%;
    }
    img {
        height: 4vh;
    }
    div {
        justify-content: space-around;
        display: flex;
        flex-direction: row;
        width: 25vw;
    }
    div > a{
        text-decoration: none;
        color: black;
        font-size: larger;
    }
    div > a:hover {
        text-decoration: underline;
        font-weight: bold;
    }
    span > button {
        text-decoration: none;
        color: black;
        font-size: larger;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font-family: serif;
        display: flex;
        align-items: flex-start;
        position: relative;
        flex-direction: column;
    }
    span > button:hover {
        text-decoration: underline;
        font-weight: bold;
    }
</style>
