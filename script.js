document.addEventListener("DOMContentLoaded", () => {

    // Mobile menu
    const menu = document.getElementById("mobile-menu");
    const nav = document.querySelector(".nav-links");

    if(menu){
        menu.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }

    // Scroll reveal
    const elements = document.querySelectorAll(".reveal");

    window.addEventListener("scroll", () => {
        elements.forEach(el => {
            if(el.getBoundingClientRect().top < window.innerHeight - 100){
                el.classList.add("active");
            }
        });
    });

});
