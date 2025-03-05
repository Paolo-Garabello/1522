<script lang="ts">
	import LoginPopUp from "./LoginPopUp.svelte";
	import PAreaPopUp from "./PAreaPopUp.svelte";

    let {display = $bindable(), logged = $bindable()} = $props();
    let login: boolean = $state(true);
</script>

{#if display}
    <section>
        <div class="{logged ? "loggedDimension" : login ? "loginSize" : "signupSize"}">
            {#if logged}
                <PAreaPopUp bind:display={display} bind:logged={logged}/>
            {:else}
                <LoginPopUp bind:display={display} bind:logged={logged} bind:login={login}/>
            {/if}
        </div>
    </section>
{/if}

<style>
    div {
        margin-top: 1vh;
        position: absolute;
        border-radius: 10px;
        background-color: rgb(238, 238, 238);
    }
    .loggedDimension {
        width: 10vw;
        height: 9vh;
    }
    .loginSize {
        width: 12vw;
        height: 4vw;
    }
    .signupSize {
        width: 12vw;
        height: 8vw;
    }
</style>