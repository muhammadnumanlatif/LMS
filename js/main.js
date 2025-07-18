import { auth, db } from './firebase-init.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const logoutBtn = document.getElementById('logout-btn');

    const studentNav = document.getElementById('student-dashboard-link-container');
    const teacherNav = document.getElementById('teacher-dashboard-link-container');
    const userNameDisplay = document.getElementById('user-name');

    const applyTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.className = savedTheme === 'dark' ? 'dark-mode' : '';
        if (themeToggle) {
            themeToggle.checked = savedTheme === 'dark';
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const isDarkMode = themeToggle.checked;
            document.body.className = isDarkMode ? 'dark-mode' : '';
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).catch(error => console.error('Logout Error:', error));
        });
    }

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userNameDisplay) {
                    userNameDisplay.textContent = userData.fullName;
                }
                
                if (userData.role === 'STUDENT' && studentNav) {
                    studentNav.style.display = 'list-item';
                } else if (userData.role === 'TEACHER' && teacherNav) {
                    teacherNav.style.display = 'list-item';
                }
            }
        } else {
            if (studentNav) studentNav.style.display = 'none';
            if (teacherNav) teacherNav.style.display = 'none';
        }
    });

    applyTheme();
});