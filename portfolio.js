import { db } from "./firebase.js";
import {
collection,
getDocs
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// =================
// Load Skills
// =================
async function loadSkills(){
const container = document.querySelector("#skills-container");
if(!container) return;
const snapshot = await getDocs(
collection(db,"skills")
);
let html="";
snapshot.forEach(doc=>{
let skill = doc.data();
html += `
<div class="skill-icon">
<i class="${skill.icon}"></i>
<p>
${skill.name}
</p>
</div>
`;
});
container.innerHTML = html;
}
// =================
// Load Projects
// =================
async function loadProjects(){
const container = document.querySelector("#projects-container");
if(!container) return;
const snapshot = await getDocs(
collection(db,"projects")
);
let html="";
snapshot.forEach(doc=>{
let project = doc.data();
html += `
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
${project.tools}
</span>
<a href="${project.github}" target="_blank" class="github-btn">
GitHub
</a>
</div>
</div>
`;
});
container.innerHTML = html;
}
// =================
// Load Experience
// =================
async function loadExperience(){
const container =
document.querySelector("#experience-container");
if(!container) return;
const snapshot =
await getDocs(
collection(db,"experience")
);
let html="";
snapshot.forEach(doc=>{
let exp=doc.data();
html += `
<div class="experience-card">
<div class="exp-icon">
<i class="${exp.icon}"></i>
</div>
<div class="exp-content">
<span class="exp-date">
${exp.date}
</span>
<h3>
${exp.title}
</h3>
<h4>
${exp.company}
</h4>
<p>
${exp.description}
</p>
</div>
</div>
`;
});
container.innerHTML = html;
}
loadSkills();
loadProjects();
loadExperience();