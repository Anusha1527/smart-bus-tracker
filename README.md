# 🚌 **SMART PUBLIC BUS TRACKER**

### *A Modern Web App for Bus Routes, ETA, and Student-Friendly Navigation*

---

# 🚌 **SMART PUBLIC BUS TRACKER**

### *A Modern Web App for Bus Routes, ETA, and Student-Friendly Navigation*

The **Smart Public Bus Tracker** simplifies public transport by enabling users to:

* ✔️ Select **source → destination**
* ✔️ View all buses available on that route
* ✔️ Check **ETA**, next stop, and timeline
* ✔️ Enjoy a clean, mobile-first UI
* ✔️ Login/signup securely with Firebase Auth
* ✔️ Receive **welcome emails** on signup
* ✔️ Load bus data dynamically (Firestore + fallback support)

---

## 🌟 **Key Features**

### 🔍 **1. Smart Bus Search**

* Smart input validation
* Prevents same source & destination
* Only allows valid stop selection
* Clean error messages (Blink/RedBus style)
* Displays buses only after a valid search

---

### 🚌 **2. Real-Time Style Bus Details**

* Bold, clear **ETA** display
* Highlighted **next stop**
* Detailed card UI showing:

  * Bus ID
  * Current status
  * Route name
  * Next stop
* **Route Timeline View**
  Displays stop sequence from **start → end**

---

### 🔐 **3. Authentication (Firebase)**

#### **Login**

* Email + password login
* Input validation
* Minimal, clean error UI

#### **Signup**

* New account creation
* Email verification
* Sends **welcome email**

#### **Password Reset**

* Forgot Password → sends reset link
* Powered by Firebase Auth

---

### 📡 **4. Database Support**

**Primary Storage:** Firebase Firestore
**Automatic Fallback:** Local JS data
**Admin Support (Future):**

* Route updates via Excel sheets (.xlsx)

---

### 📱 **5. Modern Responsive UI**

Built with **React + TailwindCSS**:

* Mobile-first layout
* Smooth animations
* Card-based design
* Works perfectly on:

  * 📱 Mobile
  * 📱 Tablet
  * 💻 Laptop

---

## 🧱 **Tech Stack**

| Category               | Technologies                                |
| ---------------------- | ------------------------------------------- |
| **Frontend**           | React, Vite, JavaScript, Tailwind CSS       |
| **Backend**            | Firebase Authentication, Firebase Firestore |
| **Hosting (Optional)** | Firebase Hosting                            |
| **State Management**   | React Context API                           |
| **Developer Tools**    | VS Code, Git, npm                           |

---

## 🏗️ **Project Architecture**

```
src/
│── components/
│── pages/
│── context/       (Auth context + Bus data context)
│── data/          (Local fallback bus data)
│── firebase/      (Auth + Firestore configuration)
│── styles/        (Tailwind + global CSS)
│── utils/         (Helper functions)
│── App.jsx
│── main.jsx
```

---

## ⚙️ **How It Works**

1. User selects **source** & **destination**
2. App validates input
3. Fetches buses from **Firestore**

   * If unavailable → uses **local JSON fallback**
4. Displays ETA + next stop
5. Route progress shown in timeline

---

## 🚀 **Future Enhancements**

* Real-time GPS tracking (optional)
* Admin dashboard for route management
* Push notifications for bus arrival
* Multi-language UI
* Bulk updates via Excel

---

## 🌐 **Demo (Optional)**

```
https://your-app-url.web.app
```

---

## 🧑‍💻 **Setup Instructions**

```bash
# 1. Clone repo
git clone https://github.com/your-username/bus-tracker.git

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

---

## 🔥 Firebase Setup

Inside `firebase.js`:

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

## 🤝 **Contributing**

Pull requests, ideas, and improvements are welcome.
Feel free to open issues or suggest enhancements!

---

## 🏁 **Final Note**

This project aims to make public transport **simpler, smarter, and student-friendly**, without requiring GPS devices in buses.

If you find this useful, don’t forget to **⭐ star the repo!**

---

If you want, I can also create:
🎨 A project banner
🖼️ Feature preview screenshots
📄 PDF version of the README
🎥 Demo video script

Just tell me!
