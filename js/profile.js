import { auth, db, storage } from './firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const profilePictureInput = document.getElementById('profile-picture-input');
    const profilePictureDisplay = document.getElementById('profile-picture-display');
    const displayNameElement = document.getElementById('display-name');
    const displayRoleElement = document.getElementById('display-role');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const bioTextarea = document.getElementById('bio');

    let currentUser = null;

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            await populateUserProfile(user.uid);
            profileForm.addEventListener('submit', handleProfileUpdate);
            profilePictureInput.addEventListener('change', handlePictureUpload);
        } else {
            window.location.href = 'login.html';
        }
    });

    const populateUserProfile = async (uid) => {
        try {
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                displayNameElement.textContent = userData.fullName;
                displayRoleElement.textContent = userData.role;
                fullNameInput.value = userData.fullName;
                emailInput.value = userData.email;
                bioTextarea.value = userData.bio || '';
                profilePictureDisplay.src = userData.profilePicture || 'assets/images/default-avatar.png';
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            showToast('Error loading profile.', 'error');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const newFullName = fullNameInput.value;
        const newBio = bioTextarea.value;

        if (!newFullName) {
            showToast('Full Name cannot be empty.', 'error');
            return;
        }

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                fullName: newFullName,
                bio: newBio
            });
            displayNameElement.textContent = newFullName;
            showToast('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error);
            showToast('Failed to update profile.', 'error');
        }
    };

    const handlePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        showToast('Uploading picture...');
        const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);

        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                profilePicture: downloadURL
            });

            profilePictureDisplay.src = downloadURL;
            showToast('Profile picture updated!');
        } catch (error) {
            console.error("Error uploading picture:", error);
            showToast('Picture upload failed.', 'error');
        }
    };

    const showToast = (message, type = 'success') => {
        const toast = document.getElementById('toast-notification');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => {
            toast.className = toast.className.replace('show', '');
        }, 3000);
    };
});