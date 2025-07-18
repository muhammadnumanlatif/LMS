Modern Learning Management System (LMS) - Vanilla JS Edition

A feature-rich, single-page application (SPA) style Learning Management System built with pure, vanilla HTML, CSS, and JavaScript. This project uses Firebase for all backend services, including authentication and database management, to create a modern and scalable web application without a traditional server.

Author: seoustaad.com

Core Features

Dual User Roles: Separate interfaces and permissions for Students and Teachers.

Secure Authentication: Complete user login, registration, and Google Sign-In powered by Firebase Auth.

Role-Based Access Control (RBAC): Protected routes prevent unauthorized access to role-specific pages.

Dynamic Dashboards: Personalized dashboards for both students and teachers.

Course Discovery: A filterable and searchable catalog of all available courses.

Course Management: Teachers can create, edit, and manage courses with dynamic modules and lessons.

Interactive Lesson Viewing: A dedicated page for students to watch video lessons and track progress.

User Profiles: Users can view and update their personal information.

Modern UI/UX: A clean, responsive design with a dark/light mode theme toggle.

Technology Stack

Frontend:

HTML5

CSS3 (with custom properties for theming)

Modern JavaScript (ES6+ Modules)

Backend & Database:

Firebase Authentication: For user management.

Google Firestore: As the primary NoSQL database.

Firebase Storage: For hosting user-uploaded assets like profile pictures.

No Frameworks or Libraries: This project is intentionally built with vanilla technologies to demonstrate core web development principles.

Setup and Installation

To run this project, you need to connect it to your own Firebase project.

Step 1: Create a Firebase Project

Go to the Firebase Console.

Click "Add project" and follow the on-screen instructions to create a new project.

Inside your new project, click the web icon (</>) to add a new web app.

Register your app. Firebase will provide you with a firebaseConfig object. Copy this object.

Step 2: Configure Firebase Services

In the Firebase console for your new project:

Navigate to Authentication -> Sign-in method and enable Email/Password and Google.

Navigate to Firestore Database -> Create database. Start in test mode for initial setup.

Navigate to Storage and click "Get started" to enable file storage.

Step 3: Add Your Firebase Configuration

Open the file: js/firebase-init.js.

You will see a firebaseConfig constant. Paste your configuration object that you copied from the Firebase console here.

Step 4: Run the Project Locally

Because this project uses ES Modules, you cannot run it by simply opening index.html from the file system (file://...). You must serve it from a local web server.

Option 1: Using VS Code Live Server

Install the Live Server extension in Visual Studio Code.

Right-click on index.html and choose "Open with Live Server".

Option 2: Using http-server

Make sure you have Node.js installed.

Install http-server globally by running this command in your terminal:

Generated bash
npm install --global http-server
```3.  Navigate to the `lms-project` directory in your terminal and run:
```bash
http-server


Open your browser and go to the local address provided (e.g., http://127.0.0.1:8080).

Project Structure
Generated code
/lms-project
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── courses.html
├── student-dashboard.html
├── teacher-dashboard.html
├── create-course.html
├── lesson-view.html
├── profile.html
├── error-403.html
|
├── /css
│   ├── style.css
│   └── animations.css
|
├── /js
│   ├── firebase-init.js
│   ├── auth.js
│   ├── main.js
│   ├── dashboard.js
│   ├── courses.js
│   ├── profile.js
│   ├── lesson-view.js
│   ├── student-dashboard.js
│   ├── teacher-dashboard.js
│   └── create-course.js
|
├── /assets
│   ├── /images
│   └── /icons
|
└── README.md