<script>
    export let open = false;
    export let showBackdrop = true;
    /**
     * @type {Function}
     */
    export let onClosed;

    const modalClose = () => {
        open = false;
        if (onClosed) {
            onClosed();
        }
    };

    const newConnectionInfo = {
        host: "",
        port: 6379,
        label: "",
        username: "",
        password: "",
    };
</script>

{#if open}
    <div
        class="modal"
        id="newconnectionModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="newconnectionModalLabel"
        aria-hidden={false}
    >
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="newconnectionModalLabel">
                        Add Database
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        on:click={modalClose}
                    />
                </div>

                <form id="connectionForm" method="POST" action="?/create">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="hostInput" class="form-label"
                                >Host</label
                            >
                            <input
                                type="text"
                                class="form-control"
                                id="hostInput"
                                aria-describedby="hostHelp"
                                required
                                name="host"
                                bind:value={newConnectionInfo.host}
                            />
                            <div id="hostHelp" class="form-text">
                                Hostname / IP address of the Keydb
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="portInput" class="form-label"
                                >Port</label
                            >
                            <input
                                type="number"
                                class="form-control"
                                id="portInput"
                                required
                                name="port"
                                bind:value={newConnectionInfo.port}
                            />
                        </div>

                        <div class="mb-3">
                            <label for="labelInput" class="form-label"
                                >Label</label
                            >
                            <input
                                type="text"
                                class="form-control"
                                id="labelInput"
                                aria-describedby="labelHelp"
                                required
                                name="label"
                                bind:value={newConnectionInfo.label}
                            />
                            <div id="labelHelp" class="form-text">
                                Hostname / IP address of the Keydb
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="inputUsername" class="form-label"
                                >Username</label
                            >
                            <input
                                type="username"
                                class="form-control"
                                id="inputUsername"
                                name="username"
                                bind:value={newConnectionInfo.username}
                            />
                        </div>

                        <div class="mb-3">
                            <label for="inputPassword" class="form-label"
                                >Password</label
                            >
                            <input
                                type="password"
                                class="form-control"
                                id="inputPassword"
                                name="password"
                                bind:value={newConnectionInfo.password}
                            />
                        </div>

                        <div class="mb-3 form-check">
                            <input
                                type="checkbox"
                                class="form-check-input"
                                id="tlsCheck"
                            />
                            <label class="form-check-label" for="tlsCheck"
                                >TLS</label
                            >
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal"
                            on:click={modalClose}>Close</button
                        >
                        <button
                            form="connectionForm"
                            type="submit"
                            class="btn btn-primary">Create Connection</button
                        >
                    </div>
                </form>
            </div>
        </div>
    </div>
    {#if showBackdrop}
        <div class="modal-backdrop show" />
    {/if}
{/if}

<style>
    .modal {
        display: block;
    }
</style>
