(function () {
    const MIN_DISPLAY_TIME = 400;
    const start = Date.now();

    function hideLoader() {
        const loader = document.getElementById('page-loader');
        if (!loader) return;
        const elapsed = Date.now() - start;
        const wait = Math.max(MIN_DISPLAY_TIME - elapsed, 0);
        setTimeout(() => loader.classList.add('loader-hidden'), wait);
    }

    window.hidePageLoader = hideLoader;

    window.addEventListener('load', function () {
        if (!window.MANUAL_LOADER_CONTROL) {
            hideLoader();
        }
    });

    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            const loader = document.getElementById('page-loader');
            if (loader) loader.classList.add('loader-hidden');
        }
    });

    document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (!link) return;
        if (link.target === '_blank' || link.hasAttribute('download')) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

        let url;
        try {
            url = new URL(href, window.location.href);
        } catch {
            return;
        }
        if (url.origin !== window.location.origin) return;

        const loader = document.getElementById('page-loader');
        if (loader) loader.classList.remove('loader-hidden');
    });
})();