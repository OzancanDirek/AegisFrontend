import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "./authFetch";
import { API_BASE_URL } from "./config";
import Sidebar from "./sidebar";
import Header from "./Header.jsx";


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

  /* Hero */
  .dash-hero { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 28px 32px; position: relative; overflow: hidden; }
  .dash-hero::before { content: ''; position: absolute; top: -40px; right: -40px; width: 220px; height: 220px; background: radial-gradient(circle, rgba(245,166,35,.1) 0%, transparent 70%); border-radius: 50%; }
  .dash-greeting { font-family: var(--font-head); font-size: 24px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
  .dash-greeting span { color: var(--accent); }
  .dash-sub { font-size: 13px; color: var(--muted); }

  /* Stat kartlari */
  .dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .dash-stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; display: flex; flex-direction: column; gap: 8px; cursor: pointer; transition: border-color .2s; }
  .dash-stat:hover { border-color: rgba(245,166,35,.4); }
  .dash-stat-top { display: flex; align-items: center; justify-content: space-between; }
  .dash-stat-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
  .dash-stat-label { font-size: 11px; color: var(--muted); letter-spacing: .8px; text-transform: uppercase; font-weight: 600; }
  .dash-stat-value { font-family: var(--font-head); font-size: 28px; font-weight: 800; }
  .dash-stat-sub { font-size: 11px; color: var(--muted); }

  /* Alt grid */
  .dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .dash-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); display: flex; flex-direction: column; }
  .dash-card-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .dash-card-title { font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--text); }
  .dash-card-link { font-size: 12px; color: var(--accent); cursor: pointer; text-decoration: none; background: none; border: none; font-family: var(--font-body); }
  .dash-card-link:hover { color: var(--accent2); }
  .dash-card-body { padding: 8px 0; flex: 1; }
  .dash-item { display: flex; align-items: center; gap: 12px; padding: 10px 20px; transition: background .15s; }
  .dash-item:hover { background: var(--surface2); }
  .dash-item-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .dash-item-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .dash-item-title { font-size: 13px; color: var(--text); font-weight: 500; }
  .dash-item-sub { font-size: 11px; color: var(--muted); }
  .dash-item-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; border: 1px solid; white-space: nowrap; flex-shrink: 0; }
  .dash-empty-item { padding: 24px 20px; text-align: center; color: var(--muted); font-size: 13px; }

  /* Hizli erisim */
  .dash-quick { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .dash-quick-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; cursor: pointer; transition: all .2s; display: flex; flex-direction: column; gap: 10px; }
  .dash-quick-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .dash-quick-icon { width: 34px; height: 34px; background: rgba(245,166,35,.1); border: 1px solid rgba(245,166,35,.2); border-radius: 9px; display: flex; align-items: center; justify-content: center; color: var(--accent); }
  .dash-quick-title { font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--text); }
  .dash-quick-desc { font-size: 11px; color: var(--muted); }
`;

const STATUS_COLORS = {
  PENDING: "#6b8099",
  VERIFIED: "#63b3ed",
  ASSIGNED: "#F5A623",
  IN_PROGRESS: "#a78bfa",
  COMPLETED: "#3ecf5a",
  CANCELLED: "#ef4444",
};
const STATUS_LABELS = {
  PENDING: "Beklemede",
  VERIFIED: "Onaylandı",
  ASSIGNED: "Atandı",
  IN_PROGRESS: "Devam Ediyor",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal",
};

const UsersIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="4" fill="currentColor" />
    <path d="M2 21v-1a7 7 0 0114 0v1" fill="currentColor" opacity=".7" />
  </svg>
);
const AlertIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 19h20L12 2z" fill="currentColor" opacity=".8" />
    <path
      d="M12 9v4M12 16.5v.5"
      stroke="#0d1117"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
const BoxIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" fill="currentColor" opacity=".8" />
    <path d="M3 8l9 5 9-5M12 13v8" stroke="#0d1117" strokeWidth="1.2" />
  </svg>
);
const AssignIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <rect
      x="4"
      y="3"
      width="16"
      height="18"
      rx="2"
      fill="currentColor"
      opacity=".2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M8 7h8M8 11h8M8 15h5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const TeamIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="3" fill="currentColor" opacity=".9" />
    <circle cx="17" cy="8" r="3" fill="currentColor" opacity=".6" />
    <path d="M3 20c0-3.5 3-6 6-6s6 2.5 6 6" fill="currentColor" opacity=".5" />
  </svg>
);
const MapIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"
      fill="currentColor"
      opacity=".7"
    />
  </svg>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "Admin";

  const [requests, setRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [criticalItems, setCriticalItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reqRes, asgRes, volRes, critRes] = await Promise.all([
          authFetch(`${API_BASE_URL}/aid-requests`),
          authFetch(`${API_BASE_URL}/assignments`),
          authFetch(`${API_BASE_URL}/volunteer`),
          authFetch(`${API_BASE_URL}/inventory/critical`),
        ]);
        const [reqData, asgData, volData, critData] = await Promise.all([
          reqRes.json(),
          asgRes.json(),
          volRes.json(),
          critRes.json(),
        ]);
        setRequests(Array.isArray(reqData) ? reqData : []);
        setAssignments(Array.isArray(asgData) ? asgData : []);
        setVolunteers(Array.isArray(volData) ? volData : []);
        setCriticalItems(Array.isArray(critData) ? critData : []);
      } catch {
        console.error();
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const activeRequests = requests.filter((r) =>
    ["PENDING", "VERIFIED", "ASSIGNED", "IN_PROGRESS"].includes(r.status),
  ).length;
  const availableVols = volunteers.filter((v) => v.availabilityStatus).length;
  const activeAssign = assignments.filter(
    (a) => a.status === "IN_PROGRESS",
  ).length;
  const criticalCount = criticalItems.length;

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  const recentAssignments = [...assignments]
    .sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))
    .slice(0, 5);

  const STATS = [
    {
      label: "Aktif Talep",
      value: activeRequests,
      sub: `${requests.length} toplam talep`,
      color: "#F5A623",
      bg: "rgba(245,166,35,.1)",
      icon: <AlertIcon />,
      path: "/requests",
    },
    {
      label: "Müsait Gönüllü",
      value: availableVols,
      sub: `${volunteers.length} toplam gönüllü`,
      color: "#3ecf5a",
      bg: "rgba(62,207,90,.1)",
      icon: <UsersIcon />,
      path: "/volunteers",
    },
    {
      label: "Devam Eden Görev",
      value: activeAssign,
      sub: `${assignments.length} toplam görev`,
      color: "#a78bfa",
      bg: "rgba(167,139,250,.1)",
      icon: <AssignIcon />,
      path: "/assignments",
    },
    {
      label: "Kritik Stok",
      value: criticalCount,
      sub: "Kritik seviyedeki ürünler",
      color: criticalCount > 0 ? "#ef4444" : "#3ecf5a",
      bg: criticalCount > 0 ? "rgba(239,68,68,.1)" : "rgba(62,207,90,.1)",
      icon: <BoxIcon />,
      path: "/warehouses",
    },
  ];

  const QUICK = [
    {
      icon: <UsersIcon />,
      title: "Kullanıcılar",
      desc: "Kullanıcıları yönet",
      path: "/adminUsers",
    },
    {
      icon: <TeamIcon />,
      title: "Takımlar",
      desc: "Ekip yönetimi",
      path: "/teams",
    },
    {
      icon: <BoxIcon />,
      title: "Depolar",
      desc: "Stok ve envanter",
      path: "/warehouses",
    },
    {
      icon: <MapIcon />,
      title: "Harita",
      desc: "Risk ve deprem verileri",
      path: "/map",
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="al-shell">
        <Header />
        <Sidebar />
        <main className="al-main">
          {/* Hero */}
          <div className="dash-hero">
            <div className="dash-greeting">
              Hoş Geldiniz, <span>{userName}</span> 👋
            </div>
            <div className="dash-sub">
              Sistemin genel durumunu aşağıdan takip edebilirsiniz.
            </div>
          </div>

          {/* İstatistik kartları */}
          <div className="dash-stats">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="dash-stat"
                onClick={() => navigate(s.path)}
              >
                <div className="dash-stat-top">
                  <span className="dash-stat-label">{s.label}</span>
                  <div
                    className="dash-stat-icon"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {s.icon}
                  </div>
                </div>
                <div className="dash-stat-value" style={{ color: s.color }}>
                  {loading ? "—" : s.value}
                </div>
                <div className="dash-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Son talepler + son görevler */}
          <div className="dash-grid">
            {/* Son Talepler */}
            <div className="dash-card">
              <div className="dash-card-head">
                <span className="dash-card-title">Son Talepler</span>
                <button
                  className="dash-card-link"
                  onClick={() => navigate("/requests")}
                >
                  Tümünü gör →
                </button>
              </div>
              <div className="dash-card-body">
                {loading ? (
                  <div className="dash-empty-item">Yükleniyor...</div>
                ) : recentRequests.length === 0 ? (
                  <div className="dash-empty-item">Talep bulunamadı</div>
                ) : (
                  recentRequests.map((r) => (
                    <div key={r.requestId} className="dash-item">
                      <div
                        className="dash-item-dot"
                        style={{
                          background: STATUS_COLORS[r.status] || "#6b8099",
                        }}
                      />
                      <div className="dash-item-info">
                        <span className="dash-item-title">
                          {r.typeName || "Yardım Talebi"}
                        </span>
                        <span className="dash-item-sub">
                          {r.householdName || "—"} · Aciliyet {r.urgencyLevel}
                        </span>
                      </div>
                      <span
                        className="dash-item-badge"
                        style={{
                          color: STATUS_COLORS[r.status],
                          borderColor: STATUS_COLORS[r.status],
                          background: `${STATUS_COLORS[r.status]}15`,
                        }}
                      >
                        {STATUS_LABELS[r.status] || r.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Son Görevler */}
            <div className="dash-card">
              <div className="dash-card-head">
                <span className="dash-card-title">Son Görevler</span>
                <button
                  className="dash-card-link"
                  onClick={() => navigate("/assignments")}
                >
                  Tümünü gör →
                </button>
              </div>
              <div className="dash-card-body">
                {loading ? (
                  <div className="dash-empty-item">Yükleniyor...</div>
                ) : recentAssignments.length === 0 ? (
                  <div className="dash-empty-item">Görev bulunamadı</div>
                ) : (
                  recentAssignments.map((a) => (
                    <div key={a.assignmentId} className="dash-item">
                      <div
                        className="dash-item-dot"
                        style={{
                          background: STATUS_COLORS[a.status] || "#6b8099",
                        }}
                      />
                      <div className="dash-item-info">
                        <span className="dash-item-title">
                          Görev #{a.assignmentId}
                        </span>
                        <span className="dash-item-sub">
                          {a.notes || "Not yok"} ·{" "}
                          {a.assignedAt
                            ? new Date(a.assignedAt).toLocaleDateString("tr-TR")
                            : "—"}
                        </span>
                      </div>
                      <span
                        className="dash-item-badge"
                        style={{
                          color: STATUS_COLORS[a.status],
                          borderColor: STATUS_COLORS[a.status],
                          background: `${STATUS_COLORS[a.status]}15`,
                        }}
                      >
                        {STATUS_LABELS[a.status] || a.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Hızlı erişim */}
          <div className="dash-quick">
            {QUICK.map((q) => (
              <div
                key={q.path}
                className="dash-quick-card"
                onClick={() => navigate(q.path)}
              >
                <div className="dash-quick-icon">{q.icon}</div>
                <div>
                  <div className="dash-quick-title">{q.title}</div>
                  <div className="dash-quick-desc">{q.desc}</div>
                </div>
              </div>
            ))}
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
