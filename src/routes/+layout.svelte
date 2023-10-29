<div>
    <nav class="navbar bg-body-secondary">
        <div class="mx-3">
            <a class="navbar-brand" href="/">
                <b class="fs-2">KeyDB</b> Web Client
            </a>
        </div>
    </nav>

    <main class="container-fluid">
        <div class="mx-5">
            <slot />
        </div>
    </main>

    <footer class="footer text-center w-100 py-3 position-absolute bottom-0 start-50 translate-middle-x">
        <div>Made with &hearts; SvelteKit</div>
    </footer>
</div>
