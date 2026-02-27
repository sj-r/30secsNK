// ======= Your lists (ported) =======
const list1 = ["Avondprogramma","Afterparty","Examen","CITO","CE","SE","SSL","Leiden","Natuurkunde","Haverkoek","BiNaS", "Podium", "Raaklijn", "Stappenplam", "Schets", "Oppervlakte", "Wet van Energiebehoud", "SALE", "Significantie (SALE)", "Antwoord (SALE)", "Logisch (SALE)", "Eenheid (SALE)", "Ontbinden", "Construeren", "Beginpunt", "Eindpunt", "Formule", "Grafieken",
    "Bewegen", "Mechanica", "Energie", "Krachten", "Constante Snelheid", "FRes", "Vermogen", "Wrijvingsenergie", "Arbeid", "Kinetische Energie", "Zwaarte-energie", "Zwaartekracht", "Gravitatie-energie", "Veerenergie", "Newton", "Joules", "Normaalkracht", "Wrijvingskracht", "Aandrijfkracht", "Veerkracht", "Einstein", "Spankracht", "Gravitatiekracht", "F = ma", "middelpuntzoekendekracht",
    "cirkelbeweging", "baansnelheid", "Vernelling", "Snelheid", "Hoofddocent", "Whiteboard"
];

const list2 = list1.concat(["Elektromagnetisme", "Trillingen", "Golven", "Kwantum", "Elektrisch Veld", "Magnetisch Veld", "Elektron", "Proton", "Neutron", "Elektrische Kracht", "Elektrische Energie", "Veldsterkte", "Veldlijnen", "Magneet", "Noordpool", "Zuidpool", "Draad", "Spoel", "Stroom", "Tesla", "FBI", "Lorenzkracht", "Inductie", "Volt", "Ampere", "Windingen", "Flux", "Amplitude", "Uitwijking",
    "Trillingstijd", "Lopende Golf", "Staande golf", "Golfsnelheid", "Golflengte", "nanometer", "f = 1/T", "v = λ * f", "Knoop", "Buik", "Open uiteinde", "Gesloten uiteinde", "Grondtoon", "Boventoon", "l = n * λ * ½", "l = (2n-1) * ¼ * λ", "trilt maximaal", "kan niet trillen", "energiedigrammen", "grondtoestand", "aangeslagen toestand", "absorbtie", "ionisatie", "emissie", "fotonenergie", "plank's constante", "lichtsnelheid (c)",
    "1D put", "principe van Pauli",
]);

const list3 = list2.concat(["De Broglie golflengte", "interferrentie", "constructief", "destructief", "weglengteverschil", "faseverschil", "tralies", "tralieconstante", "waarschijnlijkheidsverdeling", "Astrophysica", "Straal", "Oppervlakte", "Intensiteit", "λ max", "Temperatuur", "Kelvin", "Watt", "Vermogen", "Elektriciteit", "Schakelingenspel", "Bingo regel", "U = IR", "SOS-regel", "Weerstand",
    "Serieschakeling", "Parallelschakeling", "Bronspanning", "Stroommeter", "Spanningsmeter", "PTC", "NTC", "LDR", "Licht Dempt R", "Diode", "Soortelijke Weerstand", "R*A/L", "Lengte", "diameter", "elektrisch vermogen", "Ohm-meter", "Ohm", "Rendement", "P nuttig / P totaal * 100%", "lading", "capaciteit", "Kernphysica", "Reactievergelijking", "Massagetal", "Atoomnummer", "Alpha-straling", "Beta-straling", "Gamma-straling", "Doordringend Vermogen",
    "ioniserend vermogen", "Beschieting", "Halveringstijd", "Halveringsdikte", "Aantal Kernen", "Activiteit", "Dikte", "Dosis", "Massa", "Dosisequivalent", "Weegfactor", "Gray", "Kilogram", "Sievert"

]);

// ======= Core logic (Python -> JS) =======
function getPool(courseDays, day) {
  courseDays = Number(courseDays);
  day = Number(day);

  if (courseDays === 2) {
    if (day === 1) return list1;
    if (day === 2) return list2;
    throw new Error("Invalid day for 2-day course");
  }

  if (courseDays === 3) {
    if (day === 1) return list1;
    if (day === 2) return list2;
    if (day === 3) return list3;
    throw new Error("Invalid day for 3-day course");
  }

  throw new Error("Invalid course length");
}

function sampleUnique(arr, k) {
  if (k > arr.length) throw new Error("Cannot sample more items than list length");
  const copy = arr.slice();
  // Fisher–Yates shuffle partial
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, k);
}

// ======= State =======
const STORAGE_KEY = "thirtysecs_state_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ======= UI =======
const courseEl = document.getElementById("course");
const dayEl = document.getElementById("day");
const renewEl = document.getElementById("renew");
const itemsEl = document.getElementById("items");

function setDayOptions(courseDays) {
  const n = Number(courseDays);
  const days = n === 2 ? [1, 2] : [1, 2, 3];
  dayEl.innerHTML = "";
  for (const d of days) {
    const opt = document.createElement("option");
    opt.value = String(d);
    opt.textContent = `Day ${d}`;
    dayEl.appendChild(opt);
  }
}

function render(state) {
  itemsEl.innerHTML = "";
  for (const text of state.items) {
    const li = document.createElement("li");
    li.className = "item" + (state.crossed[text] ? " crossed" : "");
    li.textContent = text;

    li.addEventListener("click", () => {
      state.crossed[text] = !state.crossed[text];
      saveState(state);
      render(state);
    });

    itemsEl.appendChild(li);
  }
}

function renew(state) {
  const pool = getPool(state.courseDays, state.day);
  state.items = sampleUnique(pool, 5);
  // reset crossed state on renew
  state.crossed = {};
  saveState(state);
  render(state);
}

// ======= Boot =======
let state = loadState();
if (!state) {
  state = { courseDays: 2, day: 1, items: [], crossed: {} };
}

courseEl.value = String(state.courseDays);
setDayOptions(state.courseDays);
dayEl.value = String(state.day);

if (!state.items || state.items.length !== 5) {
  renew(state);
} else {
  render(state);
}

courseEl.addEventListener("change", () => {
  state.courseDays = Number(courseEl.value);
  setDayOptions(state.courseDays);
  state.day = Number(dayEl.value); // default first option
  saveState(state);
  renew(state);
});

dayEl.addEventListener("change", () => {
  state.day = Number(dayEl.value);
  saveState(state);
  renew(state);
});


renewEl.addEventListener("click", () => renew(state));
