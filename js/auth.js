import { auth, db } from './firebase-init.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const googleProvider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const googleLoginBtn = document.getElementById('google-login');
    const logoutBtn = document.getElementById('logout-btn');

    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (googleLoginBtn) googleLoginBtn.addEventListener('click', handleGoogleLogin);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    monitorAuthState();
});

async function handleRegister(e) {
    e.preventDefault();
    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = e.target.role.value;

    if (!role) {
        alert("Please select a role (Student or Teacher).");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            email: email,
            role: role,
            createdAt: new Date(),
            profilePicture: 'assets/images/default-avatar.png',
            bio: ''
        });
        
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error("Registration Error:", error);
        alert(`Error during registration: ${error.message}`);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error("Login Error:", error);
        alert(`Error during login: ${error.message}`);
    }
}

async function handleGoogleLogin() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                fullName: user.displayName,
                email: user.email,
                role: 'STUDENT',
                createdAt: new Date(),
                profilePicture: user.photoURL || 'assets/images/default-avatar.png',
            });
        }
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error("Google Login Error:", error);
        alert(`Error with Google Sign-In: ${error.message}`);
    }
}

function handleLogout() {
    signOut(auth).catch(error => console.error("Logout Error:", error));
}

function monitorAuthState() {
    onAuthStateChanged(auth, async (user) => {
        const currentPage = window.location.pathname.split('/').pop();
        const isAuthPage = ['login.html', 'register.html'].includes(currentPage);
        const isProtectedPage = !isAuthPage && currentPage !== '' && currentPage !== 'index.html';

        if (user) {
            if (isAuthPage) {
                window.location.href = 'dashboard.html';
                return;
            }
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                checkRoleAndRedirect(userData.role, currentPage);
            }
        } else {
            if (isProtectedPage) {
                window.location.href = 'login.html';
            }
        }
    });
}

function checkRoleAndRedirect(role, page) {
    const studentOnlyPages = ['student-dashboard.html'];
    const teacherOnlyPages = ['teacher-dashboard.html', 'create-course.html'];

    if (role === 'STUDENT' && teacherOnlyPages.includes(page)) {
        window.location.href = 'error-403.html';
    } else if (role === 'TEACHER' && studentOnlyPages.includes(page)) {
        window.location.href = 'error-403.html';
    }
}