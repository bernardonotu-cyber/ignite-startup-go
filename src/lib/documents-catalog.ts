export type PassportService = {
  id: string;
  name: string;
  blurb: string;
  processing: string;
  validity: string;
  price: number;
  documents: string[];
  accent: "sunset" | "lagoon" | "grape" | "mango" | "leaf";
};

export type VisaOption = {
  id: string;
  destinationId: string;
  country: string;
  type: "Tourist e-Visa" | "Visa on arrival" | "Sticker visa" | "Visa-free";
  stay: string;
  processing: string;
  fee: number;
  entries: string;
  documents: string[];
  note: string;
};

export const PASSPORT_SERVICES: PassportService[] = [
  {
    id: "pp-new",
    name: "New passport application",
    blurb: "First-time applicants — we prep the forms, book the appointment and track it to delivery.",
    processing: "4 – 6 weeks",
    validity: "10 years",
    price: 185,
    accent: "lagoon",
    documents: [
      "Birth certificate (original)",
      "Government-issued photo ID",
      "2 recent passport photos",
      "Proof of address",
    ],
  },
  {
    id: "pp-renew",
    name: "Passport renewal",
    blurb: "Expiring soon? Renew by mail with a guided checklist and status tracking.",
    processing: "3 – 4 weeks",
    validity: "10 years",
    price: 140,
    accent: "grape",
    documents: ["Current or recently expired passport", "2 recent passport photos", "Name-change document (if any)"],
  },
  {
    id: "pp-express",
    name: "Express / expedited",
    blurb: "Trip in a hurry — priority handling, courier both ways and a dedicated case agent.",
    processing: "5 – 8 business days",
    validity: "10 years",
    price: 310,
    accent: "sunset",
    documents: ["Proof of travel (ticket or itinerary)", "Current passport or birth certificate", "2 recent passport photos"],
  },
  {
    id: "pp-child",
    name: "Child passport (under 16)",
    blurb: "Both-parent consent handled, with appointment slots that fit school hours.",
    processing: "4 – 6 weeks",
    validity: "5 years",
    price: 160,
    accent: "mango",
    documents: ["Child's birth certificate", "Both parents' IDs", "Parental consent form", "2 child passport photos"],
  },
  {
    id: "pp-lost",
    name: "Lost or stolen replacement",
    blurb: "Report, invalidate and replace — including emergency travel documents if you're abroad.",
    processing: "2 – 3 weeks",
    validity: "10 years",
    price: 225,
    accent: "leaf",
    documents: ["Police report", "Photo ID", "Statement of loss form", "2 recent passport photos"],
  },
];

export const VISA_OPTIONS: VisaOption[] = [
  {
    id: "visa-santorini-1",
    destinationId: "santorini",
    country: "Greece (Schengen)",
    type: "Sticker visa",
    stay: "Up to 90 days in any 180",
    processing: "15 – 20 days",
    fee: 90,
    entries: "Multiple entry",
    documents: ["Schengen application form", "Travel insurance (€30,000 cover)", "Hotel bookings", "Bank statements (3 months)", "Return flight reservation"],
    note: "Many nationalities are visa-exempt for short stays but will need ETIAS pre-authorisation.",
  },
  {
    id: "visa-santorini-2",
    destinationId: "santorini",
    country: "Greece (Schengen)",
    type: "Visa-free",
    stay: "90 days",
    processing: "ETIAS approval in minutes",
    fee: 0,
    entries: "Multiple entry",
    documents: ["Valid passport (3+ months beyond stay)", "ETIAS travel authorisation"],
    note: "For passports on the Schengen visa-exempt list. No embassy visit needed.",
  },
  {
    id: "visa-tokyo-1",
    destinationId: "tokyo",
    country: "Japan",
    type: "Tourist e-Visa",
    stay: "Up to 90 days",
    processing: "5 – 7 days",
    fee: 45,
    entries: "Single entry",
    documents: ["Passport bio page scan", "Daily itinerary", "Proof of funds", "Return ticket"],
    note: "Issued electronically — print the approval or keep it on your phone.",
  },
  {
    id: "visa-tokyo-2",
    destinationId: "tokyo",
    country: "Japan",
    type: "Visa-free",
    stay: "90 days",
    processing: "Immediate at immigration",
    fee: 0,
    entries: "Single entry",
    documents: ["Valid passport", "Onward or return ticket"],
    note: "Applies to visa-exempt nationalities; landing card completed on arrival.",
  },
  {
    id: "visa-marrakech-1",
    destinationId: "marrakech",
    country: "Morocco",
    type: "Visa-free",
    stay: "90 days",
    processing: "Immediate at immigration",
    fee: 0,
    entries: "Multiple entry",
    documents: ["Passport valid 6+ months", "Accommodation address"],
    note: "Most European, North and South American passports enter without a visa.",
  },
  {
    id: "visa-marrakech-2",
    destinationId: "marrakech",
    country: "Morocco",
    type: "Tourist e-Visa",
    stay: "30 days",
    processing: "3 – 5 days",
    fee: 40,
    entries: "Single entry",
    documents: ["Passport scan", "Passport photo", "Hotel or riad confirmation", "Return ticket"],
    note: "For nationalities not on the visa-exempt list.",
  },
  {
    id: "visa-capetown-1",
    destinationId: "capetown",
    country: "South Africa",
    type: "Tourist e-Visa",
    stay: "Up to 90 days",
    processing: "7 – 10 days",
    fee: 38,
    entries: "Single entry",
    documents: ["Passport with 2 blank pages", "Proof of accommodation", "Bank statements", "Return ticket"],
    note: "Children travelling need an unabridged birth certificate.",
  },
  {
    id: "visa-capetown-2",
    destinationId: "capetown",
    country: "South Africa",
    type: "Visa-free",
    stay: "90 days",
    processing: "Immediate at immigration",
    fee: 0,
    entries: "Multiple entry",
    documents: ["Passport valid 30 days beyond stay", "2 blank passport pages"],
    note: "Applies to visa-exempt passports including US, UK and most EU countries.",
  },
  {
    id: "visa-rio-1",
    destinationId: "rio",
    country: "Brazil",
    type: "Tourist e-Visa",
    stay: "90 days",
    processing: "5 – 8 days",
    fee: 81,
    entries: "Multiple entry",
    documents: ["Passport scan", "Digital photo", "Proof of funds", "Itinerary or return ticket"],
    note: "Fully online — approval arrives by email as a PDF.",
  },
  {
    id: "visa-rio-2",
    destinationId: "rio",
    country: "Brazil",
    type: "Visa-free",
    stay: "90 days",
    processing: "Immediate at immigration",
    fee: 0,
    entries: "Multiple entry",
    documents: ["Passport valid 6+ months", "Proof of onward travel"],
    note: "For EU, UK and most South American passports.",
  },
  {
    id: "visa-bali-1",
    destinationId: "bali",
    country: "Indonesia",
    type: "Visa on arrival",
    stay: "30 days (extendable once)",
    processing: "At the airport counter",
    fee: 35,
    entries: "Single entry",
    documents: ["Passport valid 6+ months", "Return ticket", "Customs declaration QR"],
    note: "Can be pre-paid online as e-VOA to skip the airport queue.",
  },
  {
    id: "visa-bali-2",
    destinationId: "bali",
    country: "Indonesia",
    type: "Tourist e-Visa",
    stay: "60 days",
    processing: "4 – 6 days",
    fee: 110,
    entries: "Single entry",
    documents: ["Passport scan", "Photo", "Proof of funds ($2,000)", "Accommodation booking"],
    note: "Best for longer stays and digital-nomad style trips.",
  },
];

export const VISA_STEPS = [
  { title: "Pick your service", body: "Choose a passport tier or the visa that matches your destination." },
  { title: "Send your documents", body: "Upload scans from your phone — we check them before submission." },
  { title: "Track the status", body: "Live updates from submission to approval, right in your basket." },
  { title: "Receive and travel", body: "Courier delivery for passports, e-mail for e-visas. Then pack." },
];
