import { useState } from "react";
import SearchForm from "../components/SearchForm";
import BusList from "../components/BusList";
import { useBusData } from "../context/BusDataContext";

export default function Home() {
  const { routes, loading, error: dataError } = useBusData();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [results, setResults] = useState([]);
  const [searchError, setSearchError] = useState("");

  // ➕ NEW: track if a valid search has been performed
  const [hasSearched, setHasSearched] = useState(false);

  function handleSearch() {
    // If routes are still loading or empty, block search
    if (loading) {
      setSearchError("Please wait, loading bus routes...");
      setResults([]);
      setHasSearched(false);
      return;
    }

    if (!routes || routes.length === 0) {
      setSearchError(
        "No route data is available right now. Please try again later."
      );
      setResults([]);
      setHasSearched(false);
      return;
    }

    // Basic checks
    if (!source || !destination) {
      setSearchError("Please select both source and destination.");
      setResults([]);
      setHasSearched(false);
      return;
    }

    // Same source & destination → error
    if (source === destination) {
      setSearchError(
        "Source and destination cannot be the same. Please select different stops."
      );
      setResults([]);
      setHasSearched(false);
      return;
    }

    // ✅ From here, we have a valid search
    setHasSearched(true);

    // Find matching routes/buses
    const matches = [];

    routes.forEach((route) => {
      const srcIndex = route.stops.findIndex((s) => s === source);
      const destIndex = route.stops.findIndex((s) => s === destination);

      if (srcIndex !== -1 && destIndex !== -1 && srcIndex < destIndex) {
        route.buses.forEach((bus) => {
          matches.push({ route, bus });
        });
      }
    });

    if (matches.length === 0) {
      setSearchError(
        "No buses found for this source and destination. Please try a different pair of stops."
      );
    } else {
      setSearchError("");
    }

    setResults(matches);
  }

  return (
    <div className="pb-10">
      {/* Welcome heading at the top */}
      <div className="text-center mt-10 mb-4">
        <h2 className="text-lg md:text-xl font-semibold">
          Welcome to Smart Public Bus Tracker
        </h2>
      </div>

      {/* Firestore/localStorage warning */}
      {dataError && (
        <div className="max-w-6xl mx-auto mt-4 px-4">
          <div className="border border-amber-200 bg-amber-50 text-[11px] md:text-xs text-amber-700 rounded-md px-3 py-2">
            {dataError} &nbsp;Using default demo routes.
          </div>
        </div>
      )}

      {/* Search card with dropdowns */}
      <SearchForm
        source={source}
        destination={destination}
        setSource={setSource}
        setDestination={setDestination}
        onSearch={handleSearch}
        routes={routes || []}
      />

      {/* Description just under search box */}
      <div className="text-center mt-6 mb-6">
        <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto">
          Select your source and destination to find buses running on your
          route. Get real-time style information about bus numbers, ETAs, and
          current status – all without tracking the driver's phone.
        </p>
      </div>

      {/* Error bar under description */}
      {searchError && (
        <div className="max-w-6xl mx-auto mt-2 px-4">
          <div className="border border-red-200 bg-red-50 text-[11px] md:text-xs text-red-600 rounded-md px-3 py-2 flex items-center gap-2">
            <span>⚠</span>
            <span>{searchError}</span>
          </div>
        </div>
      )}

      {/* Bus cards / 'No buses' text (controlled by hasSearched) */}
      <BusList results={results} hasSearched={hasSearched} />
    </div>
  );
}
