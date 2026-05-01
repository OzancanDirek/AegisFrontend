import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AegisLogo from "./images/Aegislogo.jpeg";
import Sidebar from "./sidebar";

const API = "http://localhost:8080/api";

import { authFetch } from "./authFetch";


const TEAM_TYPE_CONFIG = {
  ARAMA_KURTARMA: {
    label: "Arama & Kurtarma",
    color: "#ef4444",
    bg: "rgba(239,68,68,.12)",
    border: "rgba(239,68,68,.3)",
    icon: "🚨",
  },
  TIBBI: {
    label: "Tıbbi",
    color: "#3ecf5a",
    bg: "rgba(62,207,90,.12)",
    border: "rgba(62,207,90,.3)",
    icon: "🏥",
  },
  LOJISTIK: {
    label: "Lojistik",
    color: "#F5A623",
    bg: "rgba(245,166,35,.12)",
    border: "rgba(245,166,35,.3)",
    icon: "📦",
  },
  ILETISIM: {
    label: "İletişim",
    color: "#60a5fa",
    bg: "rgba(96,165,250,.12)",
    border: "rgba(96,165,250,.3)",
    icon: "📡",
  },
  GENEL: {
    label: "Genel",
    color: "#6b8099",
    bg: "rgba(107,128,153,.12)",
    border: "rgba(107,128,153,.3)",
    icon: "👥",
  },
};

const STATUS_CONFIG = {
  AKTIF: {
    label: "Aktif",
    color: "#3ecf5a",
    bg: "rgba(62,207,90,.1)",
    border: "rgba(62,207,90,.3)",
  },
  PASIF: {
    label: "Pasif",
    color: "#6b8099",
    bg: "rgba(107,128,153,.1)",
    border: "rgba(107,128,153,.3)",
  },
  GOREVDE: {
    label: "Görevde",
    color: "#F5A623",
    bg: "rgba(245,166,35,.1)",
    border: "rgba(245,166,35,.3)",
  },
};

function TeamModal({
  title,
  accent,
  onClose,
  onConfirm,
  confirmLabel,
  loading,
  children,
}) {
  return (
    <div
      className="tm-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="tm-modal">
        <div className="tm-modal-title">
          {title} <span style={{ color: "var(--accent)" }}>{accent}</span>
        </div>
        {children}
        <div className="tm-modal-actions">
          <button className="tm-cancel-btn" onClick={onClose}>
            İptal
          </button>
          <button
            className="tm-confirm-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "İşleniyor..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

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
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path
      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <polyline
      points="3 6 5 6 21 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d1117; --surface: #161d27; --surface2: #1e2a3a; --border: #253045;
    --accent: #F5A623; --accent2: #ffc04a; --text: #e8f0fe; --muted: #6b8099;
    --sidebar-w: 230px; --header-h: 60px; --footer-h: 48px; --radius: 10px;
    --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
  }
  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-body); overflow: hidden; }

  .tm-shell { display: grid; grid-template-rows: var(--header-h) 1fr var(--footer-h); grid-template-columns: var(--sidebar-w) 1fr; grid-template-areas: "header header" "sidebar main" "footer footer"; height: 100vh; width: 100vw; }

  .al-header { grid-area: header; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px 0 0; position: sticky; top: 0; z-index: 100; }
  .al-logo { display: flex; align-items: center; gap: 10px; padding: 0 20px; width: var(--sidebar-w); border-right: 1px solid var(--border); height: 100%; flex-shrink: 0; }
  .al-logo-text { font-family: var(--font-head); font-weight: 800; font-size: 20px; letter-spacing: -0.5px; color: var(--text); }
  .al-logo-text span { color: var(--accent); }
  .al-header-right { display: flex; align-items: center; gap: 10px; }
  .al-user-chip { display: flex; align-items: center; gap: 8px; background: var(--surface2); border: 1px solid var(--border); border-radius: 40px; padding: 5px 14px 5px 5px; }
  .al-avatar { width: 30px; height: 30px; border-radius: 50%; background: rgba(245,166,35,0.18); border: 1px solid rgba(245,166,35,0.35); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; font-size: 13px; font-weight: 700; }
  .al-user-name { font-size: 13px; font-weight: 500; color: var(--text); white-space: nowrap; }
  .al-logout-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-family: var(--font-body); font-size: 13px; padding: 7px 14px; cursor: pointer; transition: all .2s; }
  .al-logout-btn:hover { border-color: var(--accent); color: var(--accent); }

  .tm-main { grid-area: main; padding: 28px; overflow-y: auto; background: var(--bg); }
  .tm-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .tm-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; letter-spacing: -.3px; }
  .tm-title span { color: var(--accent); }
  .tm-new-btn { display: flex; align-items: center; gap: 7px; background: var(--accent); color: #0d1117; border: none; border-radius: var(--radius); padding: 9px 18px; font-family: var(--font-head); font-size: 13px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .tm-new-btn:hover { background: var(--accent2); }

  .tm-layout { display: grid; grid-template-columns: 320px 1fr; gap: 20px; height: calc(100vh - var(--header-h) - var(--footer-h) - 88px); }

  .tm-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); display: flex; flex-direction: column; overflow: hidden; }
  .tm-panel-head { padding: 13px 18px; border-bottom: 1px solid var(--border); background: var(--surface2); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .tm-panel-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; }
  .tm-badge { background: rgba(245,166,35,.15); border: 1px solid rgba(245,166,35,.25); color: var(--accent); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }

  .tm-list { overflow-y: auto; flex: 1; }
  .tm-team-btn { width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: transparent; border: none; border-bottom: 1px solid var(--border); cursor: pointer; text-align: left; transition: background .12s; font-family: var(--font-body); }
  .tm-team-btn:hover { background: var(--surface2); }
  .tm-team-btn.active { background: rgba(245,166,35,.07); }
  .tm-team-icon { width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; background: var(--surface2); border: 1px solid var(--border); }
  .tm-team-btn.active .tm-team-icon { background: rgba(245,166,35,.15); border-color: rgba(245,166,35,.4); }
  .tm-team-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  .tm-team-name { font-size: 13px; font-weight: 600; color: var(--text); font-family: var(--font-head); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tm-team-pills { display: flex; gap: 5px; flex-wrap: wrap; }
  .tm-active-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .tm-empty-list { padding: 28px; text-align: center; color: var(--muted); font-size: 13px; }

  .tm-detail { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
  .tm-detail-body { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 18px; }
  .tm-empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
  .tm-empty-icon { font-size: 36px; }
  .tm-empty-txt { font-size: 13px; color: var(--muted); text-align: center; line-height: 1.6; }

  .tm-info-card { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 18px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .tm-info-icon { width: 46px; height: 46px; border-radius: 12px; background: rgba(245,166,35,.12); border: 1.5px solid rgba(245,166,35,.35); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .tm-info-texts { flex: 1; min-width: 0; }
  .tm-info-name { font-family: var(--font-head); font-size: 16px; font-weight: 800; color: var(--text); }
  .tm-info-sub { font-size: 11px; color: var(--muted); margin-top: 3px; }
  .tm-info-pills { display: flex; gap: 6px; margin-top: 6px; }
  .tm-info-actions { display: flex; gap: 7px; margin-left: auto; flex-shrink: 0; }
  .tm-btn-edit { display: flex; align-items: center; gap: 5px; background: rgba(245,166,35,.08); border: 1px solid rgba(245,166,35,.3); border-radius: 8px; color: var(--accent); font-family: var(--font-body); font-size: 12px; font-weight: 600; padding: 6px 13px; cursor: pointer; transition: all .15s; }
  .tm-btn-edit:hover { background: rgba(245,166,35,.18); }
  .tm-btn-del { display: flex; align-items: center; gap: 5px; background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.28); border-radius: 8px; color: #ef4444; font-family: var(--font-body); font-size: 12px; font-weight: 600; padding: 6px 13px; cursor: pointer; transition: all .15s; }
  .tm-btn-del:hover { background: rgba(239,68,68,.18); }

  .tm-pill { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; border: 1px solid; white-space: nowrap; font-family: var(--font-body); }

  .tm-sec-lbl { font-size: 10px; letter-spacing: 1.4px; text-transform: uppercase; color: var(--muted); font-weight: 600; margin-bottom: 9px; }

  .tm-member-list { display: flex; flex-direction: column; gap: 7px; }
  .tm-member-row { display: flex; align-items: center; gap: 11px; padding: 10px 14px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); transition: border-color .15s; }
  .tm-member-row:hover { border-color: rgba(239,68,68,.3); }
  .tm-member-row:hover .tm-remove-btn { opacity: 1; }
  .tm-member-av { width: 34px; height: 34px; border-radius: 50%; background: var(--surface2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--muted); flex-shrink: 0; }
  .tm-member-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .tm-member-email { font-size: 11px; color: var(--muted); margin-top: 1px; }
  .tm-remove-btn { margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 7px; background: transparent; border: 1px solid transparent; color: var(--muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; opacity: 0; }
  .tm-remove-btn:hover { background: rgba(239,68,68,.12); border-color: rgba(239,68,68,.4); color: #ef4444; }
  .tm-no-member { padding: 18px; text-align: center; color: var(--muted); font-size: 13px; border: 1px dashed var(--border); border-radius: var(--radius); }

  .tm-add-box { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .tm-add-box-head { padding: 11px 14px; background: var(--surface2); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .tm-add-box-title { font-family: var(--font-head); font-size: 13px; font-weight: 700; }
  .tm-add-box-count { font-size: 11px; color: var(--muted); }
  .tm-user-list { max-height: 190px; overflow-y: auto; }
  .tm-user-row { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background .1s; user-select: none; }
  .tm-user-row:last-child { border-bottom: none; }
  .tm-user-row:hover { background: var(--surface2); }
  .tm-user-row.sel { background: rgba(245,166,35,.06); }
  .tm-checkbox { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid var(--border); background: transparent; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; color: #0d1117; transition: all .12s; }
  .tm-user-row.sel .tm-checkbox { background: var(--accent); border-color: var(--accent); }
  .tm-user-label { font-size: 13px; color: var(--text); }
  .tm-user-mail { font-size: 11px; color: var(--muted); margin-left: auto; }
  .tm-add-box-foot { padding: 10px 14px; background: var(--surface2); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .tm-add-box-info { font-size: 12px; color: var(--muted); }
  .tm-add-box-btn { background: var(--accent); color: #0d1117; border: none; border-radius: 8px; padding: 7px 16px; font-family: var(--font-head); font-size: 12px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .tm-add-box-btn:hover:not(:disabled) { background: var(--accent2); }
  .tm-add-box-btn:disabled { opacity: .4; cursor: not-allowed; }

  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .tm-toast { position: fixed; top: 18px; right: 22px; z-index: 9999; padding: 10px 18px; border-radius: var(--radius); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 30px rgba(0,0,0,.5); border: 1px solid; animation: slideIn .2s ease; font-family: var(--font-body); }
  .tm-toast.ok  { background: rgba(62,207,90,.1);  border-color: #3ecf5a; color: #3ecf5a; }
  .tm-toast.err { background: rgba(239,68,68,.1);  border-color: #ef4444; color: #ef4444; }
  @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .tm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 300; display: flex; align-items: center; justify-content: center; animation: fadeIn .15s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .tm-modal { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; width: 400px; padding: 26px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 24px 60px rgba(0,0,0,.6); }
  .tm-modal-title { font-family: var(--font-head); font-size: 18px; font-weight: 800; color: var(--text); }
  .tm-field { display: flex; flex-direction: column; gap: 6px; }
  .tm-field label { font-size: 10px; letter-spacing: 1.3px; text-transform: uppercase; color: var(--muted); font-weight: 600; }
  .tm-input  { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 10px 13px; font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color .2s; width: 100%; }
  .tm-select { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 10px 13px; font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color .2s; width: 100%; }
  .tm-input:focus, .tm-select:focus { border-color: rgba(245,166,35,.55); }
  .tm-select option { background: var(--surface); }
  .tm-modal-actions { display: flex; gap: 10px; padding-top: 4px; }
  .tm-cancel-btn  { flex: 1; padding: 11px; border-radius: var(--radius); border: 1px solid var(--border); background: transparent; color: var(--muted); font-family: var(--font-head); font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
  .tm-cancel-btn:hover  { border-color: var(--accent); color: var(--accent); }
  .tm-confirm-btn { flex: 1; padding: 11px; border-radius: var(--radius); border: none; background: var(--accent); color: #0d1117; font-family: var(--font-head); font-size: 13px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .tm-confirm-btn:hover:not(:disabled) { background: var(--accent2); }
  .tm-confirm-btn:disabled { opacity: .4; cursor: not-allowed; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
`;

export default function Teams() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "Admin";

  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selUsers, setSelUsers] = useState(new Set());

  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState("");

  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [cForm, setCForm] = useState({
    teamName: "",
    teamType: "GENEL",
    status: "AKTIF",
  });
  const [eForm, setEForm] = useState({
    teamId: null,
    teamName: "",
    teamType: "GENEL",
    status: "AKTIF",
  });

  /* ── VERİ YÜKLEMESİ ── */
  useEffect(() => {
    fetchTeams();
    authFetch(`${API}/UserRole/users`)
      .then((r) => r.json())
      .then((d) => setUsers(Array.isArray(d.users) ? d.users : []));
  }, []);

  const fetchTeams = () =>
    authFetch(`${API}/teams/getAllTeams`)
      .then((r) => r.json())
      .then((d) => setTeams(Array.isArray(d) ? d : []));

  const notify = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const pickTeam = (t) => {
    setSelected(t);
    setSelUsers(new Set());
  };

  const toggleUser = (id) =>
    setSelUsers((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  /* ── OLUŞTUR ── */
  const handleCreate = async () => {
    if (!cForm.teamName.trim()) return notify("Takım adı boş olamaz", "err");
    setBusy("create");
    try {
      const res = await authFetch(`${API}/teams`, {
        method: "POST",
        body: JSON.stringify(cForm),
      });
      if (res.ok) {
        const data = await res.json();
        setTeams((p) => [...p, data]);
        setCreateModal(false);
        setCForm({ teamName: "", teamType: "GENEL", status: "AKTIF" });
        notify(`"${data.teamName}" oluşturuldu`);
      } else {
        const txt = await res.text();
        notify(txt || "Oluşturma başarısız", "err");
      }
    } catch {
      notify("Sunucu hatası", "err");
    } finally {
      setBusy("");
    }
  };

  /* ── GÜNCELLE ── */
  const openEdit = (t) => {
    setEForm({
      teamId: t.teamId,
      teamName: t.teamName,
      teamType: t.teamType,
      status: t.status,
    });
    setEditModal(true);
  };

  const handleUpdate = async () => {
    if (!eForm.teamName.trim()) return notify("Takım adı boş olamaz", "err");
    setBusy("update");
    try {
      const res = await authFetch(`${API}/teams/update`, {
        method: "PUT",
        body: JSON.stringify(eForm),
      });
      if (res.ok) {
        const data = await res.json();
        setTeams((p) => p.map((t) => (t.teamId === data.teamId ? data : t)));
        setSelected(data);
        setEditModal(false);
        notify(`"${data.teamName}" güncellendi`);
      } else {
        notify("Güncelleme başarısız", "err");
      }
    } catch {
      notify("Sunucu hatası", "err");
    } finally {
      setBusy("");
    }
  };

  /* ── SİL ── */
  const handleDelete = async (teamId) => {
    if (!window.confirm("Bu takımı silmek istediğinize emin misiniz?")) return;
    setBusy("delete");
    try {
      const res = await authFetch(`${API}/teams/${teamId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTeams((p) => p.filter((t) => t.teamId !== teamId));
        if (selected?.teamId === teamId) setSelected(null);
        notify("Takım silindi");
      } else {
        notify("Silme başarısız", "err");
      }
    } catch {
      notify("Sunucu hatası", "err");
    } finally {
      setBusy("");
    }
  };

  /* ── ÜYE EKLE ── */
  const handleAddMembers = async () => {
    if (selUsers.size === 0) return notify("En az bir kullanıcı seçin", "err");
    setBusy("add");
    try {
      const res = await authFetch(`${API}/teams/add-members`, {
        method: "POST",
        body: JSON.stringify({
          teamId: selected.teamId,
          userIds: [...selUsers],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTeams((p) => p.map((t) => (t.teamId === data.teamId ? data : t)));
        setSelected(data);
        setSelUsers(new Set());
        notify(`${selUsers.size} üye eklendi`);
      } else {
        notify("Üye ekleme başarısız", "err");
      }
    } catch {
      notify("Sunucu hatası", "err");
    } finally {
      setBusy("");
    }
  };

  /* ── ÜYE ÇIKAR ── */
  const handleRemove = async (userId) => {
    try {
      const res = await authFetch(`${API}/teams/remove-member`, {
        method: "POST",
        body: JSON.stringify({ teamId: selected.teamId, userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setTeams((p) => p.map((t) => (t.teamId === data.teamId ? data : t)));
        setSelected(data);
        notify("Üye takımdan çıkarıldı");
      } else {
        notify("Çıkarma başarısız", "err");
      }
    } catch {
      notify("Sunucu hatası", "err");
    }
  };

  const memberIds = new Set(selected?.members?.map((m) => m.userId) || []);
  const availableUsers = users.filter((u) => !memberIds.has(u.userId));

  return (
    <>
      <style>{CSS}</style>

      {toast && (
        <div className={`tm-toast ${toast.type}`}>
          {toast.type === "ok" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {createModal && (
        <TeamModal
          title="Yeni"
          accent="Takım Oluştur"
          onClose={() => setCreateModal(false)}
          onConfirm={handleCreate}
          confirmLabel="Oluştur"
          loading={busy === "create"}
        >
          <div className="tm-field">
            <label>Takım Adı</label>
            <input
              className="tm-input"
              placeholder="örn. Kurtarma Timi A"
              value={cForm.teamName}
              onChange={(e) =>
                setCForm((p) => ({ ...p, teamName: e.target.value }))
              }
            />
          </div>
          <div className="tm-field">
            <label>Takım Türü</label>
            <select
              className="tm-select"
              value={cForm.teamType}
              onChange={(e) =>
                setCForm((p) => ({ ...p, teamType: e.target.value }))
              }
            >
              {Object.entries(TEAM_TYPE_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div className="tm-field">
            <label>Durum</label>
            <select
              className="tm-select"
              value={cForm.status}
              onChange={(e) =>
                setCForm((p) => ({ ...p, status: e.target.value }))
              }
            >
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </TeamModal>
      )}

      {editModal && (
        <TeamModal
          title="Takımı"
          accent="Düzenle"
          onClose={() => setEditModal(false)}
          onConfirm={handleUpdate}
          confirmLabel="Kaydet"
          loading={busy === "update"}
        >
          <div className="tm-field">
            <label>Takım Adı</label>
            <input
              className="tm-input"
              placeholder="Takım adı"
              value={eForm.teamName}
              onChange={(e) =>
                setEForm((p) => ({ ...p, teamName: e.target.value }))
              }
            />
          </div>
          <div className="tm-field">
            <label>Takım Türü</label>
            <select
              className="tm-select"
              value={eForm.teamType}
              onChange={(e) =>
                setEForm((p) => ({ ...p, teamType: e.target.value }))
              }
            >
              {Object.entries(TEAM_TYPE_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div className="tm-field">
            <label>Durum</label>
            <select
              className="tm-select"
              value={eForm.status}
              onChange={(e) =>
                setEForm((p) => ({ ...p, status: e.target.value }))
              }
            >
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </TeamModal>
      )}

      <div className="tm-shell">
        <header className="al-header">
          <div className="al-logo">
            <img src={AegisLogo} alt="Logo" style={{ width: 39, height: 39 }} />
            <span className="al-logo-text">
              Aegis<span>.</span>
            </span>
          </div>
          <div className="al-header-right">
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

        <main className="tm-main">
          <div className="tm-topbar">
            <div className="tm-title">
              Takım <span>Yönetimi</span>
            </div>
            <button className="tm-new-btn" onClick={() => setCreateModal(true)}>
              <PlusIcon /> Yeni Takım
            </button>
          </div>

          <div className="tm-layout">
            {/* SOL — TAKIM LİSTESİ */}
            <div className="tm-panel">
              <div className="tm-panel-head">
                <span className="tm-panel-title">Takımlar</span>
                <span className="tm-badge">{teams.length}</span>
              </div>
              <div className="tm-list">
                {teams.length === 0 ? (
                  <div className="tm-empty-list">Henüz takım yok</div>
                ) : (
                  teams.map((t) => {
                    const tc =
                      TEAM_TYPE_CONFIG[t.teamType] || TEAM_TYPE_CONFIG.GENEL;
                    const sc = STATUS_CONFIG[t.status] || STATUS_CONFIG.PASIF;
                    return (
                      <button
                        key={t.teamId}
                        className={`tm-team-btn ${selected?.teamId === t.teamId ? "active" : ""}`}
                        onClick={() => pickTeam(t)}
                      >
                        <div className="tm-team-icon">{tc.icon}</div>
                        <div className="tm-team-info">
                          <span className="tm-team-name">{t.teamName}</span>
                          <div className="tm-team-pills">
                            <span
                              className="tm-pill"
                              style={{
                                color: tc.color,
                                borderColor: tc.border,
                                background: tc.bg,
                              }}
                            >
                              {tc.label}
                            </span>
                            <span
                              className="tm-pill"
                              style={{
                                color: sc.color,
                                borderColor: sc.border,
                                background: sc.bg,
                              }}
                            >
                              {sc.label}
                            </span>
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--muted)",
                            flexShrink: 0,
                          }}
                        >
                          {t.members?.length || 0} üye
                        </span>
                        {selected?.teamId === t.teamId && (
                          <div className="tm-active-dot" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* SAĞ — DETAY */}
            <div className="tm-panel">
              {!selected ? (
                <div className="tm-empty-state">
                  <div className="tm-empty-icon">👥</div>
                  <p className="tm-empty-txt">
                    Sol listeden bir takım seçin
                    <br />
                    detaylar burada görünecek
                  </p>
                </div>
              ) : (
                (() => {
                  const tc =
                    TEAM_TYPE_CONFIG[selected.teamType] ||
                    TEAM_TYPE_CONFIG.GENEL;
                  const sc =
                    STATUS_CONFIG[selected.status] || STATUS_CONFIG.PASIF;
                  return (
                    <div className="tm-detail">
                      <div className="tm-panel-head">
                        <span className="tm-panel-title">Takım Detayı</span>
                        <span className="tm-badge">{selected.teamName}</span>
                      </div>
                      <div className="tm-detail-body">
                        <div className="tm-info-card">
                          <div className="tm-info-icon">{tc.icon}</div>
                          <div className="tm-info-texts">
                            <div className="tm-info-name">
                              {selected.teamName}
                            </div>
                            <div className="tm-info-sub">
                              ID: {selected.teamId}
                            </div>
                            <div className="tm-info-pills">
                              <span
                                className="tm-pill"
                                style={{
                                  color: tc.color,
                                  borderColor: tc.border,
                                  background: tc.bg,
                                }}
                              >
                                {tc.label}
                              </span>
                              <span
                                className="tm-pill"
                                style={{
                                  color: sc.color,
                                  borderColor: sc.border,
                                  background: sc.bg,
                                }}
                              >
                                {sc.label}
                              </span>
                            </div>
                          </div>
                          <div className="tm-info-actions">
                            <button
                              className="tm-btn-edit"
                              onClick={() => openEdit(selected)}
                            >
                              <EditIcon /> Düzenle
                            </button>
                            <button
                              className="tm-btn-del"
                              onClick={() => handleDelete(selected.teamId)}
                              disabled={busy === "delete"}
                            >
                              <TrashIcon /> Sil
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="tm-sec-lbl">
                            Mevcut Üyeler ({selected.members?.length || 0})
                          </div>
                          <div className="tm-member-list">
                            {!selected.members?.length ? (
                              <div className="tm-no-member">
                                Bu takımda henüz üye yok
                              </div>
                            ) : (
                              selected.members.map((m) => (
                                <div key={m.userId} className="tm-member-row">
                                  <div className="tm-member-av">
                                    {m.name?.[0]?.toUpperCase()}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div className="tm-member-name">
                                      {m.name} {m.surname}
                                    </div>
                                    <div className="tm-member-email">
                                      {m.email}
                                    </div>
                                  </div>
                                  <button
                                    className="tm-remove-btn"
                                    title="Takımdan çıkar"
                                    onClick={() => handleRemove(m.userId)}
                                  >
                                    <TrashIcon />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {availableUsers.length > 0 && (
                          <div>
                            <div className="tm-sec-lbl">Üye Ekle</div>
                            <div className="tm-add-box">
                              <div className="tm-add-box-head">
                                <span className="tm-add-box-title">
                                  Kullanıcı Listesi
                                </span>
                                <span className="tm-add-box-count">
                                  {availableUsers.length} kişi mevcut
                                </span>
                              </div>
                              <div className="tm-user-list">
                                {availableUsers.map((u) => (
                                  <div
                                    key={u.userId}
                                    className={`tm-user-row ${selUsers.has(u.userId) ? "sel" : ""}`}
                                    onClick={() => toggleUser(u.userId)}
                                  >
                                    <div className="tm-checkbox">
                                      {selUsers.has(u.userId) && "✓"}
                                    </div>
                                    <span className="tm-user-label">
                                      {u.name} {u.surname}
                                    </span>
                                    <span className="tm-user-mail">
                                      {u.email}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="tm-add-box-foot">
                                <span className="tm-add-box-info">
                                  {selUsers.size > 0
                                    ? `${selUsers.size} kişi seçildi`
                                    : "Eklemek için seçin"}
                                </span>
                                <button
                                  className="tm-add-box-btn"
                                  onClick={handleAddMembers}
                                  disabled={
                                    busy === "add" || selUsers.size === 0
                                  }
                                >
                                  {busy === "add" ? "Ekleniyor..." : "Ekle"}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {availableUsers.length === 0 &&
                          (selected.members?.length || 0) > 0 && (
                            <p
                              style={{
                                fontSize: 12,
                                color: "var(--muted)",
                                textAlign: "center",
                              }}
                            >
                              Tüm kullanıcılar bu takımda zaten mevcut
                            </p>
                          )}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
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
