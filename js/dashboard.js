import { auth, db } from './firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, collection, getDocs, query, where, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const initializeDashboard = async (user) => {
    const userNameEl = document.getElementById('user-name');
    const widgetsContainer = document.getElementById('dashboard-widgets');
    if (!userNameEl || !widgetsContainer) return;

    widgetsContainer.innerHTML = '<p>Loading dashboard...</p>';

    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            widgetsContainer.innerHTML = '<p>Could not find user data.</p>';
            return;
        }

        const userData = userDocSnap.data();
        userNameEl.textContent = userData.fullName;

        const coursesQuery = query(collection(db, "courses"));
        const announcementsQuery = query(collection(db, "announcements"), limit(5));

        const [coursesSnapshot, announcementsSnapshot] = await Promise.all([
            getDocs(coursesQuery),
            getDocs(announcementsQuery)
        ]);

        const allCourses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const recentAnnouncements = announcementsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        widgetsContainer.innerHTML = '';

        if (userData.role === 'STUDENT') {
            renderStudentDashboard(userData, allCourses, widgetsContainer);
        } else if (userData.role === 'TEACHER') {
            renderTeacherDashboard(user.uid, allCourses, widgetsContainer);
        }

        renderSharedWidgets(recentAnnouncements, widgetsContainer);

    } catch (error) {
        console.error("Error initializing dashboard:", error);
        widgetsContainer.innerHTML = '<p class="error">Failed to load dashboard. Please try again later.</p>';
    }
};

const renderStudentDashboard = (userData, allCourses, container) => {
    const enrolledCourses = allCourses.filter(course =>
        userData.enrolledCourses?.includes(course.id)
    );

    let enrolledCoursesHtml = '<li>No courses enrolled yet. <a href="courses.html">Explore courses</a>.</li>';
    if (enrolledCourses.length > 0) {
        enrolledCoursesHtml = enrolledCourses.map(course => `
            <li>
                <a href="lesson-view.html?courseId=${course.id}">${course.title}</a>
                <div class="progress-bar"><div class="progress-bar-fill" style="width: 50%;"></div></div>
            </li>
        `).join('');
    }

    const studentWidgets = `
        <div class="widget">
            <h3>My Enrolled Courses</h3>
            <ul class="widget-list">${enrolledCoursesHtml}</ul>
        </div>
        <div class="widget">
            <h3>Upcoming Deadlines</h3>
            <ul class="widget-list">
                <li>Quiz: Advanced CSS - Due in 3 days</li>
                <li>Assignment: JS Fundamentals - Due in 7 days</li>
            </ul>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', studentWidgets);
};

const renderTeacherDashboard = (uid, allCourses, container) => {
    const createdCourses = allCourses.filter(course => course.instructorId === uid);

    let createdCoursesHtml = '<li>No courses created yet. <a href="create-course.html">Create one</a>.</li>';
    if (createdCourses.length > 0) {
        createdCoursesHtml = createdCourses.map(course => `
            <li><a href="lesson-view.html?courseId=${course.id}">${course.title}</a></li>
        `).join('');
    }

    const teacherWidgets = `
        <div class="widget">
            <h3>My Created Courses</h3>
            <ul class="widget-list">${createdCoursesHtml}</ul>
        </div>
        <div class="widget">
            <h3>Assignments to Grade</h3>
            <ul class="widget-list">
                <li>No assignments currently need grading.</li>
            </ul>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', teacherWidgets);
};

const renderSharedWidgets = (announcements, container) => {
    let announcementsHtml = '<li>No recent announcements.</li>';
    if (announcements.length > 0) {
        announcementsHtml = announcements.map(ann => `
            <li>
                <strong>${ann.title}</strong>
                <p>${ann.content}</p>
            </li>
        `).join('');
    }

    const sharedWidgets = `
        <div class="widget">
            <h3>Recent Announcements</h3>
            <ul class="widget-list">${announcementsHtml}</ul>
        </div>
        <div class="widget">
            <h3>Live Sessions Calendar</h3>
            <ul class="widget-list">
                 <li>Live Q&A with an expert - 2025-07-18 15:00 UTC</li>
                 <li>Advanced Javascript - 2025-07-25 18:00 UTC</li>
            </ul>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', sharedWidgets);
};


document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            initializeDashboard(user);
        } else {
            window.location.href = 'login.html';
        }
    });
});