<script>
    import { formatBytes } from "$lib/utils";

    /**
     * @type {string | null}
     */
    export let key;

    /**
     * @type {import("./key/+server").KeyDataResponse}
     */
    export let data;
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
                    <small role="button" class="text-decoration-underline">
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
                        <th scope="col">&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.value as member}
                        <tr>
                            <td>{member}</td>
                            <td>&nbsp;</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
    /* Set a fixed height for the second column to enable scrolling */
    .scrollable-column {
        max-height: alc(60vh - 80px); /* Adjust the height as needed */
        overflow-y: auto;
    }
</style>
