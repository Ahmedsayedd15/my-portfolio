import { initializeApp } 
from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } 
from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } 
from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
const firebaseConfig = {
apiKey: "AIzaSyDQaBt6g20PCquOyPDlsc_8pMLushXhYwc",
authDomain: "ahmed-portfolio-84bb1.firebaseapp.com",
projectId: "ahmed-portfolio-84bb1",
storageBucket: "ahmed-portfolio-84bb1.firebasestorage.app",
messagingSenderId: "912091063016",
appId: "1:912091063016:web:a0eb48949970f5189b5f5d"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);