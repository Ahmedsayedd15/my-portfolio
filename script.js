document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }
    // --- On-Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const triggerBottom = (window.innerHeight / 5) * 4;
        revealElements.forEach(el => {
            if (el.getBoundingClientRect().top < triggerBottom) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
    // --- Scroll Progress Bar ---
    const progressBar = document.querySelector('.scroll-progress');
    const updateProgress = () => {
        if (!progressBar) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = percent + '%';
    };
    window.addEventListener('scroll', updateProgress);
    updateProgress();
    // --- Active Nav Link on Scroll ---
    const navAnchors = document.querySelectorAll('.nav-links a[href*="#"]:not(.btn-sm)');
    const observedSections = document.querySelectorAll('section[id]');
    if (observedSections.length && navAnchors.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navAnchors.forEach(a => {
                        a.classList.toggle('active', a.getAttribute('href').endsWith('#' + id));
                    });
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px' });
        observedSections.forEach(sec => sectionObserver.observe(sec));
    }
});