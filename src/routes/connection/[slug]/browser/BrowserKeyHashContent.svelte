<script>
    import SetTtlModal from "$lib/modals/SetTTLModal.svelte";
    import { formatBytes } from "$lib/utils";

    /**
     * @type {string}
     */
    export let key;

    /**
     * @type {import("./key/+server").KeyDataResponse}
     */
    export let data;

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

        <div class="card-body scrollable-column">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Field</th>
                        <th scope="col">Value</th>
                        <th scope="col">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {#each Object.entries(data.value) as [field, value]}
                        <tr>
                            <td>{field}</td>
                            <td>{value}</td>
                            <td>&nbsp;</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
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
</style>
