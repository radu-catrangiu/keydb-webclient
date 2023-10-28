<script>
    import { page } from '$app/stores'
    const basePath = $page.url.pathname;
</script>
<div class="row mt-3">
    <div class="col-2">
        <div class="d-grid gap-2">
            <a class="btn btn-primary" type="button" href="{basePath}/">Details</a>
            <a class="btn btn-primary" type="button" href="{basePath}/browser/">Browser</a>
            <a class="btn btn-primary" type="button" href="{basePath}/cli/">CLI</a>
            <a class="btn btn-primary" type="button" href="{basePath}/clients-list/">Clients List</a>
        </div>
    </div>
    <div class="col">
        <slot/>
    </div>
</div>

