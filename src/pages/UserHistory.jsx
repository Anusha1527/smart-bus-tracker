import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserHistory } from "../context/UserHistoryContext";

export default function UserHistory() {
  const navigate = useNavigate();
  const { recentSearches, recentBuses, frequentBuses, clearHistory, removeSearch, removeBusView } =
    useUserHistory();

  const handleSearchClick = (search) => {
    navigate("/home", {
      state: { source: search.source, destination: search.destination },
    });
  };

  const handleBusClick = (bus) => {
    navigate(`/bus/${encodeURIComponent(bus.busId)}`, {
      state: { routeId: bus.routeId },
    });
  };

  const handleFrequentBusClick = (bus) => {
    navigate(`/bus/${encodeURIComponent(bus.busId)}`, {
      state: { routeId: bus.routeId },
    });
  };

  const isEmpty =
    recentSearches.length === 0 && recentBuses.length === 0 && frequentBuses.length === 0;

  return (
    <div className="max-w-4xl mx-auto mt-6 mb-10 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Your History</h1>
        {!isEmpty && (
          <button
            onClick={clearHistory}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition"
          >
            Clear All
          </button>
        )}
      </div>

      {isEmpty && (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-500">No history yet. Start searching for buses!</p>
        </div>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🔍</span>
            <h2 className="text-lg font-semibold text-slate-900">Recent Searches</h2>
            <span className="badge-gray ml-auto">{recentSearches.length}</span>
          </div>

          <div className="space-y-2">
            {recentSearches.map((search) => (
              <div
                key={search.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition cursor-pointer group"
                onClick={() => handleSearchClick(search)}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {search.source} → {search.destination}
                  </p>
                  {search.routeName && (
                    <p className="text-xs text-slate-500">{search.routeName}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSearch(search.id);
                  }}
                  className="text-slate-400 hover:text-red-500 transition ml-2 opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Buses */}
      {recentBuses.length > 0 && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🚌</span>
            <h2 className="text-lg font-semibold text-slate-900">Recently Viewed Buses</h2>
            <span className="badge-gray ml-auto">{recentBuses.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentBuses.map((bus) => (
              <div
                key={bus.id}
                className="p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition cursor-pointer group border border-transparent hover:border-blue-200"
                onClick={() => handleBusClick(bus)}
              >
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{bus.busId}</p>
                    {bus.routeName && (
                      <p className="text-xs text-slate-500">{bus.routeName}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBusView(bus.id);
                    }}
                    className="text-slate-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Viewed {new Date(bus.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Frequently Used Buses */}
      {frequentBuses.length > 0 && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">⭐</span>
            <h2 className="text-lg font-semibold text-slate-900">Frequently Used Buses</h2>
            <span className="badge-green ml-auto">{frequentBuses.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {frequentBuses.map((bus, idx) => (
              <div
                key={bus.id}
                className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg hover:from-emerald-100 hover:to-teal-100 transition cursor-pointer group border border-emerald-200 hover:border-emerald-400"
                onClick={() => handleFrequentBusClick(bus)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-emerald-600">#{idx + 1}</span>
                    <p className="text-sm font-semibold text-slate-900">{bus.busId}</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-200 text-emerald-700 rounded text-xs font-medium">
                    {bus.count}x
                  </span>
                </div>
                {bus.routeName && (
                  <p className="text-xs text-slate-600 mb-2">{bus.routeName}</p>
                )}
                <p className="text-xs text-slate-500">
                  Last viewed {new Date(bus.lastViewed).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
