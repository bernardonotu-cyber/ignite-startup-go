export type Flight = {
  id: string;
  airline: string;
  route: string;
  depart: string;
  arrive: string;
  duration: string;
  stops: string;
  cabin: string;
  price: number;
};

export type Car = {
  id: string;
  name: string;
  type: string;
  pickup: string;
  seats: number;
  transmission: string;
  perks: string;
  price: number;
};

export type Stay = {
  id: string;
  name: string;
  kind: string;
  area: string;
  rating: number;
  perks: string;
  price: number;
};

export type Destination = {
  id: string;
  city: string;
  country: string;
  image: string;
  tagline: string;
  color: string;
  vibes: string[];
  bestTime: string;
  currency: string;
  language: string;
  avgDaily: number;
  history: string;
  highlights: { title: string; blurb: string }[];
  flights: Flight[];
  cars: Car[];
  stays: Stay[];
};

export const DESTINATIONS: Destination[] = [
  {
    id: "santorini",
    city: "Santorini",
    country: "Greece",
    image: "/images/dest-santorini.jpg",
    tagline: "Whitewashed cliffs over a drowned volcano",
    color: "sky",
    vibes: ["Romantic", "Islands", "Sunsets"],
    bestTime: "May – early October",
    currency: "EUR (€)",
    language: "Greek",
    avgDaily: 210,
    history:
      "Santorini is the rim of a volcano that erupted around 1600 BC in one of the largest blasts in human history, burying the Minoan town of Akrotiri under ash and, some argue, seeding the legend of Atlantis. The caldera you sail into today is the collapsed heart of that mountain, and the blue-domed villages of Oia and Fira were built high on the cliffs by islanders who spent centuries watching for pirates.",
    highlights: [
      { title: "Akrotiri excavations", blurb: "A Bronze Age town frozen in volcanic ash, with three-storey houses and frescoes still in place." },
      { title: "Oia at sunset", blurb: "The classic caldera view — arrive two hours early and claim a wall." },
      { title: "Red Beach", blurb: "Iron-rich volcanic cliffs falling straight into clear water." },
    ],
    flights: [
      { id: "f-sant-1", airline: "Aegean Airlines", route: "JFK → ATH → JTR", depart: "18:40", arrive: "15:10 +1", duration: "14h 30m", stops: "1 stop", cabin: "Economy", price: 712 },
      { id: "f-sant-2", airline: "Lufthansa", route: "JFK → FRA → JTR", depart: "21:05", arrive: "17:55 +1", duration: "14h 50m", stops: "1 stop", cabin: "Premium", price: 1180 },
    ],
    cars: [
      { id: "c-sant-1", name: "Fiat Panda", type: "Compact", pickup: "Santorini Airport (JTR)", seats: 4, transmission: "Manual", perks: "Free cancellation · Unlimited km", price: 38 },
      { id: "c-sant-2", name: "Jeep Renegade", type: "Small SUV", pickup: "Fira town office", seats: 5, transmission: "Automatic", perks: "Cliff-road friendly · Full insurance", price: 79 },
    ],
    stays: [
      { id: "h-sant-1", name: "Caldera Cave Suites", kind: "Boutique hotel", area: "Oia", rating: 4.8, perks: "Infinity pool · Caldera view · Breakfast", price: 340 },
      { id: "h-sant-2", name: "Blue Dome Residences", kind: "Apartment", area: "Fira", rating: 4.5, perks: "Kitchen · Walk to nightlife", price: 165 },
    ],
  },
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japan",
    image: "/images/dest-tokyo.jpg",
    tagline: "Neon, noodles and 400 years of city-making",
    color: "violet",
    vibes: ["Food", "Nightlife", "Design"],
    bestTime: "March – May, October – November",
    currency: "JPY (¥)",
    language: "Japanese",
    avgDaily: 180,
    history:
      "Tokyo began as Edo, a fishing village that the shogun Tokugawa Ieyasu turned into his capital in 1603. By the 1700s it was the largest city on earth. Renamed Tokyo in 1868 when the emperor moved east, it was flattened twice in one century — by the 1923 earthquake and by wartime firebombing — and rebuilt each time faster than anyone expected, which is why the old and the brand new sit on the same block.",
    highlights: [
      { title: "Senso-ji, Asakusa", blurb: "Tokyo's oldest temple, founded 628 AD, approached through a lantern-lit market street." },
      { title: "Shibuya Crossing", blurb: "Up to 3,000 people cross at once — best watched from the Sky building." },
      { title: "Tsukiji Outer Market", blurb: "Breakfast sushi, tamagoyaki and knife shops from the old fish-market era." },
    ],
    flights: [
      { id: "f-tok-1", airline: "ANA", route: "LAX → HND", depart: "11:35", arrive: "16:05 +1", duration: "11h 30m", stops: "Nonstop", cabin: "Economy", price: 890 },
      { id: "f-tok-2", airline: "Japan Airlines", route: "LAX → NRT", depart: "13:20", arrive: "17:40 +1", duration: "11h 20m", stops: "Nonstop", cabin: "Business", price: 3240 },
    ],
    cars: [
      { id: "c-tok-1", name: "Toyota Yaris Hybrid", type: "Compact", pickup: "Haneda Airport (HND)", seats: 5, transmission: "Automatic", perks: "ETC toll card · English GPS", price: 55 },
      { id: "c-tok-2", name: "Nissan Serena", type: "Van", pickup: "Shinjuku station office", seats: 7, transmission: "Automatic", perks: "Great for day trips to Hakone", price: 98 },
    ],
    stays: [
      { id: "h-tok-1", name: "Park Tower Shinjuku", kind: "Luxury hotel", area: "Shinjuku", rating: 4.9, perks: "Skyline bar · Onsen floor", price: 420 },
      { id: "h-tok-2", name: "Nui. Hostel & Bar", kind: "Design hostel", area: "Kuramae", rating: 4.6, perks: "River views · Great coffee", price: 62 },
    ],
  },
  {
    id: "marrakech",
    city: "Marrakech",
    country: "Morocco",
    image: "/images/dest-marrakech.jpg",
    tagline: "The red city of caravans and courtyards",
    color: "amber",
    vibes: ["Markets", "Desert", "Craft"],
    bestTime: "March – May, September – November",
    currency: "MAD (د.م.)",
    language: "Arabic, Amazigh, French",
    avgDaily: 95,
    history:
      "Founded in 1070 by the Almoravids as a desert launch pad, Marrakech grew rich on caravans hauling gold and salt across the Sahara. Its rammed-earth walls gave the city its red colour and its name to the whole country. The Koutoubia minaret, finished in the 12th century, became the template for towers in Seville and Rabat — and no building in the medina is allowed to rise above it.",
    highlights: [
      { title: "Jemaa el-Fnaa", blurb: "A square that turns into an open-air kitchen and storytelling stage every evening." },
      { title: "Bahia Palace", blurb: "Zellige tilework and painted cedar ceilings from the 1860s." },
      { title: "Atlas Mountains day trip", blurb: "Berber villages and waterfalls 90 minutes from the medina." },
    ],
    flights: [
      { id: "f-mar-1", airline: "Royal Air Maroc", route: "JFK → CMN → RAK", depart: "19:00", arrive: "12:45 +1", duration: "12h 45m", stops: "1 stop", cabin: "Economy", price: 640 },
      { id: "f-mar-2", airline: "Air France", route: "JFK → CDG → RAK", depart: "22:10", arrive: "15:20 +1", duration: "12h 10m", stops: "1 stop", cabin: "Economy", price: 705 },
    ],
    cars: [
      { id: "c-mar-1", name: "Dacia Logan", type: "Sedan", pickup: "Marrakech Menara (RAK)", seats: 5, transmission: "Manual", perks: "Cheapest option · A/C", price: 29 },
      { id: "c-mar-2", name: "Land Cruiser + driver", type: "4x4 with driver", pickup: "Riad doorstep", seats: 6, transmission: "Automatic", perks: "Desert-ready · English-speaking driver", price: 145 },
    ],
    stays: [
      { id: "h-mar-1", name: "Riad Yasmine", kind: "Riad", area: "Medina", rating: 4.7, perks: "Courtyard pool · Rooftop breakfast", price: 130 },
      { id: "h-mar-2", name: "Palmeraie Desert Resort", kind: "Resort", area: "Palmeraie", rating: 4.6, perks: "Spa · Two pools · Shuttle", price: 240 },
    ],
  },
  {
    id: "capetown",
    city: "Cape Town",
    country: "South Africa",
    image: "/images/dest-capetown.jpg",
    tagline: "A mountain in the middle of two oceans",
    color: "teal",
    vibes: ["Nature", "Wine", "Coast"],
    bestTime: "November – March",
    currency: "ZAR (R)",
    language: "English, Afrikaans, isiXhosa",
    avgDaily: 110,
    history:
      "The Dutch East India Company planted a supply garden at the foot of Table Mountain in 1652, and the settlement that grew around it became the halfway house of the spice route. The land was already home to the Khoikhoi, and the city's later story — District Six, Robben Island, the 1994 election — is inseparable from apartheid and its dismantling. Table Mountain itself is roughly six times older than the Himalayas.",
    highlights: [
      { title: "Table Mountain cableway", blurb: "Rotating cable car to a flat summit with the whole peninsula below." },
      { title: "Robben Island", blurb: "Ferry to the prison island; tours are led by former political prisoners." },
      { title: "Cape Winelands", blurb: "Stellenbosch and Franschhoek estates, an hour inland." },
    ],
    flights: [
      { id: "f-cpt-1", airline: "Emirates", route: "JFK → DXB → CPT", depart: "23:15", arrive: "16:40 +2", duration: "23h 25m", stops: "1 stop", cabin: "Economy", price: 1080 },
      { id: "f-cpt-2", airline: "Qatar Airways", route: "JFK → DOH → CPT", depart: "20:30", arrive: "14:05 +2", duration: "22h 35m", stops: "1 stop", cabin: "Economy", price: 995 },
    ],
    cars: [
      { id: "c-cpt-1", name: "VW Polo", type: "Compact", pickup: "Cape Town Intl (CPT)", seats: 5, transmission: "Manual", perks: "Unlimited km · Free extra driver", price: 32 },
      { id: "c-cpt-2", name: "Ford Ranger", type: "Pickup 4x4", pickup: "V&A Waterfront", seats: 5, transmission: "Automatic", perks: "Garden Route ready", price: 88 },
    ],
    stays: [
      { id: "h-cpt-1", name: "Camps Bay Beach House", kind: "Villa", area: "Camps Bay", rating: 4.8, perks: "Ocean-front · Private pool", price: 295 },
      { id: "h-cpt-2", name: "The Silo District Hotel", kind: "Design hotel", area: "V&A Waterfront", rating: 4.9, perks: "Rooftop pool · Museum access", price: 380 },
    ],
  },
  {
    id: "rio",
    city: "Rio de Janeiro",
    country: "Brazil",
    image: "/images/dest-rio.jpg",
    tagline: "Beaches, granite peaks and a permanent soundtrack",
    color: "orange",
    vibes: ["Beach", "Music", "Carnival"],
    bestTime: "December – March",
    currency: "BRL (R$)",
    language: "Portuguese",
    avgDaily: 105,
    history:
      "Portuguese sailors entered the bay in January 1502 and mistook it for a river mouth — Rio de Janeiro, 'January River'. It was Brazil's capital for nearly two centuries and briefly the seat of the entire Portuguese empire when the court fled Napoleon in 1808. Samba was born in its hillside neighbourhoods in the early 1900s, and Christ the Redeemer has watched over the whole thing since 1931.",
    highlights: [
      { title: "Christ the Redeemer", blurb: "Cog train up through Tijuca rainforest to the 38-metre statue." },
      { title: "Sugarloaf cable car", blurb: "Two-stage ride best timed for sunset over Guanabara Bay." },
      { title: "Ipanema & Leblon", blurb: "Beach posto culture, sunset applause at Arpoador rock." },
    ],
    flights: [
      { id: "f-rio-1", airline: "LATAM", route: "MIA → GIG", depart: "22:45", arrive: "09:30 +1", duration: "8h 45m", stops: "Nonstop", cabin: "Economy", price: 620 },
      { id: "f-rio-2", airline: "American Airlines", route: "JFK → GIG", depart: "21:50", arrive: "10:15 +1", duration: "9h 25m", stops: "Nonstop", cabin: "Premium", price: 1420 },
    ],
    cars: [
      { id: "c-rio-1", name: "Chevrolet Onix", type: "Compact", pickup: "Galeão Airport (GIG)", seats: 5, transmission: "Automatic", perks: "Toll tag included", price: 34 },
      { id: "c-rio-2", name: "Private driver, full day", type: "Chauffeur", pickup: "Hotel lobby", seats: 4, transmission: "Automatic", perks: "8 hours · English speaking", price: 160 },
    ],
    stays: [
      { id: "h-rio-1", name: "Copacabana Palace", kind: "Historic hotel", area: "Copacabana", rating: 4.9, perks: "1923 landmark · Beachfront pool", price: 520 },
      { id: "h-rio-2", name: "Ipanema Surf Loft", kind: "Apartment", area: "Ipanema", rating: 4.5, perks: "Two blocks from the sand", price: 140 },
    ],
  },
  {
    id: "bali",
    city: "Bali",
    country: "Indonesia",
    image: "/images/dest-bali.jpg",
    tagline: "Rice terraces, temples and volcanic sunrises",
    color: "emerald",
    vibes: ["Wellness", "Surf", "Nature"],
    bestTime: "April – October",
    currency: "IDR (Rp)",
    language: "Balinese, Indonesian",
    avgDaily: 75,
    history:
      "When Islam spread through Java in the 15th and 16th centuries, the Hindu Majapahit court and its priests, artists and architects moved east to Bali — which is why the island is still Hindu in a mostly Muslim country. The subak irrigation cooperatives that carve the rice terraces have been run by farmer-priests since the 9th century and are now UNESCO-listed as a living cultural landscape.",
    highlights: [
      { title: "Tegallalang terraces", blurb: "Subak-fed rice steps best seen just after sunrise." },
      { title: "Mount Batur sunrise trek", blurb: "Two-hour night hike up an active volcano for the cloud-sea view." },
      { title: "Uluwatu temple", blurb: "Clifftop temple, kecak fire dance at dusk." },
    ],
    flights: [
      { id: "f-bal-1", airline: "Singapore Airlines", route: "SFO → SIN → DPS", depart: "01:10", arrive: "13:55 +2", duration: "22h 45m", stops: "1 stop", cabin: "Economy", price: 1020 },
      { id: "f-bal-2", airline: "Qatar Airways", route: "LAX → DOH → DPS", depart: "16:25", arrive: "23:10 +2", duration: "24h 45m", stops: "1 stop", cabin: "Economy", price: 960 },
    ],
    cars: [
      { id: "c-bal-1", name: "Toyota Avanza", type: "Small MPV", pickup: "Ngurah Rai Airport (DPS)", seats: 7, transmission: "Manual", perks: "Cheap · Good for families", price: 22 },
      { id: "c-bal-2", name: "Scooter + helmets", type: "Scooter", pickup: "Canggu, delivered", seats: 2, transmission: "Automatic", perks: "Delivered to your villa", price: 7 },
    ],
    stays: [
      { id: "h-bal-1", name: "Ubud Jungle Villas", kind: "Villa resort", area: "Ubud", rating: 4.8, perks: "Private pool · Yoga deck", price: 190 },
      { id: "h-bal-2", name: "Canggu Surf Retreat", kind: "Resort", area: "Canggu", rating: 4.6, perks: "Board rental · Beach club access", price: 95 },
    ],
  },
];
