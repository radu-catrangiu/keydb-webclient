<script>
    import { page } from "$app/stores";

    export let data;

    const info = data.connectionInfo || [];
</script>

<h1>
    Connection Details
</h1>

<div class="my-3 scrollable-column">
    <table class="table table-striped table-hover">
        <tbody class="fs-4">
            {#each info as { key, value }}
            <tr>
                <td>{key}</td>
                <td>{value}</td>
            </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    /* Set a fixed height for the second column to enable scrolling */
    .scrollable-column {
        max-height: 80vh; /* Adjust the height as needed */
        overflow-y: auto;
    }
</style>