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
const loginBtn = document.querySelector("#loginBtn");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const updateSkill = document.querySelector("#updateSkill");
const updateProject = document.querySelector("#updateProject");
const updateExperience = document.querySelector("#updateExperience");
// =======================
// SHIFT ORDER
// =======================
async function shiftOrders(collectionName,newOrder){
const q=query(
collection(db,collectionName),
orderBy("order","desc")
);
const snapshot=await getDocs(q);
for(const item of snapshot.docs){
const data=item.data();
if(data.order >= newOrder){
await updateDoc(
doc(db,collectionName,item.id),
{
order:data.order + 1
}
);
}
}
}
// =======================
// NORMALIZE ORDER
// =======================
async function normalizeOrders(collectionName){
const q=query(
collection(db,collectionName),
orderBy("order","asc")
);
const snap=await getDocs(q);
let count=1;
for(const item of snap.docs){
await updateDoc(
doc(db,collectionName,item.id),
{
order:count
}
);
count++;
}
}
// =======================
// UPDATE ORDER
// =======================
async function updateOrder(collectionName,id,oldOrder,newOrder){
if(oldOrder===newOrder) return;
const q=query(
collection(db,collectionName),
orderBy("order","asc")
);
const snap=await getDocs(q);
for(const item of snap.docs){
if(item.id===id) continue;
const data=item.data();
if(oldOrder < newOrder){
if(data.order > oldOrder && data.order <= newOrder){
await updateDoc(
doc(db,collectionName,item.id),
{
order:data.order-1
}
);
}
}
else{
if(data.order >= newOrder && data.order < oldOrder){
await updateDoc(
doc(db,collectionName,item.id),
{
order:data.order+1
}
);
}
}
}
}
// =======================
// LOGIN
// =======================
loginBtn.onclick=()=>{
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
// =======================
// ADD SKILL
// =======================
addSkill.onclick=async()=>{
try{
const order=Math.max(Number(skillOrder.value)||1,1);
await shiftOrders(
"skills",
order
);
await addDoc(
collection(db,"skills"),
{
name:skillName.value,
icon:skillIcon.value,
order:order
}
);
skillName.value="";
skillIcon.value="";
skillOrder.value="";
await loadAll();
}
catch(error){
alert(error.message);
}
};
// =======================
// ADD PROJECT
// =======================
addProject.onclick=async()=>{
try{
const order=Math.max(Number(projectOrder.value)||1,1);
await shiftOrders(
"projects",
order
);
await addDoc(
collection(db,"projects"),
{
title:projectTitle.value,
category:projectCategory.value,
icon:projectIcon.value,
description:projectDescription.value,
tools:projectTools.value,
github:projectGithub.value,
order:order
}
);
projectTitle.value="";
projectCategory.value="";
projectIcon.value="";
projectDescription.value="";
projectTools.value="";
projectGithub.value="";
projectOrder.value="";
await loadAll();
}
catch(error){
alert(error.message);
}
};
// =======================
// ADD EXPERIENCE
// =======================
addExperience.onclick=async()=>{
try{
const order=Math.max(Number(expOrder.value)||1,1);
await shiftOrders(
"experience",
order
);
await addDoc(
collection(db,"experience"),
{
date:expDate.value,
title:expTitle.value,
company:expCompany.value,
icon:expIcon.value,
description:expDescription.value,
order:order
}
);
expDate.value="";
expTitle.value="";
expCompany.value="";
expIcon.value="";
expDescription.value="";
expOrder.value="";
await loadAll();
}
catch(error){
alert(error.message);
}
};
// =======================
// LOAD ALL
// =======================
async function loadAll(){
await loadSkills();
await loadProjects();
await loadExperience();
}
// =======================
// SKILLS
// =======================
async function loadSkills(){
const box=document.querySelector("#skills-list");
box.innerHTML="";
const q=query(
collection(db,"skills"),
orderBy("order","asc")
);
const snap=await getDocs(q);
snap.forEach(item=>{
const data=item.data();
box.innerHTML+=`
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
async function loadProjects(){
const box=document.querySelector("#projects-list");
box.innerHTML="";
const q=query(
collection(db,"projects"),
orderBy("order","asc")
);
const snap=await getDocs(q);
snap.forEach(item=>{
const data=item.data();
box.innerHTML+=`
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
async function loadExperience(){
const box=document.querySelector("#experience-list");
box.innerHTML="";
const q=query(
collection(db,"experience"),
orderBy("order","asc")
);
const snap=await getDocs(q);
snap.forEach(item=>{
const data=item.data();
box.innerHTML+=`
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
window.deleteItem=async(collectionName,id)=>{
if(confirm("Are you sure you want to delete?")){
await deleteDoc(
doc(db,collectionName,id)
);
await normalizeOrders(collectionName);
await loadAll();
}
};
// =======================
// EDIT SKILL
// =======================
window.editSkill=async(id)=>{
const snap=await getDocs(
collection(db,"skills")
);
snap.forEach(item=>{
if(item.id===id){
const data=item.data();
skillName.value=data.name;
skillIcon.value=data.icon;
skillOrder.value=data.order;
editId=id;
addSkill.style.display="none";
updateSkill.style.display="block";
}
});
};
// =======================
// UPDATE SKILL
// =======================
updateSkill.onclick=async()=>{
let oldOrder;
const snap=await getDocs(
collection(db,"skills")
);
snap.forEach(item=>{
if(item.id===editId){
oldOrder=item.data().order;
}
});
const newOrder=Math.max(Number(skillOrder.value)||1,1);
await updateOrder(
"skills",
editId,
oldOrder,
newOrder
);
await updateDoc(
doc(db,"skills",editId),
{
name:skillName.value,
icon:skillIcon.value,
order:newOrder
}
);
editId=null;
skillName.value="";
skillIcon.value="";
skillOrder.value="";
addSkill.style.display="block";
updateSkill.style.display="none";
await loadAll();
};
// =======================
// EDIT PROJECT
// =======================
window.editProject=async(id)=>{
const snap=await getDocs(
collection(db,"projects")
);
snap.forEach(item=>{
if(item.id===id){
const data=item.data();
projectTitle.value=data.title;
projectCategory.value=data.category;
projectIcon.value=data.icon;
projectDescription.value=data.description;
projectTools.value=data.tools;
projectGithub.value=data.github;
projectOrder.value=data.order;
editId=id;
addProject.style.display="none";
updateProject.style.display="block";
}
});
};
// =======================
// UPDATE PROJECT
// =======================
updateProject.onclick=async()=>{
let oldOrder;
const snap=await getDocs(
collection(db,"projects")
);
snap.forEach(item=>{
if(item.id===editId){
oldOrder=item.data().order;
}
});
const newOrder=Math.max(Number(projectOrder.value)||1,1);
await updateOrder(
"projects",
editId,
oldOrder,
newOrder
);
await updateDoc(
doc(db,"projects",editId),
{
title:projectTitle.value,
category:projectCategory.value,
icon:projectIcon.value,
description:projectDescription.value,
tools:projectTools.value,
github:projectGithub.value,
order:newOrder
}
);
editId=null;
projectTitle.value="";
projectCategory.value="";
projectIcon.value="";
projectDescription.value="";
projectTools.value="";
projectGithub.value="";
projectOrder.value="";
addProject.style.display="block";
updateProject.style.display="none";
await loadAll();
};
// =======================
// EDIT EXPERIENCE
// =======================
window.editExperience=async(id)=>{
const snap=await getDocs(
collection(db,"experience")
);
snap.forEach(item=>{
if(item.id===id){
const data=item.data();
expDate.value=data.date;
expTitle.value=data.title;
expCompany.value=data.company;
expIcon.value=data.icon;
expDescription.value=data.description;
expOrder.value=data.order;
editId=id;
addExperience.style.display="none";
updateExperience.style.display="block";
}
});
};
// =======================
// UPDATE EXPERIENCE
// =======================
updateExperience.onclick=async()=>{
let oldOrder;
const snap=await getDocs(
collection(db,"experience")
);
snap.forEach(item=>{
if(item.id===editId){
oldOrder=item.data().order;
}
});
const newOrder=Math.max(Number(expOrder.value)||1,1);
await updateOrder(
"experience",
editId,
oldOrder,
newOrder
);
await updateDoc(
doc(db,"experience",editId),
{
date:expDate.value,
title:expTitle.value,
company:expCompany.value,
icon:expIcon.value,
description:expDescription.value,
order:newOrder
}
);
editId=null;
expDate.value="";
expTitle.value="";
expCompany.value="";
expIcon.value="";
expDescription.value="";
expOrder.value="";
addExperience.style.display="block";
updateExperience.style.display="none";
await loadAll();
};