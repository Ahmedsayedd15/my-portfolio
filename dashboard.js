import { db } from "./firebase.js";
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// =======================
// COUNT-UP ANIMATION
// =======================
function animateCount(el, target, duration = 900) {
    if (!el) return;
    const start = 0;
    const startTime = performance.now();
    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = Math.round(start + (target - start) * eased);
        el.textContent = `${value}+`;
        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = `${target}+`;
        }
    }
    requestAnimationFrame(tick);
}
async function loadDashboard() {
    try {
        const [projects, skills, experience] = await Promise.all([
            getDocs(collection(db, "projects")),
            getDocs(collection(db, "skills")),
            getDocs(collection(db, "experience"))
        ]);
        animateCount(document.querySelector("#project-count"), projects.size);
        animateCount(document.querySelector("#skill-count"), skills.size);
        animateCount(document.querySelector("#exp-count"), experience.size);
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}
loadDashboard();