export type Place = {
  id: string;
  name: string;
  area: string;
  category: string;
  blurb: string;
  /** Entrance fee in USD. 0 means free entry. */
  fee: number;
  feeNote?: string;
  hours: string;
  lat: number;
  lng: number;
};

export const PLACES: Record<string, Place[]> = {
  santorini: [
    { id: "p-sant-1", name: "Akrotiri Excavations", area: "Akrotiri", category: "Archaeology", blurb: "Bronze Age town buried in ash, roofed and walkable.", fee: 13, hours: "08:30 – 20:00", lat: 36.3517, lng: 25.4033 },
    { id: "p-sant-2", name: "Oia Sunset Castle", area: "Oia", category: "Viewpoint", blurb: "Ruined Venetian castle, the classic caldera sunset spot.", fee: 0, feeNote: "Free · arrive 2h early", hours: "Always open", lat: 36.4618, lng: 25.3753 },
    { id: "p-sant-3", name: "Red Beach", area: "Akrotiri", category: "Beach", blurb: "Iron-red volcanic cliffs dropping into clear water.", fee: 0, feeNote: "Free · sunbeds €10", hours: "Daylight", lat: 36.3477, lng: 25.3937 },
    { id: "p-sant-4", name: "Museum of Prehistoric Thera", area: "Fira", category: "Museum", blurb: "Frescoes and gold finds lifted from Akrotiri.", fee: 6, hours: "08:30 – 15:30", lat: 36.4162, lng: 25.4318 },
    { id: "p-sant-5", name: "Ancient Thera", area: "Kamari", category: "Archaeology", blurb: "Hellenistic ridge-top city 360m above the sea.", fee: 8, hours: "08:00 – 15:00", lat: 36.3617, lng: 25.4767 },
    { id: "p-sant-6", name: "Amoudi Bay", area: "Oia", category: "Harbour", blurb: "Fishing coves below Oia — 300 steps down, tavernas at the bottom.", fee: 0, feeNote: "Free", hours: "Always open", lat: 36.4632, lng: 25.3688 },
  ],
  tokyo: [
    { id: "p-tok-1", name: "Senso-ji Temple", area: "Asakusa", category: "Temple", blurb: "Tokyo's oldest temple, founded 628 AD.", fee: 0, feeNote: "Free entry", hours: "06:00 – 17:00", lat: 35.7148, lng: 139.7967 },
    { id: "p-tok-2", name: "Shibuya Crossing & Sky", area: "Shibuya", category: "Cityscape", blurb: "The famous scramble, best seen from Shibuya Sky.", fee: 16, feeNote: "Crossing free · Sky deck $16", hours: "10:00 – 22:30", lat: 35.6595, lng: 139.7005 },
    { id: "p-tok-3", name: "Tsukiji Outer Market", area: "Tsukiji", category: "Market", blurb: "Breakfast sushi, tamagoyaki and knife shops.", fee: 0, feeNote: "Free", hours: "05:00 – 14:00", lat: 35.6654, lng: 139.7707 },
    { id: "p-tok-4", name: "Meiji Jingu", area: "Harajuku", category: "Shrine", blurb: "Forest shrine of 100,000 donated trees.", fee: 0, feeNote: "Free · inner garden $4", hours: "Sunrise – sunset", lat: 35.6764, lng: 139.6993 },
    { id: "p-tok-5", name: "TeamLab Planets", area: "Toyosu", category: "Art", blurb: "Barefoot, water-and-light immersive galleries.", fee: 25, hours: "09:00 – 22:00", lat: 35.6487, lng: 139.7902 },
    { id: "p-tok-6", name: "Tokyo National Museum", area: "Ueno", category: "Museum", blurb: "Japan's largest collection of national treasures.", fee: 7, hours: "09:30 – 17:00", lat: 35.7188, lng: 139.7766 },
  ],
  marrakech: [
    { id: "p-mar-1", name: "Jemaa el-Fnaa", area: "Medina", category: "Square", blurb: "Open-air kitchen and storytelling stage every night.", fee: 0, feeNote: "Free", hours: "Always open", lat: 31.6258, lng: -7.9891 },
    { id: "p-mar-2", name: "Bahia Palace", area: "Medina", category: "Palace", blurb: "Zellige tilework and painted cedar ceilings, 1860s.", fee: 7, hours: "09:00 – 17:00", lat: 31.6218, lng: -7.9832 },
    { id: "p-mar-3", name: "Koutoubia Mosque", area: "Medina", category: "Landmark", blurb: "12th-century minaret; gardens open to all.", fee: 0, feeNote: "Gardens free · interior Muslims only", hours: "Gardens all day", lat: 31.6236, lng: -7.9934 },
    { id: "p-mar-4", name: "Jardin Majorelle & YSL", area: "Guéliz", category: "Garden", blurb: "Cobalt-blue villa gardens, Berber museum inside.", fee: 17, hours: "08:00 – 18:00", lat: 31.6417, lng: -8.0033 },
    { id: "p-mar-5", name: "Saadian Tombs", area: "Kasbah", category: "Heritage", blurb: "Sealed for 300 years, found by aerial survey in 1917.", fee: 7, hours: "09:00 – 17:00", lat: 31.6178, lng: -7.9874 },
    { id: "p-mar-6", name: "Souk Semmarine", area: "Medina", category: "Market", blurb: "The main artery of the souks — lanterns, leather, spice.", fee: 0, feeNote: "Free", hours: "09:00 – 20:00", lat: 31.6295, lng: -7.9887 },
  ],
  capetown: [
    { id: "p-cpt-1", name: "Table Mountain Cableway", area: "Tafelberg Rd", category: "Nature", blurb: "Rotating car to a flat summit above the peninsula.", fee: 26, feeNote: "Free if you hike Platteklip", hours: "08:00 – 18:00", lat: -33.9628, lng: 18.4098 },
    { id: "p-cpt-2", name: "Robben Island", area: "V&A Waterfront ferry", category: "History", blurb: "Prison island tours led by former political prisoners.", fee: 34, hours: "Ferries 09:00 / 11:00 / 13:00", lat: -33.8067, lng: 18.3667 },
    { id: "p-cpt-3", name: "Boulders Beach Penguins", area: "Simon's Town", category: "Wildlife", blurb: "African penguin colony on granite boulders.", fee: 10, hours: "08:00 – 18:30", lat: -34.1975, lng: 18.4515 },
    { id: "p-cpt-4", name: "Cape of Good Hope", area: "Cape Point", category: "Nature", blurb: "Cliff paths and the old lighthouse at the peninsula tip.", fee: 21, hours: "06:00 – 18:00", lat: -34.3568, lng: 18.4740 },
    { id: "p-cpt-5", name: "Kirstenbosch Gardens", area: "Newlands", category: "Garden", blurb: "Fynbos gardens and the treetop Boomslang walkway.", fee: 12, hours: "08:00 – 19:00", lat: -33.9881, lng: 18.4326 },
    { id: "p-cpt-6", name: "Bo-Kaap", area: "City Bowl", category: "Neighbourhood", blurb: "Cobbled streets of painted Cape Malay houses.", fee: 0, feeNote: "Free to walk · museum $3", hours: "Always open", lat: -33.9210, lng: 18.4147 },
  ],
  rio: [
    { id: "p-rio-1", name: "Christ the Redeemer", area: "Corcovado", category: "Landmark", blurb: "38m statue reached by cog train through rainforest.", fee: 28, hours: "08:00 – 19:00", lat: -22.9519, lng: -43.2105 },
    { id: "p-rio-2", name: "Sugarloaf Cable Car", area: "Urca", category: "Viewpoint", blurb: "Two-stage ride, best timed for sunset over the bay.", fee: 25, hours: "08:00 – 19:50", lat: -22.9486, lng: -43.1566 },
    { id: "p-rio-3", name: "Ipanema Beach", area: "Ipanema", category: "Beach", blurb: "Posto culture and sunset applause at Arpoador.", fee: 0, feeNote: "Free · chair rental $5", hours: "Always open", lat: -22.9868, lng: -43.2065 },
    { id: "p-rio-4", name: "Selarón Steps", area: "Lapa", category: "Art", blurb: "215 steps tiled with mosaics from 60 countries.", fee: 0, feeNote: "Free", hours: "Always open", lat: -22.9152, lng: -43.1791 },
    { id: "p-rio-5", name: "Jardim Botânico", area: "Jardim Botânico", category: "Garden", blurb: "Imperial palm avenue planted in 1808.", fee: 6, hours: "08:00 – 17:00", lat: -22.9674, lng: -43.2247 },
    { id: "p-rio-6", name: "Maracanã Stadium", area: "Maracanã", category: "Sport", blurb: "Tour the pitch and locker rooms of the temple of football.", fee: 15, hours: "09:00 – 17:00", lat: -22.9121, lng: -43.2302 },
  ],
  bali: [
    { id: "p-bal-1", name: "Tegallalang Rice Terraces", area: "Ubud", category: "Nature", blurb: "Subak-fed rice steps, best just after sunrise.", fee: 2, hours: "07:00 – 18:00", lat: -8.4312, lng: 115.2792 },
    { id: "p-bal-2", name: "Uluwatu Temple", area: "Pecatu", category: "Temple", blurb: "Clifftop temple with kecak fire dance at dusk.", fee: 4, feeNote: "$4 entry · dance $8", hours: "07:00 – 19:00", lat: -8.8291, lng: 115.0849 },
    { id: "p-bal-3", name: "Mount Batur Sunrise Trek", area: "Kintamani", category: "Adventure", blurb: "Two-hour night hike up an active volcano.", fee: 35, feeNote: "Guide required", hours: "Start 03:30", lat: -8.2422, lng: 115.3753 },
    { id: "p-bal-4", name: "Tirta Empul", area: "Tampaksiring", category: "Temple", blurb: "Holy spring where Balinese purify in the pools.", fee: 4, hours: "08:00 – 18:00", lat: -8.4157, lng: 115.3153 },
    { id: "p-bal-5", name: "Sacred Monkey Forest", area: "Ubud", category: "Wildlife", blurb: "Mossy temple ravine with 1,200 macaques.", fee: 6, hours: "09:00 – 18:00", lat: -8.5188, lng: 115.2585 },
    { id: "p-bal-6", name: "Canggu Beach (Echo)", area: "Canggu", category: "Beach", blurb: "Black-sand surf break with beach-club sunsets.", fee: 0, feeNote: "Free", hours: "Always open", lat: -8.6529, lng: 115.1290 },
  ],
};

/** Great-circle distance in kilometres. */
export function distanceKm(a: Place, b: Place) {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatKm(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

/** Rough drive time at 35 km/h city average. */
export function driveTime(km: number) {
  const mins = Math.max(3, Math.round((km / 35) * 60));
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
}
