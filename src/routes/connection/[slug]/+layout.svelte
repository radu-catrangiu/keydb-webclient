<script>
    // import { page } from '$app/stores'
    // const basePath = $page.url.pathname;
</script>
<div class="row mt-3">
    <div class="col-2">
        <div class="d-grid gap-2">
            <a class="btn btn-primary" type="button" href="./">Details</a>
            <a class="btn btn-primary" type="button" href="./browser/">Browser</a>
            <a class="btn btn-primary" type="button" href="./cli/">CLI</a>
            <a class="btn btn-primary" type="button" href="./clients-list/">Clients List</a>
        </div>
    </div>
    <div class="col mx-5">
        <div class="row h-100">
            <slot/>
        </div>
    </div>
</div>

