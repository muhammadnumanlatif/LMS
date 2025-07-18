import { auth, db } from './firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const welcomeBanner = document.getElementById('student-name');
const coursesGrid = document.getElementById('enrolled-courses-grid');
const assignmentsList = document.getElementById('assignments-list');
const gradesTableBody = document.getElementById('grades-tbody');
const gpaValue = document.getElementById('gpa-value');

const renderEnrolledCourses = async (enrolledCourseIds = []) => {
    coursesGrid.innerHTML = '';
    if (enrolledCourseIds.length === 0) {
        coursesGrid.innerHTML = '<p>You have not enrolled in any courses yet. <a href="courses.html">Explore courses</a>.</p>';
        return;
    }

    try {
        const coursesRef = collection(db, "courses");
        const q = query(coursesRef, where("__name__", "in", enrolledCourseIds));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
             coursesGrid.innerHTML = '<p>Could not find details for your enrolled courses.</p>';
             return;
        }

        let coursesHTML = '';
        querySnapshot.forEach(doc => {
            const course = doc.data();
            coursesHTML += `
                <div class="course-card-progress">
                    <img src="${course.thumbnail}" alt="${course.title}" class="course-thumbnail">
                    <div class="course-content">
                        <h3>${course.title}</h3>
                        <p>by ${course.instructor}</p>
                        <div class="progress-bar">
                            <div class="progress-bar-fill" style="width: 75%;">75%</div>
                        </div>
                        <a href="lesson-view.html?courseId=${doc.id}" class="btn btn-primary-sm">Continue Learning</a>
                    </div>
                </div>
            `;
        });
        coursesGrid.innerHTML = coursesHTML;
    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        coursesGrid.innerHTML = '<p class="error-text">There was an error loading your courses.</p>';
    }
};

const renderAssignments = () => {
    assignmentsList.innerHTML = `
        <div class="assignment-item">
            <div class="assignment-info">
                <h4>Final Essay</h4>
                <p>Introduction to JavaScript</p>
            </div>
            <div class="assignment-due">
                <span>Due: Jul 30, 2025</span>
            </div>
        </div>
        <div class="assignment-item">
            <div class="assignment-info">
                <h4>Wireframe Submission</h4>
                <p>Responsive CSS Design</p>
            </div>
            <div class="assignment-due">
                <span>Due: Aug 05, 2025</span>
            </div>
        </div>
    `;
};

const renderGrades = () => {
    gradesTableBody.innerHTML = `
        <tr>
            <td>Introduction to JavaScript</td>
            <td>Quiz 1</td>
            <td>A-</td>
            <td>Jul 15, 2025</td>
        </tr>
        <tr>
            <td>Responsive CSS Design</td>
            <td>Project 1</td>
            <td>B+</td>
            <td>Jul 10, 2025</td>
        </tr>
    `;
    gpaValue.textContent = '3.85';
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role !== 'STUDENT') {
                    window.location.href = 'dashboard.html';
                    return;
                }
                
                welcomeBanner.textContent = userData.fullName;
                renderEnrolledCourses(userData.enrolledCourses);
                renderAssignments();
                renderGrades();

            } else {
                 window.location.href = 'login.html';
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            document.body.innerHTML = '<p class="error-text">Could not load dashboard. Please try again later.</p>';
        }
    } else {
        window.location.href = 'login.html';
    }
});