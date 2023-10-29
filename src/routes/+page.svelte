<script>
    import NewConnectionModal from "$lib/modals/NewConnectionModal.svelte";
    /**
     * @type {import("./+page.server").ConnectionsPageResponse}
     */
    export let data;

    let showNewConnectionModal = false;

    const onModalClose = () => {
        showNewConnectionModal = false;
    };
</script>



<div class="container my-3">
    <div class="row my-5">
        <h1 class="text-center">Welcome to KeyDB Web Client</h1>
    </div>
    <div class="row my-3">
        <div class="text-center">
            <button
                style="width: 18rem;"
                type="button"
                class="btn btn-primary"
                on:click={() => (showNewConnectionModal = true)}>Add Keydb Database</button
            >
        </div>
    </div>
    <div class="row row-cols-2">
        {#each data.connections as connection}
            <div class="col">
                <div class="card text-center m-2" style="">
                    <div class="card-body">
                        <h5 class="card-title">{connection.label}</h5>
                        
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <th>Host</th>
                                        <td>{connection.host}</td>
                                    </tr>
                                    <tr>
                                        <th>Port</th>
                                        <td>{connection.port}</td>
                                    </tr>
                                </tbody>
                            </table>
                        
                        <div class="d-grid gap-2">
                            <a
                            class="btn btn-primary"
                            href="/connection/{connection.slug}/info"
                            type="button">Open <b>{connection.label}</b></a
                            >
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>

<NewConnectionModal
    open={showNewConnectionModal}
    onClosed={() => onModalClose()}
/>
