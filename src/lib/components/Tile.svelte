<script lang="ts">
    export let title: string;
    export let text: string[];
    export let id: string;
</script>

<div id={id}>
    <h2>{title}</h2>
    {#each text as p}
        <p>{p}</p>
    {/each}
</div>

<style>
    div {
        background-color: #ffff;
        box-shadow: 0 4px 6px #0000001a;
        border-radius: 20px;
        max-width: 90%;
        margin: 1.25% 5%;
        padding: 2%;
    }
</style>