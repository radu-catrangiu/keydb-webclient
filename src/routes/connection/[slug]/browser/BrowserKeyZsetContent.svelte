<script>
    import SetTtlModal from "$lib/modals/SetTTLModal.svelte";
    import { formatBytes } from "$lib/utils";

    /**
     * @type {string}
     */
    export let key;

    /**
     * @typedef {import("./key/+server").KeyDataResponse} ZsetData
     * @property {string[]} value
    */

    /**
     * @type {ZsetData}
     */
    export let data;

    // Dynamically compute touples when data.value changes
    $: touples = data.value.reduce((/** @type {any[][]} */ acc, /** @type {string} */ cur, /** @type {number} */ idx) => {
        if (idx % 2 == 0) {
            acc.push([cur]);
        } else {
            acc[acc.length - 1].push(cur);
        }
        return acc;
    }, []);
    
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
                        <th scope="col">Member</th>
                        <th scope="col">Score</th>
                        <th scope="col">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {#each touples as [member, score]}
                        <tr>
                            <td>{member}</td>
                            <td>{score}</td>
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
