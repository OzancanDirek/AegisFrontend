import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AegisLogo from "./images/Aegislogo.jpeg";
import Sidebar from "./sidebar";

const ShieldIcon = () => (
  <img src={AegisLogo} alt="Logo" style={{ width: 39, height: 39 }} />
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill="currentColor" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="currentColor" />
  </svg>
);
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
const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6h18M7 12h10M11 18h2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path
      d="M21 21l-4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 4v6h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 10A8 8 0 1 1 6 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const ToggleOnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect
      x="1"
      y="6"
      width="22"
      height="12"
      rx="6"
      fill="#3ecf5a"
      opacity=".3"
    />
    <circle cx="16" cy="12" r="4" fill="#3ecf5a" />
  </svg>
);
const ToggleOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect
      x="1"
      y="6"
      width="22"
      height="12"
      rx="6"
      fill="currentColor"
      opacity=".2"
    />
    <circle cx="8" cy="12" r="4" fill="currentColor" opacity=".5" />
  </svg>
);

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d1117; --surface: #161d27; --surface2: #1e2a3a;
    --border: #253045; --accent: #F5A623; --accent2: #ffc04a;
    --text: #e8f0fe; --muted: #6b8099;
    --sidebar-w: 230px; --header-h: 60px; --footer-h: 48px; --radius: 10px;
    --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
  }
  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-body); overflow: hidden; }

  .al-shell {
    display: grid;
    grid-template-rows: var(--header-h) 1fr var(--footer-h);
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-areas: "header header" "sidebar main" "footer footer";
    height: 100vh;
    width: 100vw;
  }

  .al-header {
    grid-area: header; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px 0 0; position: sticky; top: 0; z-index: 100;
  }
  .al-logo {
    display: flex; align-items: center; gap: 10px; padding: 0 20px;
    width: var(--sidebar-w); border-right: 1px solid var(--border); height: 100%; flex-shrink: 0;
  }
  .al-logo-text { font-family: var(--font-head); font-weight: 800; font-size: 20px; letter-spacing: -0.5px; color: var(--text); }
  .al-logo-text span { color: var(--accent); }
  .al-header-right { display: flex; align-items: center; gap: 10px; }
  .al-user-chip {
    display: flex; align-items: center; gap: 8px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 40px; padding: 5px 14px 5px 5px;
  }
  .al-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: rgba(245,166,35,0.18); border: 1px solid rgba(245,166,35,0.35);
    display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0;
  }
  .al-user-name { font-size: 13px; font-weight: 500; color: var(--text); white-space: nowrap; }
  .al-logout-btn {
    display: flex; align-items: center; gap: 6px; background: transparent;
    border: 1px solid var(--border); border-radius: 8px; color: var(--muted);
    font-family: var(--font-body); font-size: 13px; padding: 7px 14px; cursor: pointer; transition: all .2s;
  }
  .al-logout-btn:hover { border-color: var(--accent); color: var(--accent); }

  .al-main { grid-area: main; padding: 28px; overflow-y: auto; background: var(--bg); }

  .al-footer {
    grid-area: footer; background: var(--surface); border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
  }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot {
    display: inline-block; width: 7px; height: 7px; border-radius: 50%;
    background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .page-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;
  }
  .dash-title {
    font-family: var(--font-head); font-size: 22px; font-weight: 700;
    color: var(--text); letter-spacing: -0.3px;
  }
  .dash-title span { color: var(--accent); }

  .vol-toolbar {
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;
  }
  .vol-search-wrap {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    padding: 7px 12px; flex: 1; min-width: 200px; max-width: 320px;
  }
  .vol-search-wrap input {
    background: transparent; border: none; outline: none;
    color: var(--text); font-family: var(--font-body); font-size: 13px; width: 100%;
  }
  .vol-search-wrap input::placeholder { color: var(--muted); }
  .vol-search-wrap svg { color: var(--muted); flex-shrink: 0; }

  .vol-filter-btn {
    display: flex; align-items: center; gap: 6px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    color: var(--muted); font-family: var(--font-body); font-size: 13px;
    padding: 7px 14px; cursor: pointer; transition: all .2s; white-space: nowrap;
  }
  .vol-filter-btn:hover { border-color: var(--accent); color: var(--accent2); }
  .vol-filter-btn.active { border-color: var(--accent); color: var(--accent2); background: rgba(245,166,35,.08); }

  .vol-skill-input-wrap {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    padding: 7px 12px;
  }
  .vol-skill-input-wrap input {
    background: transparent; border: none; outline: none;
    color: var(--text); font-family: var(--font-body); font-size: 13px; width: 140px;
  }
  .vol-skill-input-wrap input::placeholder { color: var(--muted); }
  .vol-skill-search-btn {
    background: var(--accent); border: none; border-radius: 6px;
    color: #0d1117; font-family: var(--font-body); font-size: 12px; font-weight: 500;
    padding: 4px 10px; cursor: pointer; transition: opacity .2s; white-space: nowrap;
  }
  .vol-skill-search-btn:hover { opacity: .85; }

  .vol-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
  .vol-stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 16px 20px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .vol-stat-label { font-size: 11px; color: var(--muted); letter-spacing: .8px; text-transform: uppercase; }
  .vol-stat-value { font-family: var(--font-head); font-size: 26px; font-weight: 700; color: var(--text); }
  .vol-stat-value.green { color: #3ecf5a; }
  .vol-stat-value.orange { color: var(--accent2); }

  .dash-table-wrap {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  .dash-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .dash-table thead tr { background: var(--surface2); border-bottom: 1px solid var(--border); }
  .dash-table th {
    text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase; color: var(--muted);
  }
  .dash-table td { padding: 13px 16px; color: var(--text); border-bottom: 1px solid var(--border); vertical-align: middle; }
  .dash-table tbody tr:last-child td { border-bottom: none; }
  .dash-table tbody tr:hover td { background: var(--surface2); }

  .dash-id {
    font-family: monospace; font-size: 11px; color: var(--muted);
    max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;
  }
  .dash-error {
    background: rgba(245,166,35,.08); border: 1px solid rgba(245,166,35,.2);
    border-radius: var(--radius); padding: 16px 20px; color: var(--accent2); font-size: 14px; margin-bottom: 16px;
  }
  .dash-empty { padding: 48px; text-align: center; color: var(--muted); font-size: 14px; }

  .vol-status {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 500; padding: 3px 10px; border-radius: 20px;
  }
  .vol-status.available { background: rgba(62,207,90,.1); color: #3ecf5a; }
  .vol-status.unavailable { background: rgba(107,128,153,.1); color: var(--muted); }

  .skill-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .skill-tag {
    background: rgba(245,166,35,.1); color: var(--accent2);
    font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 12px;
    border: 1px solid rgba(245,166,35,.2);
  }

  .toggle-btn {
    display: flex; align-items: center; gap: 6px;
    background: transparent; border: 1px solid var(--border); border-radius: 7px;
    color: var(--muted); font-family: var(--font-body); font-size: 12px;
    padding: 5px 10px; cursor: pointer; transition: all .2s;
  }
  .toggle-btn:hover { border-color: var(--accent); color: var(--text); }

  .loading-row td { text-align: center; padding: 48px !important; color: var(--muted); font-size: 14px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    display: inline-block; width: 18px; height: 18px; border: 2px solid var(--border);
    border-top-color: var(--accent); border-radius: 50%; animation: spin .8s linear infinite;
    vertical-align: middle; margin-right: 8px;
  }

  .vol-add-btn {
    display: flex; align-items: center; gap: 6px;
    background: var(--accent); border: none; border-radius: 8px;
    color: #0d1117; font-family: var(--font-body); font-size: 13px; font-weight: 500;
    padding: 8px 16px; cursor: pointer; transition: opacity .2s;
  }
  .vol-add-btn:hover { opacity: .85; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.72); backdrop-filter: blur(4px);
    z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .modal-box {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto;
    animation: modalIn .2s ease;
  }
  @keyframes modalIn { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: none; } }
  .modal-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-bottom: 1px solid var(--border);
  }
  .modal-title { font-family: var(--font-head); font-size: 17px; font-weight: 700; color: var(--text); }
  .modal-close {
    background: transparent; border: 1px solid var(--border); border-radius: 7px;
    color: var(--muted); cursor: pointer; padding: 5px; display: flex; align-items: center; transition: all .2s;
  }
  .modal-close:hover { border-color: var(--accent); color: var(--accent); }
  .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
  .modal-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-field { display: flex; flex-direction: column; gap: 6px; }
  .modal-field.full { grid-column: 1 / -1; }
  .modal-label { font-size: 11px; font-weight: 600; letter-spacing: .8px; text-transform: uppercase; color: var(--muted); }
  .modal-input {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); font-family: var(--font-body); font-size: 13px;
    padding: 9px 12px; outline: none; transition: border-color .2s; width: 100%;
  }
  .modal-input:focus { border-color: var(--accent); }
  .modal-input::placeholder { color: var(--muted); }
  select.modal-input option { background: var(--surface2); }
  .modal-foot {
    padding: 16px 24px; border-top: 1px solid var(--border);
    display: flex; justify-content: flex-end; gap: 10px;
  }
  .modal-cancel {
    background: transparent; border: 1px solid var(--border); border-radius: 8px;
    color: var(--muted); font-family: var(--font-body); font-size: 13px;
    padding: 8px 18px; cursor: pointer; transition: all .2s;
  }
  .modal-cancel:hover { border-color: var(--accent); color: var(--accent); }
  .modal-submit {
    background: var(--accent); border: none; border-radius: 8px;
    color: #0d1117; font-family: var(--font-body); font-size: 13px; font-weight: 500;
    padding: 8px 20px; cursor: pointer; transition: opacity .2s;
  }
  .modal-submit:hover { opacity: .85; }
  .modal-submit:disabled { opacity: .5; cursor: not-allowed; }

  .skill-select-wrap {
    display: flex; flex-wrap: wrap; gap: 6px;
    background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
    padding: 8px 10px; min-height: 42px;
  }
  .skill-chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 12px; font-weight: 500; padding: 3px 10px; border-radius: 20px;
    border: 1px solid var(--border); cursor: pointer; transition: all .15s;
    color: var(--muted); background: transparent; user-select: none;
  }
  .skill-chip:hover { border-color: var(--accent); color: var(--accent2); }
  .skill-chip.selected { background: rgba(245,166,35,.15); border-color: var(--accent); color: var(--accent2); }
  .skill-empty-note { font-size: 12px; color: var(--muted); padding: 4px 2px; }
`;

const transportLabel = (type) => {
  const map = {
    CAR: "Araba",
    MOTORCYCLE: "Motosiklet",
    BICYCLE: "Bisiklet",
    FOOT: "Yaya",
    TRUCK: "Kamyon",
  };
  return map[type] || type || "—";
};

export default function Volunteers() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userList, setUserList] = useState([]);
  const [skillList, setSkillList] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const EMPTY_FORM = {
    userId: "",
    addressId: "",
    transportType: "",
    maxDistanceKm: "",
    availabilityStatus: true,
  };
  const [form, setForm] = useState(EMPTY_FORM);

  const adminEmail = localStorage.getItem("email") || "";
  const userName = localStorage.getItem("name") || "Admin";
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleSkill = (skillId) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId],
    );
  };

  const openModal = () => {
    setForm(EMPTY_FORM);
    setSelectedSkills([]);
    setShowModal(true);
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const payload = {
        userId: form.userId || null,
        addressId: form.addressId ? Number(form.addressId) : null,
        transportType: form.transportType || null,
        maxDistanceKm: form.maxDistanceKm ? Number(form.maxDistanceKm) : null,
        availabilityStatus: form.availabilityStatus,
        skillIds: selectedSkills,
      };
      await axios.post("http://localhost:8080/api/volunteer", payload);
      setShowModal(false);
      fetchAll();
    } catch (error) {
      setMessage(error.response?.data?.message || "Gönüllü oluşturulamadı.");
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get("http://localhost:8080/api/volunteer");
      setVolunteers(res.data);
      setFilterMode("all");
      setSkillSearch("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Gönüllüler getirilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailable = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get(
        "http://localhost:8080/api/volunteer/available",
      );
      setVolunteers(res.data);
      setFilterMode("available");
      setSkillSearch("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Müsait gönüllüler getirilemedi.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchBySkill = async () => {
    if (!skillInput.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get(
        `http://localhost:8080/api/volunteer/skill?skillName=${skillInput.trim()}`,
      );
      setVolunteers(res.data);
      setFilterMode("skill");
      setSkillSearch(skillInput.trim());
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Yetenek ile arama başarısız.",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/volunteer/${id}/availability?status=${!currentStatus}`,
      );
      setVolunteers((prev) =>
        prev.map((v) =>
          v.volunteerId === id
            ? { ...v, availabilityStatus: !currentStatus }
            : v,
        ),
      );
    } catch {
      setMessage("Durum güncellenemedi.");
    }
  };

  useEffect(() => {
    fetchAll();
    if (adminEmail) {
      axios
        .get(
          `http://localhost:8080/api/admin/adminUserList?email=${adminEmail}`,
        )
        .then((res) => setUserList(res.data))
        .catch(() => {});
    }
    axios
      .get("http://localhost:8080/api/skill")
      .then((res) => setSkillList(res.data))
      .catch(() => {});
  }, []);

  const filtered = volunteers.filter((v) => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    return (
      String(v.volunteerId).includes(q) ||
      (v.name || "").toLowerCase().includes(q) ||
      (v.surname || "").toLowerCase().includes(q) ||
      (v.city || "").toLowerCase().includes(q) ||
      (v.district || "").toLowerCase().includes(q)
    );
  });

  const totalCount = volunteers.length;
  const availableCount = volunteers.filter((v) => v.availabilityStatus).length;
  const unavailCount = totalCount - availableCount;

  return (
    <>
      <style>{CSS}</style>
      <div className="al-shell">
        <header className="al-header">
          <div className="al-logo">
            <ShieldIcon />
            <span className="al-logo-text">
              Aegis<span>.</span>
            </span>
          </div>
          <div className="al-header-right">
            <div className="al-user-chip">
              <div className="al-avatar">
                <UserIcon />
              </div>
              <span className="al-user-name">{userName}</span>
            </div>
            <button className="al-logout-btn" onClick={handleLogout}>
              <LogoutIcon /> Çıkış Yap
            </button>
          </div>
        </header>

        <Sidebar />

        <main className="al-main">
          <div className="page-header">
            <div className="dash-title">
              Gönüllü <span>Listesi</span>
              {filterMode === "available" && (
                <span
                  style={{ fontSize: 14, color: "#3ecf5a", marginLeft: 10 }}
                >
                  · Müsait
                </span>
              )}
              {filterMode === "skill" && (
                <span
                  style={{
                    fontSize: 14,
                    color: "var(--accent2)",
                    marginLeft: 10,
                  }}
                >
                  · Yetenek: {skillSearch}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="vol-add-btn" onClick={openModal}>
                <PlusIcon /> Gönüllü Ekle
              </button>
              <button className="vol-filter-btn" onClick={fetchAll}>
                <RefreshIcon /> Yenile
              </button>
            </div>
          </div>

          <div className="vol-stats">
            <div className="vol-stat-card">
              <div className="vol-stat-label">Toplam</div>
              <div className="vol-stat-value">{totalCount}</div>
            </div>
            <div className="vol-stat-card">
              <div className="vol-stat-label">Müsait</div>
              <div className="vol-stat-value green">{availableCount}</div>
            </div>
            <div className="vol-stat-card">
              <div className="vol-stat-label">Müsait Değil</div>
              <div className="vol-stat-value orange">{unavailCount}</div>
            </div>
          </div>

          <div className="vol-toolbar">
            <div className="vol-search-wrap">
              <SearchIcon />
              <input
                placeholder="İsim, şehir, ID ara…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <button
              className={`vol-filter-btn ${filterMode === "available" ? "active" : ""}`}
              onClick={filterMode === "available" ? fetchAll : fetchAvailable}
            >
              <FilterIcon /> Müsait Gönüllüler
            </button>
            <div className="vol-skill-input-wrap">
              <input
                placeholder="Yetenek adı…"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchBySkill()}
              />
              <button className="vol-skill-search-btn" onClick={fetchBySkill}>
                Ara
              </button>
            </div>
          </div>

          {message && <div className="dash-error">{message}</div>}

          <div className="dash-table-wrap">
            {filtered.length === 0 && !loading ? (
              <div className="dash-empty">Gönüllü bulunamadı.</div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ad Soyad</th>
                    <th>Telefon</th>
                    <th>Konum</th>
                    <th>Ulaşım</th>
                    <th>Maks. Mesafe</th>
                    <th>Yetenekler</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="loading-row">
                      <td colSpan={8}>
                        <span className="spinner" />
                        Yükleniyor…
                      </td>
                    </tr>
                  ) : (
                    filtered.map((v) => (
                      <tr key={v.volunteerId}>
                        <td>
                          <span className="dash-id">#{v.volunteerId}</span>
                        </td>
                        <td>
                          {v.name || "—"} {v.surname || ""}
                        </td>
                        <td>{v.phone || "—"}</td>
                        <td style={{ fontSize: 13, color: "var(--muted)" }}>
                          {[v.neighborhood, v.district, v.city]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </td>
                        <td>{transportLabel(v.transportType)}</td>
                        <td>
                          {v.maxDistanceKm != null
                            ? `${v.maxDistanceKm} km`
                            : "—"}
                        </td>
                        <td>
                          {v.skills && v.skills.length > 0 ? (
                            <div className="skill-tags">
                              {v.skills.map((s, i) => (
                                <span className="skill-tag" key={i}>
                                  {s}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span
                              style={{ color: "var(--muted)", fontSize: 13 }}
                            >
                              —
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            className="toggle-btn"
                            onClick={() =>
                              toggleAvailability(
                                v.volunteerId,
                                v.availabilityStatus,
                              )
                            }
                          >
                            {v.availabilityStatus ? (
                              <ToggleOnIcon />
                            ) : (
                              <ToggleOffIcon />
                            )}
                            <span
                              className={`vol-status ${v.availabilityStatus ? "available" : "unavailable"}`}
                              style={{
                                padding: 0,
                                background: "none",
                                border: "none",
                              }}
                            >
                              {v.availabilityStatus ? "Müsait" : "Müsait Değil"}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
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

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">Yeni Gönüllü Ekle</span>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-field full">
                <label className="modal-label">Kullanıcı (opsiyonel)</label>
                <select
                  className="modal-input"
                  name="userId"
                  value={form.userId}
                  onChange={handleFormChange}
                >
                  <option value="">— Seçiniz —</option>
                  {userList.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      {u.name} {u.surname} — {u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-row">
                <div className="modal-field">
                  <label className="modal-label">Ulaşım Tipi</label>
                  <select
                    className="modal-input"
                    name="transportType"
                    value={form.transportType}
                    onChange={handleFormChange}
                  >
                    <option value="">Seçiniz</option>
                    <option value="CAR">Araba</option>
                    <option value="MOTORCYCLE">Motosiklet</option>
                    <option value="BICYCLE">Bisiklet</option>
                    <option value="FOOT">Yaya</option>
                    <option value="TRUCK">Kamyon</option>
                  </select>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Maks. Mesafe (km)</label>
                  <input
                    className="modal-input"
                    name="maxDistanceKm"
                    type="number"
                    placeholder="örn. 20"
                    value={form.maxDistanceKm}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="modal-field full">
                <label className="modal-label">
                  Yetenekler{" "}
                  {selectedSkills.length > 0 && (
                    <span style={{ color: "var(--accent2)" }}>
                      ({selectedSkills.length} seçili)
                    </span>
                  )}
                </label>
                <div className="skill-select-wrap">
                  {skillList.length === 0 ? (
                    <span className="skill-empty-note">
                      Henüz yetenek tanımlanmamış.
                    </span>
                  ) : (
                    skillList.map((sk) => (
                      <span
                        key={sk.skillId}
                        className={`skill-chip ${selectedSkills.includes(sk.skillId) ? "selected" : ""}`}
                        onClick={() => toggleSkill(sk.skillId)}
                      >
                        {sk.skillName}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="modal-field">
                <label
                  className="modal-label"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="availabilityStatus"
                    checked={form.availabilityStatus}
                    onChange={handleFormChange}
                    style={{
                      width: 15,
                      height: 15,
                      accentColor: "var(--accent)",
                    }}
                  />
                  <span>Başlangıçta Müsait</span>
                </label>
              </div>
            </div>
            <div className="modal-foot">
              <button
                className="modal-cancel"
                onClick={() => setShowModal(false)}
              >
                İptal
              </button>
              <button
                className="modal-submit"
                onClick={handleCreate}
                disabled={submitting}
              >
                {submitting ? "Kaydediliyor…" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
