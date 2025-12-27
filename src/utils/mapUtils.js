// src/utils/mapUtils.js
/**
 * Simulated GPS coordinates for bus stops
 * Each stop has latitude/longitude (sample data for Bengaluru region)
 */
export const stopCoordinates = {
  // Bengaluru → Chikkaballapur route
  "Majestic": [12.9633, 77.5617],
  "Hebbal": [13.0089, 77.5946],
  "Yelahanka": [13.1089, 77.6023],
  "Kogilu": [13.1567, 77.5899],
  "Airport Trumpet": [13.1926, 77.5789],
  "Devanahalli Bus Stand": [13.2267, 77.5612],
  "Nagarjuna College (NCET)": [13.2567, 77.5467],
  "Nandi Upachar": [13.2890, 77.5234],
  "Chikkaballapur Bus Stand": [13.3156, 77.4501],

  // Chikkaballapur → Chintamani
  "Nayanahalli": [13.3234, 77.4234],
  "Jathavarahalli": [13.3567, 77.3901],
  "Hosaudya": [13.3801, 77.3567],
  "Shidlagatta": [13.4012, 77.3234],
  "Hunnesaenahalli": [13.4234, 77.2901],
  "Upparpete": [13.4456, 77.2567],
  "Chintamani KSRTC Depot": [13.4701, 77.2201],

  // Chintamani → Kolar
  "Dodaanatta Halt": [13.4901, 77.1834],
  "Srinivaspura": [13.5089, 77.1467],
  "Dalasanuru Halt": [13.5267, 77.1101],
  "Gootihalli": [13.5456, 76.9701],
  "Jannagatta Halt": [13.5634, 76.9234],
  "Kolar Bus Stand": [13.5834, 76.8734],

  // Kolar → Devanahalli
  "Vemagal": [13.5567, 77.0123],
  "Narasapura": [13.5234, 77.0567],
  "H Cross": [13.4567, 77.1234],

  // Airport routes
  "Kempegowda International Airport": [13.1979, 77.7063],
};

/**
 * Interpolate GPS position between two stops based on progress
 * @param {string} fromStop - Starting stop name
 * @param {string} toStop - Destination stop name
 * @param {number} progress - Progress 0-1 (0 = at fromStop, 1 = at toStop)
 * @returns {[number, number]} [latitude, longitude]
 */
export function interpolatePosition(fromStop, toStop, progress) {
  const fromCoords = stopCoordinates[fromStop];
  const toCoords = stopCoordinates[toStop];

  if (!fromCoords || !toCoords) {
    // Fallback to first known coordinate
    return Object.values(stopCoordinates)[0] || [12.9633, 77.5617];
  }

  const lat = fromCoords[0] + (toCoords[0] - fromCoords[0]) * progress;
  const lng = fromCoords[1] + (toCoords[1] - fromCoords[1]) * progress;

  return [lat, lng];
}

/**
 * Calculate current bus position on route
 * @param {string} currentStop - Current stop name
 * @param {string} nextStop - Next stop name
 * @param {number} remainingSeconds - Seconds to next stop
 * @param {number} segmentTimeSeconds - Total time for this segment
 * @returns {[number, number]} [latitude, longitude]
 */
export function calculateBusPosition(currentStop, nextStop, remainingSeconds, segmentTimeSeconds) {
  if (!currentStop || !nextStop) {
    return [12.9633, 77.5617]; // Default to Majestic
  }

  // Progress from current to next: 0 = just left, 1 = about to arrive
  const elapsed = segmentTimeSeconds - remainingSeconds;
  const progress = Math.min(1, Math.max(0, elapsed / segmentTimeSeconds));

  return interpolatePosition(currentStop, nextStop, progress);
}
