<script>
    /**
     * @type {import("./browserState").BrowserState}
     */
    export let state;

    /**
     * @type {(arg0: string) => void}
     */
    export let selectKey;
</script>

<div class="col-3">
    <div class="card">
        <div class="card-header">
            <h5 class="text-muted">
                Keys
            </h5>
        </div>
        
        {#if state.keysList.length === 0}
            <div class="card-body text-center">No keys found.</div>
        {:else}
            <ul class="list-group list-group-flush scrollable-column">
                {#each state.keysList as key}
                    <button
                        type="button"
                        class="list-group-item list-group-item-action {key ===
                        state.selectedKey
                            ? 'active'
                            : ''}"
                        on:click={() => selectKey(key)}>{key}</button
                    >
                {/each}
            </ul>
        {/if}
    </div>

    <div class="mt-1 font-monospace">
        <small>&nbsp; Matched <b>{state.keysList.length}</b> keys.</small>
    </div>
    <small class="font-monospace"
        >&nbsp; Scanned <i>{state.scan.current}</i> out of
        <i>{state.scan.maxKeys}</i> keys.</small
    >
</div>

<style>
    /* Set a fixed height for the second column to enable scrolling */
    .scrollable-column {
        height: 60vh;
        max-height: 60vh; /* Adjust the height as needed */
        overflow-y: auto;
    }
</style>
