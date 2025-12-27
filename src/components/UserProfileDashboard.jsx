import React from "react";
import { useUserHistory } from "../context/UserHistoryContext";

export default function UserProfileDashboard() {
  const {
    recentBuses,
    favorites,
    loading,
    recordBusView,
    removeBusView,
    toggleFavorite,
    removeFavorite,
  } = useUserHistory();

  const handleDelete = (id) => {
    // removeBusView expects bus view id
    removeBusView(id);
  };

  const handleToggleStar = (bus) => {
    toggleFavorite(bus.busId, bus.routeId, bus.routeName);
  };

  const handleUnstarFromFavorites = (busId) => {
    removeFavorite(busId);
  };

  const emptyRecent = !recentBuses || recentBuses.length === 0;
  const emptyFav = !favorites || favorites.length === 0;

  return (
    <div className="max-w-5xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>

      {/* Starred Buses */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Starred Buses</h3>
          <p className="text-xs text-slate-500">Mark buses as favorites for quick access</p>
        </div>

        {loading ? (
          <div className="text-sm text-slate-500">Loading...</div>
        ) : emptyFav ? (
          <div className="text-sm text-slate-500">No starred buses yet. Star a bus from your recent list.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {favorites.map((f) => (
              <div key={f.id} className="p-3 bg-white rounded-lg shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{f.busId}</div>
                  <div className="text-xs text-slate-500">{f.routeName}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUnstarFromFavorites(f.busId)}
                    title="Unstar"
                    className="text-amber-500 hover:text-amber-600"
                  >
                    {/* filled star SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.047 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Viewed Buses */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Recently Viewed Buses</h3>
          <p className="text-xs text-slate-500">Tap a bus to view details in the tracker</p>
        </div>

        {loading ? (
          <div className="text-sm text-slate-500">Loading...</div>
        ) : emptyRecent ? (
          <div className="text-sm text-slate-500">You have no recently viewed buses.</div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {recentBuses.map((b) => (
              <div key={b.id} className="p-3 bg-white rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex-1" style={{cursor: 'pointer'}} onClick={() => recordBusView(b.busId, b.routeId, b.routeName)}>
                  <div className="text-sm font-semibold">{b.busId}</div>
                  <div className="text-xs text-slate-500">{b.routeName}</div>
                  <div className="text-xs text-slate-400 mt-1">Viewed {new Date(b.timestamp).toLocaleString()}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStar(b)}
                    title="Star / Unstar"
                    className="text-slate-400 hover:text-amber-500"
                  >
                    {/* star outline */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                      <path strokeWidth="1.5" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.047 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleDelete(b.id)}
                    title="Delete"
                    className="text-slate-400 hover:text-red-500"
                  >
                    {/* trash icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                      <path strokeWidth="1.5" d="M6 7h8M7 7l.5 9a2 2 0 002 2h1a2 2 0 002-2L13 7M9 3h2l1 2H8l1-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
