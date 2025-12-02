🚌 Smart Public Bus Tracker

A modern web-based bus route & tracking system built using React + Firebase.
This application helps students and commuters easily find available KSRTC/college buses, check ETA, and view next stops — all without tracking driver devices.

🚀 Overview

Smart Public Bus Tracker is designed to simplify public transport usage by letting users:

- ✔️ Select source and destination  
- ✔️ Instantly view all buses running on that route  
- ✔️ See ETA, next stop, route details, and bus status  
- ✔️ Get a clean, modern, mobile-friendly UI  
- ✔️ Secure user login & signup using Firebase Authentication  
- ✔️ “Forget Password” feature with email reset  
- ✔️ Welcome email on new account creation  
- ✔️ Bus data loaded dynamically (supports Firestore / local JSON / future Excel integration)


🌟 Key Features
🔍 1. Smart Bus Search

Search buses using source → destination

Prevents invalid input

Blocks same source & destination

Requires valid stop selection

Displays results only after valid search

Clean error messages

Styled similar to Blink/RedBus UI

🚌 2. Real-Time Style Bus Details

ETA displayed clearly with bold styling

Next stop highlighted

Shows key bus information:

Bus ID

Current status

Route name

Route timeline view

Shows all stops from start → end

🔐 3. Authentication (Firebase)

Login System

Email + Password login

Account Creation

Input validation

Email verification

Welcome email after registration

Password Management

Password reset via email

📡 4. Database Support

Primary Storage

Firebase Firestore

Fallback System

Automatically uses local JS data if Firestore fails

Optional Admin Support

Excel import for future route updates

📱 5. Modern Responsive UI

Built with React + TailwindCSS

Clean card-based layout

Fully responsive for:

Mobile

Tablet

Laptop

🏗️ Tech Stack
Category	                Tools / Technologies
Frontend	                React, Vite, JavaScript, Tailwind CSS
Backend	                    Firebase Authentication, Firebase Firestore
Hosting (optional)	        Firebase Hosting
State Management	        React Context API
Developer Tools	            VS Code, Git, npm
