// Helper to generate departure times (fresh timestamps) and per-stop timings
const generateBuses = (buses, stops) => {
  const now = Date.now(); // Generate fresh timestamp
  return buses.map((bus, idx) => {
    // parse numeric minutes from eta like "7 min"
    const m = (bus.eta || "0").match(/(\d+)/);
    const etaMinutes = m ? parseInt(m[1], 10) : 7;
    const segmentTimeSeconds = Math.max(30, etaMinutes * 60); // minimum 30s per segment

    // find nextStop index to determine where bus currently is
    const nextIdx = stops ? stops.findIndex((s) => s === bus.nextStop) : -1;
    const startIndex = Math.max(0, nextIdx - 1);

    // departureTime corresponds to when the bus left the stop at startIndex
    // stagger buses by 7 minutes to spread them out along the route
    const departureTime = now - idx * 7 * 60 * 1000 - startIndex * segmentTimeSeconds * 1000;

    return {
      ...bus,
      departureTime,
      segmentTimeSeconds,
      startIndex,
    };
  });
};

export const routes = [
  {
    id: "blr-chikkaballapur",
    name: "Bengaluru → Chikkaballapur",
    stops: [
      "Majestic",
      "Hebbal",
      "Yelahanka",
      "Kogilu",
      "Airport Trumpet",
      "Devanahalli Bus Stand",
      "Nagarjuna College (NCET)",
      "Nandi Upachar",
      "Chikkaballapur Bus Stand",
    ],
    buses: generateBuses([
      { id: "KA01 F 5521", eta: "7 min", status: "On the way", nextStop: "Nagarjuna College (NCET)" },
      { id: "KA40 F 8829", eta: "12 min", status: "At stop", nextStop: "Devanahalli Bus Stand" },
      { id: "KA01 F 7710", eta: "18 min", status: "On the way", nextStop: "Nandi Upachar" },
      { id: "KA40 F 9913", eta: "26 min", status: "On the way", nextStop: "Airport Trumpet" },
      { id: "KA01 F 4408", eta: "34 min", status: "On the way", nextStop: "Yelahanka" },
    ]),
  },

  {
    id: "chikkaballapur-blr",
    name: "Chikkaballapur → Bengaluru",
    stops: [
      "Chikkaballapur Bus Stand",
      "Nandi Upachar",
      "Nagarjuna College (NCET)",
      "Devanahalli Bus Stand",
      "Airport Trumpet",
      "Kogilu",
      "Yelahanka",
      "Hebbal",
      "Majestic",
    ],
    buses: generateBuses([
      { id: "KA01 F 4408", eta: "34 min", status: "On the way", nextStop: "Yelahanka" },
      { id: "KA40 F 9913", eta: "26 min", status: "On the way", nextStop: "Airport Trumpet" },
      { id: "KA01 F 7710", eta: "18 min", status: "On the way", nextStop: "Nandi Upachar" },
      { id: "KA40 F 8829", eta: "12 min", status: "At stop", nextStop: "Devanahalli Bus Stand" },
      { id: "KA01 F 5521", eta: "7 min", status: "On the way", nextStop: "Nagarjuna College (NCET)" },
    ]),
  },

  {
    id: "chikkaballapur-chintamani",
    name: "Chikkaballapur → Chintamani",
    stops: [
      "Chikkaballapur Bus Stand",
      "Nayanahalli",
      "Jathavarahalli",
      "Hosaudya",
      "Shidlagatta",
      "Hunnesaenahalli",
      "Upparpete",
      "Chintamani KSRTC Depot",
    ],
    buses: generateBuses([
      { id: "KA40 F 2351", eta: "5 min", status: "On the way", nextStop: "Nayanahalli" },
      { id: "KA40 F 6630", eta: "12 min", status: "On the way", nextStop: "Jathavarahalli" },
      { id: "KA40 F 1189", eta: "18 min", status: "At stop", nextStop: "Hosaudya" },
      { id: "KA40 F 7719", eta: "25 min", status: "On the way", nextStop: "Shidlagatta" },
      { id: "KA40 F 9924", eta: "30 min", status: "On the way", nextStop: "Hunnesaenahalli" },
    ]),
  },

  {
    id: "chintamani-chikkaballapur",
    name: "Chintamani → Chikkaballapur",
    stops: [
      "Chintamani KSRTC Depot",
      "Upparpete",
      "Hunnesaenahalli",
      "Shidlagatta",
      "Hosaudya",
      "Jathavarahalli",
      "Nayanahalli",
      "Chikkaballapur Bus Stand",
    ],
    buses: generateBuses([
      { id: "KA40 F 5521", eta: "6 min", status: "On the way", nextStop: "Upparpete" },
      { id: "KA40 F 7740", eta: "13 min", status: "On the way", nextStop: "Hunnesaenahalli" },
      { id: "KA40 F 2272", eta: "19 min", status: "At stop", nextStop: "Shidlagatta" },
      { id: "KA40 F 6633", eta: "26 min", status: "On the way", nextStop: "Hosaudya" },
      { id: "KA40 F 4491", eta: "33 min", status: "On the way", nextStop: "Jathavarahalli" },
    ]),
  },

  {
    id: "chikkaballapur-devanahalli-airport",
    name: "Chikkaballapur → Devanahalli → Airport",
    stops: [
      "Chikkaballapur Bus Stand",
      "Nandi Upachar",
      "Nagarjuna College (NCET)",
      "Devanahalli Bus Stand",
      "Airport Trumpet",
      "Kempegowda International Airport",
    ],
    buses: generateBuses([
      { id: "KA40 F 9901", eta: "6 min", status: "On the way", nextStop: "Nandi Upachar" },
      { id: "KA40 F 4410", eta: "13 min", status: "On the way", nextStop: "Nagarjuna College (NCET)" },
      { id: "KA40 F 7718", eta: "19 min", status: "At stop", nextStop: "Devanahalli Bus Stand" },
      { id: "KA40 F 5502", eta: "25 min", status: "On the way", nextStop: "Airport Trumpet" },
      { id: "KA40 F 8890", eta: "33 min", status: "On the way", nextStop: "Kempegowda International Airport" },
    ]),
  },

  {
    id: "airport-devanahalli-chikkaballapur",
    name: "Airport → Devanahalli → Chikkaballapur",
    stops: [
      "Kempegowda International Airport",
      "Airport Trumpet",
      "Devanahalli Bus Stand",
      "Nagarjuna College (NCET)",
      "Nandi Upachar",
      "Chikkaballapur Bus Stand",
    ],
    buses: generateBuses([
      { id: "KA40 F 8821", eta: "5 min", status: "On the way", nextStop: "Airport Trumpet" },
      { id: "KA40 F 6642", eta: "12 min", status: "On the way", nextStop: "Devanahalli Bus Stand" },
      { id: "KA40 F 9914", eta: "18 min", status: "At stop", nextStop: "Nagarjuna College (NCET)" },
      { id: "KA40 F 4477", eta: "24 min", status: "On the way", nextStop: "Nandi Upachar" },
      { id: "KA40 F 3302", eta: "31 min", status: "On the way", nextStop: "Chikkaballapur Bus Stand" },
    ]),
  },

  {
    id: "chintamani-kolar",
    name: "Chintamani → Kolar",
    stops: [
      "Chintamani KSRTC Depot",
      "Dodaanatta Halt",
      "Srinivaspura",
      "Dalasanuru Halt",
      "Gootihalli",
      "Jannagatta Halt",
      "Kolar Bus Stand",
    ],
    buses: generateBuses([
      { id: "KA07 F 6612", eta: "3 min", status: "On the way", nextStop: "Dodaanatta Halt" },
      { id: "KA07 F 4420", eta: "9 min", status: "At stop", nextStop: "Srinivaspura" },
      { id: "KA07 F 7711", eta: "15 min", status: "On the way", nextStop: "Dalasanuru Halt" },
      { id: "KA07 F 5584", eta: "22 min", status: "On the way", nextStop: "Gootihalli" },
      { id: "KA07 F 9924", eta: "27 min", status: "On the way", nextStop: "Kolar Bus Stand" },
    ]),
  },

  {
    id: "kolar-chintamani",
    name: "Kolar → Chintamani",
    stops: [
      "Kolar Bus Stand",
      "Jannagatta Halt",
      "Gootihalli",
      "Dalasanuru Halt",
      "Srinivaspura",
      "Dodaanatta Halt",
      "Chintamani KSRTC Depot",
    ],
    buses: generateBuses([
      { id: "KA07 F 5521", eta: "4 min", status: "On the way", nextStop: "Jannagatta Halt" },
      { id: "KA07 F 7744", eta: "10 min", status: "On the way", nextStop: "Gootihalli" },
      { id: "KA07 F 2290", eta: "17 min", status: "At stop", nextStop: "Dalasanuru Halt" },
      { id: "KA07 F 6633", eta: "23 min", status: "On the way", nextStop: "Srinivaspura" },
      { id: "KA07 F 4491", eta: "30 min", status: "On the way", nextStop: "Dodaanatta Halt" },
    ]),
  },

  {
    id: "kolar-devanahalli",
    name: "Kolar → Devanahalli",
    stops: [
      "Kolar Bus Stand",
      "Vemagal",
      "Narasapura",
      "H Cross",
      "Devanahalli Bus Stand",
    ],
    buses: generateBuses([
      { id: "KA07 F 5579", eta: "5 min", status: "On the way", nextStop: "Vemagal" },
      { id: "KA07 F 9910", eta: "12 min", status: "At stop", nextStop: "Narasapura" },
      { id: "KA07 F 2278", eta: "19 min", status: "On the way", nextStop: "H Cross" },
      { id: "KA07 F 7749", eta: "25 min", status: "On the way", nextStop: "Devanahalli Bus Stand" },
      { id: "KA07 F 6605", eta: "32 min", status: "On the way", nextStop: "Kolar Bus Stand" },
    ]),
  },

  {
    id: "chikkaballapur-bagalur",
    name: "Chikkaballapur → Bagalur",
    stops: [
      "Chikkaballapur Bus Stand",
      "Sathanur",
      "Kundana",
      "Bagalur Cross",
      "Bagalur Town",
    ],
    buses: generateBuses([
      { id: "KA40 F 3087", eta: "4 min", status: "On the way", nextStop: "Sathanur" },
      { id: "KA40 F 1145", eta: "10 min", status: "On the way", nextStop: "Kundana" },
      { id: "KA40 F 9921", eta: "16 min", status: "At stop", nextStop: "Bagalur Cross" },
      { id: "KA40 F 6630", eta: "23 min", status: "On the way", nextStop: "Bagalur Town" },
      { id: "KA40 F 4477", eta: "29 min", status: "On the way", nextStop: "Chikkaballapur Bus Stand" },
    ]),
  },
];
export const staticRoutes = routes;