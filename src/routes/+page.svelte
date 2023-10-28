<script>
    /**
     * @type {import("./+page.server").ConnectionsPageResponse}
     */
    export let data;
</script>

<h1>Welcome to KeyDB Web Client</h1>

<button type="button" class="btn btn-primary">Add Keydb Database</button>
<div class="my-3">
    <div class="d-grid gap-2">
        {#each data.connections as connection}
            <a class="btn btn-primary" href="/connection/{connection.slug}/" type="button">{connection.label}</a>
        {/each}
    </div>
</div>
