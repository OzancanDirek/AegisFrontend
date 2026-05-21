import { useEffect, useState } from "react";
import { authFetch } from "./authFetch";
import { API_BASE_URL } from "./config";
import Sidebar from "./sidebar";
import Header from "./Header.jsx";



const ACTION_COLORS = {
  CREATE: {
    color: "#3ecf5a",
    bg: "rgba(62,207,90,.1)",
    border: "rgba(62,207,90,.25)",
  },
  UPDATE: {
    color: "#63b3ed",
    bg: "rgba(99,179,237,.1)",
    border: "rgba(99,179,237,.25)",
  },
  DELETE: {
    color: "#ef4444",
    bg: "rgba(239,68,68,.1)",
    border: "rgba(239,68,68,.25)",
  },
  LOGIN: {
    color: "#a78bfa",
    bg: "rgba(167,139,250,.1)",
    border: "rgba(167,139,250,.25)",
  },
  LOGIN_FAILED: {
    color: "#f97316",
    bg: "rgba(249,115,22,.1)",
    border: "rgba(249,115,22,.25)",
  },
  REGISTER: {
    color: "#F5A623",
    bg: "rgba(245,166,35,.1)",
    border: "rgba(245,166,35,.25)",
  },
  VIEW: {
    color: "#6b8099",
    bg: "rgba(107,128,153,.1)",
    border: "rgba(107,128,153,.25)",
  },
};

const ENTITY_LABELS = {
  WAREHOUSE: "Depo",
  AID_REQUEST: "Talep",
  ASSIGNMENT: "Görev",
  USER: "Kullanıcı",
  USER_ROLE: "Rol Atama",
  ROLE: "Rol",
  TEAM: "Takım",
  VOLUNTEER: "Gönüllü",
  INVENTORY_ITEM: "Envanter",
  ADDRESS: "Adres",
  ANNOUNCEMENT: "Duyuru",
  HOUSEHOLD: "Hane",
  RESIDENT: "Depremzede",
  SKILL: "Yetenek",
  SPECIAL_NEED: "Özel İhtiyaç",
  AUTH: "Kimlik Doğrulama",
  USER_LIST: "Kullanıcı Listesi",
};

const ACTION_LABELS = {
  CREATE: "Oluşturdu",
  UPDATE: "Güncelledi",
  DELETE: "Sildi",
  LOGIN: "Giriş Yaptı",
  LOGIN_FAILED: "Giriş Başarısız",
  REGISTER: "Kayıt Oldu",
  VIEW: "Görüntüledi",
};

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
  .al-shell { display: grid; grid-template-rows: var(--header-h) 1fr var(--footer-h); grid-template-columns: var(--sidebar-w) 1fr; grid-template-areas: "header header" "sidebar main" "footer footer"; height: 100vh; width: 100vw; }
  .al-main { grid-area: main; padding: 28px; overflow-y: auto; background: var(--bg); display: flex; flex-direction: column; gap: 20px; }
  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); } .al-footer-l strong { color: var(--accent); } .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .page-header { display: flex; align-items: center; justify-content: space-between; }
  .page-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; }
  .page-title span { color: var(--accent); }
  .page-sub { font-size: 13px; color: var(--muted); margin-top: 3px; }

  .al-toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .al-search { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; flex: 1; min-width: 220px; max-width: 340px; }
  .al-search input { background: transparent; border: none; outline: none; color: var(--text); font-family: var(--font-body); font-size: 13px; width: 100%; }
  .al-search input::placeholder { color: var(--muted); }
  .al-select { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: var(--font-body); font-size: 13px; padding: 8px 12px; outline: none; cursor: pointer; }
  .al-select:focus { border-color: var(--accent); }
  .al-select option { background: var(--surface2); }
  .al-refresh-btn { display: flex; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-family: var(--font-body); font-size: 13px; padding: 8px 14px; cursor: pointer; transition: all .2s; margin-left: auto; }
  .al-refresh-btn:hover { border-color: var(--accent); color: var(--accent); }

  .al-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .al-stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 18px; }
  .al-stat-label { font-size: 11px; color: var(--muted); letter-spacing: .8px; text-transform: uppercase; }
  .al-stat-value { font-family: var(--font-head); font-size: 24px; font-weight: 700; margin-top: 4px; }

  .al-table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .al-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .al-table thead tr { background: var(--surface2); border-bottom: 1px solid var(--border); }
  .al-table th { text-align: left; padding: 11px 16px; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
  .al-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .al-table tbody tr:last-child td { border-bottom: none; }
  .al-table tbody tr:hover td { background: var(--surface2); }
  .al-empty { padding: 48px; text-align: center; color: var(--muted); font-size: 14px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .al-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin .8s linear infinite; vertical-align: middle; margin-right: 8px; }

  .action-badge { display: inline-flex; align-items: center; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; border: 1px solid; white-space: nowrap; }
  .entity-chip { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 6px; background: var(--surface2); border: 1px solid var(--border); color: var(--muted); }
  .al-email { font-size: 12px; color: var(--accent); font-family: monospace; }
  .al-detail { font-size: 12px; color: var(--muted); max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .al-time { font-size: 11px; color: var(--muted); white-space: nowrap; }
  .al-id { font-family: monospace; font-size: 11px; color: var(--muted); }
`;

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

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("tr-TR") +
    " " +
    d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
  );
}

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/audit`);
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Kayıtlar alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (l.userEmail || "").toLowerCase().includes(q) ||
      (l.detail || "").toLowerCase().includes(q) ||
      (l.entityId || "").toLowerCase().includes(q);
    const matchAction = actionFilter === "all" || l.action === actionFilter;
    const matchEntity = entityFilter === "all" || l.entityType === entityFilter;
    return matchSearch && matchAction && matchEntity;
  });

  const uniqueActions = [...new Set(logs.map((l) => l.action).filter(Boolean))];
  const uniqueEntities = [
    ...new Set(logs.map((l) => l.entityType).filter(Boolean)),
  ];

  const todayCount = logs.filter((l) => {
    if (!l.createdAt) return false;
    const d = new Date(l.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const failedCount = logs.filter((l) => l.action === "LOGIN_FAILED").length;
  const deleteCount = logs.filter((l) => l.action === "DELETE").length;

  return (
    <>
      <style>{CSS}</style>
      <div className="al-shell">
        <Header />
        <Sidebar />
        <main className="al-main">
          <div className="page-header">
            <div>
              <div className="page-title">
                Audit <span>Log</span>
              </div>
              <div className="page-sub">Sistemdeki tüm işlem geçmişi</div>
            </div>
          </div>

          <div className="al-stats">
            <div className="al-stat">
              <div className="al-stat-label">Toplam Kayıt</div>
              <div className="al-stat-value">{logs.length}</div>
            </div>
            <div className="al-stat">
              <div className="al-stat-label">Bugün</div>
              <div className="al-stat-value" style={{ color: "var(--accent)" }}>
                {todayCount}
              </div>
            </div>
            <div className="al-stat">
              <div className="al-stat-label">Başarısız Giriş</div>
              <div
                className="al-stat-value"
                style={{ color: failedCount > 0 ? "#ef4444" : "#3ecf5a" }}
              >
                {failedCount}
              </div>
            </div>
            <div className="al-stat">
              <div className="al-stat-label">Silme İşlemi</div>
              <div
                className="al-stat-value"
                style={{ color: deleteCount > 0 ? "#f97316" : "var(--text)" }}
              >
                {deleteCount}
              </div>
            </div>
          </div>

          <div className="al-toolbar">
            <div className="al-search">
              <SearchIcon />
              <input
                placeholder="Email, detay veya ID ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="al-select"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="all">Tüm İşlemler</option>
              {uniqueActions.map((a) => (
                <option key={a} value={a}>
                  {ACTION_LABELS[a] || a}
                </option>
              ))}
            </select>
            <select
              className="al-select"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
            >
              <option value="all">Tüm Modüller</option>
              {uniqueEntities.map((e) => (
                <option key={e} value={e}>
                  {ENTITY_LABELS[e] || e}
                </option>
              ))}
            </select>
            <button className="al-refresh-btn" onClick={fetchLogs}>
              <RefreshIcon /> Yenile
            </button>
          </div>

          <div className="al-table-wrap">
            {loading ? (
              <div className="al-empty">
                <span className="al-spinner" />
                Yükleniyor...
              </div>
            ) : filtered.length === 0 ? (
              <div className="al-empty">Kayıt bulunamadı.</div>
            ) : (
              <table className="al-table">
                <thead>
                  <tr>
                    <th>Zaman</th>
                    <th>Kullanıcı</th>
                    <th>İşlem</th>
                    <th>Modül</th>
                    <th>ID</th>
                    <th>Detay</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log) => {
                    const ac =
                      ACTION_COLORS[log.action] || ACTION_COLORS["VIEW"];
                    return (
                      <tr key={log.id}>
                        <td>
                          <span className="al-time">
                            {formatDate(log.createdAt)}
                          </span>
                        </td>
                        <td>
                          <span className="al-email">
                            {log.userEmail || "—"}
                          </span>
                        </td>
                        <td>
                          <span
                            className="action-badge"
                            style={{
                              color: ac.color,
                              background: ac.bg,
                              borderColor: ac.border,
                            }}
                          >
                            {ACTION_LABELS[log.action] || log.action}
                          </span>
                        </td>
                        <td>
                          <span className="entity-chip">
                            {ENTITY_LABELS[log.entityType] ||
                              log.entityType ||
                              "—"}
                          </span>
                        </td>
                        <td>
                          <span className="al-id">{log.entityId || "—"}</span>
                        </td>
                        <td>
                          <span className="al-detail" title={log.detail}>
                            {log.detail || "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
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
    </>
  );
}
