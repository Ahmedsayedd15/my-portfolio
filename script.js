document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // MOBILE NAVIGATION
    // =========================
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
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // =========================
    // PROJECT DETAILS TOGGLE
    // =========================
    const toggleButtons = document.querySelectorAll('.toggle-details-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetDetails = document.getElementById(targetId);

            if (targetDetails) {
                targetDetails.classList.toggle('expanded');

                button.textContent = targetDetails.classList.contains('expanded')
                    ? 'Hide Details'
                    : 'View Details';
            }
        });
    });

    // =========================
    // SCROLL REVEAL (OPTIMIZED)
    // =========================
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const triggerBottom = (window.innerHeight / 5) * 4;

        revealElements.forEach(el => {
            if (el.getBoundingClientRect().top < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    let revealTicking = false;

    const scrollHandler = () => {
        if (!revealTicking) {
            window.requestAnimationFrame(() => {
                revealOnScroll();
                revealTicking = false;
            });
            revealTicking = true;
        }
    };

    window.addEventListener('scroll', scrollHandler);
    revealOnScroll();

    // =========================
    // ACTIVE NAV LINK (SCROLL SPY) - FIXED & OPTIMIZED
    // =========================
    const sections = document.querySelectorAll("section[id], header[id], footer[id]");
    const navItems = document.querySelectorAll(".nav-links a");

    let scrollTicking = false;

    window.addEventListener("scroll", () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {

                let current = "";

                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 120;

                    if (scrollY >= sectionTop) {
                        current = section.getAttribute("id");
                    }
                });

                navItems.forEach(link => {
                    link.classList.remove("active-link");

                    if (link.getAttribute("href") === "#" + current) {
                        link.classList.add("active-link");
                    }
                });

                scrollTicking = false;
            });

            scrollTicking = true;
        }
    });

    // =========================
    // SMOOTH THEME TOGGLE (LIGHT/DARK)
    // =========================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');

            const icon = themeToggle.querySelector('i');

            if (icon) {
                if (body.classList.contains('light-mode')) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        });
    }

});