// src/utils/uploadRoutesToFirestore.js
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { staticRoutes } from "../data/routesData";

// Call this ONCE to copy your JS routes into Firestore
export async function uploadRoutesToFirestoreOnce() {
  try {
    const routesCol = collection(db, "routes");

    for (const route of staticRoutes) {
      // use route.id as Firestore document id
      await setDoc(doc(routesCol, route.id), route);
    }

    alert("✅ Routes uploaded to Firestore successfully!");
  } catch (err) {
    console.error("Error uploading routes:", err);
    alert("❌ Failed to upload routes. Check console for details.");
  }
}
