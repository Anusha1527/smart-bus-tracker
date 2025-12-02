import { useLocation, useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { useBusData } from "../context/BusDataContext";

export default function BusDetails() {
  const { busId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const decodedId = decodeURIComponent(busId);

  // ⬇️ Get routes from context instead of importing from routesData.js
  const { routes } = useBusData();

  let route = null;
  let bus = null;

  if (location.state?.routeId) {
    route = routes.find((r) => r.id === location.state.routeId);
    if (route) bus = route.buses.find((b) => b.id === decodedId);
  }

  if (!route || !bus) {
    routes.forEach((r) => {
      const found = r.buses.find((b) => b.id === decodedId);
      if (found) {
        route = r;
        bus = found;
      }
    });
  }

  if (!route || !bus) {
    return (
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="card p-6">
          <p>Bus not found.</p>
          <button
            className="btn-primary mt-4"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const stops = route.stops;
  const currentIndex = stops.findIndex((s) => s === bus.nextStop);

  return (
    <div className="max-w-4xl mx-auto mt-6 mb-10 px-4 space-y-4">
      {/* Back Button */}
      <button
        className="text-xs text-slate-600 mb-2"
        onClick={() => navigate("/home")}
      >
        ← Back to Home
      </button>

      {/* Top Summary Card */}
      <div className="card p-5 flex flex-col gap-3">
        {/* BUS ID + STATUS */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <img
                src={logo}
                alt="App Logo"
                className="h-12 w-12 object-contain"
              />
            </div>
            <div>
              <p className="font-semibold text-sm md:text-base">{bus.id}</p>
              <p className="text-[11px] text-slate-500">{route.name}</p>
            </div>
          </div>
          <span className="badge-green">{bus.status}</span>
        </div>

        {/* ETA + NEXT STOP: LEFT–RIGHT alignment */}
        <div className="w-full flex justify-between items-center mt-4 text-base font-semibold text-slate-700">
          {/* LEFT — ETA */}
          <div className="flex items-center gap-2">
            <span className="text-xl">⏱</span>
            <div className="leading-tight">
              <span className="text-slate-600 text-sm block">ETA</span>
              <span className="text-emerald-600 text-xl font-bold">
                {bus.eta}
              </span>
            </div>
          </div>

          {/* RIGHT — Next Stop */}
          <div className="flex items-center gap-2 text-right">
            <span className="text-xl">📍</span>
            <div className="leading-tight">
              <span className="text-slate-600 text-sm block">Next Stop</span>
              <span className="text-slate-900 text-xl font-bold">
                {bus.nextStop}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Stops Timeline */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold mb-3">Route Stops</h3>
        <div className="relative pl-6">
          <div className="absolute left-2 top-1 bottom-1 w-px bg-slate-200" />
          <ul className="space-y-4 text-sm">
            {stops.map((stop, idx) => {
              const isStart = idx === 0;
              const isEnd = idx === stops.length - 1;
              const isCurrent = idx === currentIndex;

              let badge = null;
              if (isStart)
                badge = <span className="badge-gray ml-2">Starting Point</span>;
              else if (isEnd)
                badge = (
                  <span className="badge-gray ml-2">Final Destination</span>
                );
              else if (isCurrent)
                badge = <span className="badge-green ml-2">Next Stop</span>;

              return (
                <li key={stop} className="flex items-start gap-3">
                  <div className="mt-1">
                    <span
                      className={`h-3 w-3 rounded-full border-2 ${
                        isCurrent
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-slate-300 bg-white"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-xs md:text-sm ${
                        isCurrent ? "text-emerald-700 font-medium" : ""
                      }`}
                    >
                      {stop}
                      {badge}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Live Map Placeholder */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold mb-2">Live Tracking</h3>
        <div className="border border-dashed border-slate-200 rounded-lg h-40 flex flex-col items-center justify-center text-xs text-slate-500">
          <div className="text-2xl mb-2">🗺</div>
          <p className="font-medium mb-1">Live Map Coming Soon</p>
          <p className="max-w-xs text-center">
            Real-time bus tracking on map will be available in the next update.
          </p>
        </div>
      </div>
    </div>
  );
}
