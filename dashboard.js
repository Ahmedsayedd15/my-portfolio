import { db } from "./firebase.js";
import {
collection,
getDocs
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
async function loadDashboard(){
const projects =
await getDocs(
collection(db,"projects")
);
const skills =
await getDocs(
collection(db,"skills")
);
const experience =
await getDocs(
collection(db,"experience")
);
document.querySelector("#project-count").innerHTML =
projects.size + "+";
document.querySelector("#skill-count").innerHTML =
skills.size + "+";
document.querySelector("#exp-count").innerHTML =
experience.size + "+";
}
loadDashboard();