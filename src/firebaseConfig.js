import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_YQ1NvaaLVrwDsphhHeKy_pfWFP0fX0o",
  authDomain: "smart-bus-tracker-6aea2.firebaseapp.com",
  projectId: "smart-bus-tracker-6aea2",
  storageBucket: "smart-bus-tracker-6aea2.firebasestorage.app",
  messagingSenderId: "169178270498",
  appId: "1:169178270498:web:53d3fae1c7e9d58d02337b"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;