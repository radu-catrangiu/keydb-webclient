<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import BrowserTopBar from "./BrowserTopBar.svelte";
    import BrowserList from "./BrowserList.svelte"
    import BrowserKeyContent from "./BrowserKeyContent.svelte";
    import { getKeyData, listKeysFromAPI, updateUrl } from "./browserState";

    /**
     * @type {import("./browserState").BrowserState}
     */
    const state = {
        dbIndex: {
            new: 0,
            current: 0,
        },
        pattern: {
            current: "*",
            new: "*",
        },
        scan: {
            cursor: "0",
            maxKeys: 1500,
            batch: 500,
            current: 0,
        },
        selectedKey: null,
        selectedKeyData: null,
        keysList: [],
    };

    onMount(async () => {
        updateUrl($page.url, state.selectedKey, state.dbIndex.current, state.pattern.current);
        await listKeys(true);
        console.log(state.keysList);
    });

    function updateDbIndex() {
        if (state.dbIndex.new < 0) {
            state.dbIndex.new = 0;
        }

        state.dbIndex.current = state.dbIndex.new;
    }

    function updatePattern() {
        state.pattern.current = state.pattern.new;
    }

    /**
     * @param {boolean} replace
     */
    async function listKeys(replace) {
        const url = $page.url;
        const pattern = state.pattern.current;
        const cursor = state.scan.cursor;
        const count = state.scan.batch;
        
        const result = await listKeysFromAPI(url, pattern, cursor, count);

        state.scan.cursor = result.newCursor;
        
        if (replace) {
            state.scan.current = count;
            state.keysList = [...result.list];
        } else {
            state.scan.current += count;
            state.keysList = [...state.keysList, ...result.list];
        }
    }

    /**
     * @param {string} value
     */
    async function selectKey(value) {
        const url = $page.url;
        const db = state.dbIndex.current;
        const key = value;
        const response = await getKeyData(url, db, key);

        state.selectedKeyData = response;
        state.selectedKey = key;
    }
</script>

<h1>Browser</h1>

<BrowserTopBar
    currentDbIndex={state.dbIndex.current}
    newDbIndex={state.dbIndex.new}
    currentPattern={state.pattern.current}
    newPattern={state.pattern.new}
    updateDbIndex={updateDbIndex}
    updatePattern={updatePattern}
/>

<div class="row">
    <BrowserList
        selectKey={selectKey}
        state={state}
    />

    <BrowserKeyContent
        selectedKey={state.selectedKey}
        selectedKeyData={state.selectedKeyData}
    />
</div>
