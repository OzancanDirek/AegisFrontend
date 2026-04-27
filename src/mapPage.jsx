import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AegisLogo from "./images/Aegislogo.jpeg";
import Sidebar from "./sidebar";


const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d1117; --surface: #161d27; --surface2: #1e2a3a; --border: #253045;
    --accent: #F5A623; --text: #e8f0fe; --muted: #6b8099;
    --sidebar-w: 230px; --header-h: 60px; --footer-h: 48px; --radius: 10px;
    --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
  }
  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-body); overflow: hidden; }
  .map-shell {
    display: grid;
    grid-template-rows: var(--header-h) 1fr var(--footer-h);
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-areas: "header header" "sidebar main" "footer footer";
    height: 100vh; width: 100vw;
  }
  .al-header { grid-area: header; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px 0 0; position: sticky; top: 0; z-index: 1000; }
  .al-logo { display: flex; align-items: center; gap: 10px; padding: 0 20px; width: var(--sidebar-w); border-right: 1px solid var(--border); height: 100%; flex-shrink: 0; }
  .al-logo-text { font-family: var(--font-head); font-weight: 800; font-size: 20px; letter-spacing: -0.5px; color: var(--text); }
  .al-logo-text span { color: var(--accent); }
  .al-header-right { display: flex; align-items: center; gap: 10px; }
  .al-filters { display: flex; align-items: center; gap: 8px; }
  .al-filter-lbl { font-size: 12px; color: var(--muted); }
  .al-filter-btn { background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; color: var(--muted); font-family: var(--font-body); font-size: 12px; padding: 5px 12px; cursor: pointer; transition: all .15s; }
  .al-filter-btn:hover { border-color: var(--accent); color: var(--accent); }
  .al-filter-btn.active { border-color: var(--accent); color: var(--accent); background: rgba(245,166,35,.1); }
  .al-user-chip { display: flex; align-items: center; gap: 8px; background: var(--surface2); border: 1px solid var(--border); border-radius: 40px; padding: 5px 14px 5px 5px; }
  .al-avatar { width: 30px; height: 30px; border-radius: 50%; background: rgba(245,166,35,0.18); border: 1px solid rgba(245,166,35,0.35); display: flex; align-items: center; justify-content: center; color: var(--accent); font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .al-user-name { font-size: 13px; font-weight: 500; color: var(--text); white-space: nowrap; }
  .al-logout-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-family: var(--font-body); font-size: 13px; padding: 7px 14px; cursor: pointer; transition: all .2s; }
  .al-logout-btn:hover { border-color: var(--accent); color: var(--accent); }
  .map-main { grid-area: main; display: flex; overflow: hidden; background: var(--bg); }
  .map-panel { width: 240px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto; z-index: 10; }
  .mp-head { padding: 13px 16px; border-bottom: 1px solid var(--border); background: var(--surface2); flex-shrink: 0; }
  .mp-title { font-family: var(--font-head); font-size: 13px; font-weight: 700; }
  .mp-legend { padding: 12px 14px; border-bottom: 1px solid var(--border); }
  .mp-legend-item { display: flex; align-items: center; gap: 8px; padding: 5px 8px; border-radius: 6px; cursor: pointer; transition: background .12s; }
  .mp-legend-item:hover { background: var(--surface2); }
  .mp-dot { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; }
  .mp-legend-label { font-size: 12px; color: var(--text); flex: 1; }
  .mp-legend-count { font-size: 11px; color: var(--muted); font-family: monospace; }
  .mp-stats { padding: 12px 14px; border-bottom: 1px solid var(--border); }
  .mp-stat { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid var(--border); }
  .mp-stat:last-child { border-bottom: none; }
  .mp-stat-lbl { font-size: 11px; color: var(--muted); }
  .mp-stat-val { font-size: 13px; font-weight: 500; color: var(--text); }
  .mp-info { padding: 12px 14px; }
  .mp-info-card { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; }
  .mp-info-city { font-family: var(--font-head); font-size: 14px; font-weight: 700; margin-bottom: 8px; }
  .mp-info-row { display: flex; justify-content: space-between; font-size: 11px; padding: 3px 0; }
  .mp-info-lbl { color: var(--muted); }
  .mp-info-val { color: var(--text); font-weight: 500; }
  .mp-empty-info { font-size: 12px; color: var(--muted); text-align: center; padding: 20px 14px; line-height: 1.6; }
  .map-container { flex: 1; position: relative; }
  #leaflet-map { width: 100%; height: 100%; }
  .map-loading { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; background: var(--bg); z-index: 500; }
  .map-loading-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }
  .map-loading-txt { font-size: 13px; color: var(--muted); }
  .map-error { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; background: var(--bg); color: var(--muted); font-size: 13px; z-index: 500; text-align: center; padding: 40px; line-height: 1.8; }
  .map-error a { color: var(--accent); }
  .leaflet-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; }
  .leaflet-container { background: #0d1117 !important; }
  .leaflet-control-zoom a { background: #161d27 !important; color: #e8f0fe !important; border-color: #253045 !important; }
  .leaflet-control-zoom a:hover { background: #1e2a3a !important; }
  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
`;

const RISK_COLORS = {
  1: "#ef4444",
  2: "#f97316",
  3: "#eab308",
  4: "#22c55e",
  5: "#3b82f6",
};
const RISK_NAMES = {
  1: "Çok Yüksek",
  2: "Yüksek",
  3: "Orta",
  4: "Düşük",
  5: "Çok Düşük",
};

// GeoJSON'daki "name" alanına göre eşleşme (simplemaps İngilizce isim kullanır)
const RISK_DATA = {
  Istanbul: {
    name: "İstanbul",
    risk: 1,
    fault: "Kuzey Anadolu Fay Hattı",
    pop: "15.8M",
    req: 87,
  },
  Kocaeli: {
    name: "Kocaeli",
    risk: 1,
    fault: "Kuzey Anadolu Fay Hattı",
    pop: "2.0M",
    req: 34,
  },
  Duzce: {
    name: "Düzce",
    risk: 1,
    fault: "Kuzey Anadolu Fay Hattı",
    pop: "412K",
    req: 12,
  },
  Sakarya: {
    name: "Sakarya",
    risk: 1,
    fault: "Kuzey Anadolu Fay Hattı",
    pop: "1.1M",
    req: 21,
  },
  Bolu: {
    name: "Bolu",
    risk: 1,
    fault: "Kuzey Anadolu Fay Hattı",
    pop: "327K",
    req: 8,
  },
  Erzincan: {
    name: "Erzincan",
    risk: 1,
    fault: "Kuzey Anadolu Fay Hattı",
    pop: "241K",
    req: 9,
  },
  Bingol: {
    name: "Bingöl",
    risk: 1,
    fault: "Doğu Anadolu Fay Hattı",
    pop: "284K",
    req: 11,
  },
  Kahramanmaras: {
    name: "Kahramanmaraş",
    risk: 1,
    fault: "Doğu Anadolu Fay Hattı",
    pop: "1.2M",
    req: 156,
  },
  Hatay: {
    name: "Hatay",
    risk: 1,
    fault: "Doğu Anadolu Fay Hattı",
    pop: "1.7M",
    req: 203,
  },
  Adiyaman: {
    name: "Adıyaman",
    risk: 1,
    fault: "Doğu Anadolu Fay Hattı",
    pop: "640K",
    req: 67,
  },
  Malatya: {
    name: "Malatya",
    risk: 1,
    fault: "Doğu Anadolu Fay Hattı",
    pop: "820K",
    req: 89,
  },
  Gaziantep: {
    name: "Gaziantep",
    risk: 1,
    fault: "Doğu Anadolu Fay Hattı",
    pop: "2.1M",
    req: 112,
  },
  Yalova: {
    name: "Yalova",
    risk: 1,
    fault: "Kuzey Anadolu Fay Hattı",
    pop: "272K",
    req: 16,
  },
  Sanliurfa: {
    name: "Şanlıurfa",
    risk: 2,
    fault: "Doğu Anadolu Fay Hattı",
    pop: "2.2M",
    req: 45,
  },
  Diyarbakir: {
    name: "Diyarbakır",
    risk: 2,
    fault: "Doğu Anadolu Fay Hattı",
    pop: "1.8M",
    req: 38,
  },
  Elazig: {
    name: "Elazığ",
    risk: 2,
    fault: "Doğu Anadolu Fay Hattı",
    pop: "620K",
    req: 29,
  },
  Erzurum: {
    name: "Erzurum",
    risk: 2,
    fault: "Çevre faylar",
    pop: "762K",
    req: 17,
  },
  Van: { name: "Van", risk: 2, fault: "Van Fay Zonu", pop: "1.1M", req: 41 },
  Mus: { name: "Muş", risk: 2, fault: "Çevre faylar", pop: "414K", req: 14 },
  Bitlis: {
    name: "Bitlis",
    risk: 2,
    fault: "Çevre faylar",
    pop: "341K",
    req: 10,
  },
  Bursa: {
    name: "Bursa",
    risk: 2,
    fault: "Kuzey Anadolu Fay Hattı",
    pop: "3.1M",
    req: 28,
  },
  Balikesir: {
    name: "Balıkesir",
    risk: 2,
    fault: "Batı Anadolu Graben",
    pop: "1.3M",
    req: 19,
  },
  Izmir: {
    name: "İzmir",
    risk: 2,
    fault: "Batı Anadolu Graben",
    pop: "4.4M",
    req: 52,
  },
  Manisa: {
    name: "Manisa",
    risk: 2,
    fault: "Gediz Fayı",
    pop: "1.5M",
    req: 23,
  },
  Denizli: {
    name: "Denizli",
    risk: 2,
    fault: "Büyük Menderes Graben",
    pop: "1.1M",
    req: 18,
  },
  Aydin: {
    name: "Aydın",
    risk: 2,
    fault: "Büyük Menderes Graben",
    pop: "1.1M",
    req: 15,
  },
  Mugla: {
    name: "Muğla",
    risk: 2,
    fault: "Batı Anadolu Graben",
    pop: "1.1M",
    req: 12,
  },
  Adana: {
    name: "Adana",
    risk: 2,
    fault: "Doğu Anadolu Fay Hattı",
    pop: "2.2M",
    req: 33,
  },
  Osmaniye: {
    name: "Osmaniye",
    risk: 2,
    fault: "Doğu Anadolu Fay Hattı",
    pop: "560K",
    req: 21,
  },
  Kilis: {
    name: "Kilis",
    risk: 2,
    fault: "Doğu Anadolu Fay Hattı",
    pop: "147K",
    req: 18,
  },
  Tunceli: {
    name: "Tunceli",
    risk: 2,
    fault: "Doğu Anadolu Fay Hattı",
    pop: "84K",
    req: 4,
  },
  Bilecik: {
    name: "Bilecik",
    risk: 2,
    fault: "Kuzey Anadolu Fay Hattı",
    pop: "232K",
    req: 7,
  },
  Ankara: {
    name: "Ankara",
    risk: 3,
    fault: "Çevre faylar",
    pop: "5.7M",
    req: 22,
  },
  Konya: {
    name: "Konya",
    risk: 3,
    fault: "Orta Anadolu",
    pop: "2.3M",
    req: 11,
  },
  Eskisehir: {
    name: "Eskişehir",
    risk: 3,
    fault: "İnönü-Dodurga Fayı",
    pop: "908K",
    req: 9,
  },
  Kutahya: {
    name: "Kütahya",
    risk: 3,
    fault: "Gediz Fayı",
    pop: "591K",
    req: 7,
  },
  Afyonkarahisar: {
    name: "Afyonkarahisar",
    risk: 3,
    fault: "Akşehir Fayı",
    pop: "742K",
    req: 8,
  },
  Isparta: {
    name: "Isparta",
    risk: 3,
    fault: "Akşehir Fayı",
    pop: "437K",
    req: 6,
  },
  Sivas: { name: "Sivas", risk: 3, fault: "Orta Anadolu", pop: "651K", req: 8 },
  Tokat: { name: "Tokat", risk: 3, fault: "Orta Anadolu", pop: "597K", req: 7 },
  Yozgat: {
    name: "Yozgat",
    risk: 3,
    fault: "Orta Anadolu",
    pop: "434K",
    req: 5,
  },
  Kirsehir: {
    name: "Kırşehir",
    risk: 3,
    fault: "Orta Anadolu",
    pop: "246K",
    req: 4,
  },
  Nevsehir: {
    name: "Nevşehir",
    risk: 3,
    fault: "Orta Anadolu",
    pop: "305K",
    req: 5,
  },
  Aksaray: {
    name: "Aksaray",
    risk: 3,
    fault: "Tuz Gölü Fayı",
    pop: "424K",
    req: 6,
  },
  Nigde: { name: "Niğde", risk: 3, fault: "Ecemiş Fayı", pop: "375K", req: 5 },
  Kayseri: {
    name: "Kayseri",
    risk: 3,
    fault: "Orta Anadolu",
    pop: "1.4M",
    req: 13,
  },
  Mersin: {
    name: "Mersin",
    risk: 3,
    fault: "Ecemiş Fayı",
    pop: "1.9M",
    req: 16,
  },
  Tekirdag: {
    name: "Tekirdağ",
    risk: 3,
    fault: "Kuzey Anadolu yakın",
    pop: "1.1M",
    req: 11,
  },
  Canakkale: {
    name: "Çanakkale",
    risk: 3,
    fault: "Batı Anadolu",
    pop: "548K",
    req: 6,
  },
  Samsun: {
    name: "Samsun",
    risk: 3,
    fault: "Kuzey Anadolu yakın",
    pop: "1.4M",
    req: 12,
  },
  Kirikkale: {
    name: "Kırıkkale",
    risk: 3,
    fault: "Çevre faylar",
    pop: "276K",
    req: 3,
  },
  Amasya: {
    name: "Amasya",
    risk: 3,
    fault: "Çevre faylar",
    pop: "339K",
    req: 3,
  },
  Hakkari: {
    name: "Hakkari",
    risk: 3,
    fault: "Çevre faylar",
    pop: "287K",
    req: 6,
  },
  Sirnak: {
    name: "Şırnak",
    risk: 3,
    fault: "Çevre faylar",
    pop: "559K",
    req: 8,
  },
  Siirt: { name: "Siirt", risk: 3, fault: "Çevre faylar", pop: "348K", req: 5 },
  Batman: {
    name: "Batman",
    risk: 3,
    fault: "Çevre faylar",
    pop: "620K",
    req: 9,
  },
  Mardin: {
    name: "Mardin",
    risk: 3,
    fault: "Çevre faylar",
    pop: "843K",
    req: 11,
  },
  Antalya: {
    name: "Antalya",
    risk: 3,
    fault: "Batı Toroslar",
    pop: "2.6M",
    req: 14,
  },
  Burdur: {
    name: "Burdur",
    risk: 3,
    fault: "Akşehir Fayı",
    pop: "273K",
    req: 3,
  },
  Usak: {
    name: "Uşak",
    risk: 3,
    fault: "Batı Anadolu Graben",
    pop: "378K",
    req: 5,
  },
  Edirne: {
    name: "Edirne",
    risk: 4,
    fault: "Uzak faylar",
    pop: "416K",
    req: 3,
  },
  Kirklareli: {
    name: "Kırklareli",
    risk: 4,
    fault: "Uzak faylar",
    pop: "362K",
    req: 2,
  },
  Trabzon: {
    name: "Trabzon",
    risk: 4,
    fault: "Uzak faylar",
    pop: "808K",
    req: 5,
  },
  Rize: { name: "Rize", risk: 4, fault: "Uzak faylar", pop: "345K", req: 3 },
  Artvin: {
    name: "Artvin",
    risk: 4,
    fault: "Uzak faylar",
    pop: "175K",
    req: 2,
  },
  Giresun: {
    name: "Giresun",
    risk: 4,
    fault: "Uzak faylar",
    pop: "453K",
    req: 4,
  },
  Ordu: { name: "Ordu", risk: 4, fault: "Uzak faylar", pop: "756K", req: 5 },
  Sinop: { name: "Sinop", risk: 4, fault: "Uzak faylar", pop: "221K", req: 2 },
  Kastamonu: {
    name: "Kastamonu",
    risk: 4,
    fault: "Uzak faylar",
    pop: "381K",
    req: 3,
  },
  Karabuk: {
    name: "Karabük",
    risk: 4,
    fault: "Uzak faylar",
    pop: "248K",
    req: 2,
  },
  Bartin: {
    name: "Bartın",
    risk: 4,
    fault: "Uzak faylar",
    pop: "202K",
    req: 2,
  },
  Zonguldak: {
    name: "Zonguldak",
    risk: 4,
    fault: "Uzak faylar",
    pop: "606K",
    req: 4,
  },
  Cankiri: {
    name: "Çankırı",
    risk: 4,
    fault: "Uzak faylar",
    pop: "195K",
    req: 2,
  },
  Corum: { name: "Çorum", risk: 4, fault: "Uzak faylar", pop: "533K", req: 4 },
  Gumushane: {
    name: "Gümüşhane",
    risk: 4,
    fault: "Uzak faylar",
    pop: "176K",
    req: 1,
  },
  Bayburt: {
    name: "Bayburt",
    risk: 4,
    fault: "Uzak faylar",
    pop: "83K",
    req: 1,
  },
  Agri: { name: "Ağrı", risk: 4, fault: "Çevre faylar", pop: "509K", req: 5 },
  Karaman: {
    name: "Karaman",
    risk: 4,
    fault: "Uzak faylar",
    pop: "250K",
    req: 2,
  },
  Kars: { name: "Kars", risk: 5, fault: "Uzak faylar", pop: "289K", req: 2 },
  Ardahan: {
    name: "Ardahan",
    risk: 5,
    fault: "Uzak faylar",
    pop: "98K",
    req: 1,
  },
  Igdir: { name: "Iğdır", risk: 5, fault: "Uzak faylar", pop: "198K", req: 1 },
};

const FILTER_BTNS = [
  { key: "all", label: "Tümü", color: null },
  { key: 1, label: "Çok Yüksek", color: "#ef4444" },
  { key: 2, label: "Yüksek", color: "#f97316" },
  { key: 3, label: "Orta", color: "#eab308" },
  { key: 4, label: "Düşük", color: "#22c55e" },
];

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// GeoJSON'daki name değerini RISK_DATA key'ine normalize et
function normalizeKey(name = "") {
  return name
    .replace(/İ/g, "I")
    .replace(/ı/g, "i")
    .replace(/Ğ/g, "G")
    .replace(/ğ/g, "g")
    .replace(/Ü/g, "U")
    .replace(/ü/g, "u")
    .replace(/Ş/g, "S")
    .replace(/ş/g, "s")
    .replace(/Ö/g, "O")
    .replace(/ö/g, "o")
    .replace(/Ç/g, "C")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z]/g, "");
}

export default function MapPage() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const geoLayersRef = useRef([]);
  const filterRef = useRef("all");

  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCity, setSelectedCity] = useState(null);
  const [counts, setCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [debugKeys, setDebugKeys] = useState(null);
  const [lastQuake, setLastQuake] = useState("Yükleniyor...");

  const userName = localStorage.getItem("name") || "Admin";

  const getColor = (risk) => RISK_COLORS[risk] || "#6b8099";

  const lookupByName = (rawName = "") => {
    // Önce direkt eşleşme dene
    if (RISK_DATA[rawName]) return RISK_DATA[rawName];
    // Normalize ederek dene
    const norm = normalizeKey(rawName);
    const found = Object.entries(RISK_DATA).find(
      ([k]) => normalizeKey(k) === norm,
    );
    return found ? found[1] : null;
  };

  const buildStyle = (feat, filter) => {
    const rawName =
      feat.properties?.name ||
      feat.properties?.NAME_1 ||
      feat.properties?.shapeName ||
      "";
    const info = lookupByName(rawName);
    const risk = info?.risk ?? 3;
    const show = filter === "all" || filter === risk;
    return {
      fillColor: getColor(risk),
      fillOpacity: show ? 0.72 : 0.07,
      color: "#0d1117",
      weight: 0.8,
      opacity: show ? 1 : 0.15,
    };
  };

  useEffect(() => {
    fetch("https://api.orhanaydogdu.com.tr/deprem/kandilli/live")
      .then((r) => r.json())
      .then((data) => {
        const eq = data.result?.[0];
        if (eq) {
          const mag = Number(eq.mag).toFixed(1);
          const location = eq.title
            ?.split("-")
            .pop()
            ?.trim()
            ?.replace(/\(.*?\)/g, "")
            ?.trim();
          setLastQuake(mag + " — " + location);
        }
      })
      .catch(() => setLastQuake("Veri alınamadı"));
  }, []);

  useEffect(() => {
    const loadMap = async () => {
      if (!window.L) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }

      const L = window.L;
      if (leafletRef.current) return;
      if (!mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [39.0, 35.5],
        zoom: 6,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 12,
        },
      ).addTo(map);

      leafletRef.current = map;

      // Projenizin public/ klasöründeki WGS84 GeoJSON dosyasını yükle
      try {
        const res = await fetch("/tr-cities.json");
        if (!res.ok) throw new Error("GeoJSON dosyası bulunamadı");
        const data = await res.json();

        // Debug: ilk 5 feature'ın name'ini logla
        const sampleKeys = data.features.slice(0, 5).map((f) => {
          const p = f.properties;
          return (
            p?.name ||
            p?.NAME_1 ||
            p?.shapeName ||
            JSON.stringify(Object.keys(p)).slice(0, 80)
          );
        });
        setDebugKeys(sampleKeys);

        const newCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        data.features.forEach((f) => {
          const rawName =
            f.properties?.name ||
            f.properties?.NAME_1 ||
            f.properties?.shapeName ||
            "";
          const info = lookupByName(rawName);
          const risk = info?.risk ?? 3;
          newCounts[risk] = (newCounts[risk] || 0) + 1;
        });
        setCounts(newCounts);

        L.geoJSON(data, {
          style: (feat) => buildStyle(feat, filterRef.current),
          onEachFeature: (feat, layer) => {
            const rawName =
              feat.properties?.name ||
              feat.properties?.NAME_1 ||
              feat.properties?.shapeName ||
              "";
            const info = lookupByName(rawName);
            const risk = info?.risk ?? 3;
            const displayName = info?.name || rawName;

            geoLayersRef.current.push({ layer, feat });

            layer.on("mouseover", function () {
              this.setStyle({ weight: 2, fillOpacity: 0.92 });
            });
            layer.on("mouseout", function () {
              this.setStyle(buildStyle(feat, filterRef.current));
            });
            layer.on("click", function () {
              if (info) setSelectedCity({ name: displayName, ...info });
            });

            if (displayName) {
              layer.bindTooltip(
                `<div style="background:#161d27;border:1px solid #253045;border-radius:6px;padding:6px 10px;font-family:'DM Sans',sans-serif;font-size:12px;color:#e8f0fe">
                  <b style="color:#F5A623">${displayName}</b><br>
                  <span style="color:${getColor(risk)}">&#9679; ${RISK_NAMES[risk]}</span>
                </div>`,
                { sticky: true, className: "leaflet-tooltip" },
              );
            }
          },
        }).addTo(map);

        setLoading(false);
      } catch (err) {
        console.error("Map error:", err);
        setMapError(true);
        setLoading(false);
      }
    };

    loadMap().catch((err) => {
      console.error("loadMap error:", err);
      setMapError(true);
      setLoading(false);
    });

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
        geoLayersRef.current = [];
      }
    };
  }, []);

  useEffect(() => {
    filterRef.current = activeFilter;
    geoLayersRef.current.forEach(({ layer, feat }) => {
      layer.setStyle(buildStyle(feat, activeFilter));
    });
  }, [activeFilter]);

  const highRiskCount = (counts[1] || 0) + (counts[2] || 0);

  return (
    <>
      <style>{CSS}</style>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      <div className="map-shell">
        <header className="al-header">
          <div className="al-logo">
            <img src={AegisLogo} alt="Logo" style={{ width: 39, height: 39 }} />
            <span className="al-logo-text">
              Aegis<span>.</span>
            </span>
          </div>
          <div className="al-header-right">
            <div className="al-filters">
              <span className="al-filter-lbl">Risk:</span>
              {FILTER_BTNS.map((f) => (
                <button
                  key={f.key}
                  className={`al-filter-btn ${activeFilter === f.key ? "active" : ""}`}
                  style={
                    f.color
                      ? {
                          borderColor: `${f.color}66`,
                          color: activeFilter === f.key ? f.color : undefined,
                        }
                      : {}
                  }
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="al-user-chip">
              <div className="al-avatar">{userName[0]?.toUpperCase()}</div>
              <span className="al-user-name">{userName}</span>
            </div>
            <button
              className="al-logout-btn"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              <LogoutIcon /> Çıkış Yap
            </button>
          </div>
        </header>

        <Sidebar />

        <main className="map-main">
          <div className="map-panel">
            <div className="mp-head">
              <span className="mp-title">Risk Seviyeleri</span>
            </div>
            <div className="mp-legend">
              {[1, 2, 3, 4, 5].map((r) => (
                <div
                  key={r}
                  className="mp-legend-item"
                  onClick={() => setActiveFilter(r)}
                >
                  <div
                    className="mp-dot"
                    style={{ background: RISK_COLORS[r] }}
                  />
                  <span className="mp-legend-label">{RISK_NAMES[r]}</span>
                  <span className="mp-legend-count">{counts[r] || 0}</span>
                </div>
              ))}
            </div>
            <div className="mp-stats">
              <div className="mp-stat">
                <span className="mp-stat-lbl">Toplam İl</span>
                <span className="mp-stat-val">81</span>
              </div>
              <div className="mp-stat">
                <span className="mp-stat-lbl">Yüksek Risk ≥</span>
                <span className="mp-stat-val" style={{ color: "#ef4444" }}>
                  {highRiskCount} İl
                </span>
              </div>
              <div className="mp-stat">
                <span className="mp-stat-lbl">Aktif Talepler</span>
                <span
                  className="mp-stat-val"
                  style={{ color: "var(--accent)" }}
                >
                  247
                </span>
              </div>
              <div className="mp-stat">
                <span className="mp-stat-lbl">Son Deprem</span>
                <span className="mp-stat-val">{lastQuake}</span>
              </div>
            </div>
            <div className="mp-info">
              {selectedCity ? (
                <div className="mp-info-card">
                  <div className="mp-info-city">{selectedCity.name}</div>
                  <div className="mp-info-row">
                    <span className="mp-info-lbl">Risk Seviyesi</span>
                    <span
                      style={{
                        color: RISK_COLORS[selectedCity.risk],
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {RISK_NAMES[selectedCity.risk]}
                    </span>
                  </div>
                  <div className="mp-info-row">
                    <span className="mp-info-lbl">Fay Hattı</span>
                    <span className="mp-info-val">{selectedCity.fault}</span>
                  </div>
                  <div className="mp-info-row">
                    <span className="mp-info-lbl">Nüfus</span>
                    <span className="mp-info-val">{selectedCity.pop}</span>
                  </div>
                  <div className="mp-info-row">
                    <span className="mp-info-lbl">Aktif Talepler</span>
                    <span
                      style={{
                        color: "var(--accent)",
                        fontWeight: 500,
                        fontSize: 12,
                      }}
                    >
                      {selectedCity.req} talep
                    </span>
                  </div>
                </div>
              ) : (
                <p className="mp-empty-info">
                  Haritadan bir ile tıklayın detayları görün
                </p>
              )}
            </div>
          </div>

          <div className="map-container">
            {loading && (
              <div className="map-loading">
                <div className="map-loading-dot" />
                <span className="map-loading-txt">Harita yükleniyor...</span>
              </div>
            )}
            {mapError && !debugKeys && (
              <div className="map-error">
                <strong style={{ color: "var(--accent)" }}>
                  GeoJSON dosyası eksik
                </strong>
                <span>
                  Renklerin çalışması için WGS84 formatında Türkiye il GeoJSON'u
                  gerekli.
                  <br />
                  <a
                    href="https://simplemaps.com/gis/country/tr"
                    target="_blank"
                    rel="noreferrer"
                  >
                    simplemaps.com/gis/country/tr
                  </a>{" "}
                  adresinden ücretsiz indirin,
                  <br />
                  <code style={{ color: "#ffc04a" }}>
                    public/tr-cities.json
                  </code>{" "}
                  olarak kaydedin.
                </span>
              </div>
            )}
            <div id="leaflet-map" ref={mapRef} />
          </div>
        </main>

        <footer className="al-footer">
          <div className="al-footer-l">
            <span className="al-dot" />
            <strong>Aegis</strong> Afet Yönetim Sistemi &nbsp;·&nbsp; v1.0.0
          </div>
          <div className="al-footer-r">
            ©️ 2026 Aegis. Tüm hakları saklıdır.
          </div>
        </footer>
      </div>
    </>
  );
}
