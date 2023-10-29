<script>
    /**
     * @type {number}
     */
    export let newDbIndex;

    /**
     * @type {number}
     */
    export let currentDbIndex;

    /**
     * @type {string}
     */
    export let newPattern;

    /**
     * @type {string}
     */
    export let currentPattern;

    /**
     * @type {(arg0: number) => void}
     */
    export let updateDbIndex;

    /**
     * @type {(arg0: string) => void}
     */
    export let updatePattern;

    /**
     * @type {Function}
     */
    export let openCreateModal;
</script>

<div class="row my-3">
    <div class="col-3">
        <div class="input-group">
            <span class="input-group-text">Database Index</span>
            <input
                type="number"
                class="form-control"
                min="0"
                max="1000"
                bind:value={newDbIndex}
                aria-label="Database Index"
                on:keyup={(e) => e.key === "Enter" && updateDbIndex(newDbIndex)}
            />
            <button
                class="btn btn-secondary"
                type="button"
                disabled={currentDbIndex === newDbIndex}
                on:click={() => updateDbIndex(newDbIndex)}>Select</button
            >
        </div>
    </div>

    <div class="col">
        <div class="input-group">
            <span class="input-group-text">Key Pattern</span>
            <input
                type="text"
                class="form-control"
                bind:value={newPattern}
                aria-label="Pattern"
                on:keyup={(e) => e.key === "Enter" && updatePattern(newPattern)}
            />
            <button
                class="btn btn-secondary"
                type="button"
                disabled={currentPattern === newPattern}
                on:click={() => updatePattern(newPattern)}>Search</button
            >
        </div>
    </div>

    <div class="col-auto">
        <button class="btn btn-primary" on:click={openCreateModal("CREATE")}>Insert Key</button>
    </div>
</div>
