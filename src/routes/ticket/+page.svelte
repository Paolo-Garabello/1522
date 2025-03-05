<script lang="ts">
	import TicketForm from "$lib/components/TicketForm.svelte";
	let { data } = $props();
</script>

<TicketForm data={data}/>