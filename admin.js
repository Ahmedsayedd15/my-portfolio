import { db, auth } from "../firebase.js";
import {
collection,
addDoc,
getDocs,
deleteDoc,
updateDoc,
doc
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
let editId = null;
let editType = null;
import {
signInWithEmailAndPassword,
onAuthStateChanged
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// =================
// LOGIN
// =================
loginBtn.onclick = ()=>{
signInWithEmailAndPassword(
auth,
email.value,
password.value
)
.catch(()=>{
alert("Wrong Login");
});
};
onAuthStateChanged(auth,(user)=>{
if(user){
    document.querySelector("#login-box").style.display="none";
    document.querySelector("#panel").style.display="block";
loadAll();
}
});
// =================
// ADD SKILL
// =================
addSkill.onclick = async ()=>{
await addDoc(
collection(db,"skills"),
{
name:skillName.value,
icon:skillIcon.value
}
);
skillName.value="";
skillIcon.value="";
loadAll();
};
// =================
// ADD PROJECT
// =================
addProject.onclick = async ()=>{
await addDoc(
collection(db,"projects"),
{
title:projectTitle.value,
category:projectCategory.value,
icon:projectIcon.value,
description:projectDescription.value,
tools:projectTools.value,
github:projectGithub.value
}
);
loadAll();
};
// =================
// ADD EXPERIENCE
// =================
addExperience.onclick = async ()=>{
await addDoc(
collection(db,"experience"),
{
date:expDate.value,
title:expTitle.value,
company:expCompany.value,
icon:expIcon.value,
description:expDescription.value
}
);
loadAll();
};
// =================
// LOAD DATA
// =================
async function loadAll(){
loadSkills();
loadProjects();
loadExperience();
}
// =================
// SKILLS CRUD
// =================
async function loadSkills(){
    const box =
    document.querySelector("#skills-list");
    box.innerHTML="";
    const snap =
    await getDocs(collection(db,"skills"));
    snap.forEach(item=>{
    let data=item.data();
    box.innerHTML += `
    <div class="admin-card">
    <h3>
    ${data.name}
    </h3>
    <button onclick="deleteItem('skills','${item.id}')">
    Delete
    </button>
    <button onclick="editSkill('${item.id}')">
    Edit
    </button>
    </div>
    `;
    });
    }
// =================
// PROJECTS CRUD
// =================
async function loadProjects(){
const box =
document.querySelector("#projects-list");
box.innerHTML="";
const snap =
await getDocs(collection(db,"projects"));
snap.forEach(item=>{
let data=item.data();
box.innerHTML += `
<div class="admin-card">
<h3>
${data.title}
</h3>
<button onclick="deleteItem('projects','${item.id}')">
Delete
</button>
<button onclick="editProject('${item.id}')">
Edit
</button>
</div>
`;
});
}
// =================
// EXPERIENCE CRUD
// =================
async function loadExperience(){
const box =
document.querySelector("#experience-list");
box.innerHTML="";
const snap =
await getDocs(collection(db,"experience"));
snap.forEach(item=>{
let data=item.data();
box.innerHTML += `
<div class="admin-card">
<h3>
${data.title}
</h3>
<button onclick="deleteItem('experience','${item.id}')">
Delete
</button>
<button onclick="editExperience('${item.id}')">
Edit
</button>
</div>
`;
});
}
// =================
// DELETE
// =================
window.deleteItem = async(collectionName,id)=>{
await deleteDoc(
doc(db,collectionName,id)
);
loadAll();
};
// =================
// =================
// =================
// EDIT SKILL
// =================
window.editSkill = async(id)=>{
    const snap = await getDocs(collection(db,"skills"));
    snap.forEach(item=>{
    if(item.id === id){
    let data = item.data();
    skillName.value = data.name;
    skillIcon.value = data.icon;
    editId = id;
    editType = "skills";
    addSkill.style.display="none";
    updateSkill.style.display="block";
    }
    });
    };
    // =================
    // UPDATE SKILL
    // =================
    updateSkill.onclick = async()=>{
    await updateDoc(
    doc(db,"skills",editId),
    {
    name:skillName.value,
    icon:skillIcon.value
    }
    );
    skillName.value="";
    skillIcon.value="";
    editId=null;
    updateSkill.style.display="none";
    addSkill.style.display="block";
    loadAll();
    };
    // =================
    // EDIT PROJECT
    // =================
    window.editProject = async(id)=>{
    const snap = await getDocs(collection(db,"projects"));
    snap.forEach(item=>{
    if(item.id === id){
    let data=item.data();
    projectTitle.value=data.title;
    projectCategory.value=data.category;
    projectIcon.value=data.icon;
    projectDescription.value=data.description;
    projectTools.value=data.tools;
    projectGithub.value=data.github;
    editId=id;
    editType="projects";
    addProject.style.display="none";
    updateProject.style.display="block";
    }
    });
    };
    // =================
    // UPDATE PROJECT
    // =================
    updateProject.onclick = async()=>{
    await updateDoc(
    doc(db,"projects",editId),
    {
    title:projectTitle.value,
    category:projectCategory.value,
    icon:projectIcon.value,
    description:projectDescription.value,
    tools:projectTools.value,
    github:projectGithub.value
    }
    );
    projectTitle.value="";
    projectCategory.value="";
    projectIcon.value="";
    projectDescription.value="";
    projectTools.value="";
    projectGithub.value="";
    editId=null;
    updateProject.style.display="none";
    addProject.style.display="block";
    loadAll();
    };
    // =================
    // EDIT EXPERIENCE
    // =================
    window.editExperience = async(id)=>{
    const snap = await getDocs(collection(db,"experience"));
    snap.forEach(item=>{
    if(item.id===id){
    let data=item.data();
    expDate.value=data.date;
    expTitle.value=data.title;
    expCompany.value=data.company;
    expIcon.value=data.icon;
    expDescription.value=data.description;
    editId=id;
    editType="experience";
    addExperience.style.display="none";
    updateExperience.style.display="block";
    }
    });
    };
    // =================
    // UPDATE EXPERIENCE
    // =================
    updateExperience.onclick = async()=>{
    await updateDoc(
    doc(db,"experience",editId),
    {
    date:expDate.value,
    title:expTitle.value,
    company:expCompany.value,
    icon:expIcon.value,
    description:expDescription.value
    }
    );
    expDate.value="";
    expTitle.value="";
    expCompany.value="";
    expIcon.value="";
    expDescription.value="";
    editId=null;
    updateExperience.style.display="none";
    addExperience.style.display="block";
    loadAll();
    };