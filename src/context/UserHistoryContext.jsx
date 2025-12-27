import { createContext, useContext, useEffect, useState } from "react";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../AuthProvider";

const UserHistoryContext = createContext();

export function UserHistoryProvider({ children }) {
  const { user } = useAuth();
  const [recentSearches, setRecentSearches] = useState([]);
  const [recentBuses, setRecentBuses] = useState([]);
  const [frequentBuses, setFrequentBuses] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load user history from Firestore
  useEffect(() => {
    if (!user) {
      setRecentSearches([]);
      setRecentBuses([]);
      setFrequentBuses([]);
      return;
    }

    const loadHistory = async () => {
      try {
        setLoading(true);
        const historyDocRef = doc(db, "users", user.uid, "data", "history");
        const historySnap = await getDoc(historyDocRef);

        if (historySnap.exists()) {
          const data = historySnap.data();
          setRecentSearches(data.recentSearches || []);
          setRecentBuses(data.recentBuses || []);
          setFrequentBuses(data.frequentBuses || []);
          setFavorites(data.favorites || []);
        }
        setError("");
      } catch (err) {
        console.error("Failed to load history:", err);
        setError("Could not load history");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user]);

  // Record a search (route search)
  const recordSearch = async (source, destination, routeName) => {
    if (!user) return;

    const search = {
      source,
      destination,
      routeName,
      timestamp: Date.now(),
      id: `${source}-${destination}-${Date.now()}`,
    };

    // Add to front, keep last 10
    const updated = [search, ...recentSearches].slice(0, 10);
    setRecentSearches(updated);

    // Persist to Firestore
    try {
      const historyDocRef = doc(db, "users", user.uid, "data", "history");
      await setDoc(historyDocRef, { recentSearches: updated }, { merge: true });
    } catch (err) {
      console.error("Failed to save search history:", err);
    }
  };

  // Record a bus view
  const recordBusView = async (busId, routeId, routeName) => {
    if (!user) return;

    const busView = {
      busId,
      routeId,
      routeName,
      timestamp: Date.now(),
      id: `${busId}-${Date.now()}`,
    };

    // Add to front, keep last 10
    const updatedRecent = [busView, ...recentBuses].slice(0, 10);
    setRecentBuses(updatedRecent);

    // Update frequency count
    const existingFrequent = frequentBuses.find((b) => b.busId === busId);
    let updatedFrequent = [];
    if (existingFrequent) {
      updatedFrequent = frequentBuses.map((b) =>
        b.busId === busId ? { ...b, count: (b.count || 1) + 1, lastViewed: Date.now() } : b
      );
    } else {
      updatedFrequent = [
        { busId, routeId, routeName, count: 1, lastViewed: Date.now(), id: busId },
        ...frequentBuses,
      ];
    }
    updatedFrequent.sort((a, b) => b.count - a.count).slice(0, 10);
    setFrequentBuses(updatedFrequent);

    // Persist to Firestore
    try {
      const historyDocRef = doc(db, "users", user.uid, "data", "history");
      await updateDoc(historyDocRef, {
        recentBuses: updatedRecent,
        frequentBuses: updatedFrequent,
      });
    } catch (err) {
      console.error("Failed to save bus view history:", err);
    }
  };

  // Toggle favorite (star/unstar) for a bus
  const toggleFavorite = async (busId, routeId, routeName) => {
    if (!user) return;

    let updated = [];
    const exists = favorites.find((f) => f.busId === busId);
    if (exists) {
      updated = favorites.filter((f) => f.busId !== busId);
    } else {
      updated = [{ busId, routeId, routeName, timestamp: Date.now(), id: busId }, ...favorites];
      // Keep most recent favorites first, but no strict limit
    }

    setFavorites(updated);

    // Persist to Firestore
    try {
      const historyDocRef = doc(db, "users", user.uid, "data", "history");
      await updateDoc(historyDocRef, { favorites: updated });
    } catch (err) {
      console.error("Failed to update favorites:", err);
    }
  };

  const removeFavorite = async (busId) => {
    if (!user) return;
    const updated = favorites.filter((f) => f.busId !== busId);
    setFavorites(updated);
    try {
      const historyDocRef = doc(db, "users", user.uid, "data", "history");
      await updateDoc(historyDocRef, { favorites: updated });
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  // Clear all history
  const clearHistory = async () => {
    if (!user) return;

    setRecentSearches([]);
    setRecentBuses([]);
    setFrequentBuses([]);

    try {
      const historyDocRef = doc(db, "users", user.uid, "data", "history");
      await setDoc(
        historyDocRef,
        { recentSearches: [], recentBuses: [], frequentBuses: [] },
        { merge: true }
      );
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  // Clear specific search
  const removeSearch = async (searchId) => {
    const updated = recentSearches.filter((s) => s.id !== searchId);
    setRecentSearches(updated);

    try {
      const historyDocRef = doc(db, "users", user.uid, "data", "history");
      await updateDoc(historyDocRef, { recentSearches: updated });
    } catch (err) {
      console.error("Failed to remove search:", err);
    }
  };

  // Clear specific bus from history
  const removeBusView = async (busViewId) => {
    const updated = recentBuses.filter((b) => b.id !== busViewId);
    setRecentBuses(updated);

    try {
      const historyDocRef = doc(db, "users", user.uid, "data", "history");
      await updateDoc(historyDocRef, { recentBuses: updated });
    } catch (err) {
      console.error("Failed to remove bus view:", err);
    }
  };

  return (
    <UserHistoryContext.Provider
      value={{
        recentSearches,
        recentBuses,
        frequentBuses,
        favorites,
        loading,
        error,
        recordSearch,
        recordBusView,
        clearHistory,
        removeSearch,
        removeBusView,
        toggleFavorite,
        removeFavorite,
      }}
    >
      {children}
    </UserHistoryContext.Provider>
  );
}

export function useUserHistory() {
  return useContext(UserHistoryContext);
}
