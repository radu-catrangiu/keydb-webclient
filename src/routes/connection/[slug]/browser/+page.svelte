<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    const dbIndex = {
        current: 0,
        new: 0,
    };

    const pattern = {
        current: "*",
        new: "*",
    };

    /**
     * @type {string | null}
     */
    let currentKey = null;
    let cursor = "0";

    /**
     * @type {string[]}
     */
    let keysList = [];

    onMount(async () => {
        const { searchParams } = $page.url;

        console.log($page.url)

        const queryDb = searchParams.get("db");
        if (queryDb) {
            dbIndex.new = Number(queryDb);
        }
        
        const queryPattern = searchParams.get("pattern");
        if (queryPattern) {
            pattern.new = queryPattern;
        }
        
        updateDbIndex();
        updatePattern();

        await listKeys(false);
    });

    /**
     * @param {string} value
     */
    function updateCursor(value) {
        cursor = value;
    }

    async function resetCursor() {
        keysList=[];
        updateCursor("0");
        listKeys(true)
    }

    function updateUrl() {
        $page.url.searchParams.set("db", String(dbIndex.current));
        $page.url.searchParams.set("pattern", pattern.current);
        history.replaceState(history.state, "", $page.url);
        resetCursor();
    }

    function updateDbIndex() {
        if (dbIndex.new < 0) {
            dbIndex.new = 0;
        }
        dbIndex.current = dbIndex.new;
        updateUrl();
    }

    function updatePattern() {
        pattern.current = pattern.new;
        updateUrl();
    }

    /**
     * @param {boolean} replace
     */
    async function listKeys(replace) {
        const u = new URL($page.url);
        u.pathname = u.pathname + "/list"
        u.searchParams.set("cursor", cursor);
        const url = u.pathname + u.search;

        const response = await fetch(url, {
            method: "GET",
        });

        const result = await response.json();
        console.log(result);
        
        updateCursor(result.newCursor);
        if (replace) {
            keysList = [...result.list];
        } else {
            keysList = [...keysList, ...result.list];
        }
    }

    /**
     * @param {string} value
     */
    async function getKey(value) {
        currentKey = value;
    }
</script>

<h1>Browser</h1>

<div class="row my-3">
    <div class="col-3">
        <div class="input-group">
            <span class="input-group-text">Database Index</span>
            <input
                type="number"
                class="form-control"
                min="0"
                max="1000"
                bind:value={dbIndex.new}
                aria-label="Database Index"
                on:keyup={(e) => e.key === "Enter" && updateDbIndex()}
            />
            <button
                class="btn btn-secondary"
                type="button"
                disabled={dbIndex.current === dbIndex.new}
                on:click={updateDbIndex}>Select</button
            >
        </div>
    </div>

    <div class="col">
        <div class="input-group">
            <span class="input-group-text">Key Pattern</span>
            <input
                type="text"
                class="form-control"
                bind:value={pattern.new}
                aria-label="Pattern"
                on:keyup={(e) => e.key === "Enter" && updatePattern()}
            />
            <button
                class="btn btn-secondary"
                type="button"
                disabled={pattern.current === pattern.new}
                on:click={updatePattern}>Search</button
            >
        </div>
    </div>
</div>

<div class="row">
    <div class="col-3">
        <div class="card">
            <ul class="list-group list-group-flush">
                {#each keysList as key}
                    <button 
                        type="button"
                        class="list-group-item list-group-item-action {key === currentKey ? 'active' : ''}"
                        on:click={() => getKey(key)}>{key}</button>
                {/each}
            </ul>
        </div>
    </div>

    <div class="col">
        <div class="card">
            <div class="card-body">This is some text within a card body.</div>
        </div>
    </div>
</div>
