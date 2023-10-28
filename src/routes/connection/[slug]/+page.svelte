<script>
    import { browser } from "$app/environment";
    import { page } from "$app/stores";

    if (browser) {
        window.location.href = $page.url + "/info";
    }
</script>

<p>Redirecting to /info...</p>
