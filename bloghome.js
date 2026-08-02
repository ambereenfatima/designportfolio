document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("footer-year").textContent = new Date().getFullYear();

    const slug = new URLSearchParams(window.location.search).get("slug");

    if (slug) {
        loadSinglePost(slug);
    } else {
        loadPostList();
    }
});

/* list mode */
async function loadPostList() {
    const listEl = document.getElementById("entry-list");

    try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

        const data = await res.json();
        const posts = Array.isArray(data) ? data : data.posts;

        if (!posts || posts.length === 0) {
            showEmptyState("no entries yet; check back soon!");
            hideLoader();
            return;
        }

        renderPostList(posts, listEl);
        listEl.hidden = false;
        hideLoader();

    } catch (err) {
        console.error("Failed to load posts:", err);
        showEmptyState("couldn't load the journal right now. try refreshing in a bit.");
        hideLoader();
    }
}

function renderPostList(posts, listEl) {
    listEl.innerHTML = "";

    posts.forEach((post, i) => {
        const entry = document.createElement("a");
        entry.className = "entry";
        entry.href = `blog.html?slug=${encodeURIComponent(post.slug)}`;
        entry.style.setProperty("--stagger", i);

        const cover = post.cover
            ? `<img class="entry-thumb" src="${escapeAttr(post.cover)}" alt="" loading="lazy">`
            : "";

        const tags = Array.isArray(post.tags) && post.tags.length
            ? `<span class="entry-tags">${post.tags.map(escapeHtml).join(" · ")}</span>`
            : "";

        entry.innerHTML = `
        <div class="entry-text">
          <div class="entry-date">${post.date ? formatDate(post.date) : ""}</div>
          <h2 class="entry-title">${escapeHtml(post.title || "untitled")}</h2>
          ${post.excerpt ? `<p class="entry-excerpt">${escapeHtml(post.excerpt)}</p>` : ""}
          ${tags}
        </div>
        ${cover}
      `;

        listEl.appendChild(entry);
    });

    requestAnimationFrame(() => {
        listEl.querySelectorAll(".entry").forEach(el => el.classList.add("is-visible"));
    });
}

/* single post */
async function loadSinglePost(slug) {
    const container = document.getElementById("post-container");
    const subtitleEl = document.getElementById("journal-subtitle");

    try {
        const res = await fetch(`/api/post?slug=${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

        const data = await res.json();
        const post = data.post || data;

        if (!post || !post.title) {
            showEmptyState("that entry couldn't be found.");
            hideLoader();
            return;
        }

        document.title = `${post.title} — The Journal`;
        subtitleEl.textContent = post.date ? formatDate(post.date) : "";

        document.getElementById("post-date").textContent = post.date ? formatDate(post.date) : "";
        document.getElementById("post-title").textContent = post.title;

        const descEl = document.getElementById("post-description");
        if (post.excerpt) {
            descEl.textContent = post.excerpt;
        } else {
            descEl.remove();
        }

        const bannerEl = document.getElementById("post-banner");
        if (post.cover) {
            bannerEl.src = post.cover;
            bannerEl.alt = post.title;
            bannerEl.hidden = false;
        }

        document.getElementById("post-body").innerHTML = post.html || post.body || "";

        container.hidden = false;
        hideLoader();
        requestAnimationFrame(() => container.classList.add("is-visible"));

    } catch (err) {
        console.error("Failed to load post:", err);
        showEmptyState("couldn't load this entry right now. try refreshing in a bit.");
        hideLoader();
    }
}

function hideLoader() {
    const loader = document.getElementById("page-loader");
    if (loader) loader.classList.add("loader-hidden");
}

function showEmptyState(message) {
    const el = document.getElementById("blog-empty-state");
    el.querySelector("p").textContent = message;
    el.hidden = false;
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
}