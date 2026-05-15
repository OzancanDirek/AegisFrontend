import { useState, useEffect } from "react";
import { authFetch } from "./authFetch.js";
import Sidebar from "./sidebar.jsx";
import Header from "./Header.jsx";

const API = "http://localhost:8080/api";

const STATUS_COLS = [
  { key: "PENDING", label: "Bekliyor", color: "#6b8099" },
  { key: "IN_PROGRESS", label: "Devam Ediyor", color: "#F5A623" },
  { key: "COMPLETED", label: "Tamamlandı", color: "#3ecf5a" },
  { key: "CANCELLED", label: "İptal", color: "#ef4444" },
];

const URGENCY_COLORS = {
  1: "#3ecf5a",
  2: "#a3e635",
  3: "#F5A623",
  4: "#f97316",
  5: "#ef4444",
};

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
  .vd-shell {
    display: grid;
    grid-template-rows: var(--header-h) 1fr var(--footer-h);
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-areas: "header header" "sidebar main" "footer footer";
    height: 100vh; width: 100vw;
  }
  .vd-main { grid-area: main; padding: 24px; overflow-y: auto; background: var(--bg); display: flex; flex-direction: column; gap: 20px; }
  .vd-toast {
    position: fixed; top: 18px; right: 22px; z-index: 9999;
    padding: 10px 18px; border-radius: var(--radius);
    font-family: var(--font-body); font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,.5); border: 1px solid; animation: vdSlide .2s ease;
  }
  .vd-toast.success { background: rgba(62,207,90,.1); border-color: #3ecf5a; color: #3ecf5a; }
  .vd-toast.error   { background: rgba(239,68,68,.1);  border-color: #ef4444; color: #ef4444; }
  @keyframes vdSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  /* Üst profil kartı */
  .vd-profile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; }
  .vd-profile-left { display: flex; align-items: center; gap: 16px; }
  .vd-avatar { width: 52px; height: 52px; border-radius: 50%; background: rgba(245,166,35,.15); border: 2px solid rgba(245,166,35,.4); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: var(--accent); font-family: var(--font-head); flex-shrink: 0; }
  .vd-name { font-family: var(--font-head); font-size: 17px; font-weight: 700; color: var(--text); }
  .vd-sub { font-size: 12px; color: var(--muted); margin-top: 3px; }
  .vd-status-badge { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; font-family: var(--font-body); }
  .vd-status-badge.available { background: rgba(62,207,90,.1); border: 1px solid rgba(62,207,90,.3); color: #3ecf5a; }
  .vd-status-badge.unavailable { background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.3); color: #ef4444; }

  /* İstatistik kartları */
  .vd-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .vd-stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; display: flex; flex-direction: column; gap: 6px; }
  .vd-stat-label { font-size: 11px; color: var(--muted); font-weight: 600; letter-spacing: .5px; }
  .vd-stat-value { font-family: var(--font-head); font-size: 24px; font-weight: 700; }

  /* Görev listesi */
  .vd-section-title { font-family: var(--font-head); font-size: 15px; font-weight: 700; color: var(--text); }
  .vd-filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .vd-filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 12px; font-weight: 600; font-family: var(--font-body); cursor: pointer; transition: all .15s; }
  .vd-filter-btn:hover { color: var(--text); border-color: var(--muted); }
  .vd-filter-btn.active { border-color: var(--accent); background: rgba(245,166,35,.1); color: var(--accent); }

  .vd-task-list { display: flex; flex-direction: column; gap: 10px; }
  .vd-task { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; display: flex; align-items: center; gap: 16px; transition: border-color .15s; }
  .vd-task:hover { border-color: rgba(245,166,35,.3); }
  .vd-task-status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .vd-task-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .vd-task-type { font-size: 13px; font-weight: 700; font-family: var(--font-head); color: var(--text); }
  .vd-task-household { font-size: 12px; color: var(--muted); }
  .vd-task-date { font-size: 11px; color: var(--muted); }
  .vd-task-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
  .vd-task-status { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; border: 1px solid; }
  .vd-urgency { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; border: 1px solid; }

  .vd-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 48px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
  .vd-empty-icon { font-size: 32px; }
  .vd-empty-text { font-size: 13px; color: var(--muted); text-align: center; }

  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
`;

export default function VolunteerDashboard() {
  const [profile, setProfile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("ALL");


  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    authFetch(`${API}/users/profile`)
      .then((r) => r.json())
      .then((p) => {
        setProfile(p);
        if (p.volunteerId) {
          return authFetch(`${API}/assignments/volunteer/${p.volunteerId}`)
            .then((r) => r.json())
            .then((a) => setAssignments(Array.isArray(a) ? a : []));
        }
      })
      .catch(() => showToast("Veriler yüklenemedi", "error"))
      .finally(() => setLoading(false));
  }, []);
  const filtered =
    filter === "ALL"
      ? assignments
      : assignments.filter((a) => a.status === filter);

  const stats = {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === "PENDING").length,
    inProgress: assignments.filter((a) => a.status === "IN_PROGRESS").length,
    completed: assignments.filter((a) => a.status === "COMPLETED").length,
  };

  const getStatusColor = (status) =>
    STATUS_COLS.find((s) => s.key === status)?.color || "#6b8099";

  const getStatusLabel = (status) =>
    STATUS_COLS.find((s) => s.key === status)?.label || status;

  if (loading)
    return (
      <>
        <style>{CSS}</style>
        <div className="vd-shell">
          <Header />
          <Sidebar />
          <main className="vd-main">
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              Yükleniyor...
            </div>
          </main>
        </div>
      </>
    );

  return (
    <>
      <style>{CSS}</style>
      {toast && (
        <div className={`vd-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div className="vd-shell">
        <Header />
        <Sidebar />

        <main className="vd-main">
          {/* Profil kartı */}
          <div className="vd-profile-card">
            <div className="vd-profile-left">
              <div className="vd-avatar">
                {profile?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="vd-name">
                  {profile?.name} {profile?.surname}
                </div>
                <div className="vd-sub">
                  {profile?.transportType && `🚗 ${profile.transportType}`}
                  {profile?.maxDistanceKm && ` · ${profile.maxDistanceKm} km`}
                  {profile?.city && ` · ${profile.city}`}
                </div>
              </div>
            </div>
            <div
              className={`vd-status-badge ${profile?.availabilityStatus ? "available" : "unavailable"}`}
            >
              <span>{profile?.availabilityStatus ? "●" : "●"}</span>
              {profile?.availabilityStatus ? "Müsaitim" : "Müsait Değilim"}
            </div>
          </div>

          {/* İstatistikler */}
          <div className="vd-stats">
            <div className="vd-stat">
              <span className="vd-stat-label">Toplam Görev</span>
              <span className="vd-stat-value" style={{ color: "var(--text)" }}>
                {stats.total}
              </span>
            </div>
            <div className="vd-stat">
              <span className="vd-stat-label">Bekleyen</span>
              <span className="vd-stat-value" style={{ color: "#6b8099" }}>
                {stats.pending}
              </span>
            </div>
            <div className="vd-stat">
              <span className="vd-stat-label">Devam Eden</span>
              <span className="vd-stat-value" style={{ color: "#F5A623" }}>
                {stats.inProgress}
              </span>
            </div>
            <div className="vd-stat">
              <span className="vd-stat-label">Tamamlanan</span>
              <span className="vd-stat-value" style={{ color: "#3ecf5a" }}>
                {stats.completed}
              </span>
            </div>
          </div>

          {/* Görev listesi */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span className="vd-section-title">Görevlerim</span>
            </div>

            <div className="vd-filters">
              {[{ key: "ALL", label: "Tümü" }, ...STATUS_COLS].map((f) => (
                <button
                  key={f.key}
                  className={`vd-filter-btn ${filter === f.key ? "active" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}{" "}
                  {f.key === "ALL"
                    ? `(${stats.total})`
                    : `(${assignments.filter((a) => a.status === f.key).length})`}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="vd-empty">
                <span className="vd-empty-icon">📋</span>
                <span className="vd-empty-text">
                  {filter === "ALL"
                    ? "Henüz görev atanmamış"
                    : "Bu durumda görev yok"}
                </span>
              </div>
            ) : (
              <div className="vd-task-list">
                {filtered.map((a) => (
                  <div key={a.assignmentId} className="vd-task">
                    <div
                      className="vd-task-status-dot"
                      style={{ background: getStatusColor(a.status) }}
                    />
                    <div className="vd-task-info">
                      <span className="vd-task-type">
                        {a.requestType || "Yardım Talebi"}
                      </span>
                      {a.householdName && (
                        <span className="vd-task-household">
                          📍 {a.householdName}
                        </span>
                      )}
                      <span className="vd-task-date">
                        {a.assignedAt
                          ? new Date(a.assignedAt).toLocaleString("tr-TR")
                          : "—"}
                      </span>
                      {a.notes && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--muted)",
                            fontStyle: "italic",
                          }}
                        >
                          {a.notes}
                        </span>
                      )}
                    </div>
                    <div className="vd-task-right">
                      <span
                        className="vd-task-status"
                        style={{
                          color: getStatusColor(a.status),
                          borderColor: getStatusColor(a.status),
                          background: `${getStatusColor(a.status)}15`,
                        }}
                      >
                        {getStatusLabel(a.status)}
                      </span>
                      {a.urgencyLevel && (
                        <span
                          className="vd-urgency"
                          style={{
                            color: URGENCY_COLORS[a.urgencyLevel],
                            borderColor: URGENCY_COLORS[a.urgencyLevel],
                            background: `${URGENCY_COLORS[a.urgencyLevel]}15`,
                          }}
                        >
                          Aciliyet {a.urgencyLevel}
                        </span>
                      )}
                      {a.completedAt && (
                        <span style={{ fontSize: 10, color: "#3ecf5a" }}>
                          ✓{" "}
                          {new Date(a.completedAt).toLocaleDateString("tr-TR")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
