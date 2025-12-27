// src/context/BusDataContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { staticRoutes } from "../data/routesData";

// Helper: haversine distance in meters between two [lat, lng]
function haversineMeters(a, b) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000; // earth meters
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const val = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(val), Math.sqrt(1 - val));
  return R * c;
}

// Convert lat/lng to planar meters relative to reference lat for point-segment math
function latLngToMeters([lat, lng], refLat) {
  const latRad = (lat * Math.PI) / 180;
  const refLatRad = (refLat * Math.PI) / 180;
  const metersPerDegLat = 111132.92 - 559.82 * Math.cos(2 * refLatRad) + 1.175 * Math.cos(4 * refLatRad);
  const metersPerDegLng = (Math.PI / 180) * 6378137 * Math.cos(refLatRad);
  const x = (lng) * metersPerDegLng;
  const y = (lat) * metersPerDegLat;
  return [x, y];
}

// Distance from a point to a segment (each point [lat,lng]) in meters
function pointToSegmentDistanceMeters(p, v, w) {
  // Use simple planar projection around reference latitude (mean of v and w)
  const refLat = (v[0] + w[0]) / 2;
  const [px, py] = latLngToMeters(p, refLat);
  const [vx, vy] = latLngToMeters(v, refLat);
  const [wx, wy] = latLngToMeters(w, refLat);

  const dx = wx - vx;
  const dy = wy - vy;
  if (dx === 0 && dy === 0) {
    return Math.hypot(px - vx, py - vy);
  }
  const t = ((px - vx) * dx + (py - vy) * dy) / (dx * dx + dy * dy);
  const clamped = Math.max(0, Math.min(1, t));
  const projx = vx + clamped * dx;
  const projy = vy + clamped * dy;
  return Math.hypot(px - projx, py - projy);
}

// Compute deviation metrics between expected line (array of [lng,lat]) and actualPoints (array of [lng,lat])
function computeDeviation(expectedLine, actualPoints) {
  if (!expectedLine || expectedLine.length < 2 || !actualPoints || actualPoints.length === 0) return null;

  // Convert expectedLine to [lat,lng] pairs for convenience
  const expectedLatLng = expectedLine.map((p) => [p[1], p[0]]);
  const actualLatLng = actualPoints.map((p) => [p[1], p[0]]);

  const distances = actualLatLng.map((pt) => {
    // For each actual point, find min distance to each segment of expected
    let minDist = Infinity;
    for (let i = 0; i < expectedLatLng.length - 1; i++) {
      const d = pointToSegmentDistanceMeters(pt, expectedLatLng[i], expectedLatLng[i + 1]);
      if (d < minDist) minDist = d;
    }
    return minDist; // meters
  });

  const sum = distances.reduce((a, b) => a + b, 0);
  const mean = sum / distances.length;
  const max = Math.max(...distances);
  return { meanMeters: mean, maxMeters: max, samples: distances.length };
}

const BusDataContext = createContext();

export function BusDataProvider({ children }) {
  const [routes, setRoutes] = useState(staticRoutes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // actualPaths: { [busId]: [[lng, lat], ...] }
  const [actualPaths, setActualPaths] = useState({});
  // deviations: { [busId]: { meanMeters, maxMeters, samples } }
  const [deviations, setDeviations] = useState({});

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

  // Append a new GPS point for a bus (lat,lng from calculateBusPosition)
  function updateBusPosition(busId, latLng) {
    if (!busId || !latLng) return;
    // convert [lat, lng] -> [lng, lat] for mapping consistency
    const point = [latLng[1], latLng[0]];
    setActualPaths((prev) => {
      const list = prev[busId] ? [...prev[busId]] : [];
      // prevent duplicates: if last point within 3 meters, skip
      if (list.length > 0) {
        const last = list[list.length - 1];
        const lastLatLng = [last[1], last[0]];
        const dist = haversineMeters(lastLatLng, latLng);
        if (dist < 3) return prev;
      }
      list.push(point);
      return { ...prev, [busId]: list };
    });
  }

  // Finalize route for a bus: compute deviation against expected route
  function finalizeRouteForBus(busId) {
    if (deviations[busId]) return; // already computed
    if (!busId) return;
    // find route that contains this bus
    const route = routes.find((r) => r.buses && r.buses.some((b) => b.id === busId));
    if (!route) return;
    const expected = (route.stops || [])
      .map((s) => {
        const coords = require("../utils/mapUtils").stopCoordinates[s];
        return coords ? [coords[1], coords[0]] : null; // [lng, lat]
      })
      .filter(Boolean);
    const actual = actualPaths[busId] || [];
    if (expected.length < 2 || actual.length === 0) return;
    const result = computeDeviation(expected, actual);
    setDeviations((prev) => ({ ...prev, [busId]: result }));
  }

  return (
    <BusDataContext.Provider
      value={{
        routes,
        loading,
        error,
        actualPaths,
        deviations,
        updateBusPosition,
        finalizeRouteForBus,
      }}
    >
      {children}
    </BusDataContext.Provider>
  );
}

export function useBusData() {
  return useContext(BusDataContext);
}