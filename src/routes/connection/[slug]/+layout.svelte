<script>
    import { page } from "$app/stores";
    const { slug } = $page.params;

    const baseClass = "list-group-item list-group-item-action";
    const links = [
        {
            path: `/connection/${slug}/info`,
            text: "Details",
        },
        {
            path: `/connection/${slug}/browser`,
            text: "Browser",
        },
        {
            path: `/connection/${slug}/cli`,
            text: "CLI",
        },
        {
            path: `/connection/${slug}/clients-list`,
            text: "Clients list",
        },
    ];
</script>

<div class="row">
    <div class="col-2">
        <div class="list-group list-group-flush">
            {#each links as link}      
            <a href="{link.path}" class="{baseClass} {link.path === $page.url.pathname ? 'active' : ''}">
                {link.text}
            </a>
            {/each}
        </div>
    </div>
    <div class="col">
        <div class="row h-100">
            <slot />
        </div>
    </div>
</div>
