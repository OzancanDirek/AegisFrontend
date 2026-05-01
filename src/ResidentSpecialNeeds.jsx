import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AegisLogo from "./images/Aegislogo.jpeg";
import Sidebar from "./sidebar";

const API = "http://localhost:8080/api";

// Token'ı her istekte otomatik ekleyen yardımcı fonksiyon
import { authFetch } from "./authFetch";

const PRIORITY_CONFIG = {
  CRITICAL: {
    label: "Kritik",
    color: "#ef4444",
    bg: "rgba(239,68,68,.12)",
    border: "rgba(239,68,68,.35)",
    icon: "🔴",
  },
  HIGH: {
    label: "Yüksek",
    color: "#f97316",
    bg: "rgba(249,115,22,.12)",
    border: "rgba(249,115,22,.35)",
    icon: "🟠",
  },
  MEDIUM: {
    label: "Orta",
    color: "#F5A623",
    bg: "rgba(245,166,35,.12)",
    border: "rgba(245,166,35,.35)",
    icon: "🟡",
  },
  LOW: {
    label: "Düşük",
    color: "#6b8099",
    bg: "rgba(107,128,153,.12)",
    border: "rgba(107,128,153,.35)",
    icon: "⚪",
  },
};

function calcPriority(needIds, allNeeds, birthDate) {
  const selected = allNeeds.filter((n) => needIds.has(n.needId));
  const hasMed = selected.some((n) =>
    n.needName?.toLowerCase().includes("ilaç"),
  );
  const hasAny = selected.length > 0;

  let age = null;
  if (birthDate) {
    age = Math.floor(
      (new Date() - new Date(birthDate)) / (1000 * 60 * 60 * 24 * 365.25),
    );
  }

  if (hasMed) return "CRITICAL";
  if (age !== null && age > 65 && hasAny) return "HIGH";
  if (hasAny) return "MEDIUM";
  return "LOW";
}

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
  .sn-shell { display: grid; grid-template-rows: var(--header-h) 1fr var(--footer-h); grid-template-columns: var(--sidebar-w) 1fr; grid-template-areas: "header header" "sidebar main" "footer footer"; height: 100vh; width: 100vw; }
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
  .sn-main { grid-area: main; padding: 28px; overflow-y: auto; background: var(--bg); }
  .sn-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; margin-bottom: 24px; letter-spacing: -.3px; }
  .sn-title span { color: var(--accent); }
  .sn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: calc(100vh - var(--header-h) - var(--footer-h) - 80px); }
  .sn-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); display: flex; flex-direction: column; overflow: hidden; }
  .sn-panel-head { padding: 13px 18px; border-bottom: 1px solid var(--border); background: var(--surface2); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .sn-panel-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; }
  .sn-badge { background: rgba(245,166,35,.15); border: 1px solid rgba(245,166,35,.25); color: var(--accent); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
  .sn-search-wrap { padding: 12px 14px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .sn-search { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 8px 12px; font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color .2s; }
  .sn-search:focus { border-color: rgba(245,166,35,.5); }
  .sn-search::placeholder { color: var(--muted); }
  .sn-list { overflow-y: auto; flex: 1; }
  .sn-res-btn { width: 100%; display: flex; align-items: center; gap: 11px; padding: 11px 14px; background: transparent; border: none; border-bottom: 1px solid var(--border); color: var(--muted); cursor: pointer; text-align: left; transition: background .12s; font-family: var(--font-body); }
  .sn-res-btn:hover { background: var(--surface2); color: var(--text); }
  .sn-res-btn.active { background: rgba(245,166,35,.07); }
  .sn-res-avatar { width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; background: var(--surface2); border: 1px solid var(--border); color: var(--muted); }
  .sn-res-btn.active .sn-res-avatar { background: rgba(245,166,35,.18); border-color: rgba(245,166,35,.4); color: var(--accent); }
  .sn-res-info { flex: 1; display: flex; flex-direction: column; gap: 1px; }
  .sn-res-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .sn-res-id { font-size: 11px; color: var(--muted); }
  .sn-active-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .sn-empty { padding: 28px; text-align: center; color: var(--muted); font-size: 13px; }
  .sn-empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 40px; }
  .sn-empty-icon { width: 50px; height: 50px; border-radius: 50%; background: var(--surface2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .sn-empty-txt { font-size: 13px; color: var(--muted); text-align: center; line-height: 1.6; }
  .sn-assign-area { flex: 1; padding: 18px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }
  .sn-ucard { display: flex; align-items: center; gap: 12px; padding: 14px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); }
  .sn-ucard-avatar { width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 700; background: rgba(245,166,35,.15); border: 1.5px solid rgba(245,166,35,.4); color: var(--accent); }
  .sn-ucard-name { font-size: 15px; font-weight: 700; color: var(--text); font-family: var(--font-head); }
  .sn-ucard-id { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .sn-ucard-meta { margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .sn-section-lbl { font-size: 10px; letter-spacing: 1.4px; text-transform: uppercase; color: var(--muted); font-weight: 600; margin-bottom: 8px; }
  .sn-needs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .sn-need-card { padding: 12px 14px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg); cursor: pointer; transition: all .15s; display: flex; align-items: center; gap: 10px; position: relative; }
  .sn-need-card:hover { border-color: rgba(245,166,35,.4); background: rgba(245,166,35,.04); }
  .sn-need-card.checked { border-color: var(--accent); background: rgba(245,166,35,.09); }
  .sn-need-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); flex-shrink: 0; }
  .sn-need-card.checked .sn-need-dot { background: var(--accent); }
  .sn-need-name { font-size: 13px; color: var(--muted); }
  .sn-need-card.checked .sn-need-name { color: var(--accent); }
  .sn-check-mark { position: absolute; top: 8px; right: 8px; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 9px; color: #0d1117; font-weight: 900; }
  .sn-save-btn { width: 100%; padding: 12px; border-radius: var(--radius); border: none; background: var(--accent); color: #0d1117; font-size: 13px; font-weight: 700; font-family: var(--font-head); cursor: pointer; transition: background .15s; margin-top: auto; }
  .sn-save-btn:hover:not(:disabled) { background: var(--accent2); }
  .sn-save-btn:disabled { opacity: .4; cursor: not-allowed; }
  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  .sn-toast { position: fixed; top: 18px; right: 22px; z-index: 9999; padding: 10px 18px; border-radius: var(--radius); font-family: var(--font-body); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 30px rgba(0,0,0,.5); border: 1px solid; animation: snSlide .2s ease; }
  .sn-toast.success { background: rgba(62,207,90,.1); border-color: #3ecf5a; color: #3ecf5a; }
  .sn-toast.error { background: rgba(239,68,68,.1); border-color: #ef4444; color: #ef4444; }
  @keyframes snSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .sn-priority-pill { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px; border: 1px solid; white-space: nowrap; flex-shrink: 0; font-family: var(--font-body); }
  .sn-priority-preview { border-radius: var(--radius); border: 1px solid; padding: 13px 16px; display: flex; align-items: center; gap: 12px; transition: all .25s ease; }
  .sn-priority-icon { font-size: 22px; flex-shrink: 0; }
  .sn-priority-info { flex: 1; }
  .sn-priority-lbl { font-size: 10px; letter-spacing: 1.4px; text-transform: uppercase; color: var(--muted); font-weight: 600; margin-bottom: 3px; }
  .sn-priority-val { font-family: var(--font-head); font-size: 16px; font-weight: 800; }
  .sn-priority-desc { font-size: 11px; color: var(--muted); margin-top: 2px; line-height: 1.5; }
  .sn-priority-change-badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; border: 1px solid rgba(62,207,90,.35); background: rgba(62,207,90,.1); color: #3ecf5a; animation: snSlide .2s ease; }
`;

const PRIORITY_DESC = {
  CRITICAL: "İlaç bağımlılığı tespit edildi — acil müdahale gerekebilir",
  HIGH: "65 yaş üstü & özel ihtiyaç mevcut — yüksek takip gerekli",
  MEDIUM: "Özel ihtiyaç atanmış — düzenli takip önerilir",
  LOW: "Henüz özel ihtiyaç yok — standart bakım yeterli",
};

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

export default function ResidentSpecialNeeds() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [selectedNeedIds, setSelectedNeedIds] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [savedPriority, setSavedPriority] = useState(null);
  const [_prevPreviewPriority, setPrevPreviewPriority] = useState(null);

  const userName = localStorage.getItem("name") || "Admin";

  useEffect(() => {
    authFetch(`${API}/residents/all`)
      .then((r) => r.json())
      .then((d) => setResidents(Array.isArray(d) ? d : []));
    authFetch(`${API}/special-needs/all`)
      .then((r) => r.json())
      .then((d) => setNeeds(Array.isArray(d) ? d : []));
  }, []);

  const selectResident = (r) => {
    setSelectedResident(r);
    setSelectedNeedIds(new Set(r.specialNeeds?.map((n) => n.needId) || []));
    setSavedPriority(r.priorityLevel || null);
    setPrevPreviewPriority(null);
  };

  const toggleNeed = (id) => {
    setSelectedNeedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const save = async () => {
    if (!selectedResident) return;
    setSaving(true);
    try {
      const res = await authFetch(
        `${API}/residents/${selectedResident.residentId}/special-needs`,
        {
          method: "POST",
          body: JSON.stringify([...selectedNeedIds]),
        },
      );
      if (res.ok) {
        const data = await res.json();
        const newPriority = data.priorityLevel;
        setSavedPriority(newPriority);
        setPrevPreviewPriority(null);
        setResidents((prev) =>
          prev.map((r) =>
            r.residentId === selectedResident.residentId
              ? {
                  ...r,
                  specialNeeds: data.specialNeeds,
                  priorityLevel: newPriority,
                }
              : r,
          ),
        );
        const cfg = PRIORITY_CONFIG[newPriority] || {};
        showToast(
          `İhtiyaçlar kaydedildi — Öncelik: ${cfg.label || newPriority}`,
          "success",
        );
      } else {
        showToast("Kayıt başarısız", "error");
      }
    } catch {
      showToast("Sunucu hatası", "error");
    } finally {
      setSaving(false);
    }
  };

  const livePreviewPriority = selectedResident
    ? calcPriority(selectedNeedIds, needs, selectedResident.birthDate)
    : null;

  const priorityChanged =
    savedPriority &&
    livePreviewPriority &&
    livePreviewPriority !== savedPriority;

  const filtered = residents.filter((r) =>
    r.fullName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <style>{CSS}</style>
      {toast && (
        <div className={`sn-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}
      <div className="sn-shell">
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

        <main className="sn-main">
          <div className="sn-title">
            Özel İhtiyaç <span>Atama</span>
          </div>
          <div className="sn-grid">
            {/* SOL: SAKİN LİSTESİ */}
            <div className="sn-panel">
              <div className="sn-panel-head">
                <span className="sn-panel-title">Sakinler</span>
                <span className="sn-badge">{filtered.length}</span>
              </div>
              <div className="sn-search-wrap">
                <input
                  className="sn-search"
                  placeholder="İsim ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="sn-list">
                {filtered.length === 0 ? (
                  <div className="sn-empty">Sakin bulunamadı</div>
                ) : (
                  filtered.map((r) => {
                    const p = r.priorityLevel;
                    const cfg = PRIORITY_CONFIG[p];
                    return (
                      <button
                        key={r.residentId}
                        className={`sn-res-btn ${selectedResident?.residentId === r.residentId ? "active" : ""}`}
                        onClick={() => selectResident(r)}
                      >
                        <div className="sn-res-avatar">
                          {r.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div className="sn-res-info">
                          <span className="sn-res-name">{r.fullName}</span>
                          <span className="sn-res-id">#{r.residentId}</span>
                        </div>
                        {cfg && (
                          <span
                            className="sn-priority-pill"
                            style={{
                              color: cfg.color,
                              borderColor: cfg.border,
                              background: cfg.bg,
                            }}
                          >
                            {cfg.icon} {cfg.label}
                          </span>
                        )}
                        {selectedResident?.residentId === r.residentId && (
                          <div className="sn-active-dot" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* SAĞ: ATAMA PANELİ */}
            <div className="sn-panel">
              <div className="sn-panel-head">
                <span className="sn-panel-title">İhtiyaç Ata</span>
                {selectedResident && (
                  <span className="sn-badge">{selectedResident.fullName}</span>
                )}
              </div>
              {!selectedResident ? (
                <div className="sn-empty-state">
                  <div className="sn-empty-icon">👤</div>
                  <p className="sn-empty-txt">
                    Sol listeden bir sakin seçin
                    <br />
                    ihtiyaç atama paneli burada görünecek
                  </p>
                </div>
              ) : (
                <div className="sn-assign-area">
                  <div className="sn-ucard">
                    <div className="sn-ucard-avatar">
                      {selectedResident.fullName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="sn-ucard-name">
                        {selectedResident.fullName}
                      </div>
                      <div className="sn-ucard-id">
                        Sakin ID: {selectedResident.residentId}
                      </div>
                    </div>
                    {savedPriority && PRIORITY_CONFIG[savedPriority] && (
                      <div className="sn-ucard-meta">
                        <span
                          style={{
                            fontSize: 10,
                            color: "var(--muted)",
                            letterSpacing: ".8px",
                            textTransform: "uppercase",
                          }}
                        >
                          Kayıtlı Öncelik
                        </span>
                        <span
                          className="sn-priority-pill"
                          style={{
                            color: PRIORITY_CONFIG[savedPriority].color,
                            borderColor: PRIORITY_CONFIG[savedPriority].border,
                            background: PRIORITY_CONFIG[savedPriority].bg,
                            fontSize: 12,
                            padding: "3px 10px",
                          }}
                        >
                          {PRIORITY_CONFIG[savedPriority].icon}{" "}
                          {PRIORITY_CONFIG[savedPriority].label}
                        </span>
                      </div>
                    )}
                  </div>

                  {livePreviewPriority &&
                    PRIORITY_CONFIG[livePreviewPriority] &&
                    (() => {
                      const cfg = PRIORITY_CONFIG[livePreviewPriority];
                      return (
                        <div
                          className="sn-priority-preview"
                          style={{
                            background: cfg.bg,
                            borderColor: cfg.border,
                          }}
                        >
                          <div className="sn-priority-icon">{cfg.icon}</div>
                          <div className="sn-priority-info">
                            <div className="sn-priority-lbl">
                              Öncelik Önizlemesi
                            </div>
                            <div
                              className="sn-priority-val"
                              style={{ color: cfg.color }}
                            >
                              {cfg.label}
                            </div>
                            <div className="sn-priority-desc">
                              {PRIORITY_DESC[livePreviewPriority]}
                            </div>
                          </div>
                          {priorityChanged && (
                            <div className="sn-priority-change-badge">
                              ↑ Değişecek
                            </div>
                          )}
                        </div>
                      );
                    })()}

                  <div>
                    <div className="sn-section-lbl">Özel İhtiyaçlar</div>
                    <div className="sn-needs-grid">
                      {needs.map((n) => (
                        <div
                          key={n.needId}
                          className={`sn-need-card ${selectedNeedIds.has(n.needId) ? "checked" : ""}`}
                          onClick={() => toggleNeed(n.needId)}
                        >
                          <div className="sn-need-dot" />
                          <span className="sn-need-name">{n.needName}</span>
                          {selectedNeedIds.has(n.needId) && (
                            <div className="sn-check-mark">✓</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="sn-save-btn"
                    onClick={save}
                    disabled={saving}
                  >
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
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
