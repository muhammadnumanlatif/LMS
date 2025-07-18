import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyDV49Op7YU0oVz_gY1g8NnORbYkUVeH7MA",
    authDomain: "lms-vanilla-js-project.firebaseapp.com",
    projectId: "lms-vanilla-js-project",
    storageBucket: "lms-vanilla-js-project.appspot.com",
    messagingSenderId: "1076374645234",
    appId: "1:1076374645234:web:024398c3d021262709236b",
    measurementId: "G-8KDMHK9J99"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);