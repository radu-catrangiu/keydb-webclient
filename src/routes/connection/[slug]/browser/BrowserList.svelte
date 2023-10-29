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
    {#if state.keysList.length === 0}
        <div class="card scrollable-column">
            <div class="card-body text-center">No keys found.</div>
        </div>
    {:else}
        <div class="card scrollable-column">
            <ul class="list-group list-group-flush">
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
        </div>
    {/if}

    <div class="mt-1 font-monospace">
        <small>&nbsp; Matched <b>{state.keysList.length}</b> keys.</small>
    </div>
    <small class="font-monospace"
        >&nbsp; Scanned <i>{state.scan.current}</i> out of <i>{state.scan.maxKeys}</i> keys.</small
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
