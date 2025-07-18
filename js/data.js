// js/data.js
document.addEventListener('DOMContentLoaded', () => {
    // Use the getCookie function from auth.js
    if (!getCookie('courses') || !getCookie('users')) {
        console.log("Initializing dummy data in cookies...");

        // Dummy Courses
        const courses = [
            {
                id: 'course_1',
                title: 'Introduction to JavaScript',
                instructor: 'John Teacher',
                category: 'Programming',
                thumbnail: 'assets/images/js-thumb.png',
                rating: 4.5,
                enrolled: 120,
                modules: [
                    { id: 'm1', title: 'Module 1: Getting Started', lessons: [{ id: 'l1', title: 'Welcome', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] },
                    { id: 'm2', title: 'Module 2: Core Concepts', lessons: [{ id: 'l2', title: 'Variables', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] }
                ]
            },
            {
                id: 'course_2',
                title: 'Responsive CSS Design',
                instructor: 'Jane Teacher',
                category: 'Design',
                thumbnail: 'assets/images/css-thumb.png',
                rating: 4.8,
                enrolled: 250,
                modules: []
            },
        ];

        // Dummy Users (including students and teachers)
        const users = [
            {
                id: 'user_student_1',
                fullName: 'Alice Student',
                email: 'alice@lms.com',
                password: 'password123',
                role: 'STUDENT',
                enrolledCourses: ['course_1', 'course_2'],
                profilePicture: 'assets/images/default-profile.png',
                bio: 'Eager to learn!'
            },
            {
                id: 'user_teacher_1',
                fullName: 'John Teacher',
                email: 'john@lms.com',
                password: 'password123',
                role: 'TEACHER',
                enrolledCourses: [],
                profilePicture: 'assets/images/default-profile.png',
                bio: 'Web development instructor.'
            },
             {
                id: 'user_teacher_2',
                fullName: 'Jane Teacher',
                email: 'jane@lms.com',
                password: 'password123',
                role: 'TEACHER',
                enrolledCourses: [],
                profilePicture: 'assets/images/default-profile.png',
                bio: 'CSS and Design expert.'
            }
        ];

        // Dummy Announcements
        const announcements = [
            { id: 'ann_1', title: 'Welcome to the new LMS!', content: 'We are excited to launch this new platform.' },
            { id: 'ann_2', title: 'Scheduled Maintenance', content: 'The system will be down for maintenance this Friday at midnight.' }
        ];

        // Set data into cookies
        // Note: The getCookie and setCookie functions are in auth.js,
        // which should be loaded before this script.
        setCookie('courses', JSON.stringify(courses), 365);
        setCookie('users', JSON.stringify(users), 365);
        setCookie('announcements', JSON.stringify(announcements), 365);
    }
});