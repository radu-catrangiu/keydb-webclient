<script>
    import { linear } from "svelte/easing";

    /** @type {import('./$types').PageData} */
    export let data;
    const terminalLines = [
        {
            type: "command-line",
            value: "Command 1",
        },
        {
            type: "response",
            value: "This is the response to Command 1.",
        },
        {
            type: "command-line",
            value: "Command 2",
        },
        {
            type: "response",
            value: "This is the response to Command 2.",
        },
    ];
</script>

<h1>CLI</h1>

<div class="row">
    <div class="col-md-12">
        <div class="terminal-container">
            {#each terminalLines as line}
                <div class={line.type}>
                    {#if line.type == "command-line"}
                        <span>&gt;&gt;</span>
                    {/if}
                    <span>{line.value}</span>
                </div>
            {/each}
            <!-- Add more command-response pairs here -->
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div class="input-group">
            <span class="input-group-text">Command:</span>
            <input
                type="text"
                class="form-control"
                id="commandInput"
                placeholder="Enter a command"
            />
            <button class="btn btn-primary" id="executeButton">Execute</button>
        </div>
    </div>
</div>

<style>
    .terminal-container {
        border: 1px solid #ccc;
        height: 400px;
        overflow-y: scroll;
        padding: 10px;
        background-color: aliceblue;
        color: black;
    }
    .input-group {
        margin-top: 10px;
    }
</style>
