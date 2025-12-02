// src/context/BusDataContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { staticRoutes } from "../data/routesData";

const BusDataContext = createContext();

export function BusDataProvider({ children }) {
  const [routes, setRoutes] = useState(staticRoutes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoutes() {
      try {
        const snap = await getDocs(collection(db, "routes"));

        if (snap.empty) {
          // nothing in Firestore → use JS data
          setRoutes(staticRoutes);
        } else {
          const routesFromDb = snap.docs.map((doc) => doc.data());
          setRoutes(routesFromDb);
        }
      } catch (err) {
        console.error("Failed to load routes from Firestore:", err);
        setError("Could not load live routes. Using default data.");
        setRoutes(staticRoutes);
      } finally {
        setLoading(false);
      }
    }

    loadRoutes();
  }, []);

  return (
    <BusDataContext.Provider value={{ routes, loading, error }}>
      {children}
    </BusDataContext.Provider>
  );
}

export function useBusData() {
  return useContext(BusDataContext);
}