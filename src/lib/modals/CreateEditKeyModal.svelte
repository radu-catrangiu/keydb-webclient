<script>
    import { page } from "$app/stores";
    import { upsertKey } from "../../routes/connection/[slug]/browser/browserFunctions";

    export let open = false;
    export let showBackdrop = true;

    /** @type {Function} */
    export let onClosed;

    export let mode = "CREATE";

    /** @type {string | null} */
    export let key;

    /** @type {import("../../routes/connection/[slug]/browser/key/+server").KeyDataResponse | null} */
    export let data;

    let newKeyType = mode === "CREATE" ? "string" : String(data?.type);
    let newKeyName = mode === "CREATE" ? "" : String(key);
    let newKeyValue = mode === "CREATE" ? "" : String(data?.value);

    $: {
        console.log(mode, data?.type, key, data?.value)
        console.log(mode, newKeyType, newKeyName, newKeyValue)
    }

    const modalClose = () => {
        open = false;
        if (onClosed) {
            onClosed("NONE");
        }
    };

    let db = $page.url.searchParams.get("db");

    const action = async () => {
        await upsertKey($page.url, Number(db), newKeyType, newKeyName, newKeyValue);
        modalClose();
        if (onClosed) {
            onClosed(mode, newKeyName, newKeyValue);
        }
    }
</script>

{#if open}
    <div
        class="modal"
        id="createEditKeyModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="createEditKeyModalLabel"
        aria-hidden={false}
    >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createEditKeyModalLabel">
                        {#if mode === "CREATE"}
                            Create a new key
                        {:else}
                            {key}
                        {/if}
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        on:click={modalClose}
                        aria-label="Close"
                    />
                </div>

                <div class="modal-body">
                    <div class="mb-3">
                        <label for="keyInput" class="form-label">
                            Key Type
                        </label>
                        {#if mode === "CREATE"}
                            <select 
                                bind:value={newKeyType} 
                                disabled
                                class="form-select" aria-label="Default select example">
                                <option selected value="string">String</option>
                                <option value="hash">Hash</option>
                                <option value="list">List</option>
                                <option value="set">Set</option>
                                <option value="zset">Sorted Set</option>
                            </select>
                        {:else}
                            <select 
                                bind:value={newKeyType} 
                                disabled
                                class="form-select" aria-label="Default select example">
                                <option selected value="string">String</option>
                                <option value="hash">Hash</option>
                                <option value="list">List</option>
                                <option value="set">Set</option>
                                <option value="zset">Sorted Set</option>
                            </select>
                        {/if}
                        
                    </div>
                    
                    <div class="mb-3">
                        <label for="keyInput" class="form-label">
                            Key Name
                        </label>
                        {#if mode === "CREATE"}
                        <input
                            bind:value={newKeyName}
                            type="text"
                            class="form-control"
                            id="keyInput"
                            placeholder="foo"
                            aria-describedby="keyHelp"
                            required
                            name="key"
                        />
                        {:else}
                        <input
                            bind:value={key}
                            disabled
                            type="text"
                            class="form-control"
                            id="keyInput"
                            placeholder="foo"
                            aria-describedby="keyHelp"
                            required
                            name="key"
                        />
                        {/if}
                    </div>

                    <div class="mb-3">
                        <label for="valueInput" class="form-label">
                            Value
                        </label>
                        <textarea
                            bind:value={newKeyValue}
                            class="form-control"
                            placeholder="bar"
                            id="valueInput"
                            aria-describedby="valueHelp"
                            required
                            name="value"
                        />
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        on:click={modalClose}
                        data-dismiss="modal">Close</button
                    >
                    <button
                        form="connectionForm"
                        data-dismiss="modal"
                        on:click={action}
                        class="btn btn-primary">Save</button
                    >
                </div>
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
