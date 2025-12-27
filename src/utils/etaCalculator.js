// src/utils/etaCalculator.js
/**
 * Simulates realistic bus movement and ETA calculations
 * Each bus has a departure time, and we calculate time elapsed
 */

/**
 * Parse ETA string like "7 min" to seconds
 */
export function parseETAToSeconds(etaString) {
  const match = etaString.match(/(\d+)\s*min/);
  return match ? parseInt(match[1]) * 60 : 0;
}

/**
 * Calculate remaining seconds for a bus based on its departure time
 * @param {number} departureTime - Timestamp when bus left its origin
 * @param {number} initialETASeconds - Original ETA in seconds
 * @param {number} simulationSpeed - Speed multiplier (1 = real-time, 60 = demo)
 * @returns {object} { remainingSeconds, hasArrived, isDeparted }
 */
export function calculateRemainingETA(departureTime, initialETASeconds, simulationSpeed = 1) {
  const now = Date.now();
  const elapsedMs = now - departureTime;
  const elapsedSeconds = Math.floor((elapsedMs / 1000) * simulationSpeed);

  const remainingSeconds = Math.max(0, initialETASeconds - elapsedSeconds);
  const hasArrived = remainingSeconds === 0;

  // Bus departs after being "At stop" for 30 seconds
  const totalCycleTime = initialETASeconds + 30;
  const isDeparted = elapsedSeconds > totalCycleTime;

  return { remainingSeconds, hasArrived, isDeparted };
}

/**
 * Convert seconds back to readable format
 */
export function secondsToETAString(seconds) {
  if (seconds <= 0) return "0 min";
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} min`;
}

/**
 * Determine bus status based on remaining time
 */
export function calculateBusStatus(remainingSeconds, hasArrived, isDeparted) {
  if (isDeparted) {
    return "Departed";
  }
  if (hasArrived) {
    return "At stop";
  }
  return "On the way";
}

/**
 * Enhance a bus object with real-time calculations
 * Also updates nextStop based on elapsed time
 * @param {number} simulationSpeed - Speed multiplier (1 = real-time, 60 = demo 60x)
 */
export function calculateBusMetrics(bus, departureTime, route = null, simulationSpeed = 1) {
  // Fallback: if no departure time provided, use current time
  const actualDepartureTime = departureTime || Date.now();
  // Prefer per-segment time if available
  const segmentTime = bus.segmentTimeSeconds || parseETAToSeconds(bus.eta) || 60;
  const stopDuration = 30; // seconds bus stays at stop

  const now = Date.now();
  // Apply simulation speed: multiply elapsed by speed factor
  const elapsedSeconds = Math.floor(((now - actualDepartureTime) / 1000) * simulationSpeed);

  let nextStop = bus.nextStop;
  let status = "On the way";
  let remainingSeconds = 0;
  let isDeparted = false;

  if (route && route.stops) {
    const stops = route.stops;
    const startIndex = typeof bus.startIndex === "number" ? bus.startIndex : Math.max(0, (stops.findIndex(s => s === bus.nextStop) - 1));

    const totalCycle = segmentTime + stopDuration; // travel + stop
    const cyclesPassed = Math.floor(elapsedSeconds / totalCycle);
    const cycleElapsed = elapsedSeconds % totalCycle;

    const currentSegmentIndex = startIndex + cyclesPassed; // index of segment starting point

    // If we've passed all segments (reached or passed final stop)
    if (currentSegmentIndex >= stops.length - 1) {
      // Check if still within final stop wait window
      if (cycleElapsed < stopDuration) {
        // At final stop
        status = "At stop";
        remainingSeconds = 0;
        nextStop = stops[stops.length - 1];
      } else {
        // Departed beyond final stop
        isDeparted = true;
      }
    } else {
      // Bus is somewhere before final stop
      if (cycleElapsed < segmentTime) {
        // Currently traveling to next stop
        status = "On the way";
        remainingSeconds = Math.max(0, segmentTime - cycleElapsed);
        nextStop = stops[currentSegmentIndex + 1];
      } else {
        // Currently at stop (arrived)
        status = "At stop";
        remainingSeconds = 0;
        nextStop = stops[currentSegmentIndex + 1];
      }
    }
  } else {
    // Fallback: simple remaining based on single ETA
    const initialETASeconds = parseETAToSeconds(bus.eta);
    const calc = calculateRemainingETA(actualDepartureTime, initialETASeconds, simulationSpeed);
    remainingSeconds = calc.remainingSeconds;
    status = calculateBusStatus(calc.remainingSeconds, calc.hasArrived, calc.isDeparted);
    isDeparted = calc.isDeparted;
  }

  return {
    ...bus,
    eta: secondsToETAString(remainingSeconds),
    status,
    nextStop,
    remainingSeconds,
    isDeparted,
  };
}
