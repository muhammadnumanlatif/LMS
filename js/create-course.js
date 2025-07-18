import { auth, db } from './firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const courseForm = document.getElementById('create-course-form');
    const addModuleBtn = document.getElementById('add-module-btn');
    const modulesContainer = document.getElementById('modules-container');

    let currentUser;
    let moduleCounter = 0;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
        } else {
            alert('You must be logged in as a teacher to create a course.');
            window.location.href = 'login.html';
        }
    });

    const handleAddModule = () => {
        moduleCounter++;
        const moduleGroup = document.createElement('div');
        moduleGroup.classList.add('module-group');
        moduleGroup.setAttribute('data-module-id', moduleCounter);

        moduleGroup.innerHTML = `
            <div class="form-group module-title-group">
                <label for="module-title-${moduleCounter}">Module ${moduleCounter} Title</label>
                <input type="text" id="module-title-${moduleCounter}" name="moduleTitle" placeholder="e.g., Introduction to CSS" required>
            </div>
            <div class="lessons-container" data-module-id="${moduleCounter}"></div>
            <button type="button" class="btn btn-tertiary add-lesson-btn">
                <i class="fas fa-plus"></i> Add Lesson
            </button>
        `;
        modulesContainer.appendChild(moduleGroup);
    };

    const handleAddLesson = (e) => {
        if (!e.target.classList.contains('add-lesson-btn')) return;

        const parentModule = e.target.closest('.module-group');
        const lessonsContainer = parentModule.querySelector('.lessons-container');
        const lessonCounter = lessonsContainer.children.length + 1;

        const lessonGroup = document.createElement('div');
        lessonGroup.classList.add('form-group', 'lesson-group');

        lessonGroup.innerHTML = `
            <label>Lesson ${lessonCounter}</label>
            <div class="lesson-inputs">
                <input type="text" name="lessonTitle" placeholder="Lesson Title" required>
                <input type="url" name="lessonVideoUrl" placeholder="YouTube Video URL" required>
            </div>
        `;
        lessonsContainer.appendChild(lessonGroup);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('Authentication error. Please log in again.');
            return;
        }

        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Publishing...`;

        try {
            const courseData = {
                title: courseForm.courseTitle.value,
                description: courseForm.courseDescription.value,
                category: courseForm.courseCategory.value,
                thumbnail: courseForm.courseThumbnail.value,
                instructor: {
                    uid: currentUser.uid,
                    name: currentUser.displayName || 'Unnamed Teacher'
                },
                createdAt: serverTimestamp(),
                modules: []
            };

            const moduleElements = modulesContainer.querySelectorAll('.module-group');
            moduleElements.forEach(moduleEl => {
                const moduleTitle = moduleEl.querySelector('input[name="moduleTitle"]').value;
                const lessons = [];
                
                const lessonElements = moduleEl.querySelectorAll('.lesson-group');
                lessonElements.forEach(lessonEl => {
                    lessons.push({
                        title: lessonEl.querySelector('input[name="lessonTitle"]').value,
                        videoUrl: lessonEl.querySelector('input[name="lessonVideoUrl"]').value
                    });
                });

                courseData.modules.push({ title: moduleTitle, lessons });
            });

            await addDoc(collection(db, 'courses'), courseData);
            alert('Course published successfully!');
            window.location.href = 'teacher-dashboard.html';

        } catch (error) {
            console.error("Error creating course:", error);
            alert(`Failed to create course. ${error.message}`);
            submitButton.disabled = false;
            submitButton.innerHTML = `<i class="fas fa-save"></i> Save and Publish Course`;
        }
    };

    addModuleBtn.addEventListener('click', handleAddModule);
    modulesContainer.addEventListener('click', handleAddLesson);
    courseForm.addEventListener('submit', handleFormSubmit);
});