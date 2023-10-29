<script>
    /**
     * @type {string | null}
     */
    export let selectedKey;
</script>

{#if selectedKey != null}
    <div class="col">
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col">
                        <h4>{selectedKey}</h4>
                    </div>
                    <div class="col"></div>
                </div>
                <div class="row">
                    <div class="col">
                        <small>String</small>
                    </div>
                    <div class="col"></div>
                </div>
            </div>
            <div class="card-body">
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            </div>
        </div>
    </div>
{/if}