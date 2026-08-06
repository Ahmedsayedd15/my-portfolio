import { db, auth } from "../firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    deleteDoc,
    updateDoc,
    doc,
    query,
    orderBy
} 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
let editId = null;
// =======================
// DOM
// =======================
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const addSkill = document.querySelector("#addSkill");
const addProject = document.querySelector("#addProject");
const addExperience = document.querySelector("#addExperience");
const updateSkill = document.querySelector("#updateSkill");
const updateProject = document.querySelector("#updateProject");
const updateExperience = document.querySelector("#updateExperience");
const cancelEdit = document.querySelector("#cancelEdit");
// Skills
const skillName = document.querySelector("#skillName");
const skillIcon = document.querySelector("#skillIcon");
const skillOrder = document.querySelector("#skillOrder");
// Projects
const projectTitle = document.querySelector("#projectTitle");
const projectCategory = document.querySelector("#projectCategory");
const projectIcon = document.querySelector("#projectIcon");
const projectDescription = document.querySelector("#projectDescription");
const projectTools = document.querySelector("#projectTools");
const projectGithub = document.querySelector("#projectGithub");
const projectOrder = document.querySelector("#projectOrder");
// Experience
const expDate = document.querySelector("#expDate");
const expTitle = document.querySelector("#expTitle");
const expCompany = document.querySelector("#expCompany");
const expIcon = document.querySelector("#expIcon");
const expDescription = document.querySelector("#expDescription");
const expOrder = document.querySelector("#expOrder");
// =======================
// CLEAR FORMS
// =======================
function clearSkillForm() {
    skillName.value = "";
    skillIcon.value = "";
    skillOrder.value = "";
}
function clearProjectForm() {
    projectTitle.value = "";
    projectCategory.value = "";
    projectIcon.value = "";
    projectDescription.value = "";
    projectTools.value = "";
    projectGithub.value = "";
    projectOrder.value = "";
}
function clearExperienceForm() {
    expDate.value = "";
    expTitle.value = "";
    expCompany.value = "";
    expIcon.value = "";
    expDescription.value = "";
    expOrder.value = "";
}
// =======================
// RESET EDIT MODE
// =======================
function resetEditMode() {
    editId = null;
    updateSkill.style.display = "none";
    updateProject.style.display = "none";
    updateExperience.style.display = "none";
    addSkill.style.display = "inline-block";
    addProject.style.display = "inline-block";
    addExperience.style.display = "inline-block";
    cancelEdit.style.display = "none";
    clearSkillForm();
    clearProjectForm();
    clearExperienceForm();
}
if (cancelEdit) {
    cancelEdit.onclick = resetEditMode;
}
// =======================
// SHIFT ORDER
// =======================
async function shiftOrders(collectionName, newOrder) {
    const q = query(
        collection(db, collectionName),
        orderBy("order", "desc")
    );
    const snapshot = await getDocs(q);
    const updates = [];
    for (const item of snapshot.docs) {
        const data = item.data();
        if (data.order >= newOrder) {
            updates.push(
                updateDoc(
                    doc(db, collectionName, item.id),
                    {
                        order: data.order + 1
                    }
                )
            );
        }
    }
    await Promise.all(updates);
}
// =======================
// NORMALIZE ORDER
// =======================
async function normalizeOrders(collectionName) {
    const q = query(
        collection(db, collectionName),
        orderBy("order", "asc")
    );
    const snap = await getDocs(q);
    let count = 1;
    for (const item of snap.docs) {
        await updateDoc(
            doc(db, collectionName, item.id),
            {
                order: count
            }
        );
        count++;
    }
}
// =======================
// UPDATE ORDER
// =======================
async function updateOrder(collectionName, id, oldOrder, newOrder) {
    if (oldOrder === newOrder) return;
    const q = query(
        collection(db, collectionName),
        orderBy("order", "asc")
    );
    const snap = await getDocs(q);
    for (const item of snap.docs) {
        if (item.id === id) continue;
        const data = item.data();
        if (oldOrder < newOrder) {
            if (data.order > oldOrder && data.order <= newOrder) {
                await updateDoc(
                    doc(db, collectionName, item.id),
                    {
                        order: data.order - 1
                    }
                );
            }
        } else {
            if (data.order >= newOrder && data.order < oldOrder) {
                await updateDoc(
                    doc(db, collectionName, item.id),
                    {
                        order: data.order + 1
                    }
                );
            }
        }
    }
}
// =======================
// LOGIN
// =======================
loginBtn.onclick = () => {
    signInWithEmailAndPassword(
        auth,
        email.value.trim(),
        password.value
    ).catch(() => {
        alert("Wrong Login");
    });
};
if (logoutBtn) {
    logoutBtn.onclick = async () => {
        await signOut(auth);
    };
}
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.querySelector("#login-box").style.display = "none";
        document.querySelector("#panel").style.display = "block";
        loadAll();
    } else {
        document.querySelector("#login-box").style.display = "block";
        document.querySelector("#panel").style.display = "none";
    }
});
// =======================
// ADD SKILL
// =======================
addSkill.onclick = async () => {
    try {
        if (!skillName.value.trim()) {
            return alert("Skill name is required");
        }
        const order = Math.max(Number(skillOrder.value) || 1, 1);
        await shiftOrders("skills", order);
        await addDoc(
            collection(db, "skills"),
            {
                name: skillName.value.trim(),
                icon: skillIcon.value.trim(),
                order
            }
        );
        clearSkillForm();
        await loadAll();
    } catch (error) {
        alert(error.message);
    }
};
// =======================
// ADD PROJECT
// =======================
addProject.onclick = async () => {
    try {
        if (!projectTitle.value.trim()) {
            return alert("Project title is required");
        }
        const order = Math.max(Number(projectOrder.value) || 1, 1);
        await shiftOrders("projects", order);
        await addDoc(
            collection(db, "projects"),
            {
                title: projectTitle.value.trim(),
                category: projectCategory.value.trim(),
                icon: projectIcon.value.trim(),
                description: projectDescription.value.trim(),
                tools: projectTools.value.trim(),
                github: projectGithub.value.trim(),
                order
            }
        );
        clearProjectForm();
        await loadAll();
    } catch (error) {
        alert(error.message);
    }
};
// =======================
// ADD EXPERIENCE
// =======================
addExperience.onclick = async () => {
    try {
        if (!expTitle.value.trim()) {
            return alert("Experience title is required");
        }
        const order = Math.max(Number(expOrder.value) || 1, 1);
        await shiftOrders("experience", order);
        await addDoc(
            collection(db, "experience"),
            {
                date: expDate.value.trim(),
                title: expTitle.value.trim(),
                company: expCompany.value.trim(),
                icon: expIcon.value.trim(),
                description: expDescription.value.trim(),
                order
            }
        );
        clearExperienceForm();
        await loadAll();
    } catch (error) {
        alert(error.message);
    }
};
// =======================
// LOAD ALL
// =======================
async function loadAll() {
    await Promise.all([
        loadSkills(),
        loadProjects(),
        loadExperience()
    ]);
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
            <div class="content">
                <h3>${data.name}</h3>
            </div>
            <div class="actions">
                <button onclick="editSkill('${item.id}')">
                    Edit
                </button>
                <button
                    class="delete"
                    onclick="deleteItem('skills','${item.id}')">
                    Delete
                </button>
            </div>
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
            <div class="content">
                <h3>${data.title}</h3>
            </div>
            <div class="actions">
                <button onclick="editProject('${item.id}')">
                    Edit
                </button>
                <button
                    class="delete"
                    onclick="deleteItem('projects','${item.id}')">
                    Delete
                </button>
            </div>
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
            <div class="content">
                <h3>${data.title}</h3>
            </div>
            <div class="actions">
                <button onclick="editExperience('${item.id}')">
                    Edit
                </button>
                <button
                    class="delete"
                    onclick="deleteItem('experience','${item.id}')">
                    Delete
                </button>
            </div>
        </div>
        `;
    });
}
// =======================
// DELETE
// =======================
window.deleteItem = async (collectionName, id) => {
    if (!confirm("Are you sure you want to delete?")) return;
    try {
        await deleteDoc(
            doc(db, collectionName, id)
        );
        await normalizeOrders(collectionName);
        await loadAll();
    }
    catch (error) {
        alert(error.message);
    }
};
// =======================
// EDIT SKILL
// =======================
window.editSkill = async (id) => {
    const snap = await getDoc(
        doc(db, "skills", id)
    );
    if (!snap.exists()) return;
    const data = snap.data();
    skillName.value = data.name;
    skillIcon.value = data.icon;
    skillOrder.value = data.order;
    editId = id;
    addSkill.style.display = "none";
   updateSkill.style.display = "inline-block";
addSkill.style.display = "none";
updateSkill.after(cancelEdit);
cancelEdit.style.display = "inline-block";
};
// =======================
// EDIT PROJECT
// =======================
window.editProject = async (id) => {
    const snap = await getDoc(
        doc(db, "projects", id)
    );
    if (!snap.exists()) return;
    const data = snap.data();
    projectTitle.value = data.title;
    projectCategory.value = data.category;
    projectIcon.value = data.icon;
    projectDescription.value = data.description;
    projectTools.value = data.tools;
    projectGithub.value = data.github;
    projectOrder.value = data.order;
    editId = id;
    addProject.style.display = "none";
    updateProject.style.display = "inline-block";
addProject.style.display = "none";
updateProject.after(cancelEdit);
cancelEdit.style.display = "inline-block";
};
// =======================
// EDIT EXPERIENCE
// =======================
window.editExperience = async (id) => {
    const snap = await getDoc(
        doc(db, "experience", id)
    );
    if (!snap.exists()) return;
    const data = snap.data();
    expDate.value = data.date;
    expTitle.value = data.title;
    expCompany.value = data.company;
    expIcon.value = data.icon;
    expDescription.value = data.description;
    expOrder.value = data.order;
    editId = id;
    addExperience.style.display = "none";
    updateExperience.style.display = "inline-block";
addExperience.style.display = "none";
updateExperience.after(cancelEdit);
cancelEdit.style.display = "inline-block";
};
// =======================
// UPDATE SKILL
// =======================
updateSkill.onclick = async () => {
    try {
        if (!editId) return;
        const snap = await getDoc(
            doc(db, "skills", editId)
        );
        if (!snap.exists()) return;
        const oldOrder = snap.data().order;
        const newOrder = Math.max(
            Number(skillOrder.value) || 1,
            1
        );
        await updateOrder(
            "skills",
            editId,
            oldOrder,
            newOrder
        );
        await updateDoc(
            doc(db, "skills", editId),
            {
                name: skillName.value.trim(),
                icon: skillIcon.value.trim(),
                order: newOrder
            }
        );
        resetEditMode();
        await loadAll();
    }
    catch (error) {
        alert(error.message);
    }
};
// =======================
// UPDATE PROJECT
// =======================
updateProject.onclick = async () => {
    try {
        if (!editId) return;
        const snap = await getDoc(
            doc(db, "projects", editId)
        );
        if (!snap.exists()) return;
        const oldOrder = snap.data().order;
        const newOrder = Math.max(
            Number(projectOrder.value) || 1,
            1
        );
        await updateOrder(
            "projects",
            editId,
            oldOrder,
            newOrder
        );
        await updateDoc(
            doc(db, "projects", editId),
            {
                title: projectTitle.value.trim(),
                category: projectCategory.value.trim(),
                icon: projectIcon.value.trim(),
                description: projectDescription.value.trim(),
                tools: projectTools.value.trim(),
                github: projectGithub.value.trim(),
                order: newOrder
            }
        );
        resetEditMode();
        await loadAll();
    }
    catch (error) {
        alert(error.message);
    }
};
// =======================
// UPDATE EXPERIENCE
// =======================
updateExperience.onclick = async () => {
    try {
        if (!editId) return;
        const snap = await getDoc(
            doc(db, "experience", editId)
        );
        if (!snap.exists()) return;
        const oldOrder = snap.data().order;
        const newOrder = Math.max(
            Number(expOrder.value) || 1,
            1
        );
        await updateOrder(
            "experience",
            editId,
            oldOrder,
            newOrder
        );
        await updateDoc(
            doc(db, "experience", editId),
            {
                date: expDate.value.trim(),
                title: expTitle.value.trim(),
                company: expCompany.value.trim(),
                icon: expIcon.value.trim(),
                description: expDescription.value.trim(),
                order: newOrder
            }
        );
        resetEditMode();
        await loadAll();
    }
    catch (error) {
        alert(error.message);
    }
};