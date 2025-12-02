🚌 Smart Public Bus Tracker

A modern web-based bus route & tracking system built using React + Firebase.
This application helps students and commuters easily find available KSRTC/college buses, check ETA, and view next stops — all without tracking driver devices.

🚀 Overview

Smart Public Bus Tracker is designed to simplify public transport usage by letting users:

✔ Select source and destination
✔ Instantly view all buses running on that route
✔ See ETA, next stop, route details, and bus status
✔ Get a clean, modern, mobile-friendly UI
✔ Secure user login & signup using Firebase Authentication
✔ “Forget Password” feature with email reset
✔ Welcome email on new account creation
✔ Bus data loaded dynamically (supports Firebase / local JSON / future Excel integration)

🌟 Key Features
🔍 1. Smart Bus Search

Search buses using source → destination

Prevents same source & destination selections

Displays results only after valid search

Clean error messages similar to Blink/RedBus UI

🚌 2. Real-Time Style Bus Details

ETA with bold styling

Next stop displayed with highlight

Bus ID, status, and route name shown clearly

Timeline view of all route stops (start → end)

🔐 3. Authentication (Firebase)

Email/Password login

Create Account with validation

Email verification

Password reset via email

Thank-you email sent after account creation

📡 4. Database Support

Centralized bus route storage from Firebase Firestore

Auto-fallback to local JS data if network fails

(Optional) Supports Excel import for admin update

📱 5. Modern Responsive UI

Built with React + TailwindCSS

Professional card layout

Fully responsive for mobile/laptop

🏗️ Tech Stack
Category	                Tools / Technologies
Frontend	                React, Vite, JavaScript, Tailwind CSS
Backend	                    Firebase Authentication, Firebase Firestore
Hosting (optional)	        Firebase Hosting
State Management	        React Context API
Developer Tools	            VS Code, Git, npm