document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle hamburger icon appearance
            const icon = mobileMenu.querySelector('i');
            if(icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close navigation menu instantly when clicking any link
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

    // --- Expandable Project Details System ---
    const toggleButtons = document.querySelectorAll('.toggle-details-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetDetails = document.getElementById(targetId);

            if (targetDetails) {
                targetDetails.classList.toggle('expanded');
                
                if (targetDetails.classList.contains('expanded')) {
                    button.textContent = 'Hide Details';
                } else {
                    button.textContent = 'View Details';
                }
            }
        });
    });

    // --- On-Scroll Reveal Structural Framework ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const triggerBottom = (window.innerHeight / 5) * 4;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;

            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on initial instantiation to load structural elements within frame view
    revealOnScroll();
});