import { db } from "./firebase.js";
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
async function loadDashboard() {
    try {
        const [projects, skills, experience] = await Promise.all([
            getDocs(collection(db, "projects")),
            getDocs(collection(db, "skills")),
            getDocs(collection(db, "experience"))
        ]);
        document.querySelector("#project-count").textContent = `${projects.size}+`;
        document.querySelector("#skill-count").textContent = `${skills.size}+`;
        document.querySelector("#exp-count").textContent = `${experience.size}+`;
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}
loadDashboard();