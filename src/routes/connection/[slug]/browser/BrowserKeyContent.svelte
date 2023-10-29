<script>
    import { isJsonString, syntaxHighlight, formatBytes } from "$lib/utils";

    /**
     * @type {string | null}
     */
    export let selectedKey;

    /**
     * @type {import("./key/+server").KeyDataResponse | null}
     */
    export let selectedKeyData;

    /**
     * @param {number} ttl
     */
    function parseTTL(ttl) {
        if (ttl < 0) {
            return "No TTL";
        }

        return `TTL: ${ttl}`;
    }
</script>

{#if selectedKey != null && selectedKeyData != null}
    <div class="col-9">
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col">
                        <h4>{selectedKey}</h4>
                    </div>
                    <div class="col" />
                </div>
                <div class="row">
                    <div class="col text-muted">
                        <small>{selectedKeyData.type.toUpperCase()}</small>
                        <span>|</span>
                        <small>{formatBytes(selectedKeyData.size)}</small>
                        <span>|</span>
                        <small>{parseTTL(selectedKeyData.ttl)}</small>
                    </div>
                    <div class="col" />
                </div>
            </div>
            {#if selectedKeyData.type === "string" && typeof selectedKeyData.value === "string" && isJsonString(selectedKeyData.value)}
                <div class="card-body json-background scrollable-column">
                    <pre class="mt-3">{@html syntaxHighlight(selectedKeyData.value)}</pre>
                </div>
            {:else}
                <div class="card-bod scrollable-column">
                    <p class="card-text m-2 mr-4">{selectedKeyData.value}</p>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    /* Set a fixed height for the second column to enable scrolling */
    .scrollable-column {
        max-height: 60vh; /* Adjust the height as needed */
        overflow-y: auto;
    }

    .json-background {
        background-color: rgb(28, 28, 28);
        color: rgb(248, 211, 53);
    }
    :global(.json-key) {
        color: rgb(159, 212, 251);
    }
    :global(.json-string) {
        color: rgb(190, 138, 112);
    }
    :global(.json-number) {
        color: rgb(177, 198, 161);
    }
    :global(.json-boolean) {
        color: rgb(73, 110, 153);
        font-weight: bold;
    }
    :global(.json-null) {
        color: rgb(87, 136, 194);
        font-weight: bold;
    }
</style>
