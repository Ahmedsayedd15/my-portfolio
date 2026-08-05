import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
let allProjects = [];
let activeCategory = "All";
let searchTerm = "";
/* ===========================
   Render Projects
=========================== */
function renderProjects() {
    const container = document.querySelector("#all-projects-container");
    const noResults = document.querySelector("#no-results");
    const filtered = allProjects.filter(project => {
        const matchesCategory =
            activeCategory === "All" ||
            project.category === activeCategory;
        const text = `
            ${project.title || ""}
            ${project.description || ""}
            ${project.tools || ""}
        `.toLowerCase();
        const matchesSearch =
            searchTerm === "" ||
            text.includes(searchTerm);
        return matchesCategory && matchesSearch;
    });
    if (!filtered.length) {
        container.innerHTML = "";
        noResults.style.display = "block";
        return;
    }
    noResults.style.display = "none";
    container.innerHTML = filtered.map(project => `
<div class="project-card">
    <div class="project-top">
        <div>
            <span class="project-category">
                ${project.category}
            </span>
            <h3>
                ${project.title}
            </h3>
        </div>
        <i class="${project.icon} project-icon"></i>
    </div>
    <p>
        ${project.description}
    </p>
    <div class="project-footer">
        <span>
            ${project.tools || ""}
        </span>
        <a
            href="${project.github}"
            target="_blank"
            rel="noopener noreferrer"
            class="github-btn">
            GitHub
        </a>
    </div>
</div>
`).join("");
}
/* ===========================
   Filter Buttons
=========================== */
function buildFilterButtons() {
    const wrap = document.querySelector("#filter-buttons");
    const categories = [
        "All",
        ...new Set(allProjects.map(project => project.category))
    ];
    wrap.innerHTML = categories.map(category => `
<button
    class="filter-btn ${category === "All" ? "active" : ""}"
    data-cat="${category}">
    ${category}
</button>
`).join("");
    wrap.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", () => {
            wrap.querySelectorAll(".filter-btn")
                .forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            activeCategory = button.dataset.cat;
            renderProjects();
        });
    });
}
/* ===========================
   Statistics
=========================== */
function updateStatistics() {
    const totalProjects =
        document.querySelector("#projects-count");
    const totalCategories =
        document.querySelector("#categories-count");
    if (totalProjects)
        totalProjects.textContent = allProjects.length;
    if (totalCategories)
        totalCategories.textContent =
            new Set(allProjects.map(project => project.category)).size;
}
/* ===========================
   Load Projects
=========================== */
async function loadAllProjects() {
    const container =
        document.querySelector("#all-projects-container");
    if (!container) return;
    try {
        const q = query(
            collection(db, "projects"),
            orderBy("order", "asc")
        );
        const snapshot = await getDocs(q);
        allProjects = snapshot.docs.map(doc => doc.data());
        updateStatistics();
        buildFilterButtons();
        renderProjects();
    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <p style="text-align:center;color:#aaa;">
                Failed to load projects.
            </p>
        `;
    }
}
/* ===========================
   Search
=========================== */
const searchInput = document.querySelector("#project-search");
if (searchInput) {
    searchInput.addEventListener("input", e => {
        searchTerm = e.target.value
            .toLowerCase()
            .trim();
        renderProjects();
    });
}
/* ===========================
   Init
=========================== */
loadAllProjects();