import React, { useState } from "react";
import { useUserHistory } from "../context/UserHistoryContext";

export default function HistoryDrawer({ isOpen, onClose }) {
  const {
    recentBuses,
    favorites,
    loading,
    removeBusView,
    clearHistory,
    toggleFavorite,
  } = useUserHistory();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteBus = (busViewId) => {
    removeBusView(busViewId);
  };

  const handleToggleStar = (bus) => {
    toggleFavorite(bus.busId, bus.routeId, bus.routeName);
  };

  const handleDeleteAll = async () => {
    await clearHistory();
    setShowDeleteConfirm(false);
  };

  const isBusFavorited = (busId) => {
    return favorites.some((f) => f.busId === busId);
  };

  const emptyRecent = !recentBuses || recentBuses.length === 0;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Right-side Drawer */}
      <div
        className={`fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
          <h2 className="text-xl font-bold">Travel History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-700 rounded-lg transition"
            title="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-slate-500">
              <div className="inline-block animate-spin">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <p className="mt-2">Loading history...</p>
            </div>
          ) : (
            <>
              {/* Starred Buses Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  Starred Buses
                </h3>

                {favorites && favorites.length > 0 ? (
                  <div className="space-y-3">
                    {favorites.map((bus) => (
                      <div
                        key={bus.id}
                        className="p-4 bg-amber-50 border border-amber-200 rounded-lg hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900">
                              {bus.busId}
                            </h4>
                            <p className="text-sm text-slate-600 mt-1">
                              {bus.routeName}
                            </p>
                          </div>

                          {/* Star Button */}
                          <button
                            onClick={() => handleToggleStar(bus)}
                            className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-100 rounded-lg transition"
                            title="Unstar"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.047 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg">
                    No starred buses yet. Star a bus to add it here.
                  </p>
                )}
              </div>

              {/* Divider */}
              {favorites && favorites.length > 0 && emptyRecent === false && (
                <div className="border-t border-slate-200 my-8" />
              )}

              {/* Recently Viewed Buses Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-slate-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Recently Viewed
                </h3>

                {emptyRecent ? (
                  <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg">
                    No recently viewed buses. View a bus to add it here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentBuses.map((bus) => {
                      const isFavorited = isBusFavorited(bus.busId);
                      const viewedTime = new Date(bus.timestamp);
                      const timeAgo = getTimeAgo(viewedTime);

                      return (
                        <div
                          key={bus.id}
                          className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:shadow-md transition"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-900">
                                {bus.busId}
                              </h4>
                              <p className="text-sm text-slate-600 mt-1">
                                {bus.routeName}
                              </p>
                              <p className="text-xs text-slate-400 mt-2">
                                Viewed {timeAgo}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              {/* Star Button */}
                              <button
                                onClick={() => handleToggleStar(bus)}
                                className={`p-2 rounded-lg transition ${
                                  isFavorited
                                    ? "text-amber-500 hover:bg-amber-100"
                                    : "text-slate-400 hover:text-amber-500 hover:bg-amber-50"
                                }`}
                                title={
                                  isFavorited ? "Unstar" : "Star"
                                }
                              >
                                {isFavorited ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.047 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z" />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeWidth="1.5"
                                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.047 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z"
                                    />
                                  </svg>
                                )}
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteBus(bus.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                title="Delete"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Delete All History Button */}
              {!emptyRecent && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition font-medium text-sm"
                  >
                    Delete All History
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete All Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Delete All History?
            </h3>
            <p className="text-slate-600 mb-6">
              This will permanently remove all recently viewed buses from your history. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition font-medium"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Helper function to format time ago
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;

  const options = { month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}
