function openWindow(id) {
    document.getElementById(id).classList.add('active');
}
function closeWindow(id) {
    document.getElementById(id).classList.remove('active');
}

function openLightbox(src, caption) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox-caption').textContent = caption || '';
    document.getElementById('lightbox').classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

const stickyContainers = document.querySelectorAll('.hero-inner, .about-notes');

const stickyObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                stickyObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

stickyContainers.forEach((el) => stickyObserver.observe(el));

function observeFadeIns(selector = '.work-item, .blog-item') {
    const items = document.querySelectorAll(selector);
    const fadeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    items.forEach((item) => fadeObserver.observe(item));
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.accordion-toggle').forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const item = toggle.closest('.accordion-item');
            const content = item.querySelector('.details-content');
            const isOpen = item.classList.contains('is-open');

            if (isOpen) {
                content.style.maxHeight = '0px';
                item.classList.remove('is-open');
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                item.classList.add('is-open');
            }
        });
    });

    const galleryImages = document.querySelectorAll('.project-gallery img');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    galleryImages.forEach((img) => observer.observe(img));

    observeFadeIns('.work-item');
});