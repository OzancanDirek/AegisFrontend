import { useState, useEffect } from "react";
import { authFetch } from "./authFetch.js";
import Sidebar from "./sidebar.jsx";
import Header from "./Header.jsx";

const API = "http://localhost:8080/api";

const STATUS_MAP = {
  PENDING: { label: "Beklemede", color: "#6b8099" },
  VERIFIED: { label: "Onaylandı", color: "#63b3ed" },
  ASSIGNED: { label: "Atandı", color: "#F5A623" },
  IN_PROGRESS: { label: "Devam Ediyor", color: "#a78bfa" },
  COMPLETED: { label: "Tamamlandı", color: "#3ecf5a" },
  CANCELLED: { label: "İptal", color: "#ef4444" },
};

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
  .dd-shell {
    display: grid;
    grid-template-rows: var(--header-h) 1fr var(--footer-h);
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-areas: "header header" "sidebar main" "footer footer";
    height: 100vh; width: 100vw;
  }
  .dd-main { grid-area: main; padding: 24px; overflow-y: auto; background: var(--bg); display: flex; flex-direction: column; gap: 20px; }
  .dd-toast {
    position: fixed; top: 18px; right: 22px; z-index: 9999;
    padding: 10px 18px; border-radius: var(--radius);
    font-family: var(--font-body); font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,.5); border: 1px solid; animation: ddSlide .2s ease;
  }
  .dd-toast.success { background: rgba(62,207,90,.1); border-color: #3ecf5a; color: #3ecf5a; }
  .dd-toast.error   { background: rgba(239,68,68,.1);  border-color: #ef4444; color: #ef4444; }
  @keyframes ddSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  /* Hane kartı */
  .dd-household-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; }
  .dd-household-left { display: flex; align-items: center; gap: 14px; }
  .dd-household-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(245,166,35,.12); border: 1px solid rgba(245,166,35,.25); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .dd-household-name { font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--text); }
  .dd-household-sub { font-size: 12px; color: var(--muted); margin-top: 3px; }
  .dd-new-request-btn { padding: 9px 18px; border-radius: var(--radius); border: none; background: var(--accent); color: #0d1117; font-size: 13px; font-weight: 700; font-family: var(--font-head); cursor: pointer; transition: background .15s; }
  .dd-new-request-btn:hover { background: var(--accent2); }

  /* İstatistikler */
  .dd-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .dd-stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; display: flex; flex-direction: column; gap: 6px; }
  .dd-stat-label { font-size: 11px; color: var(--muted); font-weight: 600; letter-spacing: .5px; }
  .dd-stat-value { font-family: var(--font-head); font-size: 24px; font-weight: 700; }

  /* Talep kartları */
  .dd-section-title { font-family: var(--font-head); font-size: 15px; font-weight: 700; color: var(--text); }
  .dd-request-list { display: flex; flex-direction: column; gap: 10px; }
  .dd-request { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; display: flex; gap: 16px; transition: border-color .15s; }
  .dd-request:hover { border-color: rgba(245,166,35,.3); }
  .dd-request-left { display: flex; flex-direction: column; gap: 6px; flex: 1; }
  .dd-request-type { font-size: 13px; font-weight: 700; font-family: var(--font-head); color: var(--text); }
  .dd-request-category { font-size: 11px; color: var(--muted); }
  .dd-request-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }
  .dd-request-date { font-size: 11px; color: var(--muted); }
  .dd-request-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
  .dd-status-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; border: 1px solid; white-space: nowrap; }
  .dd-urgency { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; border: 1px solid; }

  /* Hane yok durumu */
  .dd-no-household { background: var(--surface); border: 1px dashed var(--border); border-radius: 14px; padding: 40px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .dd-no-household-icon { font-size: 36px; }
  .dd-no-household-text { font-size: 14px; color: var(--muted); text-align: center; line-height: 1.6; }
  .dd-create-household-btn { padding: 10px 24px; border-radius: var(--radius); border: none; background: var(--accent); color: #0d1117; font-size: 13px; font-weight: 700; font-family: var(--font-head); cursor: pointer; transition: background .15s; }
  .dd-create-household-btn:hover { background: var(--accent2); }

  .dd-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 40px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
  .dd-empty-text { font-size: 13px; color: var(--muted); }

  /* Filtreler */
  .dd-filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .dd-filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 12px; font-weight: 600; font-family: var(--font-body); cursor: pointer; transition: all .15s; }
  .dd-filter-btn:hover { color: var(--text); border-color: var(--muted); }
  .dd-filter-btn.active { border-color: var(--accent); background: rgba(245,166,35,.1); color: var(--accent); }

  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
`;

export default function DepremzedeDashboard() {
  const [household, setHousehold] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchData = async () => {
    try {
      const hhRes = await authFetch(`${API}/aid-requests/my-household`);

      if (hhRes.status === 404 || hhRes.status === 204) {
        setHousehold(null);
        setLoading(false);
        return;
      }

      const hh = await hhRes.json();
      setHousehold(hh);

      if (hh?.householdId) {
        const reqRes = await authFetch(
          `${API}/aid-requests/household/${hh.householdId}`,
        );
        const reqs = await reqRes.json();
        setRequests(Array.isArray(reqs) ? reqs : []);
      }
    } catch {
      showToast("Veriler yüklenemedi", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered =
    filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

  const stats = {
    total: requests.length,
    active: requests.filter((r) =>
      ["PENDING", "VERIFIED", "ASSIGNED", "IN_PROGRESS"].includes(r.status),
    ).length,
    completed: requests.filter((r) => r.status === "COMPLETED").length,
    cancelled: requests.filter((r) => r.status === "CANCELLED").length,
  };

  if (loading)
    return (
      <>
        <style>{CSS}</style>
        <div className="dd-shell">
          <Header />
          <Sidebar />
          <main className="dd-main">
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
        <div className={`dd-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div className="dd-shell">
        <Header />
        <Sidebar />

        <main className="dd-main">
          {/* Hane yok */}
          {!household ? (
            <div className="dd-no-household">
              <span className="dd-no-household-icon">🏠</span>
              <span className="dd-no-household-text">
                Henüz bir hane kaydınız bulunmuyor.
                <br />
                Yardım talebi oluşturmak için önce hane bilgilerinizi kaydedin.
              </span>
              <button
                className="dd-create-household-btn"
                onClick={() => (window.location.href = "/requests")}
              >
                Talep Sayfasına Git
              </button>
            </div>
          ) : (
            <>
              {/* Hane kartı */}
              <div className="dd-household-card">
                <div className="dd-household-left">
                  <div className="dd-household-icon">🏠</div>
                  <div>
                    <div className="dd-household-name">
                      {household.householdName || "Hanem"}
                    </div>
                    <div className="dd-household-sub">
                      {household.emergencyContactName &&
                        `📞 ${household.emergencyContactName}`}
                      {household.emergencyContactPhone &&
                        ` · ${household.emergencyContactPhone}`}
                    </div>
                  </div>
                </div>
                <button
                  className="dd-new-request-btn"
                  onClick={() => (window.location.href = "/requests")}
                >
                  + Yeni Talep
                </button>
              </div>

              {/* İstatistikler */}
              <div className="dd-stats">
                <div className="dd-stat">
                  <span className="dd-stat-label">Toplam Talep</span>
                  <span
                    className="dd-stat-value"
                    style={{ color: "var(--text)" }}
                  >
                    {stats.total}
                  </span>
                </div>
                <div className="dd-stat">
                  <span className="dd-stat-label">Aktif</span>
                  <span className="dd-stat-value" style={{ color: "#F5A623" }}>
                    {stats.active}
                  </span>
                </div>
                <div className="dd-stat">
                  <span className="dd-stat-label">Tamamlanan</span>
                  <span className="dd-stat-value" style={{ color: "#3ecf5a" }}>
                    {stats.completed}
                  </span>
                </div>
                <div className="dd-stat">
                  <span className="dd-stat-label">İptal</span>
                  <span className="dd-stat-value" style={{ color: "#ef4444" }}>
                    {stats.cancelled}
                  </span>
                </div>
              </div>

              {/* Talepler */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <span className="dd-section-title">Taleplerim</span>

                <div className="dd-filters">
                  <button
                    className={`dd-filter-btn ${filter === "ALL" ? "active" : ""}`}
                    onClick={() => setFilter("ALL")}
                  >
                    Tümü ({stats.total})
                  </button>
                  {Object.entries(STATUS_MAP).map(([key, val]) => {
                    const count = requests.filter(
                      (r) => r.status === key,
                    ).length;
                    if (count === 0) return null;
                    return (
                      <button
                        key={key}
                        className={`dd-filter-btn ${filter === key ? "active" : ""}`}
                        onClick={() => setFilter(key)}
                      >
                        {val.label} ({count})
                      </button>
                    );
                  })}
                </div>

                {filtered.length === 0 ? (
                  <div className="dd-empty">
                    <span style={{ fontSize: 28 }}>📋</span>
                    <span className="dd-empty-text">
                      {filter === "ALL"
                        ? "Henüz talep oluşturulmamış"
                        : "Bu durumda talep yok"}
                    </span>
                  </div>
                ) : (
                  <div className="dd-request-list">
                    {filtered.map((r) => {
                      const s = STATUS_MAP[r.status] || {
                        label: r.status,
                        color: "#6b8099",
                      };
                      return (
                        <div key={r.requestId} className="dd-request">
                          <div className="dd-request-left">
                            <span className="dd-request-type">
                              {r.typeName || "Yardım Talebi"}
                            </span>
                            {r.category && (
                              <span className="dd-request-category">
                                {r.category}
                              </span>
                            )}
                            {r.description && (
                              <span className="dd-request-desc">
                                {r.description}
                              </span>
                            )}
                            <span className="dd-request-date">
                              📅{" "}
                              {r.createdAt
                                ? new Date(r.createdAt).toLocaleString("tr-TR")
                                : "—"}
                            </span>
                          </div>
                          <div className="dd-request-right">
                            <span
                              className="dd-status-badge"
                              style={{
                                color: s.color,
                                borderColor: s.color,
                                background: `${s.color}15`,
                              }}
                            >
                              {s.label}
                            </span>
                            {r.urgencyLevel && (
                              <span
                                className="dd-urgency"
                                style={{
                                  color: URGENCY_COLORS[r.urgencyLevel],
                                  borderColor: URGENCY_COLORS[r.urgencyLevel],
                                  background: `${URGENCY_COLORS[r.urgencyLevel]}15`,
                                }}
                              >
                                Aciliyet {r.urgencyLevel}
                              </span>
                            )}
                            <span
                              style={{ fontSize: 10, color: "var(--muted)" }}
                            >
                              #{r.requestId}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
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
