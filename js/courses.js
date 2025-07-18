import { db } from './firebase-init.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const coursesContainer = document.getElementById('courses-container');
const noResultsDiv = document.getElementById('no-results');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const instructorFilter = document.getElementById('instructor-filter');

let allCourses = [];

const fetchCourses = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        allCourses = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching courses: ", error);
        coursesContainer.innerHTML = '<p class="error-text">Could not load courses. Please try again later.</p>';
    }
};

const generateStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    return starsHTML;
};

const displayCourses = (courses) => {
    coursesContainer.innerHTML = '';
    noResultsDiv.style.display = courses.length === 0 ? 'block' : 'none';

    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <img src="${course.thumbnail}" alt="${course.title}" class="course-thumbnail">
            <div class="course-content">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-instructor">By ${course.instructor}</p>
                <div class="course-meta">
                    <span class="course-rating" aria-label="Rating: ${course.rating} out of 5 stars">
                        ${generateStarRating(course.rating)} (${course.rating})
                    </span>
                    <span class="course-enrolled">
                        <i class="fas fa-users"></i> ${course.enrolled ? course.enrolled.toLocaleString() : 0}
                    </span>
                </div>
            </div>
        `;
        // This will take the user to the lesson view for this course
        card.addEventListener('click', () => {
            window.location.href = `lesson-view.html?courseId=${course.id}`;
        });
        coursesContainer.appendChild(card);
    });
};

const populateFilters = () => {
    const categories = [...new Set(allCourses.map(course => course.category))];
    const instructors = [...new Set(allCourses.map(course => course.instructor))];

    categories.forEach(cat => {
        const option = new Option(cat, cat);
        categoryFilter.add(option);
    });

    instructors.forEach(inst => {
        const option = new Option(inst, inst);
        instructorFilter.add(option);
    });
};

const handleFilterChange = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedInstructor = instructorFilter.value;

    const filteredCourses = allCourses.filter(course => {
        const titleMatch = course.title.toLowerCase().includes(searchTerm);
        const categoryMatch = !selectedCategory || course.category === selectedCategory;
        const instructorMatch = !selectedInstructor || course.instructor === selectedInstructor;
        return titleMatch && categoryMatch && instructorMatch;
    });

    displayCourses(filteredCourses);
};

const initializePage = async () => {
    await fetchCourses();
    displayCourses(allCourses);
    populateFilters();

    searchInput.addEventListener('input', handleFilterChange);
    categoryFilter.addEventListener('change', handleFilterChange);
    instructorFilter.addEventListener('change', handleFilterChange);
};

document.addEventListener('DOMContentLoaded', initializePage);