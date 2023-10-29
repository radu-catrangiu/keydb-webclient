<script>
    import { page } from "$app/stores";
    const { slug } = $page.params;
    
    let path = $page.url.pathname;
    $: {
        path = $page.url.pathname
    };

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
    const baseClass = "list-group-item list-group-item-action";
</script>

<div class="row">
    <div class="col-2">
        <div class="list-group list-group-flush">
            {#each links as link}
                <a
                    href={link.path}
                    class="{baseClass} {path === link.path ? 'active' : ''}"
                >
                    {link.text}
                </a>
            {/each}
        </div>
    </div>
    <div class="col-10">
        <slot />
    </div>
</div>
