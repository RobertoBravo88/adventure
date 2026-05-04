// ===== TRIP DATA =====

const TRIP = {
  title: "Adventure",
  destination: "Poland · Rome · Florence",
  dates: "May 13 – 25, 2026",
  message: "A wedding, two cities, and the open road — every moment with you is the best part of the trip ♡",

  days: [
    {
      id: 1,
      title: "Drive to Eibergen",
      date: "Wed, May 13",
      city: null,
      activities: [
        { id: 1, type: "car",   name: "Drive after work to Rekken", detail: "Heading to the Netherlands ♡", liked: false },
        { id: 2, type: "sleep", name: "Stay with Robert's brother", detail: "Eibergen — home base for the night", liked: false },
      ]
    },
    {
      id: 2,
      title: "Road Trip to Wrocław",
      date: "Thu, May 14",
      city: null,
      activities: [
        { id: 3, type: "car",   name: "Drive Eibergen → Wrocław", detail: "With Robert's brother — long drive, good vibes", liked: false },
        { id: 4, type: "sleep", name: "Hotel in Wrocław", detail: "Details to be added", liked: false },
      ]
    },
    {
      id: 3,
      title: "Arrive at the Wedding Venue",
      date: "Fri, May 15",
      city: null,
      activities: [
        { id: 5, type: "car",      name: "Drive Wrocław → Wedding Venue", detail: "Wrocławska 111, 55-114 Pierwoszów · 30 min north of Wrocław", liked: false },
        { id: 6, type: "sleep",    name: "Check in at venue from 15:00", detail: "Collect keys at reception", liked: false },
        { id: 7, type: "activity", name: "Explore the venue & countryside", detail: "Enjoy the calm before the celebration ♡", liked: false },
      ]
    },
    {
      id: 4,
      title: "Joanna & Eric's Wedding 🎉",
      date: "Sat, May 16",
      city: null,
      activities: [
        { id: 8,  type: "ceremony", name: "15:50 — Take your seats", detail: "Ceremony behind the main building", liked: false },
        { id: 9,  type: "ceremony", name: "16:00 — Wedding Ceremony", detail: "Joanna & Eric exchange vows", liked: true },
        { id: 10, type: "food",     name: "17:00 — Wedding Dinner", detail: "Recharge and enjoy a lovely meal together", liked: false },
        { id: 11, type: "food",     name: "18:30 — Wedding Cake", detail: "Watch them cut the cake", liked: false },
        { id: 12, type: "party",    name: "19:00 – 04:00 — Party!", detail: "Dance until your feet hurt", liked: true },
        { id: 13, type: "note",     name: "Dress code: Tenue de Ville", detail: "Suit with tie · Cocktail dress or pant suit", liked: false },
      ]
    },
    {
      id: 5,
      title: "Recovery Day",
      date: "Sun, May 17",
      city: null,
      activities: [
        { id: 14, type: "food",     name: "09:00 – 11:00 — Wedding Breakfast", detail: "Stories and laughter from the night before ♡", liked: false },
        { id: 15, type: "note",     name: "Check out by 11:30", detail: "Pack the night before if possible", liked: false },
        { id: 16, type: "activity", name: "Relax, recover, reminisce", detail: "Take it slow today — you earned it", liked: true },
      ]
    },
    {
      id: 6,
      title: "Fly to Rome ✈️",
      date: "Mon, May 18",
      city: null,
      activities: [
        { id: 17, type: "flight", name: "FR2113 · Wrocław → Rome Ciampino", detail: "Departs 11:15 · Arrives 13:15 · Booking: J6K6FX", liked: false },
        { id: 18, type: "sleep",  name: "Check in — The Social Hub Rome", detail: "Viale dello Scalo San Lorenzo, 10, 00185 · From 15:00", liked: false },
      ]
    },
    {
      id: 7,
      title: "Rome — Day 1",
      date: "Tue, May 19",
      city: "rome",
      activities: []
    },
    {
      id: 8,
      title: "Rome — Day 2",
      date: "Wed, May 20",
      city: "rome",
      activities: []
    },
    {
      id: 9,
      title: "Rome → Florence 🚂",
      date: "Thu, May 21",
      city: "rome",
      activities: [
        { id: 19, type: "note",   name: "Check out The Social Hub", detail: "Check-out by 12:00 — store luggage at reception if needed", liked: false },
        { id: 20, type: "train",  name: "Train Roma Termini → Firenze SMN", detail: "Frecciarossa · ~1h 40min · Book at Trenitalia.com", liked: false },
        { id: 21, type: "sleep",  name: "Check in — Hotel Palazzo Borghini", detail: "Via Vincenzo Borghini, 23, 50133 Florence · From 15:00", liked: false },
      ]
    },
    {
      id: 10,
      title: "Florence — Day 1",
      date: "Fri, May 22",
      city: "florence",
      activities: []
    },
    {
      id: 11,
      title: "Florence — Day 2",
      date: "Sat, May 23",
      city: "florence",
      activities: []
    },
    {
      id: 12,
      title: "Florence — Day 3",
      date: "Sun, May 24",
      city: "florence",
      activities: []
    },
    {
      id: 13,
      title: "Florence → Bologna → Home ✈️",
      date: "Mon, May 25",
      city: null,
      activities: [
        { id: 22, type: "note",   name: "Check out Hotel Palazzo Borghini", detail: "Check-out 07:00 – 11:00 — early start today", liked: false },
        { id: 23, type: "train",  name: "Train Florence → Bologna Centrale", detail: "Frecciarossa · ~35 min · Book at Trenitalia.com", liked: false },
        { id: 24, type: "flight", name: "FR4863 · Bologna → Brussels Charleroi", detail: "Departs 16:35 · Arrives 18:20 · Booking: T8L9GE", liked: false },
        { id: 25, type: "note",   name: "Home sweet home ♡", detail: "What an adventure — already looking forward to the next one", liked: true },
      ]
    },
  ]
};

// ===== TRANSPORT =====
const TRANSPORT = [
  {
    type: "Flight", icon: "✈️",
    from: "Wrocław", to: "Rome Ciampino",
    details: ["Date: Monday May 18", "Flight: FR2113 (Ryanair)", "Departs: 11:15 WRO · Arrives: 13:15 CIA", "Booking: J6K6FX"],
    trackUrl: "https://www.flightradar24.com/data/flights/fr2113"
  },
  {
    type: "Train", icon: "🚄",
    from: "Rome Termini", to: "Florence SMN",
    details: ["Date: Thursday May 21", "Frecciarossa high-speed", "Journey: ~1h 40min", "Not yet booked — Trenitalia.com"],
    trackUrl: "https://www.trenitalia.com/en.html"
  },
  {
    type: "Train", icon: "🚄",
    from: "Florence SMN", to: "Bologna Centrale",
    details: ["Date: Monday May 25", "Frecciarossa high-speed", "Journey: ~35 min", "Not yet booked — Trenitalia.com"],
    trackUrl: "https://www.trenitalia.com/en.html"
  },
  {
    type: "Flight", icon: "✈️",
    from: "Bologna", to: "Brussels Charleroi",
    details: ["Date: Monday May 25", "Flight: FR4863 (Ryanair)", "Departs: 16:35 BLQ · Arrives: 18:20 CRL", "Booking: T8L9GE"],
    trackUrl: "https://www.flightradar24.com/data/flights/fr4863"
  },
];

// ===== RECOMMENDATIONS =====
const RECOMMENDATIONS = {
  rome: [
    { id: "r1",  category: "sights",     name: "Colosseum & Roman Forum",        detail: "The heart of ancient Rome — book online to skip queues",                rating: 4.7, mapsUrl: "https://www.google.com/maps/search/Colosseum+Rome",                      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/960px-Colosseo_2020.jpg" },
    { id: "r2",  category: "sights",     name: "Pantheon",                        detail: "2,000 years old and perfectly preserved — visit at opening",             rating: 4.8, mapsUrl: "https://www.google.com/maps/search/Pantheon+Rome",                       photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Pantheon_%28Rome%29_-_Right_side_and_front.jpg/960px-Pantheon_%28Rome%29_-_Right_side_and_front.jpg" },
    { id: "r3",  category: "sights",     name: "Vatican Museums & Sistine Chapel", detail: "Book early — the most visited museum in the world",                    rating: 4.7, mapsUrl: "https://www.google.com/maps/search/Vatican+Museums+Rome",              photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Sistina-interno.jpg/960px-Sistina-interno.jpg" },
    { id: "r4",  category: "sights",     name: "St. Peter's Basilica",            detail: "Free entry — climb the dome for panoramic views of Rome",                rating: 4.9, mapsUrl: "https://www.google.com/maps/search/St+Peters+Basilica+Rome",           photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg/960px-Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg" },
    { id: "r5",  category: "sights",     name: "Trevi Fountain at dawn",          detail: "Visit early to avoid the crowds — throw a coin ♡",                      rating: 4.7, mapsUrl: "https://www.google.com/maps/search/Trevi+Fountain+Rome",                photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Trevi_Fountain_-_Roma.jpg/960px-Trevi_Fountain_-_Roma.jpg" },
    { id: "r6",  category: "sights",     name: "Borghese Gallery",                detail: "Bernini sculptures up close — must book weeks ahead",                    rating: 4.7, mapsUrl: "https://www.google.com/maps/search/Borghese+Gallery+Rome",              photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Ingresso_monumentale_di_Villa_Borghese_a_Roma_su_piazzale_Flaminio_2018-02.jpg/960px-Ingresso_monumentale_di_Villa_Borghese_a_Roma_su_piazzale_Flaminio_2018-02.jpg" },
    { id: "r7",  category: "sights",     name: "Castel Sant'Angelo",              detail: "Former papal fortress with great views from the top",                    rating: 4.6, mapsUrl: "https://www.google.com/maps/search/Castel+Sant+Angelo+Rome",            photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Castel_Sant%27_Angelo_Between_Leaves.jpg/960px-Castel_Sant%27_Angelo_Between_Leaves.jpg" },
    { id: "r8",  category: "food",       name: "Cacio e pepe at Da Enzo al 29",   detail: "Classic Roman pasta in the heart of Trastevere",                         rating: 4.5, mapsUrl: "https://www.google.com/maps/search/Da+Enzo+al+29+Rome",                photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Cacio_e_pepe.jpg/960px-Cacio_e_pepe.jpg" },
    { id: "r9",  category: "food",       name: "Supplì Roma",                     detail: "The best Roman street snack — fried rice balls",                         rating: 4.6, mapsUrl: "https://www.google.com/maps/search/Suppli+Roma+Trastevere",             photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Suppl%C3%AC.jpg/960px-Suppl%C3%AC.jpg" },
    { id: "r10", category: "food",       name: "Gelato at Fatamorgana",           detail: "Creative artisan gelato — try the unusual flavours",                     rating: 4.5, mapsUrl: "https://www.google.com/maps/search/Fatamorgana+gelato+Rome+Trastevere",  photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ice_cream_with_whipped_cream%2C_chocolate_syrup%2C_and_a_wafer_%28cropped%29.jpg/960px-Ice_cream_with_whipped_cream%2C_chocolate_syrup%2C_and_a_wafer_%28cropped%29.jpg" },
    { id: "r11", category: "food",       name: "Aperitivo at Campo de' Fiori",    detail: "Lively piazza perfect for evening drinks",                               rating: 4.4, mapsUrl: "https://www.google.com/maps/search/Campo+de+Fiori+Rome",                photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Campo_dei_Fiori.jpg/960px-Campo_dei_Fiori.jpg" },
    { id: "r12", category: "food",       name: "Dinner in Trastevere",            detail: "Most romantic neighbourhood in Rome — perfect for a date night ♡",      rating: 4.7, mapsUrl: "https://www.google.com/maps/search/restaurants+Trastevere+Rome",       photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Santa_Maria_in_Trastevere_fountain.jpg/960px-Santa_Maria_in_Trastevere_fountain.jpg" },
    { id: "r13", category: "experience", name: "Sunset on Janiculum Hill",        detail: "Best panoramic view of Rome — magical at golden hour",                   rating: 4.6, mapsUrl: "https://www.google.com/maps/search/Janiculum+Hill+Rome",               photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Janiculum.jpg/960px-Janiculum.jpg" },
    { id: "r14", category: "experience", name: "Morning espresso at a bar",       detail: "Stand at the bar, order an espresso, live like a Roman",                 rating: 4.5, mapsUrl: "https://www.google.com/maps/search/best+espresso+bar+Rome",            photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tazzina_di_caff%C3%A8_a_Ventimiglia.jpg/960px-Tazzina_di_caff%C3%A8_a_Ventimiglia.jpg" },
    { id: "r15", category: "experience", name: "Explore the Jewish Ghetto",       detail: "Ancient, atmospheric neighbourhood with incredible food",                 rating: 4.5, mapsUrl: "https://www.google.com/maps/search/Jewish+Ghetto+Rome",               photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/ViaRuaInGhettoByRoeslerFranz.jpg/960px-ViaRuaInGhettoByRoeslerFranz.jpg" },
    { id: "r16", category: "experience", name: "Evening stroll along the Tiber",  detail: "Walk from Trastevere to Castel Sant'Angelo at dusk",                     rating: 4.6, mapsUrl: "https://www.google.com/maps/search/Tiber+River+walk+Rome",            photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/PonteSantAngeloRom.jpg/960px-PonteSantAngeloRom.jpg" },
  ],
  florence: [
    { id: "f1",  category: "sights",     name: "Uffizi Gallery",                  detail: "Botticelli's Birth of Venus — book well in advance",                     rating: 4.6, mapsUrl: "https://www.google.com/maps/search/Uffizi+Gallery+Florence",           photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Florence%2C_Italy_-_panoramio_%28125%29.jpg/960px-Florence%2C_Italy_-_panoramio_%28125%29.jpg" },
    { id: "f2",  category: "sights",     name: "Florence Cathedral & Dome Climb", detail: "Brunelleschi's dome — book the climb for breathtaking views",            rating: 4.8, mapsUrl: "https://www.google.com/maps/search/Florence+Cathedral+Duomo",          photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Cattedrale_di_Santa_Maria_del_Fiore_%E2%80%93_Il_Duomo_di_Firenze.jpg/960px-Cattedrale_di_Santa_Maria_del_Fiore_%E2%80%93_Il_Duomo_di_Firenze.jpg" },
    { id: "f3",  category: "sights",     name: "Accademia — Michelangelo's David", detail: "The real thing is absolutely breathtaking — book ahead",                 rating: 4.7, mapsUrl: "https://www.google.com/maps/search/Accademia+Gallery+Florence",       photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/David_at_the_Galleria_dell%27Accademia_%2861351%29.jpg/960px-David_at_the_Galleria_dell%27Accademia_%2861351%29.jpg" },
    { id: "f4",  category: "sights",     name: "Boboli Gardens",                  detail: "Beautiful Renaissance gardens behind Palazzo Pitti",                     rating: 4.6, mapsUrl: "https://www.google.com/maps/search/Boboli+Gardens+Florence",           photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Jard%C3%ADn_de_B%C3%B3boli%2C_Florencia%2C_Italia%2C_2022-09-19%2C_DD_26.jpg/960px-Jard%C3%ADn_de_B%C3%B3boli%2C_Florencia%2C_Italia%2C_2022-09-19%2C_DD_26.jpg" },
    { id: "f5",  category: "sights",     name: "Palazzo Vecchio",                 detail: "The old town hall — great views from the tower",                         rating: 4.6, mapsUrl: "https://www.google.com/maps/search/Palazzo+Vecchio+Florence",           photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Piazza_della_signoria%2C_palazzo_vecchio%2C_veduta_01.jpg/960px-Piazza_della_signoria%2C_palazzo_vecchio%2C_veduta_01.jpg" },
    { id: "f6",  category: "food",       name: "Bistecca Fiorentina — Il Latini", detail: "The iconic Florentine T-bone in a legendary trattoria",                  rating: 4.3, mapsUrl: "https://www.google.com/maps/search/Il+Latini+Florence",                photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Bistecca_alla_fiorentina-01.jpg/960px-Bistecca_alla_fiorentina-01.jpg" },
    { id: "f7",  category: "food",       name: "Mercato Centrale lunch",          detail: "The best food market in Florence — incredible variety",                  rating: 4.5, mapsUrl: "https://www.google.com/maps/search/Mercato+Centrale+Florence",         photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Cacio_e_pepe.jpg/960px-Cacio_e_pepe.jpg" },
    { id: "f8",  category: "food",       name: "Gelato at Gelateria dei Neri",    detail: "Local favourite on Via dei Neri — try the ricotta and fig",              rating: 4.5, mapsUrl: "https://www.google.com/maps/search/Gelateria+dei+Neri+Florence",       photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ice_cream_with_whipped_cream%2C_chocolate_syrup%2C_and_a_wafer_%28cropped%29.jpg/960px-Ice_cream_with_whipped_cream%2C_chocolate_syrup%2C_and_a_wafer_%28cropped%29.jpg" },
    { id: "f9",  category: "food",       name: "Aperitivo in Oltrarno",           detail: "The artisan quarter across the river — cool local bars",                 rating: 4.6, mapsUrl: "https://www.google.com/maps/search/aperitivo+bars+Oltrarno+Florence",  photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Palazzo_Pitti_nel_tardo_pomeriggio.jpg/960px-Palazzo_Pitti_nel_tardo_pomeriggio.jpg" },
    { id: "f10", category: "food",       name: "Lampredotto sandwich",            detail: "Classic Florentine street food — adventurous and delicious",             rating: 4.5, mapsUrl: "https://www.google.com/maps/search/lampredotto+Florence+street+food",  photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Lampredotto_2.jpg/960px-Lampredotto_2.jpg" },
    { id: "f11", category: "experience", name: "Sunset at Piazzale Michelangelo", detail: "The most beautiful view of Florence — go early for a spot ♡",           rating: 4.8, mapsUrl: "https://www.google.com/maps/search/Piazzale+Michelangelo+Florence",   photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/FirenzeDec092023_01.jpg/960px-FirenzeDec092023_01.jpg" },
    { id: "f12", category: "experience", name: "Ponte Vecchio at dawn",           detail: "The famous bridge without the crowds — truly magical",                   rating: 4.7, mapsUrl: "https://www.google.com/maps/search/Ponte+Vecchio+Florence",            photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Ponte_Vecchio_from_Ponte_alle_Grazie.jpg/960px-Ponte_Vecchio_from_Ponte_alle_Grazie.jpg" },
    { id: "f13", category: "experience", name: "Day trip to Fiesole",             detail: "Hilltop village 20 min by bus — stunning valley views",                  rating: 4.6, mapsUrl: "https://www.google.com/maps/search/Fiesole+Florence",                  photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/FiesoleDec102023_15.jpg/960px-FiesoleDec102023_15.jpg" },
    { id: "f14", category: "experience", name: "Artisan workshops in Oltrarno",   detail: "Leatherwork, gold jewellery, bookbinding — unique to Florence",          rating: 4.6, mapsUrl: "https://www.google.com/maps/search/artisan+workshops+Oltrarno+Florence", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Leather_working_tools_%28DSC08329%29.jpg/960px-Leather_working_tools_%28DSC08329%29.jpg" },
    { id: "f15", category: "experience", name: "Walk across Ponte Santa Trinita", detail: "Less touristy than Ponte Vecchio — beautiful views along the Arno",      rating: 4.6, mapsUrl: "https://www.google.com/maps/search/Ponte+Santa+Trinita+Florence",      photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Ponte_Santa_Trinita_seen_from_Ponte_Vecchio.jpg/960px-Ponte_Santa_Trinita_seen_from_Ponte_Vecchio.jpg" },
  ]
};

// ===== STATE =====
let currentDayId = null;
let nextActivityId = 200;
let discoverCity = "rome";
let discoverCategory = "all";
let dayRecCategory = "all";

let likedRecs = new Set();
let addedRecs = {};
let customRecs = [];

// ===== FIREBASE =====
firebase.initializeApp({
  apiKey: "AIzaSyBg7HQAAJu-yJeTQYQqiVZyFj4pvPodY00",
  authDomain: "adventure-e81b9.firebaseapp.com",
  databaseURL: "https://adventure-e81b9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "adventure-e81b9",
  storageBucket: "adventure-e81b9.firebasestorage.app",
  messagingSenderId: "710419058727",
  appId: "1:710419058727:web:a3e6117cd13ceb5321fe02"
});
const db = firebase.database();
const tripRef = db.ref('trip');

function saveLikedRecs() {
  tripRef.child('likedRecs').set([...likedRecs]);
}

function saveAddedRecs() {
  tripRef.child('addedRecs').set(addedRecs);
}

function saveDayState() {
  const state = {};
  TRIP.days.forEach(day => { state[day.id] = day.activities; });
  tripRef.child('dayState').set(state);
}

function applyDayState(state) {
  if (!state) return;
  TRIP.days.forEach(day => {
    const saved = state[day.id] || state[String(day.id)];
    if (saved) day.activities = saved;
  });
  const all = Object.values(state).flat().filter(Boolean);
  if (all.length) {
    const maxId = Math.max(0, ...all.map(a => a.id || 0));
    if (maxId >= nextActivityId) nextActivityId = maxId + 1;
  }
}

function refreshCurrentScreen() {
  const active = document.querySelector('.screen.active');
  if (!active) return;
  const id = active.id;
  if (id === 'itinerary-screen') renderItinerary();
  if (id === 'discover-screen') renderDiscoverScreen();
  if (id === 'day-detail-screen') {
    const day = TRIP.days.find(d => d.id === currentDayId);
    if (day) renderDayDetail(day);
  }
}

function initFirebase() {
  tripRef.child('likedRecs').on('value', snap => {
    likedRecs = new Set(snap.val() || []);
    refreshCurrentScreen();
  });
  tripRef.child('addedRecs').on('value', snap => {
    addedRecs = snap.val() || {};
    refreshCurrentScreen();
  });
  tripRef.child('dayState').on('value', snap => {
    applyDayState(snap.val());
    refreshCurrentScreen();
  });
  tripRef.child('notes').on('value', snap => {
    const el = document.getElementById('shared-notes');
    if (el && document.activeElement !== el) el.value = snap.val() || '';
  });
  tripRef.child('customRecs').on('value', snap => {
    customRecs = snap.val() ? Object.values(snap.val()) : [];
    refreshCurrentScreen();
  });
}

function findRec(recId) {
  for (const city of ['rome', 'florence']) {
    const rec = RECOMMENDATIONS[city]?.find(r => r.id === recId);
    if (rec) return { rec, city };
  }
  const custom = customRecs.find(r => r.id === recId);
  if (custom) return { rec: custom, city: custom.city };
  return null;
}

function getAllRecs(city) {
  return [...(RECOMMENDATIONS[city] || []), ...customRecs.filter(r => r.city === city)];
}

// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');

  if (screenId === 'discover-screen') renderDiscoverScreen();
  if (screenId === 'itinerary-screen') renderItinerary();

  // Sync nav active state
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const map = {
    'itinerary-screen': 'Itinerary',
    'day-detail-screen': 'Itinerary',
    'discover-screen': 'Discover',
    'transport-screen': 'Transport',
    'notes-screen': 'Notes',
  };
  const label = map[screenId];
  if (label) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      if (btn.textContent.trim().startsWith(label)) btn.classList.add('active');
    });
  }
}

// ===== OPEN DAY =====
function openDay(dayId) {
  currentDayId = dayId;
  dayRecCategory = 'all';
  const day = TRIP.days.find(d => d.id === dayId);
  if (!day) return;
  document.getElementById('day-detail-title').textContent = `Day ${day.id}`;
  renderDayDetail(day);
  showScreen('day-detail-screen');
}

// ===== RENDER ITINERARY =====
function renderItinerary() {
  document.getElementById('welcome-destination').textContent = TRIP.destination;
  document.getElementById('welcome-dates').textContent = TRIP.dates;
  document.getElementById('welcome-message').textContent = `"${TRIP.message}"`;
  document.getElementById('summary-destination').textContent = TRIP.destination;
  document.getElementById('summary-days').textContent = TRIP.days.length;

  const container = document.getElementById('days-container');
  container.innerHTML = '';

  const sections = [
    {
      label: 'The Wedding', sublabel: 'Poland · May 13–17', dayIds: [1, 2, 3, 4, 5],
      photo: 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?q=80&w=1587&auto=format&fit=crop'
    },
    {
      label: 'Rome', sublabel: 'Italy · May 18–21', dayIds: [6, 7, 8, 9],
      photo: 'https://plus.unsplash.com/premium_photo-1675975706513-9daba0ec12a8?q=80&w=1740&auto=format&fit=crop'
    },
    {
      label: 'Florence', sublabel: 'Italy · May 22–25', dayIds: [10, 11, 12, 13],
      photo: 'https://plus.unsplash.com/premium_photo-1676288635850-cd91d5b2a3af?q=80&w=1587&auto=format&fit=crop'
    },
  ];

  let currentGroup = null;

  TRIP.days.forEach(day => {
    const section = sections.find(s => s.dayIds[0] === day.id);
    if (section) {
      const header = document.createElement('div');
      header.className = 'itinerary-section-header';
      header.innerHTML = `
        <div class="section-hero-photo" style="background-image:url('${section.photo}')"></div>
        <div class="section-hero-content">
          <div class="section-hero-label">Chapter</div>
          <div class="section-hero-title">${section.label}</div>
          <div class="section-hero-days">${section.sublabel}</div>
        </div>
      `;
      container.appendChild(header);
      currentGroup = document.createElement('div');
      currentGroup.className = 'day-cards-group';
      container.appendChild(currentGroup);
    }

    const likedCount = day.activities.filter(a => a.liked).length;
    const hasRecs = day.city !== null;
    const preview = day.activities.length > 0 ? day.activities[0].name : (hasRecs ? 'Tap to discover things to do ✨' : 'No activities yet');

    const card = document.createElement('div');
    card.className = 'day-card';
    card.onclick = () => openDay(day.id);
    card.innerHTML = `
      <div class="day-card-top">
        <span class="day-number">Day ${day.id}</span>
        <span class="day-date">${day.date}</span>
      </div>
      <div class="day-title">${day.title}</div>
      <div class="day-preview">
        <span>${preview}</span>
        <span class="activity-count">${day.activities.length} items${likedCount ? ` · ${likedCount} ♡` : ''}${hasRecs ? ' · ✨' : ''}</span>
      </div>
    `;
    (currentGroup || container).appendChild(card);
  });
}

// ===== RENDER DAY DETAIL =====
function renderDayDetail(day) {
  const content = document.getElementById('day-detail-content');
  content.innerHTML = '';

  // Hero
  const hero = document.createElement('div');
  hero.className = 'day-hero';
  hero.innerHTML = `
    <div class="day-hero-label">Day ${day.id} of ${TRIP.days.length}</div>
    <div class="day-hero-title">${day.title}</div>
    <div class="day-hero-date">${day.date}</div>
  `;
  content.appendChild(hero);

  // Activities
  if (day.activities.length > 0) {
    const label = document.createElement('p');
    label.className = 'section-label';
    label.textContent = 'Plan';
    label.style.padding = '0 16px';
    content.appendChild(label);

    const list = document.createElement('div');
    list.className = 'activities-list';
    list.style.padding = '0 16px';

    day.activities.forEach(activity => {
      const item = document.createElement('div');
      item.className = 'activity-item';
      item.innerHTML = `
        <span class="activity-icon">${typeIcon(activity.type)}</span>
        <div class="activity-body">
          <div class="activity-name">${activity.name}</div>
          ${activity.detail ? `<div class="activity-detail">${activity.detail}</div>` : ''}
          ${activity.mapsUrl ? `<a href="${activity.mapsUrl}" target="_blank" class="maps-link" style="font-size:11px;margin-top:3px;display:inline-block">View on Maps ↗</a>` : ''}
        </div>
        <div class="activity-actions">
          <button class="like-btn ${activity.liked ? 'liked' : ''}" onclick="toggleLike(${day.id}, ${activity.id})">♡</button>
          <button class="delete-btn" onclick="deleteActivity(${day.id}, ${activity.id})">✕</button>
        </div>
      `;
      list.appendChild(item);
    });
    content.appendChild(list);
  } else if (!day.city) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.style.padding = '32px 16px';
    empty.innerHTML = `<div class="empty-state-icon">✨</div><div class="empty-state-text">Nothing planned yet — add something below!</div>`;
    content.appendChild(empty);
  }

  // Recommendations strip (city days only)
  const recSection = document.getElementById('day-rec-section');
  if (day.city) {
    recSection.style.display = 'block';
    document.getElementById('day-rec-label').textContent =
      `Discover ${day.city === 'rome' ? 'Rome' : 'Florence'}`;
    renderDayRecFilters(day);
    renderDayRecStrip(day);
  } else {
    recSection.style.display = 'none';
  }
}

// ===== DAY REC FILTERS =====
function renderDayRecFilters(day) {
  const filtersEl = document.getElementById('day-rec-filters');
  filtersEl.innerHTML = '';
  const categories = ['all', 'sights', 'food', 'experience'];
  const labels = { all: 'All', sights: 'Sights', food: 'Food', experience: 'Experiences' };

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${dayRecCategory === cat ? 'active' : ''}`;
    btn.textContent = labels[cat];
    btn.onclick = () => { dayRecCategory = cat; renderDayRecFilters(day); renderDayRecStrip(day); };
    filtersEl.appendChild(btn);
  });
}

// ===== DAY REC STRIP =====
function renderDayRecStrip(day) {
  const strip = document.getElementById('day-rec-strip');
  strip.innerHTML = '';

  const recs = RECOMMENDATIONS[day.city] || [];
  const filtered = dayRecCategory === 'all' ? recs : recs.filter(r => r.category === dayRecCategory);

  if (filtered.length === 0) {
    strip.innerHTML = `<p style="font-size:13px;color:var(--mid-gray);padding:8px 0">Nothing in this category yet.</p>`;
    return;
  }

  filtered.forEach(rec => {
    const isAdded = (addedRecs[rec.id] || []).includes(day.id);
    const isLiked = likedRecs.has(rec.id);

    const card = document.createElement('div');
    card.className = 'rec-strip-card';
    const photoUrl = rec.photo || '';
    card.innerHTML = `
      ${photoUrl ? `<img class="rec-strip-photo" src="${photoUrl}" alt="${rec.name}" onerror="this.style.display='none'">` : ''}
      <div class="rec-strip-inner">
        <div class="rec-strip-name">${rec.name}</div>
        <div class="rec-strip-detail">${rec.detail}</div>
        <div class="rec-strip-rating">${renderStars(rec.rating)}</div>
        <a href="${rec.mapsUrl}" target="_blank" class="rec-strip-maps">Maps ↗</a>
        <div class="rec-strip-actions">
          <button class="rec-strip-like ${isLiked ? 'liked' : ''}" onclick="toggleRecLike('${rec.id}', this)">♡</button>
          <button class="rec-strip-add ${isAdded ? 'added' : ''}" onclick="addRecToCurrentDay('${rec.id}', this)">
            ${isAdded ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>
    `;
    strip.appendChild(card);
  });
}

// ===== ADD REC TO CURRENT DAY =====
function addRecToCurrentDay(recId, btn) {
  if (!currentDayId) return;
  const day = TRIP.days.find(d => d.id === currentDayId);
  const found = findRec(recId);
  if (!found || !day) return;
  const { rec } = found;

  // Prevent duplicate
  if (day.activities.some(a => a.recId === recId)) {
    showToast('Already on this day!');
    return;
  }

  day.activities.push({
    id: nextActivityId++,
    recId,
    type: rec.category === 'food' ? 'food' : 'activity',
    name: rec.name,
    detail: rec.detail,
    liked: false
  });

  // Track in addedRecs
  if (!addedRecs[recId]) addedRecs[recId] = [];
  if (!addedRecs[recId].includes(currentDayId)) addedRecs[recId].push(currentDayId);
  saveAddedRecs();

  // Update button
  btn.textContent = '✓ Added';
  btn.classList.add('added');

  saveDayState();
  renderDayDetail(day);
  showToast(`Added to Day ${day.id} ✓`);
}

// ===== DISCOVER SCREEN =====
function setDiscoverCity(city, el) {
  discoverCity = city;
  discoverCategory = 'all';
  document.querySelectorAll('.city-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderDiscoverScreen();
}

function renderDiscoverScreen() {
  renderDiscoverFilters();
  renderDiscoverList();
  updateLikedBanner();
}

function renderDiscoverFilters() {
  const filtersEl = document.getElementById('discover-filters');
  filtersEl.innerHTML = '';
  const categories = ['all', 'sights', 'food', 'experience', 'liked', 'added'];
  const labels = { all: 'All', sights: 'Sights', food: 'Food', experience: 'Experiences', liked: '♡ Saved', added: '✓ Added' };

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${discoverCategory === cat ? 'active' : ''}`;
    btn.textContent = labels[cat];
    btn.onclick = () => { discoverCategory = cat; renderDiscoverFilters(); renderDiscoverList(); };
    filtersEl.appendChild(btn);
  });
}

function renderDiscoverList() {
  const list = document.getElementById('discover-list');
  list.innerHTML = '';

  let recs;
  if (discoverCategory === 'liked') {
    const all = [...(RECOMMENDATIONS.rome || []), ...(RECOMMENDATIONS.florence || []), ...customRecs];
    recs = all.filter(r => likedRecs.has(r.id));
  } else if (discoverCategory === 'added') {
    const all = [...(RECOMMENDATIONS.rome || []), ...(RECOMMENDATIONS.florence || []), ...customRecs];
    recs = all.filter(r => (addedRecs[r.id] || []).length > 0);
  } else {
    const all = getAllRecs(discoverCity);
    recs = discoverCategory === 'all' ? all : all.filter(r => r.category === discoverCategory);
  }

  if (recs.length === 0) {
    const msg = discoverCategory === 'liked' ? 'Nothing saved yet — tap ♡ on any place to save it' :
                discoverCategory === 'added' ? 'Nothing added to days yet' : 'No places here yet';
    list.innerHTML = `<div class="empty-state" style="padding:40px 20px"><div class="empty-state-text">${msg}</div></div>`;
    return;
  }

  recs.forEach(rec => {
    const isLiked = likedRecs.has(rec.id);
    const isCustom = rec.custom === true;
    const addedDays = (addedRecs[rec.id] || []).map(dayId => {
      const day = TRIP.days.find(d => d.id === dayId);
      return day ? `Day ${day.id}` : null;
    }).filter(Boolean);

    const card = document.createElement('div');
    card.className = 'rec-card';
    const photoUrl = rec.photo || '';
    card.innerHTML = `
      ${photoUrl ? `<img class="rec-photo" src="${photoUrl}" alt="${rec.name}" onerror="this.style.display='none'">` : ''}
      <div class="rec-card-inner">
        <div class="rec-body">
          <div class="rec-name">${rec.name}${isCustom ? ' <span class="custom-badge">yours</span>' : ''}</div>
          <div class="rec-detail">${rec.detail || ''}</div>
          <div class="rec-meta">
            ${rec.rating ? renderStars(rec.rating) : ''}
            ${rec.mapsUrl ? `<a href="${rec.mapsUrl}" target="_blank" class="maps-link">View on Maps ↗</a>` : ''}
          </div>
          ${addedDays.length ? `<div class="rec-added-to">Added to: ${addedDays.join(', ')}</div>` : ''}
        </div>
        <div class="rec-actions">
          <button class="rec-like-btn ${isLiked ? 'liked' : ''}" onclick="toggleRecLike('${rec.id}', this)">♡</button>
          <button class="rec-add-btn" onclick="openAddToDay('${rec.id}')">+ Add</button>
          ${isCustom ? `<button class="rec-delete-btn" onclick="deleteCustomRec('${rec.id}')">✕</button>` : ''}
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

function updateLikedBanner() {
  const banner = document.getElementById('liked-banner');
  const count = document.getElementById('liked-count');
  if (likedRecs.size > 0) {
    banner.style.display = 'block';
    count.textContent = likedRecs.size;
  } else {
    banner.style.display = 'none';
  }
}

// ===== TOGGLE REC LIKE =====
function toggleRecLike(recId, btn) {
  if (likedRecs.has(recId)) {
    likedRecs.delete(recId);
    btn.classList.remove('liked');
  } else {
    likedRecs.add(recId);
    btn.classList.add('liked');
    showToast('Saved ♡');
  }
  saveLikedRecs();
  updateLikedBanner();
}

// ===== ADD TO DAY MODAL (from Discover screen) =====
let modalRecId = null;

function openAddToDay(recId) {
  modalRecId = recId;
  const found = findRec(recId);
  if (!found) return;
  const { rec, city } = found;

  document.getElementById('modal-rec-name').textContent = rec.name;

  const relevantDays = TRIP.days.filter(d => d.city === city);
  const modalDays = document.getElementById('modal-days');
  modalDays.innerHTML = '';

  relevantDays.forEach(day => {
    const isAdded = (addedRecs[recId] || []).includes(day.id);
    const btn = document.createElement('button');
    btn.className = 'modal-day-btn';
    btn.disabled = isAdded;
    btn.style.opacity = isAdded ? '0.5' : '1';
    btn.innerHTML = `
      <span>${day.title} ${isAdded ? '✓' : ''}</span>
      <span class="modal-day-date">${day.date}</span>
    `;
    if (!isAdded) {
      btn.onclick = () => addRecFromModal(recId, day.id, rec);
    }
    modalDays.appendChild(btn);
  });

  document.getElementById('modal-overlay').style.display = 'flex';
}

function addRecFromModal(recId, dayId, rec) {
  const day = TRIP.days.find(d => d.id === dayId);
  if (!day) return;

  if (day.activities.some(a => a.recId === recId)) {
    showToast('Already on this day!');
    return;
  }

  day.activities.push({
    id: nextActivityId++,
    recId,
    type: rec.category === 'food' ? 'food' : 'activity',
    name: rec.name,
    detail: rec.detail,
    liked: false
  });

  if (!addedRecs[recId]) addedRecs[recId] = [];
  addedRecs[recId].push(dayId);
  saveAddedRecs();

  saveDayState();
  closeModal();
  renderDiscoverList();
  showToast(`Added to Day ${day.id} ✓`);
}

function closeModal() {
  document.getElementById('modal-overlay').style.display = 'none';
  modalRecId = null;
}

// ===== ADD / DELETE CUSTOM REC =====
function addCustomRec() {
  const name = document.getElementById('new-rec-name').value.trim();
  const detail = document.getElementById('new-rec-detail').value.trim();
  const mapsUrl = document.getElementById('new-rec-maps').value.trim() || null;
  const category = document.getElementById('new-rec-category').value;
  if (!name) { showToast('Add a name first'); return; }
  const id = `custom_${Date.now()}`;
  tripRef.child(`customRecs/${id}`).set({ id, city: discoverCity, category, name, detail, mapsUrl, custom: true });
  document.getElementById('new-rec-name').value = '';
  document.getElementById('new-rec-detail').value = '';
  document.getElementById('new-rec-maps').value = '';
  showToast('Place added ✓');
}

function deleteCustomRec(id) {
  tripRef.child(`customRecs/${id}`).remove();
  if (addedRecs[id]) { delete addedRecs[id]; saveAddedRecs(); }
  if (likedRecs.has(id)) { likedRecs.delete(id); saveLikedRecs(); }
  showToast('Removed');
}

// ===== GOOGLE MAPS URL PARSER =====
function parseMapsUrl(url) {
  try {
    const placeMatch = url.match(/\/maps\/place\/([^/@?#]+)/);
    if (placeMatch) return decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')).replace(/_/g, ' ');
    const searchMatch = url.match(/\/maps\/search\/([^/@?#]+)/);
    if (searchMatch) return decodeURIComponent(searchMatch[1].replace(/\+/g, ' '));
    const qMatch = url.match(/[?&]q=([^&]+)/);
    if (qMatch) return decodeURIComponent(qMatch[1].replace(/\+/g, ' '));
  } catch(e) {}
  return null;
}

// ===== ADD CUSTOM ACTIVITY =====
function addActivity() {
  const input = document.getElementById('new-activity-input');
  const typeSelect = document.getElementById('new-activity-type');
  const raw = input.value.trim();
  if (!raw) { showToast('Please type something first'); return; }

  const day = TRIP.days.find(d => d.id === currentDayId);
  if (!day) return;

  let name = raw;
  let mapsUrl = null;

  if (raw.includes('google.com/maps') || raw.includes('maps.google.com') || raw.includes('goo.gl/maps')) {
    const extracted = parseMapsUrl(raw);
    name = extracted || 'Place from Maps';
    mapsUrl = raw;
  }

  day.activities.push({ id: nextActivityId++, type: typeSelect.value, name, detail: '', mapsUrl, liked: false });
  input.value = '';
  saveDayState();
  renderDayDetail(day);
  renderItinerary();
  showToast(mapsUrl ? `"${name}" added from Maps ✓` : 'Added ✓');
}

// ===== TOGGLE LIKE (itinerary item) =====
function toggleLike(dayId, activityId) {
  const day = TRIP.days.find(d => d.id === dayId);
  const activity = day?.activities.find(a => a.id === activityId);
  if (!activity) return;
  activity.liked = !activity.liked;
  saveDayState();
  renderDayDetail(day);
  if (activity.liked) showToast('Loved it ♡');
}

// ===== DELETE ACTIVITY =====
function deleteActivity(dayId, activityId) {
  const day = TRIP.days.find(d => d.id === dayId);
  if (!day) return;
  const act = day.activities.find(a => a.id === activityId);
  // Clean up addedRecs tracking if it came from a recommendation
  if (act?.recId) {
    if (addedRecs[act.recId]) {
      addedRecs[act.recId] = addedRecs[act.recId].filter(id => id !== dayId);
      saveAddedRecs();
    }
  }
  day.activities = day.activities.filter(a => a.id !== activityId);
  saveDayState();
  renderDayDetail(day);
  renderItinerary();
  showToast('Removed');
}

// ===== TRANSPORT =====
function renderTransport() {
  const container = document.getElementById('transport-content');
  container.innerHTML = '';

  TRANSPORT.forEach(t => {
    const card = document.createElement('div');
    card.className = 'transport-card';
    card.innerHTML = `
      <div class="transport-type">${t.icon} ${t.type}</div>
      <div class="transport-route">
        <span class="transport-city">${t.from}</span>
        <span class="transport-arrow">——→</span>
        <span class="transport-city">${t.to}</span>
      </div>
      <div class="transport-meta">${t.details.map(d => `<span>· ${d}</span>`).join('')}</div>
      <a href="${t.trackUrl}" target="_blank" class="live-status-btn">🔴 Check live status</a>
    `;
    container.appendChild(card);
  });
}

// ===== NOTES =====
function renderNotes() {
  document.getElementById('personal-message-display').textContent = TRIP.message;
  // notes textarea populated by Firebase listener
}

function saveNotes() {
  tripRef.child('notes').set(document.getElementById('shared-notes').value);
  showToast('Notes saved ✓');
}

// ===== STAR RATING =====
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = (rating % 1) >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return `<span class="stars-wrap"><span class="stars-filled">${'★'.repeat(full)}${half ? '½' : ''}</span><span class="stars-empty">${'★'.repeat(empty)}</span> <span class="rating-num">${rating}</span></span>`;
}

// ===== ACTIVITY ICON =====
function typeIcon(type) {
  const icons = {
    flight:   '✈️',
    train:    '🚄',
    car:      '🚗',
    sleep:    '🔑',
    food:     '🍴',
    activity: '📍',
    ceremony: '💍',
    party:    '🎉',
    note:     '💬',
    // legacy fallbacks
    transport: '✈️',
    hotel:     '🔑',
  };
  return icons[type] || '📍';
}

// ===== TOAST =====
let toastTimeout;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initFirebase();
  renderItinerary();
  renderTransport();
  renderNotes();

  document.getElementById('new-activity-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') addActivity();
  });
});
