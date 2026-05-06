// ===== INSTALL PROMPT =====
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
});

function shouldShowInstall() {
  if (localStorage.getItem('adventure_install_shown')) return false;
  if (window.navigator.standalone) return false; // already installed on iOS
  if (window.matchMedia('(display-mode: standalone)').matches) return false; // already installed
  return true;
}

function showInstallPrompt() {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /android/i.test(navigator.userAgent);

  if (isIOS) {
    document.getElementById('install-steps-ios').style.display = 'flex';
  } else if (deferredInstallPrompt) {
    document.getElementById('install-btn').style.display = 'block';
  } else if (isAndroid) {
    document.getElementById('install-steps-android').style.display = 'flex';
  } else {
    skipInstall(); return;
  }
  showScreen('install-screen');
}

async function triggerInstall() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  skipInstall();
}

function skipInstall() {
  localStorage.setItem('adventure_install_shown', '1');
  showScreen('welcome-screen');
}

// ===== PASSWORD =====
const PASSWORD = 'Neo';

function checkPassword() {
  const input = document.getElementById('password-input').value;
  const error = document.getElementById('password-error');
  if (input === PASSWORD) {
    localStorage.setItem('adventure_unlocked', '1');
    if (shouldShowInstall()) { showInstallPrompt(); } else { showScreen('welcome-screen'); }
  } else {
    error.textContent = 'Try again ♡';
    document.getElementById('password-input').value = '';
    document.getElementById('password-input').focus();
  }
}

function migrateActivityTimes() {
  tripRef.child('activityTimesMigrated').once('value', snap => {
    if (snap.val()) return;
    // Patches: { activityId: { name, time?, detail? } }
    const patches = {
      6:  { name: 'Check in at venue',        time: '15:00' },
      8:  { name: 'Take your seats',           time: '15:50' },
      9:  { name: 'Wedding Ceremony',          time: '16:00' },
      10: { name: 'Wedding Dinner',            time: '17:00' },
      11: { name: 'Wedding Cake',              time: '18:30' },
      12: { name: 'Party!',                    time: '19:00', detail: 'Dance until your feet hurt — until 04:00' },
      14: { name: 'Wedding Breakfast',         time: '09:00' },
      15: { name: 'Check out',                 detail: 'Pack the night before if possible — by 11:30' },
      17: { time: '11:15' },
      24: { time: '16:35' },
    };
    tripRef.child('dayState').once('value', snap => {
      const state = snap.val();
      if (!state) { tripRef.child('activityTimesMigrated').set(true); return; }
      let changed = false;
      Object.keys(state).forEach(dayKey => {
        const acts = state[dayKey];
        if (!Array.isArray(acts)) return;
        acts.forEach((act, i) => {
          const patch = patches[act.id];
          if (!patch) return;
          Object.assign(acts[i], patch);
          changed = true;
        });
      });
      if (changed) tripRef.child('dayState').set(state);
      tripRef.child('activityTimesMigrated').set(true);
    });
  });
}

function seedNotes() {
  tripRef.child('notesSeeded').once('value', snap => {
    if (snap.val()) return;
    const notes = [
      { id: 'note_seed_checkout_florence', title: 'Check out Hotel Palazzo Borghini', body: 'Check-out 07:00 – 11:00 — early start today', linkedDays: [13] },
      { id: 'note_seed_home',              title: 'Home sweet home ♡',                body: 'What an adventure — already looking forward to the next one', linkedDays: [13] },
    ];
    const now = Date.now();
    notes.forEach(n => {
      tripRef.child(`notesList/${n.id}`).set({ ...n, createdAt: now, updatedAt: now });
    });
    tripRef.child('notesSeeded').set(true);
  });
}

function initPasswordCheck() {
  if (localStorage.getItem('adventure_unlocked') === '1') {
    showScreen('welcome-screen');
  }
  // otherwise password-screen stays active (it's the default)
}

// ===== TRIP DATA =====

const TRIP = {
  title: "Adventure",
  destination: "Poland · Rome · Florence",
  dates: "May 13 – 25, 2026",
  message: "A wedding, two cities, and you and me. Let's go on our own adventure ♡",

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
        { id: 6, type: "sleep",    name: "Check in at venue", detail: "Collect keys at reception", time: "15:00", liked: false },
        { id: 7, type: "activity", name: "Explore the venue & countryside", detail: "Enjoy the calm before the celebration ♡", liked: false },
      ]
    },
    {
      id: 4,
      title: "Joanna & Eric's Wedding 🎉",
      date: "Sat, May 16",
      city: null,
      activities: [
        { id: 8,  type: "ceremony", name: "Take your seats", detail: "Ceremony behind the main building", time: "15:50", liked: false },
        { id: 9,  type: "ceremony", name: "Wedding Ceremony", detail: "Joanna & Eric exchange vows", time: "16:00", liked: true },
        { id: 10, type: "food",     name: "Wedding Dinner", detail: "Recharge and enjoy a lovely meal together", time: "17:00", liked: false },
        { id: 11, type: "food",     name: "Wedding Cake", detail: "Watch them cut the cake", time: "18:30", liked: false },
        { id: 12, type: "party",    name: "Party!", detail: "Dance until your feet hurt — until 04:00", time: "19:00", liked: true },
        { id: 13, type: "note",     name: "Dress code: Tenue de Ville", detail: "Suit with tie · Cocktail dress or pant suit", liked: false },
      ]
    },
    {
      id: 5,
      title: "Recovery Day",
      date: "Sun, May 17",
      city: null,
      activities: [
        { id: 14, type: "food",     name: "Wedding Breakfast", detail: "Stories and laughter from the night before ♡", time: "09:00", liked: false },
        { id: 15, type: "note",     name: "Check out", detail: "Pack the night before if possible — by 11:30", liked: false },
        { id: 16, type: "activity", name: "Relax, recover, reminisce", detail: "Take it slow today — you earned it", liked: true },
      ]
    },
    {
      id: 6,
      title: "Fly to Rome ✈️",
      date: "Mon, May 18",
      city: null,
      activities: [
        { id: 17, type: "flight", name: "FR2113 · Wrocław → Rome Ciampino", detail: "Departs 11:15 · Arrives 13:15 · Booking: J6K6FX", time: "11:15", liked: false },
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
        { id: 23, type: "train",  name: "Train Florence → Bologna Centrale", detail: "Frecciarossa · ~35 min · Book at Trenitalia.com", liked: false },
        { id: 24, type: "flight", name: "FR4863 · Bologna → Brussels Charleroi", detail: "Departs 16:35 · Arrives 18:20 · Booking: T8L9GE", time: "16:35", liked: false },
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

// ===== MAP COORDINATES =====
const REC_COORDS = {
  // Rome
  r1:  [41.8902, 12.4922],
  r2:  [41.8986, 12.4769],
  r3:  [41.9065, 12.4535],
  r4:  [41.9022, 12.4539],
  r5:  [41.9009, 12.4833],
  r6:  [41.9143, 12.4922],
  r7:  [41.9031, 12.4663],
  r8:  [41.8876, 12.4706],
  r9:  [41.8885, 12.4702],
  r10: [41.8897, 12.4694],
  r11: [41.8954, 12.4723],
  r12: [41.8893, 12.4698],
  r13: [41.8924, 12.4614],
  r14: [41.8990, 12.4775],
  r15: [41.8937, 12.4795],
  r16: [41.9027, 12.4660],
  // Florence
  f1:  [43.7677, 11.2553],
  f2:  [43.7733, 11.2560],
  f3:  [43.7766, 11.2586],
  f4:  [43.7647, 11.2499],
  f5:  [43.7694, 11.2558],
  f6:  [43.7706, 11.2481],
  f7:  [43.7763, 11.2531],
  f8:  [43.7680, 11.2577],
  f9:  [43.7655, 11.2492],
  f10: [43.7759, 11.2527],
  f11: [43.7629, 11.2652],
  f12: [43.7680, 11.2531],
  f13: [43.8072, 11.2938],
  f14: [43.7650, 11.2488],
  f15: [43.7683, 11.2502],
};

const DAY_COLORS = {
  7:  '#E8725D',
  8:  '#E8C05D',
  9:  '#6EB5E8',
  10: '#5DE8C0',
  11: '#88E85D',
  12: '#C85DE8',
};
const DISCOVER_COLOR = '#C9A84C';
const HOTEL_COLOR = '#F2E8D5';

const MAP_HOTELS = {
  rome: [
    { name: 'The Social Hub Rome', detail: 'Viale dello Scalo San Lorenzo, 10, 00185 · Check-in from 15:00 · Check-out by 12:00', latlng: [41.8956, 12.5057], mapsUrl: 'https://www.google.com/maps/search/The+Social+Hub+Rome+Viale+dello+Scalo+San+Lorenzo' },
  ],
  florence: [
    { name: 'Hotel Palazzo Borghini', detail: 'Via Vincenzo Borghini, 23, 50133 Florence · Check-in from 15:00 · Check-out 07:00–11:00', latlng: [43.7827, 11.2622], mapsUrl: 'https://www.google.com/maps/search/Hotel+Palazzo+Borghini+Florence+Via+Vincenzo+Borghini' },
  ],
};

const CITY_CENTERS = {
  rome:     { latlng: [41.9009, 12.4783], zoom: 14 },
  florence: { latlng: [43.7696, 11.2558], zoom: 15 },
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
let customRecsMap = {};
let trashedItems = {};
let editingActivity = null;
let notesList = {};
let noteSortBy = 'date';
let noteSortDir = 'desc';
let currentNoteId = null;
let noteLinkModalNoteId = null;
let pendingLinkedDays = [];
let journalEntries = {};
let currentJournalDayId = null;
let journalTempPhoto = null;
let noteEditorOrigin = 'notes-screen';
let mapCity = 'rome';
let leafletMap = null;
let mapMarkers = [];
let mapFilter = new Set(['7','8','9','10','11','12','discover','hotel']);

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
  if (id === 'notes-screen') renderNotesList();
  if (id === 'trash-screen') renderTrashScreen();
  if (id === 'map-screen' && leafletMap) renderMapMarkers(mapCity);
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
  tripRef.child('journal').on('value', snap => {
    journalEntries = snap.val() || {};
    refreshCurrentScreen();
  });
  tripRef.child('customRecs').on('value', snap => {
    customRecs = snap.val() ? Object.values(snap.val()) : [];
    customRecsMap = {};
    customRecs.forEach(r => { customRecsMap[r.id] = r; });
    refreshCurrentScreen();
  });
  tripRef.child('trash').on('value', snap => {
    trashedItems = snap.val() || {};
    if (document.querySelector('.screen.active')?.id === 'trash-screen') renderTrashScreen();
  });
  tripRef.child('notesList').on('value', snap => {
    notesList = snap.val() || {};
    if (document.querySelector('.screen.active')?.id === 'notes-screen') renderNotesList();
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
  if (screenId === 'notes-screen') renderNotesList();
  if (screenId === 'trash-screen') renderTrashScreen();
  if (screenId === 'highlights-screen') renderHighlights();
  if (screenId === 'map-screen') showMapScreen();
  if (screenId === 'day-detail-screen' && currentDayId) {
    const day = TRIP.days.find(d => d.id === currentDayId);
    if (day) renderDayDetail(day);
  }

  // Close map popup when leaving map screen
  if (screenId !== 'map-screen') closeMapPopup();

  // Sync nav active state
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const map = {
    'itinerary-screen': 'Itinerary',
    'day-detail-screen': 'Itinerary',
    'discover-screen': 'Discover',
    'transport-screen': 'Transport',
    'notes-screen': 'Notes',
    'map-screen': 'Map',
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
function getTripCountdown() {
  const start = new Date('2026-05-13T00:00:00');
  const now = new Date(); now.setHours(0,0,0,0);
  const diff = Math.round((start - now) / (1000*60*60*24));
  if (diff > 1) return `${diff} days to go ✈`;
  if (diff === 1) return `Tomorrow it begins ✈`;
  if (diff === 0) return `Today is the day ✈`;
  const dayNum = Math.round((now - start) / (1000*60*60*24)) + 1;
  if (dayNum <= 13) return `Day ${dayNum} of the adventure`;
  return `What an adventure ♡`;
}

function renderItinerary() {
  document.getElementById('welcome-destination').textContent = TRIP.destination;
  document.getElementById('welcome-dates').textContent = TRIP.dates;
  document.getElementById('welcome-message').textContent = `"${TRIP.message}"`;
  const countdownEl = document.getElementById('welcome-countdown');
  if (countdownEl) countdownEl.textContent = getTripCountdown();
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
    const planActivities = day.activities.filter(a => a.type !== 'note');
    const previewAct = planActivities.length > 0 ? planActivities[0] : null;
    const preview = previewAct
      ? previewAct.name
      : (hasRecs ? 'Tap to start planning ✨' : (day.activities.length > 0 ? day.activities[0].name : 'Tap to start planning ✨'));
    const countLabel = planActivities.length > 0
      ? `${planActivities.length} items${likedCount ? ` · ${likedCount} ♡` : ''}${hasRecs ? ' · ✨' : ''}`
      : (hasRecs ? '✨ Discover' : '');

    const journal = journalEntries[day.id];
    const hasJournalPhoto = journal?.photo;

    const card = document.createElement('div');
    card.className = 'day-card' + (hasJournalPhoto ? ' has-journal-photo' : '');
    card.onclick = () => openDay(day.id);
    card.innerHTML = `
      ${hasJournalPhoto ? `<div class="day-card-photo-bg" style="background-image:url('${hasJournalPhoto}')"></div>` : ''}
      <div class="day-card-top">
        <span class="day-number">Day ${day.id}</span>
        <span class="day-date">${day.date}</span>
      </div>
      <div class="day-title">${day.title}</div>
      <div class="day-preview">
        <span>${preview}</span>
        ${countLabel ? `<span class="activity-count">${countLabel}</span>` : ''}
      </div>
      ${journal ? `<div class="day-card-memory-badge">◈ Memory</div>` : ''}
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

  const planActivities = day.activities.filter(a => a.type !== 'note');
  const noteActivities = day.activities.filter(a => a.type === 'note');
  const linkedNotes = getLinkedNotes(day.id);

  // ── Plan section ──
  if (planActivities.length > 0) {
    const label = document.createElement('p');
    label.className = 'section-label';
    label.textContent = 'Plan';
    label.style.padding = '0 16px';
    content.appendChild(label);

    const list = document.createElement('div');
    list.className = 'activities-list';
    list.style.padding = '0 16px';

    planActivities.forEach(activity => {
      const recInfo = activity.recId ? findRec(activity.recId) : null;
      const recRating = recInfo?.rec?.rating || null;
      const mapsUrl = activity.mapsUrl || recInfo?.rec?.mapsUrl || null;

      const item = document.createElement('div');
      item.className = 'activity-item';
      item.dataset.activityId = activity.id;
      item.innerHTML = `
        <div class="drag-handle" title="Hold to reorder">⠿</div>
        <span class="activity-icon">${typeIcon(activity.type)}</span>
        <div class="activity-body">
          <div class="activity-name activity-name-btn" onclick="openActivityEdit(${day.id}, ${activity.id})">${activity.name}</div>
          ${activity.detail ? `<div class="activity-detail">${activity.detail}</div>` : ''}
          ${recRating ? `<div class="activity-rating">${renderStars(recRating)}</div>` : ''}
          ${mapsUrl ? `<a href="${mapsUrl}" target="_blank" class="activity-maps-link">View on Maps ↗</a>` : ''}
          <input type="time" class="activity-time-input" value="${activity.time || ''}" onchange="updateActivityTime(${day.id}, ${activity.id}, this.value)" />
        </div>
        <div class="activity-actions">
          <button class="like-btn ${activity.liked ? 'liked' : ''}" onclick="toggleLike(${day.id}, ${activity.id})">♡</button>
          <button class="delete-btn" onclick="deleteActivity(${day.id}, ${activity.id})">✕</button>
        </div>
      `;
      list.appendChild(item);
    });
    content.appendChild(list);
    initDragDrop(list, day);
  } else if (!day.city && noteActivities.length === 0 && linkedNotes.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.style.padding = '32px 16px';
    empty.innerHTML = `<div class="empty-state-icon">✨</div><div class="empty-state-text">Nothing planned yet — add something below!</div>`;
    content.appendChild(empty);
  }

  // ── Notes section ──
  if (noteActivities.length > 0 || linkedNotes.length > 0) {
    const notesSection = document.createElement('div');
    notesSection.className = 'day-notes-section';

    const notesLabel = document.createElement('p');
    notesLabel.className = 'section-label';
    notesLabel.textContent = 'Notes';
    notesLabel.style.padding = '0 16px';
    notesSection.appendChild(notesLabel);

    const notesList_el = document.createElement('div');
    notesList_el.className = 'activities-list';
    notesList_el.style.padding = '0 16px';

    noteActivities.forEach(activity => {
      const item = document.createElement('div');
      item.className = 'activity-item';
      item.dataset.activityId = activity.id;
      item.innerHTML = `
        <span class="activity-icon">○</span>
        <div class="activity-body">
          <div class="activity-name activity-name-btn" onclick="openActivityEdit(${day.id}, ${activity.id})">${activity.name}</div>
          ${activity.detail ? `<div class="activity-detail">${activity.detail}</div>` : ''}
        </div>
        <div class="activity-actions">
          <button class="delete-btn" onclick="deleteActivity(${day.id}, ${activity.id})">✕</button>
        </div>
      `;
      notesList_el.appendChild(item);
    });

    linkedNotes.forEach(note => {
      const preview = (note.body || '').split('\n')[0].substring(0, 60);
      const item = document.createElement('div');
      item.className = 'activity-item';
      item.innerHTML = `
        <span class="activity-icon">○</span>
        <div class="activity-body">
          <div class="activity-name activity-name-btn" onclick="openNote('${note.id}')">${note.title || 'Untitled'}</div>
          ${preview ? `<div class="activity-detail">${preview}</div>` : ''}
        </div>
        <div class="activity-actions">
          <button class="delete-btn" onclick="unlinkNoteFromDay('${note.id}', ${day.id})">✕</button>
        </div>
      `;
      notesList_el.appendChild(item);
    });

    notesSection.appendChild(notesList_el);
    content.appendChild(notesSection);
  }

  // Journal / memory section
  renderJournalSection(day);

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

  const recs = getAllRecs(day.city);
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
  const isCrossCity = discoverCategory === 'liked' || discoverCategory === 'added';
  document.querySelectorAll('.city-tab').forEach(tab => {
    tab.classList.toggle('city-tab-dimmed', isCrossCity);
  });
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
  if (!banner || !count) return;
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
  noteLinkModalNoteId = null;
  const found = findRec(recId);
  if (!found) return;
  const { rec, city } = found;

  document.getElementById('modal-rec-name').textContent = rec.name;
  document.getElementById('modal-label').textContent = 'Add to which day?';

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
async function fetchPhotoForPlace(name) {
  if (!name) return null;
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.thumbnail?.source || null;
  } catch { return null; }
}

async function addCustomRec() {
  const name = document.getElementById('new-rec-name').value.trim();
  const detail = document.getElementById('new-rec-detail').value.trim();
  let mapsUrl = document.getElementById('new-rec-maps').value.trim() || null;
  const category = document.getElementById('new-rec-category').value;
  const city = document.getElementById('new-rec-city').value;
  if (!name) { showToast('Add a name first'); return; }

  if (mapsUrl && isShortMapLink(mapsUrl)) {
    showToast('Resolving Maps link…');
    mapsUrl = await resolveShortMapUrl(mapsUrl);
  }

  const id = `custom_${Date.now()}`;
  let photo = null;

  if (mapsUrl) {
    showToast('Adding place...');
    const searchName = parseMapsUrl(mapsUrl) || name;
    photo = await fetchPhotoForPlace(searchName);
    if (!photo) photo = await fetchPhotoForPlace(name);
  }

  const rec = { id, city, category, name, detail, mapsUrl, custom: true };
  if (photo) rec.photo = photo;
  tripRef.child(`customRecs/${id}`).set(rec);
  document.getElementById('new-rec-name').value = '';
  document.getElementById('new-rec-detail').value = '';
  document.getElementById('new-rec-maps').value = '';
  showToast(photo ? 'Place added with photo ✓' : 'Place added ✓');
}

function deleteCustomRec(id) {
  const rec = customRecsMap[id] || customRecs.find(r => r.id === id);
  if (rec) moveToTrash('customRec', rec);
  tripRef.child(`customRecs/${id}`).remove();
  if (addedRecs[id]) { delete addedRecs[id]; saveAddedRecs(); }
  if (likedRecs.has(id)) { likedRecs.delete(id); saveLikedRecs(); }
  showToast('Moved to trash');
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
function onActivityTypeChange(select) {
  const noteArea = document.getElementById('new-activity-note');
  const mapsInput = document.getElementById('new-activity-maps');
  const input = document.getElementById('new-activity-input');
  if (select.value === 'note') {
    noteArea.style.display = 'block';
    if (mapsInput) mapsInput.style.display = 'none';
    input.placeholder = 'Note title (optional)';
  } else {
    noteArea.style.display = 'none';
    noteArea.value = '';
    if (mapsInput) mapsInput.style.display = 'block';
    input.placeholder = 'e.g. Dinner somewhere special';
  }
}

async function addActivity() {
  const input = document.getElementById('new-activity-input');
  const typeSelect = document.getElementById('new-activity-type');
  const noteArea = document.getElementById('new-activity-note');
  const mapsInput = document.getElementById('new-activity-maps');
  const raw = input.value.trim();
  const isNote = typeSelect.value === 'note';
  const noteBody = noteArea ? noteArea.value.trim() : '';
  const mapsRaw = mapsInput ? mapsInput.value.trim() : '';

  if (!raw && !noteBody) { showToast('Please type something first'); return; }

  const day = TRIP.days.find(d => d.id === currentDayId);
  if (!day) return;

  let name = raw || 'Note';
  let mapsUrl = mapsRaw || null;
  let detail = isNote ? noteBody : '';

  // Legacy: if name field itself is a Maps URL, treat it as such
  if (!mapsUrl && !isNote && (raw.includes('google.com/maps') || raw.includes('maps.google.com') || raw.includes('maps.app.goo.gl') || raw.includes('goo.gl/maps'))) {
    const extracted = parseMapsUrl(raw);
    name = extracted || 'Place from Maps';
    mapsUrl = raw;
  }

  if (mapsUrl && isShortMapLink(mapsUrl)) {
    showToast('Resolving Maps link…');
    mapsUrl = await resolveShortMapUrl(mapsUrl);
  }

  day.activities.push({ id: nextActivityId++, type: typeSelect.value, name, detail, mapsUrl, liked: false });
  input.value = '';
  if (noteArea) { noteArea.value = ''; noteArea.style.display = 'none'; }
  if (mapsInput) { mapsInput.value = ''; mapsInput.style.display = 'none'; }
  input.placeholder = 'e.g. Dinner somewhere special';
  typeSelect.value = 'activity';
  saveDayState();
  renderDayDetail(day);
  renderItinerary();
  showToast(mapsUrl ? `"${name}" added ✓` : 'Added ✓');
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
  if (!act) return;
  if (act.recId && addedRecs[act.recId]) {
    addedRecs[act.recId] = addedRecs[act.recId].filter(id => id !== dayId);
    saveAddedRecs();
  }
  moveToTrash('activity', act, { dayId, dayTitle: day.title });
  day.activities = day.activities.filter(a => a.id !== activityId);
  saveDayState();
  renderDayDetail(day);
  renderItinerary();
  showToast('Moved to trash');
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
      <a href="${t.trackUrl}" target="_blank" class="live-status-btn"><span class="live-dot"></span>Check live status</a>
    `;
    container.appendChild(card);
  });
}

// ===== TRASH =====
function moveToTrash(type, item, extra = {}) {
  const id = `trash_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
  tripRef.child(`trash/${id}`).set({ id, type, item, ...extra, deletedAt: Date.now(), label: item.name || item.title || 'Item' });
}

function restoreFromTrash(trashId) {
  const entry = trashedItems[trashId];
  if (!entry) return;
  if (entry.type === 'activity') {
    const day = TRIP.days.find(d => d.id === entry.dayId);
    if (day) { day.activities.push(entry.item); saveDayState(); showToast('Activity restored'); }
    else showToast('Day no longer exists');
  } else if (entry.type === 'customRec') {
    tripRef.child(`customRecs/${entry.item.id}`).set(entry.item);
    showToast('Place restored');
  } else if (entry.type === 'note') {
    tripRef.child(`notesList/${entry.item.id}`).set(entry.item);
    showToast('Note restored');
  }
  tripRef.child(`trash/${trashId}`).remove();
}

function emptyTrash() {
  if (!Object.keys(trashedItems).length) return;
  if (confirm('Permanently delete everything in the trash?')) {
    tripRef.child('trash').remove();
    showToast('Trash emptied');
  }
}

function renderTrashScreen() {
  const content = document.getElementById('trash-content');
  const items = Object.values(trashedItems).sort((a, b) => b.deletedAt - a.deletedAt);
  if (items.length === 0) {
    content.innerHTML = `<div class="empty-state" style="padding:60px 20px"><div class="empty-state-icon">⊘</div><div class="empty-state-text">Trash is empty</div></div>`;
    return;
  }
  content.innerHTML = '';
  const emptyBtn = document.createElement('button');
  emptyBtn.className = 'btn-secondary';
  emptyBtn.textContent = 'Empty trash';
  emptyBtn.style.cssText = 'margin:16px;width:calc(100% - 32px);display:block';
  emptyBtn.onclick = emptyTrash;
  content.appendChild(emptyBtn);
  items.forEach(entry => {
    const typeLabel = entry.type === 'activity' ? 'Activity' : entry.type === 'customRec' ? 'Place' : 'Note';
    const date = new Date(entry.deletedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const sub = entry.type === 'activity' && entry.dayTitle ? `Day: ${entry.dayTitle}` :
                entry.type === 'customRec' ? `${entry.item?.city || ''} · ${entry.item?.category || ''}` : '';
    const card = document.createElement('div');
    card.className = 'trash-card';
    card.innerHTML = `
      <div class="trash-card-body">
        <div class="trash-type">${typeLabel}</div>
        <div class="trash-name">${entry.label}</div>
        ${sub ? `<div class="trash-sub">${sub}</div>` : ''}
        <div class="trash-date">Deleted ${date}</div>
      </div>
      <button class="btn-secondary small" onclick="restoreFromTrash('${entry.id}')">Restore</button>
    `;
    content.appendChild(card);
  });
}

// ===== NOTES =====
function getLinkedNotes(dayId) {
  return Object.values(notesList).filter(note => (note.linkedDays || []).includes(dayId));
}

function renderNotesList() {
  const container = document.getElementById('notes-list');
  if (!container) return;
  container.innerHTML = '';

  // Pinned message card
  const pinned = document.createElement('div');
  pinned.className = 'note-card special';
  pinned.innerHTML = `<p class="note-label">Message for you ◇</p><p class="note-text">I love you so so much</p>`;
  container.appendChild(pinned);

  let notes = Object.values(notesList);

  notes.sort((a, b) => {
    if (noteSortBy === 'date') return noteSortDir === 'desc' ? b.updatedAt - a.updatedAt : a.updatedAt - b.updatedAt;
    if (noteSortBy === 'title') {
      const cmp = (a.title || '').localeCompare(b.title || '');
      return noteSortDir === 'asc' ? cmp : -cmp;
    }
    if (noteSortBy === 'day') {
      const aDay = Math.min(...(a.linkedDays || []), Infinity);
      const bDay = Math.min(...(b.linkedDays || []), Infinity);
      if (aDay === Infinity && bDay === Infinity) return b.updatedAt - a.updatedAt;
      if (aDay === Infinity) return 1;
      if (bDay === Infinity) return -1;
      return aDay - bDay;
    }
    return 0;
  });

  if (notes.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.style.padding = '30px 20px';
    empty.innerHTML = `<div class="empty-state-text">No notes yet — tap + to add one</div>`;
    container.appendChild(empty);
    return;
  }

  notes.forEach(note => {
    const writtenDate = new Date(note.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const preview = (note.body || '').split('\n')[0].substring(0, 70);
    const linkedDays = (note.linkedDays || [])
      .map(dayId => TRIP.days.find(d => d.id === dayId))
      .filter(Boolean)
      .sort((a, b) => a.id - b.id);

    const card = document.createElement('div');
    card.className = 'note-list-card';
    card.innerHTML = `
      <div class="note-list-content" onclick="openNote('${note.id}')">
        <div class="note-list-title">${note.title || 'Untitled'}</div>
        ${preview ? `<div class="note-list-preview">${preview}</div>` : ''}
        <div class="note-list-meta">
          <span class="note-meta-written">Written ${writtenDate}</span>
          ${linkedDays.length ? `<span class="note-meta-linked">◈ ${linkedDays.map(d => `Day ${d.id}`).join(', ')}</span>` : ''}
        </div>
      </div>
      <div class="note-list-actions">
        <button class="note-delete-btn" onclick="deleteNote('${note.id}')">✕</button>
      </div>
    `;
    container.appendChild(card);
  });
}


function setNoteSort(by, dir) {
  noteSortBy = by; noteSortDir = dir;
  document.querySelectorAll('#notes-sort-bar .filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.sort === `${by}-${dir}`);
  });
  renderNotesList();
}

function openNewNote() {
  noteEditorOrigin = document.querySelector('.screen.active')?.id || 'notes-screen';
  currentNoteId = `note_${Date.now()}`;
  pendingLinkedDays = [];
  document.getElementById('note-title-input').value = '';
  document.getElementById('note-body-input').value = '';
  document.getElementById('note-edit-header').textContent = 'New Note';
  renderNoteLinkedChips(currentNoteId);
  showScreen('note-edit-screen');
}

function openNote(noteId) {
  const note = notesList[noteId];
  if (!note) return;
  noteEditorOrigin = document.querySelector('.screen.active')?.id || 'notes-screen';
  currentNoteId = noteId;
  pendingLinkedDays = [...(note.linkedDays || [])];
  document.getElementById('note-title-input').value = note.title || '';
  document.getElementById('note-body-input').value = note.body || '';
  document.getElementById('note-edit-header').textContent = 'Edit Note';
  renderNoteLinkedChips(noteId);
  showScreen('note-edit-screen');
}

function renderNoteLinkedChips(noteId) {
  const chips = document.getElementById('note-linked-chips');
  if (!chips) return;
  chips.innerHTML = '';
  if (pendingLinkedDays.length === 0) {
    chips.innerHTML = '<span class="note-no-links">Not linked to any day</span>';
    return;
  }
  pendingLinkedDays.forEach(dayId => {
    const day = TRIP.days.find(d => d.id === dayId);
    if (!day) return;
    const chip = document.createElement('span');
    chip.className = 'note-day-chip';
    chip.innerHTML = `Day ${day.id} · ${day.title.split(' — ')[0]} <button onclick="unlinkNoteFromDayInEditor(${day.id})">✕</button>`;
    chips.appendChild(chip);
  });
}

function openNoteDayLinkerFromEditor() {
  if (currentNoteId) openNoteDayLinker(currentNoteId);
}

function unlinkNoteFromDayInEditor(dayId) {
  pendingLinkedDays = pendingLinkedDays.filter(id => id !== dayId);
  renderNoteLinkedChips(currentNoteId);
  // If note is already saved, also update Firebase
  if (notesList[currentNoteId]) unlinkNoteFromDay(currentNoteId, dayId);
}

function saveCurrentNote() {
  if (!currentNoteId) return;
  const title = document.getElementById('note-title-input').value.trim();
  const body = document.getElementById('note-body-input').value;
  if (!title && !body.trim()) { showToast('Nothing to save'); return; }
  const existing = notesList[currentNoteId];
  const note = {
    id: currentNoteId,
    title: title || 'Untitled',
    body,
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now()
  };
  if (pendingLinkedDays.length) note.linkedDays = [...pendingLinkedDays];
  tripRef.child(`notesList/${currentNoteId}`).set(note);
  pendingLinkedDays = [];
  showToast('Note saved ✓');
  showScreen(noteEditorOrigin || 'notes-screen');
}

function closeNoteEditor() { showScreen(noteEditorOrigin || 'notes-screen'); }

function deleteNote(noteId) {
  const note = notesList[noteId];
  if (note) moveToTrash('note', note);
  tripRef.child(`notesList/${noteId}`).remove();
  showToast('Moved to trash');
}

function deleteCurrentNote() {
  if (!currentNoteId) { showScreen('notes-screen'); return; }
  if (!notesList[currentNoteId]) {
    showScreen('notes-screen');
    return;
  }
  deleteNote(currentNoteId);
  showScreen('notes-screen');
}

function openNoteDayLinker(noteId) {
  noteLinkModalNoteId = noteId;
  modalRecId = null;

  const note = notesList[noteId];
  const titleEl = document.getElementById('note-title-input');
  const displayTitle = note?.title || titleEl?.value.trim() || 'Untitled';
  document.getElementById('modal-rec-name').textContent = displayTitle;
  document.getElementById('modal-label').textContent = 'Link to which day?';

  const modalDays = document.getElementById('modal-days');
  modalDays.innerHTML = '';

  TRIP.days.forEach(day => {
    const isLinked = pendingLinkedDays.includes(day.id);
    const btn = document.createElement('button');
    btn.className = 'modal-day-btn';
    if (isLinked) btn.style.opacity = '0.5';
    btn.innerHTML = `
      <span>${day.title}${isLinked ? ' ✓' : ''}</span>
      <span class="modal-day-date">${day.date}</span>
    `;
    if (!isLinked) btn.onclick = () => linkNoteToDay(noteId, day.id);
    modalDays.appendChild(btn);
  });

  document.getElementById('modal-overlay').style.display = 'flex';
}

function linkNoteToDay(noteId, dayId) {
  if (!pendingLinkedDays.includes(dayId)) pendingLinkedDays.push(dayId);
  // If the note already exists in Firebase, persist immediately
  if (notesList[noteId]) {
    tripRef.child(`notesList/${noteId}/linkedDays`).set([...pendingLinkedDays]);
  }
  closeModal();
  const day = TRIP.days.find(d => d.id === dayId);
  showToast(`Linked to Day ${dayId}${day ? ' · ' + day.title.split(' ')[0] : ''} ✓`);
  if (currentNoteId === noteId) renderNoteLinkedChips(noteId);
}

function unlinkNoteFromDay(noteId, dayId) {
  const note = notesList[noteId];
  if (!note) return;
  const linkedDays = (note.linkedDays || []).filter(id => id !== dayId);
  tripRef.child(`notesList/${noteId}/linkedDays`).set(linkedDays.length ? linkedDays : null);
  showToast('Note unlinked');
  const day = TRIP.days.find(d => d.id === dayId);
  if (day) renderDayDetail(day);
  if (currentNoteId === noteId) renderNoteLinkedChips(noteId);
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
    flight:    '✈',
    train:     '◈',
    car:       '◆',
    sleep:     '◇',
    food:      '●',
    activity:  '✦',
    ceremony:  '◆',
    party:     '★',
    note:      '○',
    transport: '✈',
    hotel:     '◇',
  };
  return icons[type] || '✦';
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

// ===== ACTIVITY EDIT =====
function openActivityEdit(dayId, activityId) {
  const day = TRIP.days.find(d => d.id === dayId);
  const act = day?.activities.find(a => a.id === activityId);
  if (!act || !day) return;

  editingActivity = { dayId, activityId };
  const isNote = act.type === 'note';

  const screen = document.getElementById('activity-edit-screen');
  screen.classList.toggle('note-mode', isNote);

  const recInfo = act.recId ? findRec(act.recId) : null;
  const photo = recInfo?.rec?.photo || null;

  const photoBg = document.getElementById('activity-edit-photo-bg');
  const hero = document.getElementById('activity-edit-hero');
  if (photo && !isNote) {
    photoBg.style.backgroundImage = `url('${photo}')`;
    hero.classList.add('has-photo');
  } else {
    photoBg.style.backgroundImage = '';
    hero.classList.remove('has-photo');
  }

  document.getElementById('activity-edit-type-icon').textContent = typeIcon(act.type);
  document.getElementById('activity-edit-day-info').textContent = `${day.date} · ${day.title}`;

  const recRow = document.getElementById('activity-edit-rec-row');
  const starsEl = document.getElementById('activity-edit-stars');
  const mapsEl = document.getElementById('activity-edit-maps');
  const rating = recInfo?.rec?.rating || null;
  starsEl.innerHTML = rating ? renderStars(rating) : '';
  if (act.mapsUrl && !isNote) { mapsEl.href = act.mapsUrl; mapsEl.style.display = 'inline'; } else { mapsEl.style.display = 'none'; }
  recRow.style.display = (!isNote && (rating || act.mapsUrl)) ? 'flex' : 'none';

  document.getElementById('activity-edit-title').value = isNote && act.name === 'Note' ? '' : act.name;
  document.getElementById('activity-edit-title').placeholder = isNote ? 'Title (optional)' : 'Activity name';
  document.getElementById('activity-edit-detail').value = act.detail || '';
  document.getElementById('activity-edit-detail').placeholder = isNote ? 'Write your note here…' : 'Add a note...';
  document.getElementById('activity-edit-time').value = act.time || '';

  showScreen('activity-edit-screen');
}

function closeActivityEdit() {
  showScreen('day-detail-screen');
}

function deleteCurrentActivity() {
  if (!editingActivity) return;
  const { dayId, activityId } = editingActivity;
  editingActivity = null;
  deleteActivity(dayId, activityId);
  showScreen('day-detail-screen');
}

function saveActivityEdit() {
  if (!editingActivity) return;
  const { dayId, activityId } = editingActivity;
  const day = TRIP.days.find(d => d.id === dayId);
  const act = day?.activities.find(a => a.id === activityId);
  if (!act || !day) return;

  const title = document.getElementById('activity-edit-title').value.trim();
  const detail = document.getElementById('activity-edit-detail').value;
  const time = document.getElementById('activity-edit-time').value;

  if (!title) { showToast('Title cannot be empty'); return; }

  act.name = title;
  act.detail = detail;
  if (time) {
    act.time = time;
    sortActivitiesByTime(day);
  } else {
    delete act.time;
  }

  saveDayState();
  showToast('Saved ✓');
  editingActivity = null;
  showScreen('day-detail-screen');
  renderDayDetail(day);
}

// ===== TIME & SORT =====
function updateActivityTime(dayId, activityId, val) {
  const day = TRIP.days.find(d => d.id === dayId);
  const act = day?.activities.find(a => a.id === activityId);
  if (!act) return;
  if (val) {
    act.time = val;
    sortActivitiesByTime(day);
  } else {
    delete act.time;
  }
  saveDayState();
  renderDayDetail(day);
}

function sortActivitiesByTime(day) {
  day.activities.sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time && !b.time) return -1;
    if (!a.time && b.time) return 1;
    return 0;
  });
}

// ===== DRAG & DROP =====
function applyDragTimeRule(day, movedIdx) {
  const item = day.activities[movedIdx];
  if (!item?.time) return;
  const above = day.activities[movedIdx - 1];
  const below = day.activities[movedIdx + 1];
  if ((above?.time && item.time < above.time) || (below?.time && item.time > below.time)) {
    delete item.time;
  }
}

function initDragDrop(listEl, day) {
  let active = null;
  let pressTimer = null;

  listEl.addEventListener('pointerdown', e => {
    const item = e.target.closest('.activity-item');
    if (!item || e.target.closest('button, a, input, select')) return;

    const sx = e.clientX, sy = e.clientY;

    pressTimer = setTimeout(() => {
      const rect = item.getBoundingClientRect();
      const ghost = item.cloneNode(true);
      ghost.className = 'activity-item drag-ghost';
      Object.assign(ghost.style, {
        position: 'fixed', top: rect.top + 'px', left: rect.left + 'px',
        width: rect.width + 'px', zIndex: '999', pointerEvents: 'none',
      });
      document.body.appendChild(ghost);

      const ph = document.createElement('div');
      ph.className = 'drag-placeholder';
      ph.style.height = rect.height + 'px';
      item.after(ph);
      item.classList.add('is-dragging');

      active = { el: item, ghost, ph, offsetY: e.clientY - rect.top };

      document.addEventListener('pointermove', onDragMove, { passive: false });
      document.addEventListener('pointerup', onDragEnd);
      document.addEventListener('pointercancel', onDragCancel);
    }, 450);

    const cancelTimer = ev => {
      if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 10) {
        clearTimeout(pressTimer); pressTimer = null;
        document.removeEventListener('pointermove', cancelTimer);
      }
    };
    document.addEventListener('pointermove', cancelTimer);
    document.addEventListener('pointerup', () => {
      clearTimeout(pressTimer); pressTimer = null;
      document.removeEventListener('pointermove', cancelTimer);
    }, { once: true });
  });

  function onDragMove(e) {
    if (!active) return;
    e.preventDefault();
    const { ghost, ph, el, offsetY } = active;
    ghost.style.top = (e.clientY - offsetY) + 'px';

    const nonDragged = [...listEl.querySelectorAll('.activity-item')].filter(i => i !== el);
    let placed = false;
    for (const it of nonDragged) {
      const r = it.getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2) { it.before(ph); placed = true; break; }
    }
    if (!placed) listEl.appendChild(ph);
  }

  function onDragEnd() {
    if (!active) return;
    const { el, ghost, ph } = active;
    const draggedId = parseInt(el.dataset.activityId);
    active = null;

    document.removeEventListener('pointermove', onDragMove);
    document.removeEventListener('pointerup', onDragEnd);
    document.removeEventListener('pointercancel', onDragCancel);

    let newPlanPos = 0;
    for (const child of listEl.children) {
      if (child === ph) break;
      if (child.classList.contains('activity-item') && child !== el) newPlanPos++;
    }

    ghost.remove(); ph.remove();
    el.classList.remove('is-dragging');

    const planActivities = day.activities.filter(a => a.type !== 'note');
    const currentPlanPos = planActivities.findIndex(a => a.id === draggedId);

    if (newPlanPos !== currentPlanPos) {
      const newPlanOrder = [...planActivities];
      const [moved] = newPlanOrder.splice(currentPlanPos, 1);
      newPlanOrder.splice(newPlanPos, 0, moved);
      const noteActivities = day.activities.filter(a => a.type === 'note');
      day.activities = [...newPlanOrder, ...noteActivities];
      applyDragTimeRule(day, newPlanPos);
      saveDayState();
      renderDayDetail(day);
      renderItinerary();
    }
  }

  function onDragCancel() {
    if (!active) return;
    const { el, ghost, ph } = active;
    active = null;
    document.removeEventListener('pointermove', onDragMove);
    document.removeEventListener('pointerup', onDragEnd);
    document.removeEventListener('pointercancel', onDragCancel);
    ghost.remove(); ph.remove();
    el.classList.remove('is-dragging');
  }
}

// ===== JOURNAL =====
function renderJournalSection(day) {
  const section = document.getElementById('day-journal-section');
  if (!section) return;
  const journal = journalEntries[day.id];
  section.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'day-journal-section-inner';

  const labelRow = document.createElement('div');
  labelRow.className = 'day-journal-header';
  labelRow.innerHTML = `<p class="section-label" style="padding:0">Memory</p>`;
  wrapper.appendChild(labelRow);

  if (journal) {
    const preview = document.createElement('div');
    preview.className = 'day-journal-preview';
    preview.onclick = () => openJournalEditor(day.id);
    preview.innerHTML = `
      ${journal.photo ? `<div class="day-journal-photo" style="background-image:url('${journal.photo}')"></div>` : ''}
      ${journal.text ? `<p class="day-journal-text">${journal.text.substring(0, 160)}${journal.text.length > 160 ? '…' : ''}</p>` : ''}
      <span class="day-journal-edit-hint">Tap to edit ◈</span>
    `;
    wrapper.appendChild(preview);
  } else {
    const addBtn = document.createElement('button');
    addBtn.className = 'day-journal-add-btn';
    addBtn.innerHTML = `<span>◈</span> Add a memory for this day`;
    addBtn.onclick = () => openJournalEditor(day.id);
    wrapper.appendChild(addBtn);
  }

  section.appendChild(wrapper);
}

let journalEditorOrigin = 'day-detail-screen';

function openJournalEditor(dayId) {
  journalEditorOrigin = document.querySelector('.screen.active')?.id || 'day-detail-screen';
  currentJournalDayId = dayId;
  journalTempPhoto = null;
  const day = TRIP.days.find(d => d.id === dayId);
  document.getElementById('journal-edit-header').textContent = day ? `${day.title} · ${day.date}` : 'Our Day';
  const journal = journalEntries[dayId];
  document.getElementById('journal-text-input').value = journal?.text || '';
  const photoBg = document.getElementById('journal-photo-bg');
  const btnLabel = document.getElementById('journal-photo-btn-label');
  if (journal?.photo) {
    photoBg.style.backgroundImage = `url('${journal.photo}')`;
    journalTempPhoto = journal.photo;
    btnLabel.textContent = 'Change photo';
    document.getElementById('journal-photo-remove-btn').style.display = 'flex';
  } else {
    photoBg.style.backgroundImage = '';
    btnLabel.textContent = 'Add a photo';
    document.getElementById('journal-photo-remove-btn').style.display = 'none';
  }
  showScreen('journal-edit-screen');
}

function removeJournalPhoto() {
  journalTempPhoto = null;
  document.getElementById('journal-photo-bg').style.backgroundImage = '';
  document.getElementById('journal-photo-btn-label').textContent = 'Add a photo';
  document.getElementById('journal-photo-remove-btn').style.display = 'none';
}

function closeJournalEditor() {
  showScreen(journalEditorOrigin || 'day-detail-screen');
}

function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = e => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const maxW = 1200, maxH = 1200;
        let w = img.width, h = img.height;
        if (w > maxW || h > maxH) {
          const ratio = Math.min(maxW / w, maxH / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.70));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handleJournalPhoto(input) {
  const file = input.files?.[0];
  if (!file) return;
  const btnLabel = document.getElementById('journal-photo-btn-label');
  btnLabel.textContent = 'Processing…';
  try {
    const base64 = await compressPhoto(file);
    journalTempPhoto = base64;
    document.getElementById('journal-photo-bg').style.backgroundImage = `url('${base64}')`;
    btnLabel.textContent = 'Change photo';
    document.getElementById('journal-photo-remove-btn').style.display = 'flex';
    showToast('Photo ready ✓');
  } catch(e) {
    btnLabel.textContent = 'Add a photo';
    showToast('Could not load photo');
  }
  input.value = '';
}

function saveJournalEntry() {
  if (!currentJournalDayId) return;
  const text = document.getElementById('journal-text-input').value.trim();
  if (!text && !journalTempPhoto) {
    delete journalEntries[currentJournalDayId];
    tripRef.child(`journal/${currentJournalDayId}`).remove();
    showToast('Memory removed');
    closeJournalEditor();
    return;
  }
  const entry = { dayId: currentJournalDayId, updatedAt: Date.now() };
  if (text) entry.text = text;
  if (journalTempPhoto) entry.photo = journalTempPhoto;
  journalEntries[currentJournalDayId] = entry;
  tripRef.child(`journal/${currentJournalDayId}`).set(entry);
  showToast('Memory saved ♡');
  closeJournalEditor();
}

// ===== HIGHLIGHTS =====
function renderHighlights() {
  const content = document.getElementById('highlights-content');
  if (!content) return;
  content.innerHTML = '';

  const allRecs = [...(RECOMMENDATIONS.rome || []), ...(RECOMMENDATIONS.florence || []), ...customRecs];
  const likedPlaces = allRecs.filter(r => likedRecs.has(r.id));

  let hasAnything = false;

  // Days in chronological order
  TRIP.days.forEach(day => {
    const journal = journalEntries[day.id];
    const likedActivities = day.activities.filter(a => a.liked && a.type !== 'note');
    if (!journal && likedActivities.length === 0) return;

    hasAnything = true;

    // Day section header
    const dayHeader = document.createElement('div');
    dayHeader.className = 'highlights-day-header';
    dayHeader.innerHTML = `
      <span class="highlights-day-number">Day ${day.id}</span>
      <span class="highlights-day-title">${day.title}</span>
      <span class="highlights-day-date">${day.date}</span>
    `;
    content.appendChild(dayHeader);

    // Memory
    if (journal) {
      const item = document.createElement('div');
      item.className = 'highlights-memory-card';
      item.onclick = () => openJournalEditor(day.id);
      item.innerHTML = `
        ${journal.photo
          ? `<div class="highlights-memory-photo" style="background-image:url('${journal.photo}')">
               <div class="highlights-memory-overlay">
                 <span class="highlights-memory-heart">♡</span>
                 <span class="highlights-memory-label">Memory</span>
               </div>
             </div>`
          : `<div class="highlights-memory-header">
               <span class="highlights-memory-heart">♡</span>
               <span class="highlights-memory-label">Memory</span>
             </div>`
        }
        ${journal.text ? `<div class="highlights-memory-text">${journal.text}</div>` : ''}
      `;
      content.appendChild(item);
    }

    // Liked activities
    likedActivities.forEach(activity => {
      const recInfo = activity.recId ? findRec(activity.recId) : null;
      const photo = recInfo?.rec?.photo;
      const item = document.createElement('div');
      item.className = 'highlights-item';
      item.onclick = () => openDay(day.id);
      item.innerHTML = `
        ${photo ? `<div class="highlights-photo" style="background-image:url('${photo}')"></div>` : ''}
        <div class="highlights-body">
          <span class="highlights-day-tag">♡ Favourite</span>
          <div class="highlights-name">${activity.name}</div>
          ${activity.detail ? `<div class="highlights-detail">${activity.detail}</div>` : ''}
        </div>
      `;
      content.appendChild(item);
    });
  });

  // Saved places
  if (likedPlaces.length > 0) {
    hasAnything = true;
    const label = document.createElement('div');
    label.className = 'highlights-day-header';
    label.innerHTML = `<span class="highlights-day-title">Saved places</span>`;
    content.appendChild(label);

    likedPlaces.forEach(rec => {
      const item = document.createElement('div');
      item.className = 'highlights-item';
      item.innerHTML = `
        ${rec.photo ? `<div class="highlights-photo" style="background-image:url('${rec.photo}')"></div>` : ''}
        <div class="highlights-body">
          <span class="highlights-day-tag">${rec.city ? rec.city.charAt(0).toUpperCase() + rec.city.slice(1) : ''} · ${rec.category}</span>
          <div class="highlights-name">${rec.name}</div>
          ${rec.detail ? `<div class="highlights-detail">${rec.detail}</div>` : ''}
          ${rec.mapsUrl ? `<a href="${rec.mapsUrl}" target="_blank" class="activity-maps-link" onclick="event.stopPropagation()">View on Maps ↗</a>` : ''}
        </div>
      `;
      content.appendChild(item);
    });
  }

  if (!hasAnything) {
    content.innerHTML = `<div class="empty-state" style="padding:60px 20px"><div class="empty-state-icon">♡</div><div class="empty-state-text">Nothing here yet — add memories and tap ♡ on favourite moments</div></div>`;
  }
}

// ===== DAY SWIPE =====
function initDaySwipe() {
  const screen = document.getElementById('day-detail-screen');
  let startX = 0, startY = 0;

  screen.addEventListener('touchstart', e => {
    // Ignore touches that start inside a horizontally scrollable strip
    if (e.target.closest('.rec-strip, .rec-filter-row, .day-rec-section')) {
      startX = null; return;
    }
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  screen.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    // Only trigger if clearly horizontal and far enough
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    const idx = TRIP.days.findIndex(d => d.id === currentDayId);
    if (dx < 0 && idx < TRIP.days.length - 1) {
      navigateDay(TRIP.days[idx + 1].id);  // swipe left → next
    } else if (dx > 0 && idx > 0) {
      navigateDay(TRIP.days[idx - 1].id);  // swipe right → previous
    }
  }, { passive: true });
}

function navigateDay(dayId) {
  currentDayId = dayId;
  dayRecCategory = 'all';
  const day = TRIP.days.find(d => d.id === dayId);
  if (!day) return;
  document.getElementById('day-detail-title').textContent = `Day ${day.id}`;

  const scroll = document.querySelector('.day-detail-scroll');
  scroll.classList.add('day-swipe-fade');
  setTimeout(() => {
    renderDayDetail(day);
    scroll.scrollTop = 0;
    scroll.classList.remove('day-swipe-fade');
  }, 120);
}

// ===== INIT =====
function handleBackNavigation() {
  history.pushState(null, ''); // keep a state so back fires again next time
  const active = document.querySelector('.screen.active');
  if (!active) return;
  switch (active.id) {
    case 'itinerary-screen':      showScreen('welcome-screen'); break;
    case 'day-detail-screen':     showScreen('itinerary-screen'); break;
    case 'discover-screen':       showScreen('itinerary-screen'); break;
    case 'transport-screen':      showScreen('itinerary-screen'); break;
    case 'notes-screen':          showScreen('itinerary-screen'); break;
    case 'highlights-screen':     showScreen('itinerary-screen'); break;
    case 'trash-screen':          showScreen('itinerary-screen'); break;
    case 'map-screen':            showScreen('itinerary-screen'); break;
    case 'note-edit-screen':      closeNoteEditor(); break;
    case 'activity-edit-screen':  closeActivityEdit(); break;
    case 'journal-edit-screen':   closeJournalEditor(); break;
    case 'install-screen':        skipInstall(); break;
    // password-screen / welcome-screen: let the OS handle it (exit app)
  }
}

// ===== MAP =====
function extractLatLng(url) {
  if (!url) return null;
  // @lat,lng — standard place/search URL (most common)
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return [parseFloat(atMatch[1]), parseFloat(atMatch[2])];
  // ?q=lat,lng or &ll=lat,lng or &query=lat,lng etc.
  const paramMatch = url.match(/[?&](?:q|ll|query|daddr|center|cbll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (paramMatch) return [parseFloat(paramMatch[1]), parseFloat(paramMatch[2])];
  return null;
}

function isShortMapLink(url) {
  return url && /maps\.app\.goo\.gl|goo\.gl\/maps/.test(url);
}

async function resolveShortMapUrl(url) {
  try {
    const res = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(7000) }
    );
    if (!res.ok) return url;
    const data = await res.json();
    // Check the final URL reported by the proxy after redirect
    const finalUrl = data?.status?.url || '';
    if (finalUrl !== url && extractLatLng(finalUrl)) return finalUrl;
    // Search the returned HTML for @lat,lng
    const html = data?.contents || '';
    const atMatch = html.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) return `https://www.google.com/maps/@${atMatch[1]},${atMatch[2]},15z`;
    // Look for a Google Maps URL in a meta-refresh redirect
    const metaMatch = html.match(/url=([^"']+google\.com\/maps[^"']+)/i);
    if (metaMatch) {
      const redirectUrl = decodeURIComponent(metaMatch[1].replace(/&amp;/g, '&'));
      if (extractLatLng(redirectUrl)) return redirectUrl;
    }
  } catch(e) {}
  return url; // return original if resolution fails
}

function getRecDayKey(recId) {
  const days = addedRecs[recId];
  return (days && days.length > 0) ? String(days[0]) : 'discover';
}

function getRecDayColor(recId) {
  const key = getRecDayKey(recId);
  return DAY_COLORS[parseInt(key)] || DISCOVER_COLOR;
}

function makeMarkerIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.85);box-shadow:0 2px 6px rgba(0,0,0,0.6)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

function makeHotelIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="width:18px;height:18px;border-radius:3px;background:#F2E8D5;border:2px solid #9B1D35;box-shadow:0 2px 6px rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#150810;line-height:1">H</div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });
}

function showMapScreen() {
  const container = document.getElementById('map-container');
  if (!leafletMap) {
    leafletMap = L.map(container, { zoomControl: false, attributionControl: false })
      .setView(CITY_CENTERS[mapCity].latlng, CITY_CENTERS[mapCity].zoom);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
    }).addTo(leafletMap);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
    }).addTo(leafletMap);
    L.control.zoom({ position: 'topright' }).addTo(leafletMap);
  }
  setTimeout(() => {
    leafletMap.invalidateSize();
    renderMapMarkers(mapCity);
  }, 50);
}

function setMapCity(city, tabEl) {
  mapCity = city;
  document.querySelectorAll('#map-screen .city-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  closeMapPopup();
  if (!leafletMap) return;
  const center = CITY_CENTERS[city];
  leafletMap.flyTo(center.latlng, center.zoom, { duration: 0.6 });
  renderMapMarkers(city);
}

function renderMapMarkers(city) {
  mapMarkers.forEach(m => leafletMap.removeLayer(m.marker));
  mapMarkers = [];
  leafletMap.off('zoomend', onMapZoom);

  const recs = getAllRecs(city);
  recs.forEach(rec => {
    const coords = REC_COORDS[rec.id] || extractLatLng(rec.mapsUrl);
    if (!coords) return;
    const dayKey = getRecDayKey(rec.id);
    const color = DAY_COLORS[parseInt(dayKey)] || DISCOVER_COLOR;
    const marker = L.marker(coords, { icon: makeMarkerIcon(color) });
    if (mapFilter.has(dayKey)) marker.addTo(leafletMap);
    marker.bindTooltip(rec.name, { permanent: true, direction: 'right', className: 'map-label', offset: [9, 0] });
    marker.on('click', () => showMapPopup(rec.id));
    mapMarkers.push({ marker, dayKey, visible: mapFilter.has(dayKey) });
  });

  (MAP_HOTELS[city] || []).forEach(hotel => {
    const marker = L.marker(hotel.latlng, { icon: makeHotelIcon() });
    if (mapFilter.has('hotel')) marker.addTo(leafletMap);
    marker.bindTooltip(hotel.name, { permanent: true, direction: 'right', className: 'map-label', offset: [11, 0] });
    marker.on('click', () => showHotelPopup(hotel));
    mapMarkers.push({ marker, dayKey: 'hotel', visible: mapFilter.has('hotel') });
  });

  updateMapLabels();
  leafletMap.on('zoomend', onMapZoom);
  renderMapLegend(city);
}

function onMapZoom() { updateMapLabels(); }

function updateMapLabels() {
  if (!leafletMap) return;
  const show = leafletMap.getZoom() >= 15;
  mapMarkers.forEach(m => {
    if (!m.visible) return;
    try { show ? m.marker.openTooltip() : m.marker.closeTooltip(); } catch(e) {}
  });
}

function toggleMapFilter(dayKey) {
  if (mapFilter.has(dayKey)) {
    mapFilter.delete(dayKey);
    mapMarkers.filter(m => m.dayKey === dayKey).forEach(m => {
      leafletMap.removeLayer(m.marker);
      m.visible = false;
    });
  } else {
    mapFilter.add(dayKey);
    const showLabels = leafletMap.getZoom() >= 15;
    mapMarkers.filter(m => m.dayKey === dayKey).forEach(m => {
      m.marker.addTo(leafletMap);
      m.visible = true;
      if (!showLabels) m.marker.closeTooltip();
    });
  }
  document.querySelectorAll('#map-legend-panel .map-legend-item').forEach(el => {
    el.classList.toggle('map-legend-inactive', !mapFilter.has(el.dataset.dayKey));
  });
}

function renderMapLegend(city) {
  const existing = document.getElementById('map-legend-panel');
  if (existing) existing.remove();

  const panel = document.createElement('div');
  panel.id = 'map-legend-panel';
  panel.className = 'map-legend-panel';

  const dayIds = city === 'rome' ? ['7','8','9'] : ['10','11','12'];
  const items = [
    ...dayIds.map(id => {
      const day = TRIP.days.find(d => d.id === parseInt(id));
      return { key: id, label: `Day ${id} · ${day ? day.date.split(',')[1].trim() : ''}`, dot: `background:${DAY_COLORS[parseInt(id)]}` };
    }),
    { key: 'discover', label: 'Discover', dot: `background:${DISCOVER_COLOR}` },
    { key: 'hotel',    label: 'Hotel',    dot: `background:#F2E8D5;border:1.5px solid #9B1D35;border-radius:2px` },
  ];

  items.forEach(({ key, label, dot }) => {
    const item = document.createElement('div');
    item.className = 'map-legend-item' + (mapFilter.has(key) ? '' : ' map-legend-inactive');
    item.dataset.dayKey = key;
    item.onclick = () => toggleMapFilter(key);
    item.innerHTML = `<div class="map-legend-dot" style="${dot}"></div><span>${label}</span>`;
    panel.appendChild(item);
  });

  document.getElementById('map-container').appendChild(panel);
}

function showHotelPopup(hotel) {
  const popup = document.getElementById('map-popup');
  const body = document.getElementById('map-popup-body');

  body.innerHTML = `
    <div class="map-popup-header">
      <div class="map-popup-dot" style="background:#F2E8D5;border-color:#9B1D35;border-radius:2px"></div>
      <div class="map-popup-title">${hotel.name}</div>
      <button class="map-popup-close" onclick="closeMapPopup()">✕</button>
    </div>
    <div class="map-popup-cat">◇ Hotel</div>
    <div class="map-popup-detail">${hotel.detail}</div>
    <div class="map-popup-actions">
      ${hotel.mapsUrl ? `<a href="${hotel.mapsUrl}" target="_blank" class="map-popup-maps-btn" style="flex:1">Maps ↗</a>` : ''}
    </div>
  `;

  popup.style.display = 'block';
}

function showMapPopup(recId) {
  const found = findRec(recId);
  if (!found) return;
  const { rec } = found;
  const assignedDays = (addedRecs[recId] || []).map(id => {
    const d = TRIP.days.find(d => d.id === id);
    return d ? `Day ${d.id} · ${d.date}` : null;
  }).filter(Boolean);

  const popup = document.getElementById('map-popup');
  const body = document.getElementById('map-popup-body');

  const catLabel = { sights: '▣ Sight', food: '● Food', experience: '✦ Experience' }[rec.category] || rec.category;
  const color = getRecDayColor(recId);

  body.innerHTML = `
    <div class="map-popup-header">
      <div class="map-popup-dot" style="background:${color}"></div>
      <div class="map-popup-title">${rec.name}</div>
      <button class="map-popup-close" onclick="closeMapPopup()">✕</button>
    </div>
    <div class="map-popup-cat">${catLabel}</div>
    <div class="map-popup-detail">${rec.detail}</div>
    ${rec.rating ? `<div class="map-popup-stars">${renderStars(rec.rating)} <span class="map-popup-rating-num">${rec.rating}</span></div>` : ''}
    ${assignedDays.length ? `<div class="map-popup-days">${assignedDays.map(d => `<span class="map-popup-day-chip">${d}</span>`).join('')}</div>` : ''}
    <div class="map-popup-actions">
      ${rec.mapsUrl ? `<a href="${rec.mapsUrl}" target="_blank" class="map-popup-maps-btn">Maps ↗</a>` : ''}
      <button class="map-popup-add-btn" onclick="openAddToDay('${recId}')">+ Add to day</button>
    </div>
  `;

  popup.style.display = 'block';
}

function closeMapPopup() {
  const popup = document.getElementById('map-popup');
  if (popup) popup.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  history.pushState(null, ''); // initial entry so back button fires popstate
  window.addEventListener('popstate', handleBackNavigation);
  initDaySwipe();
  initPasswordCheck();
  initFirebase();
  migrateActivityTimes();
  seedNotes();
  renderItinerary();
  renderTransport();
  renderNotesList();

  document.getElementById('new-activity-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') addActivity();
  });
});
