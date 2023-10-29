<script>
    import { page } from "$app/stores";
    import { updateKeyTTL } from "../../routes/connection/[slug]/browser/browserFunctions";

    export let open = false;
    export let showBackdrop = true;

    /** @type {Function} */
    export let onClosed;

    /** @type {string} */
    export let key;

    /** @type {number} */
    export let ttl;

    /**
     * @param {number} [ttl]
     */
    const modalClose = (ttl) => {
        open = false;
        if (onClosed) {
            onClosed(ttl);
        }
    };

    let db = $page.url.searchParams.get("db");

    const updateTTL = async () => {
        await updateKeyTTL($page.url, Number(db), key, ttl)
        modalClose(ttl);
    }

    /**
     * @param {KeyboardEvent} event
     */
     function submitUpdate(event) {
        if (event.key === "Enter") {
            updateTTL();
        }
    }
</script>

{#if open}
    <div
        class="modal"
        id="setTTLModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="setTTLModalLabel"
        aria-hidden={false}
    >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="setTTLModalLabel">
                        Set Expiry
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        on:click={() => modalClose()}
                    />
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="expirationInput" class="form-label">
                            Expiration <small>(in seconds)</small>
                        </label>
                        <input
                            type="number"
                            min="-1"
                            class="form-control"
                            id="expirationInput"
                            aria-describedby="expirationHelp"
                            required
                            name="expiration"
                            on:keyup={submitUpdate}
                            bind:value={ttl}
                        />
                        <div id="expirationHelp" class="form-text">
                            Use 0 to delete the key.
                            Use a negative value to remove the Expiry.
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-dismiss="modal"
                        on:click={() => modalClose()}>Close</button
                    >
                    <button
                        form="connectionForm"
                        data-dismiss="modal"
                        on:click={updateTTL}
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
