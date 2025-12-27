import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { calculateBusMetrics } from "../utils/etaCalculator";
// Demo mode removed — use real-time speed only

export default function BusCard({ bus, route }) {
  const [metrics, setMetrics] = useState(null);
  const SIMULATION_SPEED = 1; // real-time only

  useEffect(() => {
    // Initial calculation
    setMetrics(calculateBusMetrics(bus, bus.departureTime, route, SIMULATION_SPEED));

    // Update every second
    const interval = setInterval(() => {
      setMetrics(calculateBusMetrics(bus, bus.departureTime, route, SIMULATION_SPEED));
    }, 1000);

    return () => clearInterval(interval);
  }, [bus, route, SIMULATION_SPEED]);

  if (!metrics || metrics.isDeparted) {
    return null; // Don't show departed buses
  }

  const statusClass =
    metrics.status === "At stop"
      ? "badge-gray"
      : "badge-green";

  return (
    <div className="card px-5 py-4 flex flex-col justify-between">
      <div className="flex justify-between items-start gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-600 text-lg">🚌</span>
            </div>
            <div>
              <p className="text-sm font-semibold">{metrics.id}</p>
              <p className="text-[11px] text-slate-500">
                {route.name}
              </p>
            </div>
          </div>
        </div>

        <span className={statusClass}>{metrics.status}</span>
      </div>

      <div className="mt-3 space-y-1.5 text-[11px] text-slate-600">
        <p className="flex items-center gap-1">
          <span>⏱</span>
          <span>
            ETA: <span className="font-medium text-slate-800">{metrics.eta}</span>
          </span>
        </p>
        <p className="flex items-center gap-1">
          <span>📍</span>
          <span>
            Next Stop:{" "}
            <span className="font-medium text-slate-800">
              {metrics.nextStop}
            </span>
          </span>
        </p>
      </div>

      <button className="mt-4 w-full">
        <Link
          to={`/bus/${encodeURIComponent(metrics.id)}`}
          state={{ routeId: route.id }}
          className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium py-2 rounded-md"
        >
          View Details
        </Link>
      </button>
    </div>
  );
}
