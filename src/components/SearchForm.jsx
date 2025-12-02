import { useEffect, useState } from "react";

export default function SearchForm({
  source,
  destination,
  setSource,
  setDestination,
  onSearch,
  routes,
}) {
  const [sourceStops, setSourceStops] = useState([]);
  const [destinationStops, setDestinationStops] = useState([]);

  // Get all unique stops for Source dropdown
  useEffect(() => {
    const all = new Set();
    routes.forEach((route) => {
      route.stops.forEach((s) => all.add(s));
    });
    setSourceStops([...all]);
  }, [routes]);

  // When source changes, compute valid destinations
  useEffect(() => {
    if (!source) {
      setDestinationStops([]);
      setDestination("");
      return;
    }

    const destSet = new Set();

    routes.forEach((route) => {
      const srcIndex = route.stops.findIndex((s) => s === source);
      if (srcIndex !== -1) {
        // all stops AFTER this source on this route are valid destinations
        route.stops.slice(srcIndex + 1).forEach((s) => destSet.add(s));
      }
    });

    const newDestinations = [...destSet];

    // If current destination is not valid anymore, reset it
    if (!newDestinations.includes(destination)) {
      setDestination("");
    }

    setDestinationStops(newDestinations);
  }, [source, routes, destination, setDestination]);

  return (
    <div className="card w-[95%] lg:w-[80%] mx-auto mt-6 p-6 md:p-7">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-emerald-500 text-lg">🔍</span>
        <div>
          <h2 className="text-sm md:text-base font-semibold">Search Buses</h2>
          <p className="text-[11px] md:text-xs text-slate-500">
            Enter your source and destination to find available buses
          </p>
        </div>
      </div>

      {/* Inputs row */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Source */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Source
          </label>
          <select
            className="input"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="">Select source stop</option>
            {sourceStops.map((stop) => (
              <option key={stop} value={stop}>
                {stop}
              </option>
            ))}
          </select>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Destination
          </label>
          <select
            className="input"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={!source}
          >
            {!source && <option value="">Select source first</option>}
            {source &&
              (destinationStops.length ? (
                <>
                  <option value="">Select destination stop</option>
                  {destinationStops.map((stop) => (
                    <option key={stop} value={stop}>
                      {stop}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">No destinations available for this source</option>
              ))}
          </select>
        </div>
      </div>

      {/* Big green search bar */}
      <button
        onClick={onSearch}
        className="w-full py-2.5 rounded-md bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 flex items-center justify-center gap-2 disabled:opacity-60"
        disabled={!source || !destination}
      >
        <span>Search Buses</span>
      </button>
    </div>
  );
}
