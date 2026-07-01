import { db, auth } from "../firebase.js";
import {
collection,
addDoc,
getDocs,
deleteDoc,
updateDoc,
doc,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
signInWithEmailAndPassword,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
let editId = null;
// =======================
// SHIFT ORDER FUNCTION
// =======================
async function shiftOrders(collectionName, newOrder) {
const q = query(
    collection(db, collectionName),
    orderBy("order", "desc")
);
const snapshot = await getDocs(q);
for (const item of snapshot.docs) {
    const data = item.data();
    if (data.order >= newOrder) {
        await updateDoc(doc(db, collectionName, item.id), {
            order: data.order + 1
        });
    }
}
}
// =======================
// LOGIN
// =======================
loginBtn.onclick = () => {
signInWithEmailAndPassword(auth, email.value, password.value)
.catch(() => alert("Wrong Login"));
};
onAuthStateChanged(auth, (user) => {
if (user) {
document.querySelector("#login-box").style.display = "none";
document.querySelector("#panel").style.display = "block";
loadAll();
}
});
// =======================
// ADD SKILL
// =======================
addSkill.onclick = async () => {
const order = Number(skillOrder.value);
await shiftOrders("skills", order);
await addDoc(collection(db, "skills"), {
name: skillName.value,
icon: skillIcon.value,
order: order
});
skillName.value = "";
skillIcon.value = "";
skillOrder.value = "";
loadAll();
};
// =======================
// ADD PROJECT
// =======================
addProject.onclick = async () => {
const order = Number(projectOrder.value);
await shiftOrders("projects", order);
await addDoc(collection(db, "projects"), {
title: projectTitle.value,
category: projectCategory.value,
icon: projectIcon.value,
description: projectDescription.value,
tools: projectTools.value,
github: projectGithub.value,
order: order
});
loadAll();
};
// =======================
// ADD EXPERIENCE
// =======================
addExperience.onclick = async () => {
const order = Number(expOrder.value);
await shiftOrders("experience", order);
await addDoc(collection(db, "experience"), {
date: expDate.value,
title: expTitle.value,
company: expCompany.value,
icon: expIcon.value,
description: expDescription.value,
order: order
});
loadAll();
};
// =======================
// LOAD ALL
// =======================
async function loadAll() {
loadSkills();
loadProjects();
loadExperience();
}
// =======================
// SKILLS
// =======================
async function loadSkills() {
const box = document.querySelector("#skills-list");
box.innerHTML = "";
const q = query(
collection(db, "skills"),
orderBy("order", "asc")
);
const snap = await getDocs(q);
snap.forEach(item => {
const data = item.data();
box.innerHTML += `
<div class="admin-card">
<h3>${data.name}</h3>
<button onclick="deleteItem('skills','${item.id}')">Delete</button>
<button onclick="editSkill('${item.id}')">Edit</button>
</div>
`;
});
}
// =======================
// PROJECTS
// =======================
async function loadProjects() {
const box = document.querySelector("#projects-list");
box.innerHTML = "";
const q = query(
collection(db, "projects"),
orderBy("order", "asc")
);
const snap = await getDocs(q);
snap.forEach(item => {
const data = item.data();
box.innerHTML += `
<div class="admin-card">
<h3>${data.title}</h3>
<button onclick="deleteItem('projects','${item.id}')">Delete</button>
<button onclick="editProject('${item.id}')">Edit</button>
</div>
`;
});
}
// =======================
// EXPERIENCE
// =======================
async function loadExperience() {
const box = document.querySelector("#experience-list");
box.innerHTML = "";
const q = query(
collection(db, "experience"),
orderBy("order", "asc")
);
const snap = await getDocs(q);
snap.forEach(item => {
const data = item.data();
box.innerHTML += `
<div class="admin-card">
<h3>${data.title}</h3>
<button onclick="deleteItem('experience','${item.id}')">Delete</button>
<button onclick="editExperience('${item.id}')">Edit</button>
</div>
`;
});
}
// =======================
// DELETE
// =======================
window.deleteItem = async (collectionName, id) => {
await deleteDoc(doc(db, collectionName, id));
loadAll();
};
// =======================
// EDIT (BASIC)
// =======================
window.editSkill = async (id) => {
const snap = await getDocs(collection(db, "skills"));
snap.forEach(item => {
if (item.id === id) {
const data = item.data();
skillName.value = data.name;
skillIcon.value = data.icon;
skillOrder.value = data.order;
editId = id;
addSkill.style.display = "none";
updateSkill.style.display = "block";
}
});
};
updateSkill.onclick = async () => {
await updateDoc(doc(db, "skills", editId), {
name: skillName.value,
icon: skillIcon.value,
order: Number(skillOrder.value)
});
editId = null;
addSkill.style.display = "block";
updateSkill.style.display = "none";
loadAll();
};
// =======================
window.editProject = async (id) => {
const snap = await getDocs(collection(db, "projects"));
snap.forEach(item => {
if (item.id === id) {
const data = item.data();
projectTitle.value = data.title;
projectCategory.value = data.category;
projectIcon.value = data.icon;
projectDescription.value = data.description;
projectTools.value = data.tools;
projectGithub.value = data.github;
projectOrder.value = data.order;
editId = id;
addProject.style.display = "none";
updateProject.style.display = "block";
}
});
};
updateProject.onclick = async () => {
await updateDoc(doc(db, "projects", editId), {
title: projectTitle.value,
category: projectCategory.value,
icon: projectIcon.value,
description: projectDescription.value,
tools: projectTools.value,
github: projectGithub.value,
order: Number(projectOrder.value)
});
editId = null;
addProject.style.display = "block";
updateProject.style.display = "none";
loadAll();
};
// =======================
window.editExperience = async (id) => {
const snap = await getDocs(collection(db, "experience"));
snap.forEach(item => {
if (item.id === id) {
const data = item.data();
expDate.value = data.date;
expTitle.value = data.title;
expCompany.value = data.company;
expIcon.value = data.icon;
expDescription.value = data.description;
expOrder.value = data.order;
editId = id;
addExperience.style.display = "none";
updateExperience.style.display = "block";
}
});
};
updateExperience.onclick = async () => {
await updateDoc(doc(db, "experience", editId), {
date: expDate.value,
title: expTitle.value,
company: expCompany.value,
icon: expIcon.value,
description: expDescription.value,
order: Number(expOrder.value)
});
editId = null;
addExperience.style.display = "none";
updateExperience.style.display = "block";
loadAll();
};
