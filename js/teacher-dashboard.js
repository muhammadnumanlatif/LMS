import { auth, db } from './firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDoc, getDocs, collection, query, where, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const welcomeHeader = document.getElementById('teacher-name');
const coursesGrid = document.getElementById('teacher-courses-grid');
const studentsListContainer = document.getElementById('teacher-students-list');
const gradingList = document.getElementById('assignments-to-grade');

const renderCourses = (courses) => {
    if (courses.length === 0) {
        coursesGrid.innerHTML = '<p>You have not created any courses yet. <a href="create-course.html">Create one now!</a></p>';
        return;
    }
    coursesGrid.innerHTML = courses.map(course => `
        <div class="course-card-teacher">
            <img src="${course.thumbnail || 'assets/images/default-course.png'}" alt="${course.title}" class="course-card-thumbnail">
            <div class="course-card-content">
                <h3 class="course-card-title">${course.title}</h3>
                <p class="course-card-category">${course.category}</p>
                <div class="course-card-actions">
                    <a href="edit-course.html?id=${course.id}" class="btn-card">Edit</a>
                    <a href="view-students.html?courseId=${course.id}" class="btn-card">View Students</a>
                </div>
            </div>
        </div>
    `).join('');
};

const renderStudents = (students) => {
    if (students.length === 0) {
        studentsListContainer.innerHTML = '<p>No students are currently enrolled in your courses.</p>';
        return;
    }
    studentsListContainer.innerHTML = `
        <ul class="student-list">
            ${students.map(student => `
                <li class="student-list-item">
                    <img src="${student.profilePicture || 'assets/images/default-avatar.png'}" alt="${student.fullName}" class="student-avatar">
                    <div class="student-info">
                        <span class="student-name">${student.fullName}</span>
                        <span class="student-email">${student.email}</span>
                    </div>
                </li>
            `).join('')}
        </ul>`;
};

const fetchTeacherData = async (teacherId) => {
    try {
        const coursesQuery = query(collection(db, "courses"), where("instructorId", "==", teacherId));
        const courseSnapshot = await getDocs(coursesQuery);
        const teacherCourses = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        renderCourses(teacherCourses);

        const courseIds = teacherCourses.map(course => course.id);
        if (courseIds.length > 0) {
            const studentsQuery = query(collection(db, "users"), where("role", "==", "STUDENT"), where("enrolledCourses", "array-contains-any", courseIds));
            const studentSnapshot = await getDocs(studentsQuery);
            const enrolledStudents = studentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderStudents(enrolledStudents);
        } else {
            renderStudents([]);
        }

        gradingList.innerHTML = '<p>No assignments currently require grading.</p>';

    } catch (error) {
        console.error("Error fetching teacher data:", error);
        coursesGrid.innerHTML = '<p class="error">Could not load course data. Please try again later.</p>';
    }
};

const initializeDashboard = async (user) => {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().role === 'TEACHER') {
        const userData = userDoc.data();
        welcomeHeader.textContent = userData.fullName;
        fetchTeacherData(user.uid);
    } else {
        window.location.href = 'error-403.html';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, user => {
        if (user) {
            initializeDashboard(user);
        } else {
            window.location.href = 'login.html';
        }
    });
});