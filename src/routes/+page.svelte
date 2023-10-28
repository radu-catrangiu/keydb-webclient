<script>
    import NewConnectionModal from '$lib/NewConnectionModal.svelte'
    /**
     * @type {import("./+page.server").ConnectionsPageResponse}
     */
    export let data;

    let showNewConnectionModal = false;

	const onCancelClick = () => {
		showNewConnectionModal = true;
	}

	const onModalClose = () => {
		showNewConnectionModal = false;
	}
</script>

<h1>Welcome to KeyDB Web Client</h1>

<button type="button" class="btn btn-primary" on:click={() => showNewConnectionModal=true}>Add Keydb Database</button>

<NewConnectionModal open={showNewConnectionModal} onClosed={() => onModalClose()}/>

<div class="my-3">
    <div class="d-grid gap-2">
        {#each data.connections as connection}
            <a class="btn btn-primary" href="/connection/{connection.slug}/" type="button">{connection.label}</a>
        {/each}
    </div>
</div>
