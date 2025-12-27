
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { calculateBusPosition, stopCoordinates } from "../utils/mapUtils";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function LiveMap({ bus, route, metrics, actualPath, deviation }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const busMarkerRef = useRef(null);
  const actualPolylineRef = useRef(null);
  const completedPolylineRef = useRef(null);
  const upcomingPolylineRef = useRef(null);
  const stopMarkersRef = useRef([]);
  const animationFrameRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // compute busPosition
  let busPosition = [12.9633, 77.5617];
  if (bus && metrics) {
    busPosition = calculateBusPosition(
      metrics.status === "At stop" ? metrics.nextStop : bus.nextStop,
      metrics.nextStop,
      metrics.remainingSeconds,
      bus.segmentTimeSeconds || 420
    );
  }

  // Smooth animation loop
  useEffect(() => {
    const animationFrame = () => {
      setAnimationProgress((prev) => (prev + 0.01) % 1);
      animationFrameRef.current = requestAnimationFrame(animationFrame);
    };
    animationFrameRef.current = requestAnimationFrame(animationFrame);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !route) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        preferCanvas: true,
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView(busPosition, 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing stop markers
    stopMarkersRef.current.forEach((m) => m.remove());
    stopMarkersRef.current = [];

    // Add enhanced stop markers with visual hierarchy
    if (route.stops) {
      route.stops.forEach((stop, idx) => {
        const coords = stopCoordinates[stop];
        if (coords) {
          const isStart = idx === 0;
          const isEnd = idx === route.stops.length - 1;
          const isCurrent = metrics && (metrics.nextStop === stop);

          // Determine marker color and size
          let markerColor = "#3b82f6"; // blue for regular stops
          let markerSize = 28;

          if (isStart) {
            markerColor = "#10b981"; // green for start
            markerSize = 32;
          } else if (isEnd) {
            markerColor = "#dc2626"; // red for end
            markerSize = 32;
          } else if (isCurrent) {
            markerColor = "#f59e0b"; // amber for current
            markerSize = 30;
          }

          const iconHtml = `
            <div style="
              width:${markerSize}px;
              height:${markerSize}px;
              background:${markerColor};
              border:3px solid white;
              border-radius:50%;
              display:flex;
              align-items:center;
              justify-content:center;
              color:white;
              font-size:${markerSize * 0.6}px;
              box-shadow:0 2px 8px rgba(0,0,0,0.3);
              font-weight:bold;
            ">
              ${isStart ? "🚩" : isEnd ? "🏁" : "📍"}
            </div>
          `;

          const icon = L.divIcon({
            html: iconHtml,
            className: "stop-marker",
            iconSize: [markerSize, markerSize],
          });

          const marker = L.marker([coords[0], coords[1]], { icon }).addTo(mapInstanceRef.current);
          const stopLabel = `<div style="font-weight:bold;color:#1f2937;margin-bottom:4px">${stop}</div>
            <div style="font-size:12px;color:#6b7280">${isStart ? "Start" : isEnd ? "End" : `Stop ${idx}`}</div>`;
          marker.bindPopup(stopLabel);
          stopMarkersRef.current.push(marker);
        }
      });
    }

    // Draw route polylines with segment coloring
    const routeCoords = (route.stops || [])
      .map((s) => stopCoordinates[s])
      .filter(Boolean);

    if (routeCoords.length > 1) {
      const latlngs = routeCoords.map((c) => [c[0], c[1]]);

      // Remove existing layers
      if (mapInstanceRef.current._completedLine) mapInstanceRef.current.removeLayer(mapInstanceRef.current._completedLine);
      if (mapInstanceRef.current._upcomingLine) mapInstanceRef.current.removeLayer(mapInstanceRef.current._upcomingLine);

      // Get current stop index
      const currentStopIdx = metrics ? route.stops.findIndex((s) => s === metrics.nextStop) : 0;
      const completedLatlngs = latlngs.slice(0, Math.max(1, currentStopIdx));
      const upcomingLatlngs = latlngs.slice(Math.max(0, currentStopIdx - 1));

      // Draw completed segment (teal/green)
      if (completedLatlngs.length > 1) {
        const completedPoly = L.polyline(completedLatlngs, {
          color: "#14b8a6",
          weight: 5,
          opacity: 0.9,
          dashArray: "5, 5",
        }).addTo(mapInstanceRef.current);
        mapInstanceRef.current._completedLine = completedPoly;
      }

      // Draw upcoming segment (light blue)
      if (upcomingLatlngs.length > 1) {
        const upcomingPoly = L.polyline(upcomingLatlngs, {
          color: "#60a5fa",
          weight: 4,
          opacity: 0.7,
          dashArray: "3, 7",
        }).addTo(mapInstanceRef.current);
        mapInstanceRef.current._upcomingLine = upcomingPoly;
      }

      // Fit to route bounds
      try {
        const bounds = L.latLngBounds(latlngs);
        mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
      } catch (e) {
        /* ignore */
      }
    }

    return () => {
      // Don't remove map, just clean up refs
    };
  }, [route, metrics]);

  // Update bus marker with smooth animation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Create or update bus marker with pulsing effect
    if (!busMarkerRef.current) {
      const iconHtml = `
        <div style="
          position:relative;
          width:40px;
          height:40px;
          display:flex;
          align-items:center;
          justify-content:center;
        ">
          <div class="bus-marker" style="
            width:36px;
            height:36px;
            background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);
            border:3px solid white;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-size:20px;
            box-shadow:0 4px 12px rgba(239,68,68,0.4);
            position:relative;
            z-index:1000;
          ">🚌</div>
        </div>
      `;

      const busIcon = L.divIcon({
        html: iconHtml,
        className: "bus-marker-icon",
        iconSize: [40, 40],
      });

      busMarkerRef.current = L.marker(busPosition, { icon: busIcon, zIndexOffset: 1000 }).addTo(map);
      busMarkerRef.current.bindPopup(
        `<div style="text-align:center">
          <div style="font-weight:bold;font-size:14px;color:#1f2937">${bus?.id || "Bus"}</div>
          <div style="font-size:12px;color:#6b7280;margin:4px 0">Status: ${metrics?.status || "-"}</div>
          <div style="font-size:12px;color:#6b7280">ETA: ${metrics?.eta || "-"}</div>
        </div>`
      );
    } else {
      busMarkerRef.current.setLatLng(busPosition);
    }

    // Pan map to follow bus (smooth)
    if (map.getZoom() <= 14) {
      map.panTo(busPosition, { animate: true, duration: 0.5 });
    }
  }, [metrics, animationProgress]);

  // Update actual path with real-time drawing
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !actualPath || actualPath.length === 0) return;

    // actualPath is [[lng,lat], ...]
    const latlngs = actualPath.map((p) => [p[1], p[0]]);

    if (!actualPolylineRef.current) {
      actualPolylineRef.current = L.polyline(latlngs, {
        color: "#f87171",
        weight: 3,
        opacity: 0.85,
        className: "actual-path",
      }).addTo(map);
    } else {
      actualPolylineRef.current.setLatLngs(latlngs);
    }

    // Auto-fit once actual path exists
    try {
      const routeCoords = (route?.stops || [])
        .map((s) => stopCoordinates[s])
        .filter(Boolean)
        .map((c) => [c[0], c[1]]);

      if (routeCoords.length > 0 && latlngs.length > 0) {
        const allCoords = [...routeCoords, ...latlngs];
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: false });
      }
    } catch (e) {
      /* ignore */
    }
  }, [actualPath, route]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Live Tracking Map</h3>
        {metrics?.status && (
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            metrics.status === "On the way" ? "bg-blue-100 text-blue-700" :
            metrics.status === "At stop" ? "bg-amber-100 text-amber-700" :
            "bg-slate-100 text-slate-700"
          }`}>
            {metrics.status}
          </span>
        )}
      </div>

      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "450px",
          borderRadius: 12,
          border: "2px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      />

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
          <div style={{ width: 12, height: 12, backgroundColor: "#14b8a6", borderRadius: "50%", flexShrink: 0 }} />
          <span className="text-slate-600">Completed</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
          <div style={{ width: 12, height: 12, backgroundColor: "#60a5fa", borderRadius: "50%", flexShrink: 0 }} />
          <span className="text-slate-600">Upcoming</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
          <div style={{ width: 12, height: 12, backgroundColor: "#f87171", borderRadius: "50%", flexShrink: 0 }} />
          <span className="text-slate-600">Actual Path</span>
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
          <div className="grid grid-cols-3 gap-3 text-xs md:text-sm">
            <div>
              <span className="text-slate-500 block mb-1">Current Stop</span>
              <span className="font-semibold text-slate-900">{metrics.status === "At stop" ? metrics.nextStop : bus.nextStop}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Next Stop</span>
              <span className="font-semibold text-slate-900">{metrics.nextStop}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">ETA</span>
              <span className="font-bold text-emerald-600 text-base">{metrics.eta}</span>
            </div>
          </div>

          {deviation && (
            <div className="pt-2 border-t border-slate-200">
              <div className="text-xs font-medium text-slate-600 mb-2">Route Deviation Analysis</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 text-xs block mb-1">Avg Deviation</span>
                  <span className="font-bold text-slate-900">{Math.round(deviation.meanMeters)} m</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 text-xs block mb-1">Max Deviation</span>
                  <span className="font-bold text-rose-600">{Math.round(deviation.maxMeters)} m</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
