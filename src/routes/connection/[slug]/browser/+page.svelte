<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import BrowserTopBar from "./BrowserTopBar.svelte";
    import BrowserList from "./BrowserList.svelte"
    import BrowserKeyContainer from "./BrowserKeyContainer.svelte";
    import { getKeyData, getStateFromUrl, listKeysFromAPI, updateUrl } from "./browserFunctions";
    import CreateEditKeyModal from '$lib/modals/CreateEditKeyModal.svelte'

    /**
     * @type {import("./browserFunctions").BrowserState}
     */
    let state = {
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

    let modalOpen = false;
    let modalMode = "CREATE";
    /**
     * @param {"CREATE"|"UPDATE"} mode
     */
    function openModal(mode) {
        modalOpen = true;
        modalMode = mode;
    }

    /**
     * @param {"CREATE"|"UPDATE"} mode
     * @param {string} newKey
     * @param {string} value
     */
    function onModalClosed(mode, newKey, value) {
        modalOpen = false;

        if (mode === "CREATE") {
            state.keysList = [newKey, ...state.keysList];
            selectKey(newKey, true)
        }

        if (mode === "UPDATE") {
            if (state.selectedKeyData) {
                state.selectedKeyData.value = value;
            }
        }
    }

    onMount(async () => {
        const {
            db,
            key,
            pattern,
        } = getStateFromUrl($page.url);

        if (db) {
            updateDbIndex(db, false);
        }

        if (pattern) {
            updatePattern(pattern, false);
        }

        if (key) {
            await selectKey(key, false);
        }

        await refreshPage(false);
    });

    /**
     * @param {boolean} clearSelection
     */
    async function refreshPage(clearSelection) {
        if (clearSelection) {
            state.selectedKey = null,
            state.selectedKeyData = null;
        }
        updateUrl($page.url, state.selectedKey, state.dbIndex.current, state.pattern.current);
        await listKeys(true);
    }

    /**
     * @param {number} value
     * @param {boolean} refreshUrl
     */
    function updateDbIndex(value, refreshUrl = true) {
        state.dbIndex.new = value;
        if (state.dbIndex.new < 0) {
            state.dbIndex.new = 0;
        }


        state.dbIndex.current = state.dbIndex.new;

        updatePattern("*", false);

        if (refreshUrl) {
            refreshPage(true);
        }
    }

    /**
     * @param {string} value
     * @param {boolean} [refreshUrl]
     */
    function updatePattern(value, refreshUrl = true) {
        state.pattern.current = value;
        state.pattern.new = value;
        if (refreshUrl) {
            refreshPage(true);
        }
    }

    /**
     * @param {boolean} replace
     */
    async function listKeys(replace) {
        const url = $page.url;
        const db = state.dbIndex.current;
        const pattern = state.pattern.current;
        const cursor = state.scan.cursor;
        const count = state.scan.batch;
        
        const result = await listKeysFromAPI(url, db, pattern, cursor, count);

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
     * @param {boolean} [refreshUrl]
     */
    async function selectKey(value, refreshUrl = true) {
        const url = $page.url;
        const db = state.dbIndex.current;
        const key = value;

        let response;
        try {
            response = await getKeyData(url, db, key);
        } catch (error) {
            await refreshPage(false);
        }
        
        state.selectedKeyData = response;
        state.selectedKey = key;

        if (refreshUrl) {
            updateUrl($page.url, state.selectedKey, state.dbIndex.current, state.pattern.current);
        }
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
    openCreateModal={openModal}
/>

<div class="row">
    <BrowserList
        selectKey={selectKey}
        state={state}
    />

    <BrowserKeyContainer
        key={state.selectedKey}
        data={state.selectedKeyData}
        openUpdateModal={openModal}
    />
</div>

{#if modalMode === "UPDATE" && typeof state?.selectedKey === "string"}
<CreateEditKeyModal
    key={state.selectedKey}
    value={state.selectedKeyData?.value}
    mode={modalMode}
    open={modalOpen}
    onClosed={onModalClosed}
    />
{/if}

{#if modalMode === "CREATE"}
<CreateEditKeyModal
    mode={modalMode}
    open={modalOpen}
    onClosed={onModalClosed}
    />
{/if}