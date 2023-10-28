<script>
    import { CONNECTED_COMMAND_LINE, CONNECTING_COMMAND_LINE, EMPTY_COMMAND_LINE, ERROR_COMMAND_LINE, PING_COMMAND_LINE, READY_COMMAND_LINE, TYPE } from "$lib/cli";
    import { wait } from "$lib/utils";
    import { beforeUpdate, afterUpdate, onMount } from "svelte";

    /**
     * @type {HTMLElement}
     */
    let terminalContainer;
    let autoscroll = false;

    const inputOptions = {
        disabled: false,
        placeholder: "Enter a command",
    };
    let db = 0;
    let command = "";
    /**
     * @type {any[]}
     */
    let terminalLines = [];

    beforeUpdate(() => {
        if (terminalContainer) {
            const scrollableDistance =
                terminalContainer.scrollHeight - terminalContainer.offsetHeight;
            autoscroll = terminalContainer.scrollTop > scrollableDistance - 20;
        }
    });

    afterUpdate(() => {
        if (autoscroll) {
            terminalContainer.scrollTo(0, terminalContainer.scrollHeight);
        }
    });

    onMount(async () => {
        updateTerminal(CONNECTING_COMMAND_LINE, EMPTY_COMMAND_LINE);
        updateTerminal(PING_COMMAND_LINE, EMPTY_COMMAND_LINE);

        const result = await postCommand(0, "ping");

        if (result.type !== TYPE.RESPONSE) {
            inputOptions.disabled = true;
            inputOptions.placeholder = "Input Disabled.";
            updateTerminal(ERROR_COMMAND_LINE, EMPTY_COMMAND_LINE);
        }

        await wait(100);
        updateTerminal(CONNECTED_COMMAND_LINE);

        await wait(100);
        updateTerminal(READY_COMMAND_LINE, EMPTY_COMMAND_LINE);
    });

    /**
     * @param {any[]} args
     */
    function updateTerminal(...args) {
        terminalLines = [...terminalLines, ...args];
    }

    /**
     * @param {number} db
     * @param {string} command
     */
    async function postCommand(db, command) {
        const response = await fetch("./cli", {
            method: "POST",
            body: JSON.stringify({
                command,
                db,
            }),
        });

        const result = await response.json();

        return result;
    }

    async function sendCommand() {
        const newCommand = {
            type: TYPE.COMMAND,
            value: command,
        };
        updateTerminal(newCommand);

        const { type, value } = await postCommand(db, command);

        const newResponse = { type, value };
        updateTerminal(newResponse, EMPTY_COMMAND_LINE);

        command = ""
    }

    /**
     * @param {KeyboardEvent} event
     */
    function submit(event) {
        if (event.key === "Enter") {
            sendCommand();
        }
    }
</script>

<h1>CLI</h1>

<div class="row">
    <div class="col-md-12">
        <div class="terminal-container" bind:this={terminalContainer}>
            {#each terminalLines as line}
                {#if line.type == TYPE.HTML}
                    <div class={line.type}>
                        <span>{@html line.value}</span>
                    </div>
                {/if}

                {#if line.type == TYPE.COMMAND}
                    <div class={line.type}>
                        <b>
                            <span>&gt;&gt;</span>
                            <span>{line.value}</span>
                        </b>
                    </div>
                {/if}

                {#if line.type == TYPE.RESPONSE}
                    <div class={line.type}>
                        <span>{@html line.value}</span>
                    </div>
                {/if}

                {#if line.type == TYPE.ERROR}
                    <div class={line.type}>
                        <span><b>!</b></span>
                        <span>{line.value}</span>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-12">
        <div class="input-group">
            <span class="input-group-text">$</span>
            <input
                type="text"
                class="form-control"
                id="commandInput"
                disabled={inputOptions.disabled}
                placeholder={inputOptions.placeholder}
                on:keyup={submit}
                bind:value={command}
            />
            <button
                class="btn btn-primary"
                id="executeButton"
                on:click={sendCommand}>Execute</button
            >
        </div>
    </div>
</div>

<style>
    .terminal-container {
        border: 1px solid #ccc;
        height: calc(70vh - 100px);
        overflow-y: scroll;
        padding: 10px;
        background-color: aliceblue;
        color: black;
    }
    .input-group {
        margin-top: 10px;
    }
</style>
