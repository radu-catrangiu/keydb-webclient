<script>
    import { isJsonString } from "$lib/utils";
    import BrowserKeyJsonContent from "./BrowserKeyJSONContent.svelte";
    import BrowserKeyDefaultContent from "./BrowserKeyDefaultContent.svelte";
    import BrowserKeyHashContent from "./BrowserKeyHashContent.svelte";
    import BrowserKeySetContent from "./BrowserKeySetContent.svelte";
    import BrowserKeyZsetContent from "./BrowserKeyZsetContent.svelte";
    import BrowserKeyListContent from "./BrowserKeyListContent.svelte";

    /**
     * @type {string | null}
     */
    export let key;

    /**
     * @type {import("./key/+server").KeyDataResponse | null}
     */
    export let data;
</script>

{#if key !== null && data?.exists}
    {#if data.type === "string" && typeof data.value === "string" && isJsonString(data.value)}
        <BrowserKeyJsonContent {key} {data} />
    {:else if data.type === "hash"}
        <BrowserKeyHashContent {key} {data} />
    {:else if data.type === "set"}
        <BrowserKeySetContent {key} {data} />
    {:else if data.type === "zset"}
        <BrowserKeyZsetContent {key} {data} />
    {:else if data.type === "list"}
        <BrowserKeyListContent {key} {data} />
    {:else}
        <BrowserKeyDefaultContent {key} {data} />
    {/if}
{:else}
<div class="col-9">
    <div class="text-center mt-5">
        <span class="fs-3 text-danger">
            The <b>{key}</b> key does not exist.
        </span>
    </div>
</div>
{/if}
