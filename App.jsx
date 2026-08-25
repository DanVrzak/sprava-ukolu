  CloudRain, Sun, CheckCircle2, Circle, Plus, Trash2, Sunrise, Sunset,
  Wrench, ClipboardList, CalendarDays, X, RotateCcw, BarChart3,
  ChevronLeft, ChevronRight, Clock, PlayCircle, StopCircle, Wallet, Settings2,
  CalendarClock
} from "lucide-react";

// ---------- barvy a styl ----------
const C = {
  bg: "#1B1E21",
  panel: "#24282C",
  panelAlt: "#2E3338",
  border: "#3A3F44",
  amber: "#F2A93B",
  amberDark: "#C98420",
  green: "#5FB77E",
  red: "#E2694B",
  text: "#ECECEA",
  muted: "#9AA0A6",
};

const FREQ = [
  { value: 1, label: "Denně" },
  { value: 3, label: "Průběžně (co pár dní)" },
  { value: 7, label: "Týdně" },
  { value: 14, label: "Co 2 týdny" },
  { value: 30, label: "Měsíčně" },
  { value: 90, label: "Čtvrtletně" },
  { value: 182, label: "Pololetně" },
  { value: 365, label: "Ročně" },
];

const MONTHS = ["Led", "Úno", "Bře", "Dub", "Kvě", "Čvn", "Čvc", "Srp", "Zář", "Říj", "Lis", "Pro"];
const MONTHS_FULL = ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];

const AREAS = [
  { id: "safran", label: "Šafrán", color: "#8B5FBF" },
  { id: "komunitni", label: "Komunitní prostor", color: "#3B5BA5" },
  { id: "skolni", label: "Školní prostor", color: "#2E8B7D" },
  { id: "byty", label: "Byty", color: "#6B6B6B" },
  { id: "hrastice", label: "Chata Hraštice", color: "#C24B4B" },
  { id: "vrchlabi", label: "Vrchlabí 172", color: "#9A8B3F" },
];
const EXTRA_AREA = { id: "mimoradne", label: "Mimořádné", color: "#E2694B" };
function areaInfo(id) {
  return AREAS.find((a) => a.id === id) || (id === "mimoradne" ? EXTRA_AREA : { id, label: id, color: "#9AA0A6" });
}

// ---------- role (V JAKÉ ROLI) ----------
const ROLES = [
  { id: "spravce", label: "Správce", color: "#6FA8DC", desc: "Denní kontrolní kolečka, dohled nad objekty" },
  { id: "udrzbar", label: "Údržbář / zahradník", color: "#5FB77E", desc: "Sezónní a pravidelná údržba dle katalogu" },
  { id: "mistr", label: "Mistr", color: "#F2A93B", desc: "Dílny a program s dětmi" },
  { id: "tvurce", label: "Tvůrce / řemeslník", color: "#B388EB", desc: "Projektové řemeslné a tvůrčí práce" },
  { id: "manzel", label: "Hodinový manžel", color: "#E07A5F", desc: "Objednávkové zakázky na hodiny" },
  { id: "pohotovost", label: "Pohotovost", color: "#C24B4B", desc: "Rezervovaná kapacita jen dle potřeby" },
];
function roleInfo(id) {
  return ROLES.find((r) => r.id === id) || ROLES[1];
}

// dny v týdnu: 1=Po ... 7=Ne
const DOW = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];
function isoDow(dateStr) {
  const d = new Date(dateStr + "T00:00:00").getDay(); // 0=Ne
  return d === 0 ? 7 : d;
}

// ---------- Rozvrh: pravidla, ze kterých appka sama poskládá den/týden/měsíc/rok ----------
const SEED_SCHEDULE = [
  {
    id: "r1", label: "Ranní kontrolní kolečko", role: "spravce",
    days: [1,2,3,4,5,6,7], months: [], timeStart: "06:00", timeEnd: "06:30",
    areas: ["safran", "komunitni", "skolni"], subject: "",
    note: "Odemčení/uzamčení, rychlá kontrola objektů, co se stalo přes noc.",
  },
  {
    id: "r2", label: "Sezónní údržba zahrady a exteriéru", role: "udrzbar",
    days: [2,4,6], months: [3,4,5,9,10,11], timeStart: "08:00", timeEnd: "12:00",
    areas: ["safran", "komunitni", "skolni"], subject: "",
    note: "Jaro/podzim: dle katalogu (sekání, hrabání, úklid, kontrola). Konkrétní úkoly se doplní z Katalogu.",
  },
  {
    id: "r3", label: "Letní údržba a zálivka", role: "udrzbar",
    days: [1,3,5], months: [6,7,8], timeStart: "07:00", timeEnd: "10:00",
    areas: ["safran", "komunitni", "skolni"], subject: "",
    note: "Zálivka záhonů, sekání trávy 1x/týden, drobné opravy.",
  },
  {
    id: "r4", label: "Zimní provoz a topení", role: "udrzbar",
    days: [1,2,3,4,5,6,7], months: [12,1,2], timeStart: "06:30", timeEnd: "08:00",
    areas: ["safran", "komunitni", "skolni"], subject: "",
    note: "Zátop, kontrola topení, dle potřeby sníh a posyp.",
  },
  {
    id: "r5", label: "Dílna s dětmi", role: "mistr",
    days: [3], months: [], timeStart: "15:00", timeEnd: "18:00",
    areas: ["skolni"], subject: "ŠMP / školní klub",
    note: "Řemeslná dílna, tvoření a drobné opravy společně s dětmi.",
  },
  {
    id: "r6", label: "Sobotní brigáda", role: "udrzbar",
    days: [6], months: [3,4,5,9,10,11], timeStart: "08:00", timeEnd: "12:00",
    areas: ["komunitni"], subject: "Komunitní zahrada",
    note: "Společná brigáda — sezónní úklid, sázení, údržba záhonů.",
  },
  {
    id: "r7", label: "Řemeslné projekty", role: "tvurce",
    days: [5], months: [], timeStart: "09:00", timeEnd: "13:00",
    areas: [], subject: "",
    note: "Volný projektový čas — větší opravy, výroba, vylepšení dle backlogu.",
  },
  {
    id: "r8", label: "Hodinový manžel", role: "manzel",
    days: [], months: [], timeStart: "", timeEnd: "",
    areas: [], subject: "dle objednávky",
    note: "Práce na objednávku mimo pravidelný rozvrh — domluva individuálně.",
  },
  {
    id: "r9", label: "Pohotovost", role: "pohotovost",
    days: [], months: [], timeStart: "", timeEnd: "",
    areas: [], subject: "",
    note: "Rezervovaná kapacita pro havárie a naléhavé věci — nasazuje se jen podle potřeby.",
  },
];

const SEED_TASKS = [
  { id: "v1", name: "Větrání teepee / jurty", role: "udrzbar", category: "indoor", areas: ["komunitni", "skolni"], months: [3, 4, 5, 6, 7, 8], interval: 1, notes: "Konkrétně: KOM prostor; Školní prostor, Jurta", lastDone: null },
  { id: "v2", name: "Zalévání záhonů, květin, stromků, keřů", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni"], months: [3, 4, 5, 6, 7, 8], interval: 3, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v3", name: "Sekání trávy", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [3, 4, 5, 9, 10, 11], interval: 14, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v4", name: "Odzimování, úklid po zimě (hrabání, hnojení)", role: "udrzbar", category: "indoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [3, 4, 5], interval: 90, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v5", name: "Kontrola stavu po zimě + soupis potřebných oprav", role: "udrzbar", category: "indoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [3, 4, 5], interval: 90, notes: "Výstup jde do backlogu oprav", lastDone: null },
  { id: "v6", name: "Otevření a kontrola venkovní vody, napojení hadic", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [3, 4, 5], interval: 90, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v7", name: "Kontrola nářadí a vybavení", role: "udrzbar", category: "indoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [3, 4, 5], interval: 90, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v8", name: "Kontrola hřiště a herních prvků po zimě", role: "udrzbar", category: "outdoor", areas: ["safran", "skolni"], months: [3, 4, 5], interval: 90, notes: "Konkrétně: Šafrán exteriér; Školní prostor", lastDone: null },
  { id: "v9", name: "Kontrola a čištění okapů", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [], interval: 90, notes: "Konkrétně: Domek, Nová chata, Altán (Šafrán), Odpolední ŠMP, Dílna; Knihobudka/kontejner; Maringotka, Altán (Školní prostor), Kancelář, Kuchyňka, Mobilheim, Jurta", lastDone: null },
  { id: "v10", name: "Sazba trávy", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [3, 4, 5], interval: 14, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v11", name: "Sazba květin, bylinek, rostlin", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [3, 4, 5], interval: 14, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v12", name: "Nátěr plotu", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [3, 4, 5], interval: 14, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v13", name: "Drobné opravy k provozu, zajištění nářadí a materiálu", role: "udrzbar", category: "indoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [6, 7, 8], interval: 3, notes: "", lastDone: null },
  { id: "v14", name: "Sekání trávy", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni"], months: [6, 7, 8], interval: 7, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v15", name: "Péče o stromy (ořez, česání plodů)", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [6, 7, 8], interval: 90, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v16", name: "Větrání a topení teepee / jurty", role: "udrzbar", category: "indoor", areas: ["komunitni", "skolni"], months: [1, 2, 9, 10, 11, 12], interval: 1, notes: "Konkrétně: KOM prostor; Školní prostor, Jurta", lastDone: null },
  { id: "v17", name: "Hrabání listí, úklid před zimou", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [9, 10, 11], interval: 3, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v18", name: "Zazimování zahrady a záhonů", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [9, 10, 11], interval: 90, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v19", name: "Uzavření venkovní vody + odpojení hadic", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni"], months: [9, 10, 11], interval: 90, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v20", name: "Péče o stromy (ořez)", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [9, 10, 11], interval: 90, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v21", name: "Štípání dřeva na zátop + naskladnění", role: "udrzbar", category: "indoor", areas: ["safran", "skolni"], months: [9, 10, 11], interval: 90, notes: "Konkrétně: Šafrán exteriér, Altán (Šafrán), V3S; Školní prostor", lastDone: null },
  { id: "v22", name: "Kontrola krbových kamen před topnou sezónou", role: "udrzbar", category: "indoor", areas: ["safran", "skolni"], months: [9, 10, 11], interval: 90, notes: "Konkrétně: Šafrán exteriér, Altán (Šafrán), V3S", lastDone: null },
  { id: "v23", name: "Kontrola stavu střech", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni", "hrastice"], months: [9, 10, 11], interval: 90, notes: "Konkrétně: Šafrán exteriér, Domek, Nová chata, Altán (Šafrán), Odpolední ŠMP, Dílna", lastDone: null },
  { id: "v24", name: "Impregnace plachet (teepee, jurta)", role: "udrzbar", category: "indoor", areas: ["komunitni", "skolni"], months: [9, 10, 11], interval: 90, notes: "Konkrétně: KOM prostor; Školní prostor, Jurta", lastDone: null },
  { id: "v25", name: "Kontrola nářadí před zimou (sekery, špalek)", role: "udrzbar", category: "indoor", areas: ["safran", "komunitni", "skolni"], months: [9, 10, 11], interval: 90, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v26", name: "Zátop / zapnutí topení před provozem", role: "udrzbar", category: "indoor", areas: ["safran", "komunitni", "skolni"], months: [1, 2, 12], interval: 1, notes: "Konkrétně: Šafrán exteriér, Altán (Šafrán), Odpolední ŠMP, V3S", lastDone: null },
  { id: "v27", name: "Štípání dřeva, doplňování zásoby u kamen", role: "udrzbar", category: "indoor", areas: ["safran", "skolni"], months: [1, 2, 12], interval: 3, notes: "Konkrétně: Šafrán exteriér", lastDone: null },
  { id: "v28", name: "Kontrola nářadí a vybavení", role: "udrzbar", category: "indoor", areas: ["safran", "komunitni", "skolni"], months: [1, 2, 12], interval: 3, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v29", name: "Odklízení sněhu – přístupy, cesty, plochy", role: "udrzbar", category: "indoor", areas: ["safran", "komunitni", "skolni"], months: [1, 2, 12], interval: 14, notes: "Konkrétně: Šafrán exteriér, Domek; KOM prostor", lastDone: null },
  { id: "v30", name: "Ometání sněhu ze střech", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni"], months: [1, 2, 12], interval: 14, notes: "Konkrétně: Šafrán exteriér, Nová chata, Altán (Šafrán), Odpolední ŠMP, Dílna, V3S", lastDone: null },
  { id: "v31", name: "Péče o jezírko - čištění vody, filtru, kontrola čerpadla", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni"], months: [], interval: 1, notes: "Konkrétně: Šafrán exteriér; KOM prostor", lastDone: null },
  { id: "v32", name: "Krmení ryb", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni"], months: [], interval: 1, notes: "Konkrétně: Šafrán exteriér; KOM prostor", lastDone: null },
  { id: "v33", name: "Knihobudka - srovnání knih, čištění regálků", role: "udrzbar", category: "indoor", areas: ["komunitni"], months: [], interval: 1, notes: "Konkrétně: Knihobudka/kontejner", lastDone: null },
  { id: "v34", name: "Úklid venkovních prostor kolem domku (hrabání listí, umytí lavic, zametení, příprava hřiště)", role: "udrzbar", category: "outdoor", areas: ["safran", "komunitni", "skolni"], months: [], interval: 1, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v35", name: "Přeházení kompostu, vybrání odpadu", role: "udrzbar", category: "outdoor", areas: ["komunitni"], months: [], interval: 1, notes: "Konkrétně: KOM prostor", lastDone: null },
  { id: "v36", name: "Vývoz / výměna náplně Bio WC", role: "udrzbar", category: "indoor", areas: ["safran", "komunitni", "skolni"], months: [], interval: 3, notes: "Konkrétně: Altán (Šafrán), V3S; Knihobudka/kontejner; Maringotka, Kancelář", lastDone: null },
  { id: "v37", name: "Pořádek, údržba a kontrola zázemí", role: "udrzbar", category: "indoor", areas: ["safran", "komunitni", "skolni"], months: [], interval: 3, notes: "", lastDone: null },
  { id: "v38", name: "Péče o nářadí, kontrola uskladnění", role: "udrzbar", category: "indoor", areas: ["safran", "komunitni", "skolni"], months: [], interval: 3, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v39", name: "Impregnace a čištění plachet (teepee, jurta)", role: "udrzbar", category: "indoor", areas: ["komunitni", "skolni"], months: [], interval: 3, notes: "Konkrétně: KOM prostor; Jurta", lastDone: null },
  { id: "v40", name: "Informování o docházejícím materiálu", role: "spravce", category: "indoor", areas: ["safran", "komunitni", "skolni"], months: [], interval: 3, notes: "Konkrétně: Šafrán exteriér; KOM prostor; Školní prostor", lastDone: null },
  { id: "v41", name: "Nahlášení zjištěných nedostatků → backlog oprav", role: "spravce", category: "indoor", areas: ["safran", "komunitni", "skolni", "byty", "hrastice", "vrchlabi"], months: [], interval: 3, notes: "", lastDone: null },
  { id: "v42", name: "Měsíční report odvedené práce", role: "spravce", category: "indoor", areas: ["safran", "komunitni", "skolni", "byty", "hrastice", "vrchlabi"], months: [], interval: 7, notes: "", lastDone: null },
  { id: "v43", name: "Generální úklid", role: "udrzbar", category: "indoor", areas: ["safran", "komunitni", "skolni"], months: [], interval: 30, notes: "", lastDone: null },
];

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  const A = new Date(a + "T00:00:00");
  const B = new Date(b + "T00:00:00");
  return Math.round((B - A) / 86400000);
}
function addDaysStr(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
function isSeasonActive(task, month) {
  return !task.months || task.months.length === 0 || task.months.includes(month);
}
function isDue(task, today) {
  if (!task.lastDone) return true;
  return daysBetween(task.lastDone, today) >= task.interval;
}
function daysUntilDue(task, today) {
  if (!task.lastDone) return 0;
  return task.interval - daysBetween(task.lastDone, today);
}
function nextDueDate(task, today) {
  return task.lastDone ? addDaysStr(task.lastDone, task.interval) : today;
}
function pad2(n) { return String(n).padStart(2, "0"); }
function daysInMonth(year, month) { return new Date(year, month, 0).getDate(); }
function monthRange(year, month) {
  return [`${year}-${pad2(month)}-01`, `${year}-${pad2(month)}-${pad2(daysInMonth(year, month))}`];
}
function startOfWeek(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const dow = (d.getDay() + 6) % 7; // 0 = Monday
  d.setDate(d.getDate() - dow);
  return d.toISOString().slice(0, 10);
}
function endOfWeek(dateStr) {
  return addDaysStr(startOfWeek(dateStr), 6);
}
function monthsInRange(startDate, endDate) {
  const months = new Set();
  let cur = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  while (cur <= end) {
    months.add(cur.getMonth() + 1);
    cur.setDate(cur.getDate() + 1);
  }
  return [...months];
}
function seasonActiveForRange(task, startDate, endDate) {
  if (!task.months || task.months.length === 0) return true;
  const ms = monthsInRange(startDate, endDate);
  return ms.some((m) => task.months.includes(m));
}
function pendingInRange(tasks, startDate, endDate, today) {
  return tasks.filter((t) => seasonActiveForRange(t, startDate, endDate) && nextDueDate(t, today) <= endDate);
}
function completedInRange(history, startDate, endDate) {
  return history.filter((h) => h.date >= startDate && h.date <= endDate);
}

async function storageGet(key) {
  try {
    const r = await window.storage.get(key, true);
    return r ? JSON.parse(r.value) : null;
  } catch (e) {
    return null;
  }
}
async function storageSet(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), true);
  } catch (e) {
    console.error("Ukládání se nezdařilo", key, e);
  }
}

function Badge({ children, color }) {
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: color + "22", color, border: `1px solid ${color}55` }}
    >
      {children}
    </span>
  );
}

function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
      style={{
        background: active ? C.amber : "transparent",
        color: active ? "#1B1E21" : C.muted,
      }}
    >
      <Icon size={16} />
      {children}
    </button>
  );
}

export default function MaintenanceApp() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [weather, setWeather] = useState({ date: todayStr(), isRaining: false });
  const [extraTasks, setExtraTasks] = useState([]);
  const [log, setLog] = useState([]);
  const [history, setHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [wageSettings, setWageSettings] = useState({ defaultRate: 300, areaRates: {} });
  const [scheduleRules, setScheduleRules] = useState([]);
  const [tab, setTab] = useState("dnes");

  useEffect(() => {
    (async () => {
      let catalog = await storageGet("tasks-catalog");
      if (!catalog) {
        catalog = SEED_TASKS;
        await storageSet("tasks-catalog", catalog);
      }
      setTasks(catalog);

      let ws = await storageGet("weather-state");
      if (!ws || ws.date !== todayStr()) {
        ws = { date: todayStr(), isRaining: false };
        await storageSet("weather-state", ws);
      }
      setWeather(ws);

      let extra = await storageGet("extra-tasks");
      if (!extra) {
        extra = [];
        await storageSet("extra-tasks", extra);
      }
      setExtraTasks(extra);

      let l = await storageGet("handover-log");
      if (!l) {
        l = [];
        await storageSet("handover-log", l);
      }
      setLog(l);

      let h = await storageGet("completion-history");
      if (!h) {
        h = [];
        await storageSet("completion-history", h);
      }
      setHistory(h);

      let s = await storageGet("work-sessions");
      if (!s) {
        s = [];
        await storageSet("work-sessions", s);
      }
      setSessions(s);

      let w = await storageGet("wage-settings");
      if (!w) {
        w = { defaultRate: 300, areaRates: {} };
        await storageSet("wage-settings", w);
      }
      setWageSettings(w);

      let sr = await storageGet("schedule-rules");
      if (!sr) {
        sr = SEED_SCHEDULE;
        await storageSet("schedule-rules", sr);
      }
      setScheduleRules(sr);

      setLoading(false);
    })();
  }, []);

  const today = todayStr();
  const month = new Date().getMonth() + 1;

  const dueTasks = useMemo(
    () => tasks.filter((t) => isSeasonActive(t, month) && isDue(t, today)),
    [tasks, month, today]
  );
  const dueIndoor = dueTasks.filter((t) => t.category === "indoor");
  const dueOutdoorAll = dueTasks.filter((t) => t.category === "outdoor");
  const outdoorBlocked = weather.isRaining ? dueOutdoorAll : [];
  const outdoorAvailable = weather.isRaining ? [] : dueOutdoorAll;

  const fillerSuggestions = useMemo(() => {
    return tasks
      .filter((t) => t.category === "indoor" && isSeasonActive(t, month) && !isDue(t, today))
      .sort((a, b) => daysUntilDue(a, today) - daysUntilDue(b, today))
      .slice(0, 3);
  }, [tasks, month, today]);

  const openExtra = extraTasks.filter((e) => !e.done);
  const totalToday = dueIndoor.length + outdoorAvailable.length + openExtra.length;

  async function toggleRain() {
    const next = { date: today, isRaining: !weather.isRaining };
    setWeather(next);
    await storageSet("weather-state", next);
  }

  async function toggleTaskDone(id) {
    const target = tasks.find((t) => t.id === id);
    const wasDoneToday = target.lastDone === today;
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, lastDone: wasDoneToday ? null : today } : t
    );
    setTasks(updated);
    await storageSet("tasks-catalog", updated);

    let newHistory;
    if (!wasDoneToday) {
      newHistory = [
        { id: "h-" + Date.now(), taskId: id, name: target.name, areas: target.areas, category: target.category, date: today },
        ...history,
      ].slice(0, 1000);
    } else {
      const idx = history.findIndex((h) => h.taskId === id && h.date === today);
      newHistory = idx >= 0 ? history.filter((_, i) => i !== idx) : history;
    }
    setHistory(newHistory);
    await storageSet("completion-history", newHistory);
  }

  async function addTask(newTask) {
    const updated = [...tasks, { ...newTask, id: "t-" + Date.now(), lastDone: null }];
    setTasks(updated);
    await storageSet("tasks-catalog", updated);
  }

  async function deleteTask(id) {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    await storageSet("tasks-catalog", updated);
  }

  async function addExtra(name) {
    if (!name.trim()) return;
    const updated = [...extraTasks, { id: "e-" + Date.now(), name, done: false, addedDate: today }];
    setExtraTasks(updated);
    await storageSet("extra-tasks", updated);
  }

  async function toggleExtra(id) {
    const target = extraTasks.find((e) => e.id === id);
    const updated = extraTasks.map((e) => (e.id === id ? { ...e, done: !e.done } : e));
    setExtraTasks(updated);
    await storageSet("extra-tasks", updated);

    let newHistory;
    if (!target.done) {
      newHistory = [
        { id: "h-" + Date.now(), taskId: id, name: target.name, areas: ["mimoradne"], category: "extra", date: today },
        ...history,
      ].slice(0, 1000);
    } else {
      const idx = history.findIndex((h) => h.taskId === id && h.date === today);
      newHistory = idx >= 0 ? history.filter((_, i) => i !== idx) : history;
    }
    setHistory(newHistory);
    await storageSet("completion-history", newHistory);
  }

  async function deleteExtra(id) {
    const updated = extraTasks.filter((e) => e.id !== id);
    setExtraTasks(updated);
    await storageSet("extra-tasks", updated);
  }

  async function addLogEntry(entry) {
    const updated = [
      { ...entry, id: "l-" + Date.now(), date: today, time: new Date().toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" }) },
      ...log,
    ].slice(0, 80);
    setLog(updated);
    await storageSet("handover-log", updated);
  }

  async function startShift(area) {
    if (sessions.some((s) => !s.end)) return;
    const nowIso = new Date().toISOString();
    const newSession = { id: "s-" + Date.now(), date: todayStr(), start: nowIso, end: null, area: area || "obecne" };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    await storageSet("work-sessions", updated);
  }

  async function endShift() {
    const idx = sessions.findIndex((s) => !s.end);
    if (idx < 0) return;
    const nowIso = new Date().toISOString();
    const s = sessions[idx];
    const hours = (new Date(nowIso) - new Date(s.start)) / 3600000;
    const rate = wageSettings.areaRates[s.area] || wageSettings.defaultRate;
    const updated = sessions.map((x, i) =>
      i === idx ? { ...x, end: nowIso, hours: Math.round(hours * 100) / 100, rate, wage: Math.round(hours * rate) } : x
    );
    setSessions(updated);
    await storageSet("work-sessions", updated);
  }

  async function deleteSession(id) {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    await storageSet("work-sessions", updated);
  }

  async function updateWageSettings(next) {
    setWageSettings(next);
    await storageSet("wage-settings", next);
  }

  async function addRule(rule) {
    const updated = [...scheduleRules, { ...rule, id: "r-" + Date.now() }];
    setScheduleRules(updated);
    await storageSet("schedule-rules", updated);
  }
  async function deleteRule(id) {
    const updated = scheduleRules.filter((r) => r.id !== id);
    setScheduleRules(updated);
    await storageSet("schedule-rules", updated);
  }

  const dateLabel = new Intl.DateTimeFormat("cs-CZ", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  if (loading) {
    return (
      <div style={{ background: C.bg, color: C.text, minHeight: "500px" }} className="flex items-center justify-center p-8">
        <p style={{ color: C.muted }}>Načítám provozní deník…</p>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "600px", fontFamily: "'Inter', system-ui, sans-serif" }} className="p-4 sm:p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .stencil { font-family: 'Oswald', 'Arial Narrow', sans-serif; letter-spacing: 0.03em; }
      `}</style>

      {/* Hlavička */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <h1 className="stencil text-xl sm:text-2xl font-bold uppercase" style={{ color: C.amber }}>
            Provozní deník údržby
          </h1>
          <p className="text-sm capitalize" style={{ color: C.muted }}>{dateLabel}</p>
        </div>
        <button
          onClick={toggleRain}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm"
          style={{
            background: weather.isRaining ? C.red + "22" : C.panelAlt,
            border: `1px solid ${weather.isRaining ? C.red : C.border}`,
            color: weather.isRaining ? C.red : C.text,
          }}
        >
          {weather.isRaining ? <CloudRain size={18} /> : <Sun size={18} />}
          {weather.isRaining ? "Dnes prší" : "Dnes je sucho"}
        </button>
      </div>

      {/* Taby */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <TabButton active={tab === "dnes"} onClick={() => setTab("dnes")} icon={CalendarDays}>Dnes</TabButton>
        <TabButton active={tab === "rozvrh"} onClick={() => setTab("rozvrh")} icon={CalendarClock}>Rozvrh</TabButton>
        <TabButton active={tab === "katalog"} onClick={() => setTab("katalog")} icon={Wrench}>Katalog</TabButton>
        <TabButton active={tab === "prehledy"} onClick={() => setTab("prehledy")} icon={BarChart3}>Přehledy</TabButton>
        <TabButton active={tab === "vykaz"} onClick={() => setTab("vykaz")} icon={Clock}>Výkaz práce</TabButton>
        <TabButton active={tab === "protokol"} onClick={() => setTab("protokol")} icon={ClipboardList}>Protokol</TabButton>
      </div>

      {tab === "dnes" && (
        <DnesTab
          dueIndoor={dueIndoor}
          outdoorAvailable={outdoorAvailable}
          outdoorBlocked={outdoorBlocked}
          fillerSuggestions={fillerSuggestions}
          extraTasks={extraTasks}
          totalToday={totalToday}
          onToggleTask={toggleTaskDone}
          onAddExtra={addExtra}
          onToggleExtra={toggleExtra}
          onDeleteExtra={deleteExtra}
        />
      )}

      {tab === "rozvrh" && (
        <RozvrhTab tasks={tasks} scheduleRules={scheduleRules} today={today} onAddRule={addRule} onDeleteRule={deleteRule} />
      )}

      {tab === "katalog" && (
        <KatalogTab tasks={tasks} onAdd={addTask} onDelete={deleteTask} today={today} />
      )}

      {tab === "protokol" && <ProtokolTab log={log} onAdd={addLogEntry} />}

      {tab === "prehledy" && <PrehledyTab tasks={tasks} history={history} today={today} />}

      {tab === "vykaz" && (
        <VykazTab
          sessions={sessions}
          wageSettings={wageSettings}
          today={today}
          onStart={startShift}
          onEnd={endShift}
          onDelete={deleteSession}
          onUpdateRates={updateWageSettings}
        />
      )}
    </div>
  );
}

function TaskRow({ task, onToggle, muted }) {
  const done = task.lastDone === todayStr();
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl mb-2"
      style={{ background: C.panel, border: `1px solid ${C.border}`, opacity: muted ? 0.55 : 1 }}
    >
      <button onClick={() => onToggle(task.id)} className="mt-0.5 shrink-0">
        {done ? <CheckCircle2 size={22} color={C.green} /> : <Circle size={22} color={C.muted} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm" style={{ textDecoration: done ? "line-through" : "none", color: done ? C.muted : C.text }}>
          {task.name}
        </p>
        {task.notes && <p className="text-xs mt-0.5" style={{ color: C.muted }}>{task.notes}</p>}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0 max-w-[40%]">
        <Badge color={task.category === "indoor" ? "#6FA8DC" : C.amber}>
          {task.category === "indoor" ? "Vnitřní" : "Venkovní"}
        </Badge>
        <div className="flex flex-wrap justify-end gap-1">
          {(task.areas || []).map((a) => <Badge key={a} color={areaInfo(a).color}>{areaInfo(a).label}</Badge>)}
        </div>
      </div>
    </div>
  );
}

function DnesTab({ dueIndoor, outdoorAvailable, outdoorBlocked, fillerSuggestions, extraTasks, totalToday, onToggleTask, onAddExtra, onToggleExtra, onDeleteExtra }) {
  const [newExtra, setNewExtra] = useState("");
  return (
    <div>
      <p className="text-sm mb-4" style={{ color: C.muted }}>
        {totalToday > 0 ? `Dnes vás čeká ${totalToday} úkolů.` : "Podle plánu dnes nic nevisí — mrkněte na náhradní tipy níže."}
      </p>

      {outdoorBlocked.length > 0 && (
        <div className="p-3 rounded-xl mb-4" style={{ background: C.red + "15", border: `1px solid ${C.red}55` }}>
          <p className="text-sm font-semibold mb-2" style={{ color: C.red }}>
            Odloženo kvůli dešti ({outdoorBlocked.length})
          </p>
          {outdoorBlocked.map((t) => (
            <p key={t.id} className="text-sm mb-1" style={{ color: C.muted }}>• {t.name}</p>
          ))}
        </div>
      )}

      {dueIndoor.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2" style={{ color: C.text }}>Vnitřní úkoly</p>
          {dueIndoor.map((t) => <TaskRow key={t.id} task={t} onToggle={onToggleTask} />)}
        </div>
      )}

      {outdoorAvailable.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2" style={{ color: C.text }}>Venkovní úkoly</p>
          {outdoorAvailable.map((t) => <TaskRow key={t.id} task={t} onToggle={onToggleTask} />)}
        </div>
      )}

      {(dueIndoor.length + outdoorAvailable.length === 0) && fillerSuggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2" style={{ color: C.text }}>Můžete udělat dopředu</p>
          {fillerSuggestions.map((t) => <TaskRow key={t.id} task={t} onToggle={onToggleTask} muted />)}
        </div>
      )}

      <div className="mb-2">
        <p className="text-sm font-semibold mb-2" style={{ color: C.text }}>Mimořádné úkoly dnes</p>
        {extraTasks.map((e) => (
          <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl mb-2" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <button onClick={() => onToggleExtra(e.id)} className="shrink-0">
              {e.done ? <CheckCircle2 size={20} color={C.green} /> : <Circle size={20} color={C.muted} />}
            </button>
            <p className="flex-1 text-sm" style={{ textDecoration: e.done ? "line-through" : "none", color: e.done ? C.muted : C.text }}>
              {e.name}
            </p>
            <button onClick={() => onDeleteExtra(e.id)}><Trash2 size={16} color={C.muted} /></button>
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <input
            value={newExtra}
            onChange={(e) => setNewExtra(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { onAddExtra(newExtra); setNewExtra(""); } }}
            placeholder="Přidat mimořádný úkol…"
            className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }}
          />
          <button
            onClick={() => { onAddExtra(newExtra); setNewExtra(""); }}
            className="px-3 py-2 rounded-xl"
            style={{ background: C.amber, color: "#1B1E21" }}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function KatalogTab({ tasks, onAdd, onDelete, today }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "indoor", role: "udrzbar", areas: [], months: [], interval: 30, notes: "" });

  function toggleMonth(m) {
    setForm((f) => ({ ...f, months: f.months.includes(m) ? f.months.filter((x) => x !== m) : [...f.months, m] }));
  }

  function submit() {
    if (!form.name.trim()) return;
    onAdd(form);
    setForm({ name: "", category: "indoor", role: "udrzbar", areas: [], months: [], interval: 30, notes: "" });
    setOpen(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm" style={{ color: C.muted }}>{tasks.length} úkolů v katalogu</p>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold"
          style={{ background: C.amber, color: "#1B1E21" }}
        >
          {open ? <X size={16} /> : <Plus size={16} />} {open ? "Zavřít" : "Přidat úkol"}
        </button>
      </div>

      {open && (
        <div className="p-4 rounded-xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <input
            placeholder="Název úkolu"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none"
            style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }}
          />
          <div className="flex gap-2 mb-3">
            {["indoor", "outdoor"].map((c) => (
              <button
                key={c}
                onClick={() => setForm({ ...form, category: c })}
                className="flex-1 py-2 rounded-lg text-sm font-medium"
                style={{
                  background: form.category === c ? C.amber : C.panelAlt,
                  color: form.category === c ? "#1B1E21" : C.text,
                }}
              >
                {c === "indoor" ? "Vnitřní" : "Venkovní"}
              </button>
            ))}
          </div>
          <p className="text-xs mb-1" style={{ color: C.muted }}>V jaké roli</p>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none"
            style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }}
          >
            {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
          <p className="text-xs mb-1" style={{ color: C.muted }}>Kde (může platit na víc místech)</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {AREAS.map((a) => {
              const checked = form.areas.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => setForm({ ...form, areas: checked ? form.areas.filter((x) => x !== a.id) : [...form.areas, a.id] })}
                  className="px-2 py-1 rounded-md text-xs font-medium"
                  style={{ background: checked ? a.color : C.panelAlt, color: checked ? "#fff" : C.muted }}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs mb-1" style={{ color: C.muted }}>Sezóna (nic nezaškrtnuto = celoročně)</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {MONTHS.map((m, i) => (
              <button
                key={m}
                onClick={() => toggleMonth(i + 1)}
                className="px-2 py-1 rounded-md text-xs font-medium"
                style={{
                  background: form.months.includes(i + 1) ? C.amber : C.panelAlt,
                  color: form.months.includes(i + 1) ? "#1B1E21" : C.muted,
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="text-xs mb-1" style={{ color: C.muted }}>Jak často</p>
          <select
            value={form.interval}
            onChange={(e) => setForm({ ...form, interval: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none"
            style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }}
          >
            {FREQ.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          <input
            placeholder="Poznámka (nepovinné)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none"
            style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }}
          />
          <button onClick={submit} className="w-full py-2 rounded-lg font-semibold text-sm" style={{ background: C.green, color: "#1B1E21" }}>
            Uložit úkol
          </button>
        </div>
      )}

      {tasks.map((t) => {
        const due = isDue(t, today);
        const nextDue = t.lastDone ? addDaysStr(t.lastDone, t.interval) : "ihned";
        return (
          <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl mb-2" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-medium text-sm">{t.name}</p>
                <Badge color={t.category === "indoor" ? "#6FA8DC" : C.amber}>{t.category === "indoor" ? "Vnitřní" : "Venkovní"}</Badge>
                <Badge color={roleInfo(t.role).color}>{roleInfo(t.role).label}</Badge>
                {due && <Badge color={C.green}>Aktuálně due</Badge>}
                {(t.areas || []).map((a) => <Badge key={a} color={areaInfo(a).color}>{areaInfo(a).label}</Badge>)}
              </div>
              <p className="text-xs" style={{ color: C.muted }}>
                {FREQ.find((f) => f.value === t.interval)?.label} · {t.months.length ? t.months.map((m) => MONTHS[m - 1]).join(", ") : "celoročně"} · další termín: {nextDue}
              </p>
              {t.notes && <p className="text-xs mt-1" style={{ color: C.muted }}>{t.notes}</p>}
            </div>
            <button onClick={() => onDelete(t.id)}><Trash2 size={16} color={C.muted} /></button>
          </div>
        );
      })}
    </div>
  );
}

function ProtokolTab({ log, onAdd }) {
  const [form, setForm] = useState({ type: null, author: "", text: "" });

  function submit() {
    if (!form.text.trim()) return;
    onAdd({ type: form.type, author: form.author || "Údržbář", text: form.text });
    setForm({ type: null, author: form.author, text: "" });
  }

  return (
    <div>
      {!form.type ? (
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setForm((f) => ({ ...f, type: "ranni" }))}
            className="flex-1 flex flex-col items-center gap-1 py-4 rounded-xl font-semibold text-sm"
            style={{ background: C.panel, border: `1px solid ${C.border}` }}
          >
            <Sunrise color={C.amber} /> Ranní předání
          </button>
          <button
            onClick={() => setForm((f) => ({ ...f, type: "vecerni" }))}
            className="flex-1 flex flex-col items-center gap-1 py-4 rounded-xl font-semibold text-sm"
            style={{ background: C.panel, border: `1px solid ${C.border}` }}
          >
            <Sunset color="#6FA8DC" /> Večerní předání
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <p className="text-sm font-semibold mb-3 flex items-center gap-2">
            {form.type === "ranni" ? <Sunrise size={16} color={C.amber} /> : <Sunset size={16} color="#6FA8DC" />}
            {form.type === "ranni" ? "Ranní předání" : "Večerní předání"}
          </p>
          <input
            placeholder="Jméno"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none"
            style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }}
          />
          <textarea
            placeholder={form.type === "ranni" ? "Co je naplánováno, co bylo nahlášeno…" : "Co se dnes stihlo, co zůstává na zítra…"}
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none resize-none"
            style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }}
          />
          <div className="flex gap-2">
            <button onClick={() => setForm({ type: null, author: form.author, text: "" })} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ background: C.panelAlt, color: C.muted }}>
              Zrušit
            </button>
            <button onClick={submit} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: C.amber, color: "#1B1E21" }}>
              Uložit záznam
            </button>
          </div>
        </div>
      )}

      <p className="text-sm font-semibold mb-2" style={{ color: C.text }}>Historie</p>
      {log.length === 0 && <p className="text-sm" style={{ color: C.muted }}>Zatím žádné záznamy.</p>}
      {log.map((entry) => (
        <div key={entry.id} className="p-3 rounded-xl mb-2" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2 mb-1 text-xs" style={{ color: C.muted }}>
            {entry.type === "ranni" ? <Sunrise size={14} color={C.amber} /> : <Sunset size={14} color="#6FA8DC" />}
            <span className="font-semibold" style={{ color: C.text }}>{entry.author}</span>
            <span>· {entry.date} {entry.time}</span>
          </div>
          <p className="text-sm">{entry.text}</p>
        </div>
      ))}
    </div>
  );
}

function AreaBreakdown({ items }) {
  const counts = {};
  items.forEach((i) => {
    (i.areas && i.areas.length ? i.areas : ["mimoradne"]).forEach((a) => {
      counts[a] = (counts[a] || 0) + 1;
    });
  });
  const entries = Object.entries(counts);
  if (entries.length === 0) return <p className="text-xs" style={{ color: C.muted }}>Zatím nic.</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([area, count]) => {
        const info = areaInfo(area);
        return (
          <span key={area} className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: info.color + "22", color: info.color, border: `1px solid ${info.color}55` }}>
            {info.label} · {count}
          </span>
        );
      })}
    </div>
  );
}

function SimpleListItem({ name, areas, category, note }) {
  const list = areas && areas.length ? areas : ["mimoradne"];
  return (
    <div className="flex items-start gap-2 p-2.5 rounded-lg mb-1.5" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="flex flex-col gap-0.5 mt-1 shrink-0">
        {list.map((a) => <span key={a} className="w-2 h-2 rounded-full" style={{ background: areaInfo(a).color }} />)}
      </div>
      <p className="flex-1 text-sm min-w-0">{name}</p>
      {category && (
        <Badge color={category === "indoor" ? "#6FA8DC" : category === "extra" ? C.red : C.amber}>
          {category === "indoor" ? "Vnitřní" : category === "extra" ? "Mimořádné" : "Venkovní"}
        </Badge>
      )}
      {note && <span className="text-xs shrink-0" style={{ color: C.muted }}>{note}</span>}
    </div>
  );
}

function MonthCalendar({ year, month, history, today, selectedDay, onSelectDay }) {
  const dim = daysInMonth(year, month);
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7; // 0 = Monday
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: dim }, (_, i) => i + 1)];
  const countsByDay = {};
  history.forEach((h) => {
    if (h.date.startsWith(`${year}-${pad2(month)}`)) countsByDay[h.date] = (countsByDay[h.date] || 0) + 1;
  });
  const dow = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dow.map((l) => <div key={l} className="text-center text-xs font-medium" style={{ color: C.muted }}>{l}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={"b" + i} />;
          const dateStr = `${year}-${pad2(month)}-${pad2(d)}`;
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDay;
          const count = countsByDay[dateStr] || 0;
          return (
            <button
              key={dateStr}
              onClick={() => onSelectDay(dateStr === selectedDay ? null : dateStr)}
              className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative"
              style={{
                background: isSelected ? C.amber + "33" : C.panelAlt,
                border: isToday ? `2px solid ${C.amber}` : `1px solid ${C.border}`,
                color: C.text,
              }}
            >
              {d}
              {count > 0 && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full" style={{ background: C.green }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PrehledyTab({ tasks, history, today }) {
  const [period, setPeriod] = useState("mesic");
  const [cursor, setCursor] = useState(today); // reference date, lets you flip months
  const [selectedDay, setSelectedDay] = useState(null);

  const cursorDate = new Date(cursor + "T00:00:00");
  const year = cursorDate.getFullYear();
  const month = cursorDate.getMonth() + 1;

  function shiftMonth(delta) {
    const d = new Date(year, month - 1 + delta, 1);
    setCursor(d.toISOString().slice(0, 10));
    setSelectedDay(null);
  }

  const periods = [
    { id: "rok", label: "Rok" },
    { id: "mesic", label: "Měsíc" },
    { id: "tyden", label: "Týden" },
    { id: "den", label: "Den" },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className="flex-1 py-2 rounded-xl text-sm font-semibold"
            style={{ background: period === p.id ? C.amber : C.panel, color: period === p.id ? "#1B1E21" : C.muted, border: `1px solid ${C.border}` }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {period === "mesic" && (
        <MonthReport tasks={tasks} history={history} today={today} year={year} month={month} onShiftMonth={shiftMonth} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      )}
      {period === "tyden" && <WeekReport tasks={tasks} history={history} today={today} />}
      {period === "den" && <DayReport tasks={tasks} history={history} today={today} />}
      {period === "rok" && <YearReport tasks={tasks} history={history} today={today} year={year} />}
    </div>
  );
}

function MonthReport({ tasks, history, today, year, month, onShiftMonth, selectedDay, setSelectedDay }) {
  const [start, end] = monthRange(year, month);
  const isCurrentMonth = start.slice(0, 7) === today.slice(0, 7);
  const effectiveTodayInMonth = isCurrentMonth ? today : end;

  const completed = completedInRange(history, start, effectiveTodayInMonth);
  const pending = pendingInRange(tasks, isCurrentMonth ? today : start, end, today).filter(
    (t) => !completed.some((c) => c.taskId === t.id)
  );
  const daysLeft = isCurrentMonth ? daysBetween(today, end) : null;
  const dayDetail = selectedDay ? history.filter((h) => h.date === selectedDay) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => onShiftMonth(-1)} className="p-2 rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}><ChevronLeft size={16} /></button>
        <p className="stencil font-semibold capitalize" style={{ color: C.amber }}>{MONTHS_FULL[month - 1]} {year}</p>
        <button onClick={() => onShiftMonth(1)} className="p-2 rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}><ChevronRight size={16} /></button>
      </div>

      <div className="p-3 rounded-xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <MonthCalendar year={year} month={month} history={history} today={today} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        {isCurrentMonth && <p className="text-xs mt-2 text-center" style={{ color: C.muted }}>{daysLeft === 0 ? "Dnes měsíc končí." : `Do konce měsíce zbývá ${daysLeft} ${daysLeft === 1 ? "den" : daysLeft < 5 ? "dny" : "dní"}.`}</p>}
      </div>

      {dayDetail && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Hotovo {selectedDay}</p>
          {dayDetail.length === 0 && <p className="text-xs" style={{ color: C.muted }}>Ten den nic zaznamenáno.</p>}
          {dayDetail.map((h) => <SimpleListItem key={h.id} name={h.name} areas={h.areas} category={h.category} />)}
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm font-semibold mb-2" style={{ color: C.green }}>Hotovo tento měsíc ({completed.length})</p>
        <AreaBreakdown items={completed} />
      </div>

      <div>
        <p className="text-sm font-semibold mb-2" style={{ color: C.amber }}>
          {isCurrentMonth ? `Ještě zbývá do konce měsíce (${pending.length})` : `Bylo naplánováno (${pending.length})`}
        </p>
        {pending.length === 0 && <p className="text-xs" style={{ color: C.muted }}>Nic nevisí — pěkná práce.</p>}
        {pending.map((t) => <SimpleListItem key={t.id} name={t.name} areas={t.areas} category={t.category} />)}
      </div>
    </div>
  );
}

function WeekReport({ tasks, history, today }) {
  const [cursor, setCursor] = useState(today);
  const [selectedDay, setSelectedDay] = useState(null);
  const start = startOfWeek(cursor);
  const end = endOfWeek(cursor);
  const effectiveEnd = end > today ? today : end; // don't count "completed" into the future
  const completed = completedInRange(history, start, effectiveEnd < start ? start : effectiveEnd);
  const pending = pendingInRange(tasks, today > start ? today : start, end, today).filter(
    (t) => !completed.some((c) => c.taskId === t.id)
  );
  const dow = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];
  const days = Array.from({ length: 7 }, (_, i) => addDaysStr(start, i));
  const countsByDay = {};
  history.forEach((h) => { if (h.date >= start && h.date <= end) countsByDay[h.date] = (countsByDay[h.date] || 0) + 1; });
  const dayDetail = selectedDay ? history.filter((h) => h.date === selectedDay) : null;

  function shiftWeek(delta) {
    setCursor(addDaysStr(cursor, delta * 7));
    setSelectedDay(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => shiftWeek(-1)} className="p-2 rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}><ChevronLeft size={16} /></button>
        <p className="stencil font-semibold" style={{ color: C.amber }}>{start} – {end}</p>
        <button onClick={() => shiftWeek(1)} className="p-2 rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((d, i) => {
          const isToday = d === today;
          const isSelected = d === selectedDay;
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d === selectedDay ? null : d)}
              className="flex flex-col items-center p-2 rounded-lg"
              style={{
                background: isSelected ? C.amber + "33" : C.panel,
                border: `1px solid ${isToday ? C.amber : C.border}`,
                borderWidth: isToday ? 2 : 1,
              }}
            >
              <span className="text-xs" style={{ color: C.muted }}>{dow[i]}</span>
              <span className="text-sm font-semibold">{Number(d.slice(8, 10))}</span>
              {countsByDay[d] > 0 && <span className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: C.green }} />}
            </button>
          );
        })}
      </div>

      {dayDetail && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Hotovo {selectedDay}</p>
          {dayDetail.length === 0 && <p className="text-xs" style={{ color: C.muted }}>Ten den nic zaznamenáno.</p>}
          {dayDetail.map((h) => <SimpleListItem key={h.id} name={h.name} areas={h.areas} category={h.category} />)}
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm font-semibold mb-2" style={{ color: C.green }}>Hotovo tento týden ({completed.length})</p>
        <AreaBreakdown items={completed} />
      </div>
      <div>
        <p className="text-sm font-semibold mb-2" style={{ color: C.amber }}>Ještě zbývá do konce týdne ({pending.length})</p>
        {pending.length === 0 && <p className="text-xs" style={{ color: C.muted }}>Nic nevisí.</p>}
        {pending.map((t) => <SimpleListItem key={t.id} name={t.name} areas={t.areas} category={t.category} />)}
      </div>
    </div>
  );
}

function DayReport({ tasks, history, today }) {
  const month = new Date(today + "T00:00:00").getMonth() + 1;
  const completedToday = completedInRange(history, today, today);
  const dueToday = tasks.filter((t) => isSeasonActive(t, month) && isDue(t, today));
  return (
    <div>
      <p className="text-sm mb-4" style={{ color: C.muted }}>Denní přehled — {today}</p>
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2" style={{ color: C.green }}>Hotovo dnes ({completedToday.length})</p>
        {completedToday.length === 0 && <p className="text-xs" style={{ color: C.muted }}>Zatím nic — den teprve začíná.</p>}
        {completedToday.map((h) => <SimpleListItem key={h.id} name={h.name} areas={h.areas} category={h.category} />)}
      </div>
      <div>
        <p className="text-sm font-semibold mb-2" style={{ color: C.amber }}>Na řadě dnes ({dueToday.length})</p>
        {dueToday.length === 0 && <p className="text-xs" style={{ color: C.muted }}>Nic plánovaného — mrkněte do záložky Dnes na tipy navíc.</p>}
        {dueToday.map((t) => <SimpleListItem key={t.id} name={t.name} areas={t.areas} category={t.category} />)}
      </div>
    </div>
  );
}

function YearReport({ tasks, history, today, year }) {
  const month = new Date(today + "T00:00:00").getMonth() + 1;
  const monthCounts = MONTHS.map((_, i) => {
    const [s, e] = monthRange(year, i + 1);
    return completedInRange(history, s, e).length;
  });
  const max = Math.max(1, ...monthCounts);
  const yearCompleted = completedInRange(history, `${year}-01-01`, `${year}-12-31`);
  const upcoming = tasks
    .filter((t) => t.months && t.months.length > 0 && t.months.some((m) => m > month))
    .sort((a, b) => Math.min(...a.months.filter((m) => m > month)) - Math.min(...b.months.filter((m) => m > month)));

  return (
    <div>
      <p className="text-sm mb-3" style={{ color: C.muted }}>Rok {year} · celkem hotovo {yearCompleted.length} úkolů</p>
      <div className="p-3 rounded-xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="flex items-end gap-1" style={{ height: 90 }}>
          {monthCounts.map((c, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
              <div
                className="w-full rounded-t"
                style={{ height: `${(c / max) * 100}%`, minHeight: c > 0 ? 4 : 0, background: i + 1 === month ? C.amber : C.panelAlt, border: `1px solid ${C.border}` }}
              />
              <span className="text-xs mt-1" style={{ color: i + 1 === month ? C.amber : C.muted }}>{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2" style={{ color: C.green }}>Rozložení podle míst za rok</p>
        <AreaBreakdown items={yearCompleted} />
      </div>
      <div>
        <p className="text-sm font-semibold mb-2" style={{ color: C.amber }}>Co se blíží zbytek roku</p>
        {upcoming.length === 0 && <p className="text-xs" style={{ color: C.muted }}>Nic sezónního dál v katalogu.</p>}
        {upcoming.map((t) => (
          <SimpleListItem key={t.id} name={t.name} areas={t.areas} category={t.category} note={MONTHS[Math.min(...t.months.filter((m) => m > month)) - 1]} />
        ))}
      </div>
    </div>
  );
}

// ---------- Výkaz práce (elektronické píchačky) ----------
function fmtHM(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}:${String(m).padStart(2, "0")}`;
}
function fmtCzk(n) {
  return Math.round(n).toLocaleString("cs-CZ") + " Kč";
}
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
}
function sessionRate(s, wageSettings) {
  return s.rate || wageSettings.areaRates[s.area] || wageSettings.defaultRate;
}
function sessionHours(s) {
  if (s.hours != null) return s.hours;
  return (Date.now() - new Date(s.start).getTime()) / 3600000;
}
function sessionWage(s, wageSettings) {
  if (s.wage != null) return s.wage;
  return sessionHours(s) * sessionRate(s, wageSettings);
}
function sessionsInRange(sessions, start, end) {
  return sessions.filter((s) => s.date >= start && s.date <= end);
}

function WageBreakdown({ sessions, wageSettings }) {
  const totals = {};
  sessions.forEach((s) => {
    totals[s.area] = (totals[s.area] || 0) + sessionHours(s);
  });
  const entries = Object.entries(totals);
  if (entries.length === 0) return <p className="text-xs" style={{ color: C.muted }}>Zatím nic.</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([area, hrs]) => {
        const info = areaInfo(area);
        return (
          <span key={area} className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: info.color + "22", color: info.color, border: `1px solid ${info.color}55` }}>
            {info.label} · {fmtHM(hrs)} h
          </span>
        );
      })}
    </div>
  );
}

function ShiftRow({ s, wageSettings, onDelete }) {
  const hrs = sessionHours(s);
  const wage = sessionWage(s, wageSettings);
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl mb-2" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: areaInfo(s.area).color }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {fmtTime(s.start)} – {s.end ? fmtTime(s.end) : "probíhá"} <span style={{ color: C.muted }}>({areaInfo(s.area).label})</span>
        </p>
        <p className="text-xs" style={{ color: C.muted }}>{fmtHM(hrs)} h · {fmtCzk(wage)}</p>
      </div>
      {onDelete && (
        <button onClick={() => onDelete(s.id)}><Trash2 size={16} color={C.muted} /></button>
      )}
    </div>
  );
}

function RateSettings({ wageSettings, onUpdateRates }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(wageSettings);

  function save() {
    onUpdateRates(draft);
    setOpen(false);
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => { setDraft(wageSettings); setOpen((o) => !o); }}
        className="flex items-center gap-2 text-sm font-medium"
        style={{ color: C.muted }}
      >
        <Settings2 size={15} /> Nastavení sazeb {open ? <X size={14} /> : null}
      </button>
      {open && (
        <div className="p-3 rounded-xl mt-2" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
          <p className="text-xs mb-1" style={{ color: C.muted }}>Základní sazba (Kč/hod)</p>
          <input
            type="number"
            value={draft.defaultRate}
            onChange={(e) => setDraft({ ...draft, defaultRate: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none"
            style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }}
          />
          <p className="text-xs mb-2" style={{ color: C.muted }}>Vlastní sazba pro jednotlivé činnosti (nepovinné, prázdné = základní sazba)</p>
          {AREAS.map((a) => (
            <div key={a.id} className="flex items-center gap-2 mb-2">
              <span className="text-xs flex-1" style={{ color: a.color }}>{a.label}</span>
              <input
                type="number"
                placeholder={String(draft.defaultRate)}
                value={draft.areaRates[a.id] ?? ""}
                onChange={(e) => setDraft({ ...draft, areaRates: { ...draft.areaRates, [a.id]: e.target.value === "" ? null : Number(e.target.value) } })}
                className="w-24 px-2 py-1.5 rounded-lg text-sm outline-none"
                style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }}
              />
            </div>
          ))}
          <button onClick={save} className="w-full py-2 rounded-lg font-semibold text-sm mt-1" style={{ background: C.green, color: "#1B1E21" }}>
            Uložit sazby
          </button>
        </div>
      )}
    </div>
  );
}

function PunchCard({ active, wageSettings, onStart, onEnd }) {
  const [pickArea, setPickArea] = useState("obecne");
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => forceTick((t) => t + 1), 15000);
    return () => clearInterval(id);
  }, [active]);

  if (active) {
    const hrs = sessionHours(active);
    const wage = sessionWage(active, wageSettings);
    return (
      <div className="p-4 rounded-xl mb-4" style={{ background: C.green + "15", border: `1px solid ${C.green}55` }}>
        <p className="text-xs mb-1" style={{ color: C.muted }}>Na směně od {fmtTime(active.start)} · {areaInfo(active.area).label}</p>
        <p className="stencil text-2xl font-bold mb-3" style={{ color: C.green }}>{fmtHM(hrs)} h <span className="text-base font-medium" style={{ color: C.text }}>· {fmtCzk(wage)}</span></p>
        <button onClick={onEnd} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold" style={{ background: C.red, color: "#fff" }}>
          <StopCircle size={20} /> Ukončit směnu
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <p className="text-xs mb-2" style={{ color: C.muted }}>Mimo směnu — na čem začínáte pracovat?</p>
      <select
        value={pickArea}
        onChange={(e) => setPickArea(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none"
        style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }}
      >
        {AREAS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
      </select>
      <button onClick={() => onStart(pickArea)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold" style={{ background: C.amber, color: "#1B1E21" }}>
        <PlayCircle size={20} /> Začít směnu
      </button>
    </div>
  );
}

function VykazTab({ sessions, wageSettings, today, onStart, onEnd, onDelete, onUpdateRates }) {
  const [period, setPeriod] = useState("den");
  const active = sessions.find((s) => !s.end);

  const periods = [
    { id: "rok", label: "Rok" },
    { id: "mesic", label: "Měsíc" },
    { id: "tyden", label: "Týden" },
    { id: "den", label: "Den" },
  ];

  return (
    <div>
      <PunchCard active={active} wageSettings={wageSettings} onStart={onStart} onEnd={onEnd} />
      <RateSettings wageSettings={wageSettings} onUpdateRates={onUpdateRates} />

      <div className="flex gap-2 mb-4">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className="flex-1 py-2 rounded-xl text-sm font-semibold"
            style={{ background: period === p.id ? C.amber : C.panel, color: period === p.id ? "#1B1E21" : C.muted, border: `1px solid ${C.border}` }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {period === "den" && <VykazPeriod sessions={sessionsInRange(sessions, today, today)} wageSettings={wageSettings} onDelete={onDelete} emptyLabel="Dnes zatím žádná odpracovaná doba." />}
      {period === "tyden" && <VykazPeriod sessions={sessionsInRange(sessions, startOfWeek(today), endOfWeek(today))} wageSettings={wageSettings} onDelete={onDelete} emptyLabel="Tento týden zatím nic." rangeLabel={`${startOfWeek(today)} – ${endOfWeek(today)}`} />}
      {period === "mesic" && (() => {
        const [s, e] = monthRange(new Date(today).getFullYear(), new Date(today).getMonth() + 1);
        return <VykazPeriod sessions={sessionsInRange(sessions, s, e)} wageSettings={wageSettings} onDelete={onDelete} emptyLabel="Tento měsíc zatím nic." rangeLabel={`${MONTHS_FULL[new Date(today).getMonth()]} ${new Date(today).getFullYear()}`} />;
      })()}
      {period === "rok" && (() => {
        const year = new Date(today).getFullYear();
        return <VykazPeriod sessions={sessionsInRange(sessions, `${year}-01-01`, `${year}-12-31`)} wageSettings={wageSettings} onDelete={onDelete} emptyLabel="Letos zatím nic." rangeLabel={String(year)} />;
      })()}
    </div>
  );
}

function VykazPeriod({ sessions, wageSettings, onDelete, emptyLabel, rangeLabel }) {
  const totalHours = sessions.reduce((sum, s) => sum + sessionHours(s), 0);
  const totalWage = sessions.reduce((sum, s) => sum + sessionWage(s, wageSettings), 0);
  const sorted = [...sessions].sort((a, b) => (a.start < b.start ? 1 : -1));

  return (
    <div>
      {rangeLabel && <p className="text-sm mb-3" style={{ color: C.muted }}>{rangeLabel}</p>}
      <div className="p-4 rounded-xl mb-4 flex items-center justify-between" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div>
          <p className="text-xs" style={{ color: C.muted }}>Odpracováno</p>
          <p className="stencil text-xl font-bold" style={{ color: C.text }}>{fmtHM(totalHours)} h</p>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: C.muted }}>Celkem</p>
          <p className="stencil text-xl font-bold flex items-center gap-1" style={{ color: C.amber }}><Wallet size={18} />{fmtCzk(totalWage)}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Podle činnosti</p>
        <WageBreakdown sessions={sessions} wageSettings={wageSettings} />
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Jednotlivé směny</p>
        {sorted.length === 0 && <p className="text-xs" style={{ color: C.muted }}>{emptyLabel}</p>}
        {sorted.map((s) => <ShiftRow key={s.id} s={s} wageSettings={wageSettings} onDelete={s.end ? onDelete : null} />)}
      </div>
    </div>
  );
}

// ---------- Rozvrh (KDY × KDE × ROLE × CO) ----------
function ruleActiveOnDate(rule, dateStr) {
  if (!rule.days || rule.days.length === 0) return false; // on-demand rules aren't date-bound
  const dow = isoDow(dateStr);
  const month = new Date(dateStr + "T00:00:00").getMonth() + 1;
  const monthsOk = !rule.months || rule.months.length === 0 || rule.months.includes(month);
  return rule.days.includes(dow) && monthsOk;
}
function scheduledRules(rules) { return rules.filter((r) => r.days && r.days.length > 0); }
function onDemandRules(rules) { return rules.filter((r) => !r.days || r.days.length === 0); }

function matchingTasks(tasks, rule, dateStr) {
  const month = new Date(dateStr + "T00:00:00").getMonth() + 1;
  return tasks.filter(
    (t) =>
      t.role === rule.role &&
      (rule.areas.length === 0 || (t.areas || []).some((a) => rule.areas.includes(a))) &&
      isSeasonActive(t, month)
  );
}

function RuleBlock({ rule, tasks, dateStr }) {
  const info = roleInfo(rule.role);
  const related = dateStr ? matchingTasks(tasks, rule, dateStr) : [];
  return (
    <div className="p-3 rounded-xl mb-2" style={{ background: C.panel, border: `1px solid ${C.border}`, borderLeft: `4px solid ${info.color}` }}>
      <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
        <p className="text-sm font-semibold">{rule.label}</p>
        {(rule.timeStart || rule.timeEnd) && (
          <span className="text-xs font-medium" style={{ color: info.color }}>{rule.timeStart}–{rule.timeEnd}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1 mb-1">
        <Badge color={info.color}>{info.label}</Badge>
        {rule.areas.map((a) => <Badge key={a} color={areaInfo(a).color}>{areaInfo(a).label}</Badge>)}
        {rule.subject && <Badge color={C.muted}>{rule.subject}</Badge>}
      </div>
      {rule.note && <p className="text-xs" style={{ color: C.muted }}>{rule.note}</p>}
      {related.length > 0 && (
        <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${C.border}` }}>
          <p className="text-xs font-medium mb-1" style={{ color: C.muted }}>Co konkrétně (z katalogu):</p>
          {related.slice(0, 4).map((t) => (
            <p key={t.id} className="text-xs" style={{ color: C.text }}>• {t.name}</p>
          ))}
          {related.length > 4 && <p className="text-xs" style={{ color: C.muted }}>+ {related.length - 4} dalších v Katalogu</p>}
        </div>
      )}
    </div>
  );
}

function DayAgenda({ rules, tasks, dateStr }) {
  const active = scheduledRules(rules).filter((r) => ruleActiveOnDate(r, dateStr))
    .sort((a, b) => (a.timeStart || "").localeCompare(b.timeStart || ""));
  if (active.length === 0) return <p className="text-sm" style={{ color: C.muted }}>Ten den nemá žádný pravidelný blok.</p>;
  return <div>{active.map((r) => <RuleBlock key={r.id} rule={r} tasks={tasks} dateStr={dateStr} />)}</div>;
}

function RozvrhDen({ tasks, scheduleRules, today }) {
  const [cursor, setCursor] = useState(today);
  const dow = DOW[isoDow(cursor) - 1];
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCursor(addDaysStr(cursor, -1))} className="p-2 rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}><ChevronLeft size={16} /></button>
        <p className="stencil font-semibold" style={{ color: C.amber }}>{dow} {cursor}{cursor === today ? " · dnes" : ""}</p>
        <button onClick={() => setCursor(addDaysStr(cursor, 1))} className="p-2 rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}><ChevronRight size={16} /></button>
      </div>
      <DayAgenda rules={scheduleRules} tasks={tasks} dateStr={cursor} />
    </div>
  );
}

function RozvrhTyden({ tasks, scheduleRules, today }) {
  const [cursor, setCursor] = useState(today);
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => addDaysStr(start, i));
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCursor(addDaysStr(cursor, -7))} className="p-2 rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}><ChevronLeft size={16} /></button>
        <p className="stencil font-semibold" style={{ color: C.amber }}>{start} – {endOfWeek(cursor)}</p>
        <button onClick={() => setCursor(addDaysStr(cursor, 7))} className="p-2 rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}><ChevronRight size={16} /></button>
      </div>
      {days.map((d, i) => {
        const active = scheduledRules(scheduleRules).filter((r) => ruleActiveOnDate(r, d))
          .sort((a, b) => (a.timeStart || "").localeCompare(b.timeStart || ""));
        return (
          <div key={d} className="mb-3">
            <p className="text-xs font-semibold mb-1" style={{ color: d === today ? C.amber : C.muted }}>
              {DOW[i]} {Number(d.slice(8, 10))}. {d === today ? "· dnes" : ""}
            </p>
            {active.length === 0 ? (
              <p className="text-xs pl-2" style={{ color: C.muted }}>—</p>
            ) : (
              active.map((r) => {
                const info = roleInfo(r.role);
                return (
                  <div key={r.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg mb-1" style={{ background: C.panel, borderLeft: `3px solid ${info.color}` }}>
                    <span className="text-xs font-medium shrink-0" style={{ color: info.color }}>{r.timeStart}–{r.timeEnd}</span>
                    <span className="text-xs flex-1 truncate">{r.label}</span>
                  </div>
                );
              })
            )}
          </div>
        );
      })}
    </div>
  );
}

function RozvrhMesic({ tasks, scheduleRules, today }) {
  const [cursor, setCursor] = useState(today);
  const [selectedDay, setSelectedDay] = useState(null);
  const cursorDate = new Date(cursor + "T00:00:00");
  const year = cursorDate.getFullYear();
  const month = cursorDate.getMonth() + 1;
  const dim = daysInMonth(year, month);
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: dim }, (_, i) => i + 1)];

  function shift(delta) {
    const d = new Date(year, month - 1 + delta, 1);
    setCursor(d.toISOString().slice(0, 10));
    setSelectedDay(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => shift(-1)} className="p-2 rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}><ChevronLeft size={16} /></button>
        <p className="stencil font-semibold capitalize" style={{ color: C.amber }}>{MONTHS_FULL[month - 1]} {year}</p>
        <button onClick={() => shift(1)} className="p-2 rounded-lg" style={{ background: C.panel, border: `1px solid ${C.border}` }}><ChevronRight size={16} /></button>
      </div>
      <div className="p-3 rounded-xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DOW.map((l) => <div key={l} className="text-center text-xs font-medium" style={{ color: C.muted }}>{l}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (d === null) return <div key={"b" + i} />;
            const dateStr = `${year}-${pad2(month)}-${pad2(d)}`;
            const rolesActive = [...new Set(scheduledRules(scheduleRules).filter((r) => ruleActiveOnDate(r, dateStr)).map((r) => r.role))];
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDay;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDay(dateStr === selectedDay ? null : dateStr)}
                className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative"
                style={{ background: isSelected ? C.amber + "33" : C.panelAlt, border: isToday ? `2px solid ${C.amber}` : `1px solid ${C.border}` }}
              >
                {d}
                <div className="flex gap-0.5 absolute bottom-1">
                  {rolesActive.slice(0, 3).map((r) => <span key={r} className="w-1.5 h-1.5 rounded-full" style={{ background: roleInfo(r).color }} />)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {selectedDay && (
        <div>
          <p className="text-sm font-semibold mb-2">{selectedDay}</p>
          <DayAgenda rules={scheduleRules} tasks={tasks} dateStr={selectedDay} />
        </div>
      )}
    </div>
  );
}

function RozvrhRok({ scheduleRules, today }) {
  const year = new Date(today).getFullYear();
  const scheduled = scheduledRules(scheduleRules);
  const rolesUsed = [...new Set(scheduled.map((r) => r.role))];
  return (
    <div>
      <p className="text-sm mb-3" style={{ color: C.muted }}>Sezónní rytmus rolí — {year}</p>
      {rolesUsed.map((roleId) => {
        const info = roleInfo(roleId);
        const rulesOfRole = scheduled.filter((r) => r.role === roleId);
        const monthsActive = new Set();
        rulesOfRole.forEach((r) => {
          if (!r.months || r.months.length === 0) MONTHS.forEach((_, i) => monthsActive.add(i + 1));
          else r.months.forEach((m) => monthsActive.add(m));
        });
        return (
          <div key={roleId} className="mb-3 p-3 rounded-xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <p className="text-sm font-semibold mb-2" style={{ color: info.color }}>{info.label}</p>
            <div className="flex gap-1">
              {MONTHS.map((m, i) => (
                <div key={m} className="flex-1 flex flex-col items-center">
                  <div className="w-full rounded" style={{ height: 20, background: monthsActive.has(i + 1) ? info.color : C.panelAlt }} />
                  <span className="text-[10px] mt-1" style={{ color: C.muted }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <p className="text-sm font-semibold mt-4 mb-2" style={{ color: C.text }}>Bez pevného rozvrhu (dle potřeby)</p>
      {onDemandRules(scheduleRules).map((r) => {
        const info = roleInfo(r.role);
        return (
          <div key={r.id} className="p-3 rounded-xl mb-2" style={{ background: C.panel, border: `1px solid ${C.border}`, borderLeft: `4px solid ${info.color}` }}>
            <div className="flex items-center gap-2 mb-1">
              <Badge color={info.color}>{info.label}</Badge>
              <p className="text-sm font-medium">{r.label}</p>
            </div>
            {r.note && <p className="text-xs" style={{ color: C.muted }}>{r.note}</p>}
          </div>
        );
      })}
    </div>
  );
}

function RuleForm({ onAdd, onClose }) {
  const [form, setForm] = useState({ label: "", role: "udrzbar", days: [], months: [], timeStart: "08:00", timeEnd: "12:00", areas: [], subject: "", note: "" });
  function toggle(field, val) {
    setForm((f) => ({ ...f, [field]: f[field].includes(val) ? f[field].filter((x) => x !== val) : [...f[field], val] }));
  }
  function submit() {
    if (!form.label.trim()) return;
    onAdd(form);
    onClose();
  }
  return (
    <div className="p-4 rounded-xl mb-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <input placeholder="Název bloku (např. Dílna s dětmi)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
        className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none" style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }} />
      <p className="text-xs mb-1" style={{ color: C.muted }}>V jaké roli</p>
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
        className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none" style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }}>
        {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
      </select>
      <p className="text-xs mb-1" style={{ color: C.muted }}>Dny (nic = bez pevného dne / dle potřeby)</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {DOW.map((d, i) => (
          <button key={d} onClick={() => toggle("days", i + 1)} className="px-2 py-1 rounded-md text-xs font-medium"
            style={{ background: form.days.includes(i + 1) ? C.amber : C.panelAlt, color: form.days.includes(i + 1) ? "#1B1E21" : C.muted }}>{d}</button>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <input type="time" value={form.timeStart} onChange={(e) => setForm({ ...form, timeStart: e.target.value })}
          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none" style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }} />
        <input type="time" value={form.timeEnd} onChange={(e) => setForm({ ...form, timeEnd: e.target.value })}
          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none" style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }} />
      </div>
      <p className="text-xs mb-1" style={{ color: C.muted }}>Sezóna (nic = celoročně)</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {MONTHS.map((m, i) => (
          <button key={m} onClick={() => toggle("months", i + 1)} className="px-2 py-1 rounded-md text-xs font-medium"
            style={{ background: form.months.includes(i + 1) ? C.amber : C.panelAlt, color: form.months.includes(i + 1) ? "#1B1E21" : C.muted }}>{m}</button>
        ))}
      </div>
      <p className="text-xs mb-1" style={{ color: C.muted }}>Kde</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {AREAS.map((a) => (
          <button key={a.id} onClick={() => toggle("areas", a.id)} className="px-2 py-1 rounded-md text-xs font-medium"
            style={{ background: form.areas.includes(a.id) ? a.color : C.panelAlt, color: form.areas.includes(a.id) ? "#fff" : C.muted }}>{a.label}</button>
        ))}
      </div>
      <input placeholder="Pro koho / subjekt (nepovinné)" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
        className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none" style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }} />
      <input placeholder="Poznámka" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
        className="w-full px-3 py-2 rounded-lg text-sm mb-3 outline-none" style={{ background: C.panelAlt, border: `1px solid ${C.border}`, color: C.text }} />
      <button onClick={submit} className="w-full py-2 rounded-lg font-semibold text-sm" style={{ background: C.green, color: "#1B1E21" }}>Uložit blok</button>
    </div>
  );
}

function RozvrhTab({ tasks, scheduleRules, today, onAddRule, onDeleteRule }) {
  const [period, setPeriod] = useState("den");
  const [showForm, setShowForm] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const periods = [{ id: "rok", label: "Rok" }, { id: "mesic", label: "Měsíc" }, { id: "tyden", label: "Týden" }, { id: "den", label: "Den" }];

  return (
    <div>
      <p className="text-sm mb-4" style={{ color: C.muted }}>
        Kdy × kde × pro koho × v jaké roli × co konkrétně — appka sama poskládá, co je na řadě.
      </p>
      <div className="flex gap-2 mb-4">
        {periods.map((p) => (
          <button key={p.id} onClick={() => setPeriod(p.id)} className="flex-1 py-2 rounded-xl text-sm font-semibold"
            style={{ background: period === p.id ? C.amber : C.panel, color: period === p.id ? "#1B1E21" : C.muted, border: `1px solid ${C.border}` }}>
            {p.label}
          </button>
        ))}
      </div>

      {period === "den" && <RozvrhDen tasks={tasks} scheduleRules={scheduleRules} today={today} />}
      {period === "tyden" && <RozvrhTyden tasks={tasks} scheduleRules={scheduleRules} today={today} />}
      {period === "mesic" && <RozvrhMesic tasks={tasks} scheduleRules={scheduleRules} today={today} />}
      {period === "rok" && <RozvrhRok scheduleRules={scheduleRules} today={today} />}

      <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
        <button onClick={() => setShowAdmin((o) => !o)} className="flex items-center gap-2 text-sm font-medium" style={{ color: C.muted }}>
          <Settings2 size={15} /> Upravit rozvrh {showAdmin ? <X size={14} /> : null}
        </button>
        {showAdmin && (
          <div className="mt-3">
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold mb-3" style={{ background: C.amber, color: "#1B1E21" }}>
                <Plus size={16} /> Přidat blok
              </button>
            )}
            {showForm && <RuleForm onAdd={onAddRule} onClose={() => setShowForm(false)} />}
            {scheduleRules.map((r) => {
              const info = roleInfo(r.role);
              return (
                <div key={r.id} className="flex items-center gap-2 p-2.5 rounded-lg mb-1.5" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: info.color }} />
                  <p className="flex-1 text-sm truncate">{r.label}</p>
                  <button onClick={() => onDeleteRule(r.id)}><Trash2 size={16} color={C.muted} /></button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
