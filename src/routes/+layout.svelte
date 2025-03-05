<script>
	import Header from "$lib/components/Header.svelte";
    import "../app.css";
    let { data, children} = $props();
	let logged = $state(data.logged);
</script>

<main>
    <Header bind:logged={logged}/>
    {@render children()}
</main>