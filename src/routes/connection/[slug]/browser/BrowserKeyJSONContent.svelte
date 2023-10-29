<script>
    import SetTtlModal from "$lib/modals/SetTTLModal.svelte";
    import { syntaxHighlight, formatBytes } from "$lib/utils";

    /**
     * @type {string}
     */
    export let key;

    /**
     * @type {import("./key/+server").KeyDataResponse}
     */
    export let data;
    
    /**
     * @type {Function}
    */
    export let openUpdateModal;

    let setTTLModalOpen = false;
    let ttlModalTrigger = () => setTTLModalOpen = true;
    let onTTLModalClosed = ( /** @type {number | undefined}*/ newTTL) => {
        setTTLModalOpen = false;
        if (newTTL) {
            data.ttl = newTTL;
        }
    };
</script>

<div class="col-9">
    <div class="card">
        <div class="card-header">
            <div class="row">
                <div class="col">
                    <h4>{key}</h4>
                </div>
                <div class="col" />
            </div>
            <div class="row">
                <div class="col text-muted">
                    <small>{data.type.toUpperCase()}</small>
                    <span>|</span>
                    <small>{formatBytes(data.size)}</small>
                    <span>|</span>
                    <small role="button" class="text-decoration-underline" tabindex="0" on:click={ttlModalTrigger} on:keyup={ttlModalTrigger}>
                        {data.ttl < 0 ? "No TTL" : `TTL: ${data.ttl}`}
                    </small>
                </div>
                <div class="col" />
            </div>
        </div>

        <div class="card-body json-background scrollable-column">
            <pre class="mt-3">{@html syntaxHighlight(data.value)}</pre>
        </div>
    </div>
</div>

<SetTtlModal {key} ttl={data.ttl} onClosed={onTTLModalClosed} open={setTTLModalOpen} />

<style>
    /* Set a fixed height for the second column to enable scrolling */
    .scrollable-column {
        max-height: alc(60vh - 80px); /* Adjust the height as needed */
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
