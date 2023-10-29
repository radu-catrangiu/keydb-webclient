<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    /** @type {import('./$types').PageData} */
    export let data;

    const dbIndex = {
        current: 0,
        new: 0,
    };

    const pattern = {
        current: "*",
        new: "*",
    };

    const key = null;

    onMount(() => {
        const { searchParams } = $page.url;

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
    });

    function updateUrl() {
        $page.url.searchParams.set("db", String(dbIndex.current));
        $page.url.searchParams.set("pattern", pattern.current);
        history.replaceState(history.state, "", $page.url);
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
</script>

<h1>This is the Browser page for {data.slug}</h1>

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
                <li class="list-group-item">An item</li>
                <li class="list-group-item">A second item</li>
                <li class="list-group-item">A third item</li>
            </ul>
        </div>
    </div>

    <div class="col">
        <div class="card">
            <div class="card-body">This is some text within a card body.</div>
        </div>
    </div>
</div>
