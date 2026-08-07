import { db } from "./firebase.js";
import {
collection,
getDocs,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// =================
// SKILLS
// =================
async function loadSkills(){
const container = document.querySelector("#skills-container");
if(!container) return;
const q = query(
collection(db,"skills"),
orderBy("order","asc")
);
const snapshot = await getDocs(q);
let html="";
snapshot.forEach(doc=>{
let skill = doc.data();
html += `
<div class="skill-icon">
<i class="${skill.icon || ""}"></i>
<p>${skill.name || ""}</p>
</div>
`;
});
container.innerHTML = html;
}
// =================
// PROJECTS (Home - Featured Only)
// =================
async function loadProjects(){
    const container = document.querySelector("#projects-container");
    if(!container) return;
    const q = query(
        collection(db,"projects"),
        orderBy("order","asc")
    );
    const snapshot = await getDocs(q);
    let all = [];
    snapshot.forEach(doc => all.push(doc.data()));
    let featured = all.filter(p => p.featured === true);
    if(featured.length === 0){
        featured = all.slice(0, 6);
    }
    let html="";
   featured.forEach(p => {
    html += `
<div class="project-card">
    <div class="project-top">
        <div>
            <span class="project-category">${p.category || ""}</span>
            <h3>${p.title || ""}</h3>
        </div>
        <i class="${p.icon || ""} project-icon"></i>
    </div>
    <p>${p.description || ""}</p>
    <div class="project-footer">
        <span>${p.tools || ""}</span>
        ${p.github ? `
            <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="github-btn">
                GitHub
            </a>
        ` : ""}
    </div>
</div>
`;
});
    container.innerHTML = html;
}
// =================
// EXPERIENCE
// =================
async function loadExperience(){
const container = document.querySelector("#experience-container");
if(!container) return;
const q = query(
collection(db,"experience"),
orderBy("order","asc")
);
const snapshot = await getDocs(q);
let html="";
snapshot.forEach(doc=>{
let e = doc.data();
html += `
<div class="experience-card">
    <div class="exp-icon">
        <i class="${e.icon || ""}"></i>
    </div>
    <div class="exp-content">
        <span class="exp-date">
            ${e.date || ""}
        </span>
        <h3>
            ${e.title || ""}
        </h3>
        <h4>
            ${e.company || ""}
        </h4>
        <p>
            ${e.description || ""}
        </p>
    </div>
</div>
`;
});
container.innerHTML = html;
}
// =================
loadSkills();
loadProjects();
loadExperience();
const form = document.getElementById("contact-form");
if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        emailjs.sendForm(
            "service_u0d0jke",
            "template_d93xunx",
            this,
            {
                publicKey: "LOV5aSgipElUvF_k2",
            }
        )
        .then(() => {
            alert("Message sent successfully!");
            form.reset();
        })
        .catch((error) => {
            console.log("FULL ERROR:", error);
            console.log("Status:", error.status);
            console.log("Text:", error.text);
            alert(`Status: ${error.status}\nText: ${error.text}`);
        });
    });
}