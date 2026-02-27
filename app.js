// ======= Your lists (ported) =======
const list1 = ["Avondprogramma","Afterparty","Examen","CITO","CE","SE","SSL","Leiden","Scheikunde","Haverkoek","BiNaS","Atoom","Ion","Lading","Elektron","Periodiek Systeem","I love Stappenplan","STPL","Stroomgeleiding","Reactievergelijking","Oplossen","VanderWaalsbinding","H-brug","Zout","Metaal","Moleculaire stof",
  "Dipool","Ionrooster","Polair","Apolair","Atoombinding","Ladingscentra","Kookpunt","Smeltpunt","Microniveau","Macroniveau","Structuurformule","Gas (g)","Vloeibaar (l)","Vast (s)","Opgelost (aq)","LASD","Coëfficiënten","Hydraat","Onbekend Deeltje","Omzetten",
  "Strepen (LASD)","Delen (LASD)","ALLES","Antwoord (ALLES)","Logisch (ALLES)","Leesbaar (ALLES)","Eenheid (ALLES)","Significantie (ALLES)","mol","molmassa","kruistabel","Molair Volume","Procent","Massapercentage","Volumepercentage","Liter","Gram","ton","deel/geheel","molverhouding","rendement","Einddoel","dichtheid"
];

const list2 = list1.concat(["Evenwicht","Evenwichtsvoorwaarde (K)","Evenwichtsreactie","Reactiewarmte","Vormingswarmte","Delta E","E begin","E eind","Overmaat","Ondermaat","Exotherm","Endotherm","Joule","Joule per Mol","Katalysator","geactiveerde toestand","Druk","Temperatuur","Concentratie","Botsende Deeltjesmodel","Reactiesnelheid",
  "Energie","Aflopend","Naamgeving","HONC","COOH-groep/zuurgroep","OH-groep (alcoholgroep)","Ester","Verestering","H2O","Condensatiereactie","Additiereactie","Substitutiereactie","Dubbele binding","Methylgroep (CH3-groep)","Additiepolymerisatie","Condensatiepolymerisatie","Monomeer","Polymeer","Knakken","Copolymeer",
  "Crosslinks","Thermoharder","Thermoplast","Kristallijn","Amorf","Zijketens","Weekmaker","PORN","Electrochemische Cel","Elektronen","Oxidator","Reductor","Halfreactie","Totaalreactie","Elektronenoverdracht","RedOx","Elektrode","Opladen","Stroomlevering","DNA","m-RNA","Coderende streng","Matrijsstreng","Hydrolyse","Zeep","Codon","Basen","Aminozuur","Peptideketen"
]);

const list3 = list2.concat(["Lewisstructuur","Reactiemechanisme","Formele Lading","Grensstructuren","Cis-Trans isomerie","bindingshoeken","Partiële lading","niet-bindende elektronenparen","elektronenparen","Octetregel","TOG","Asymetrisch C-atoom","spiegelbeeldisomerie","C*","Stereo-isomeer","Enzym","stereo-specefiek","Zuur","Base","Kb","Kz","Sterk Zuur","Zwak Zuur","Sterke Base","Zwakke Base",
  "H3O+","OH-","H+","pH","pOH","-log[H3O+]","-log[OH-]","Verhouding","Concentratie","Molair","E-factor","Atoomeconomie","Extractie","Bezinken","Destilleren","Blokschema","Hernieuwbaar","Milieu"
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