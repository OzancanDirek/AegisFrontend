import { useEffect, useState } from "react";
import { authFetch } from "./authFetch";
import Sidebar from "./sidebar";
import Header from "./Header.jsx";

const API = "http://localhost:8080/api/aid-requests";

const STATUS_CONFIG = {
  PENDING: {
    label: "Beklemede",
    color: "#F5A623",
    bg: "rgba(245,166,35,.1)",
    border: "rgba(245,166,35,.3)",
  },
  VERIFIED: {
    label: "Doğrulandı",
    color: "#63b3ed",
    bg: "rgba(99,179,237,.1)",
    border: "rgba(99,179,237,.3)",
  },
  ASSIGNED: {
    label: "Atandı",
    color: "#a78bfa",
    bg: "rgba(167,139,250,.1)",
    border: "rgba(167,139,250,.3)",
  },
  IN_PROGRESS: {
    label: "Devam Ediyor",
    color: "#3ecf5a",
    bg: "rgba(62,207,90,.1)",
    border: "rgba(62,207,90,.3)",
  },
  COMPLETED: {
    label: "Tamamlandı",
    color: "#6b8099",
    bg: "rgba(107,128,153,.1)",
    border: "rgba(107,128,153,.3)",
  },
  CANCELLED: {
    label: "İptal",
    color: "#ef4444",
    bg: "rgba(239,68,68,.1)",
    border: "rgba(239,68,68,.3)",
  },
};

const URGENCY_CONFIG = {
  1: { label: "Çok Düşük", color: "#3b82f6" },
  2: { label: "Düşük", color: "#22c55e" },
  3: { label: "Orta", color: "#eab308" },
  4: { label: "Yüksek", color: "#f97316" },
  5: { label: "Kritik", color: "#ef4444" },
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
  .rq-shell { display: grid; grid-template-rows: var(--header-h) 1fr var(--footer-h); grid-template-columns: var(--sidebar-w) 1fr; grid-template-areas: "header header" "sidebar main" "footer footer"; height: 100vh; width: 100vw; }
  .rq-main { grid-area: main; padding: 28px; overflow-y: auto; background: var(--bg); display: flex; flex-direction: column; gap: 24px; }
  .rq-setup { max-width: 520px; margin: 40px auto; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .rq-setup-head { padding: 24px 28px; border-bottom: 1px solid var(--border); background: var(--surface2); }
  .rq-setup-title { font-family: var(--font-head); font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
  .rq-setup-title span { color: var(--accent); }
  .rq-setup-desc { font-size: 13px; color: var(--muted); line-height: 1.7; }
  .rq-setup-body { padding: 24px 28px; display: flex; flex-direction: column; gap: 16px; }
  .rq-setup-foot { padding: 16px 28px; border-top: 1px solid var(--border); background: var(--surface2); }
  .rq-field { display: flex; flex-direction: column; gap: 6px; }
  .rq-label { font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted); }
  .rq-input, .rq-select, .rq-textarea { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 10px 14px; font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color .2s; width: 100%; }
  .rq-input:focus, .rq-select:focus, .rq-textarea:focus { border-color: rgba(245,166,35,.5); }
  .rq-input::placeholder, .rq-textarea::placeholder { color: var(--muted); }
  .rq-select option { background: var(--surface); }
  .rq-textarea { resize: vertical; min-height: 90px; }
  .rq-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .rq-btn-primary { width: 100%; padding: 12px; border-radius: var(--radius); border: none; background: var(--accent); color: #0d1117; font-family: var(--font-head); font-size: 13px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .rq-btn-primary:hover:not(:disabled) { background: var(--accent2); }
  .rq-btn-primary:disabled { opacity: .4; cursor: not-allowed; }
  .rq-btn-secondary { display: flex; align-items: center; gap: 7px; background: var(--accent); color: #0d1117; border: none; border-radius: var(--radius); padding: 9px 18px; font-family: var(--font-head); font-size: 13px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .rq-btn-secondary:hover { background: var(--accent2); }
  .rq-topbar { display: flex; align-items: center; justify-content: space-between; }
  .rq-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; }
  .rq-title span { color: var(--accent); }
  .rq-household-chip { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 8px 14px; font-size: 12px; color: var(--muted); }
  .rq-household-chip strong { color: var(--text); font-size: 13px; }
  .rq-urgency-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
  .rq-urgency-btn { padding: 8px 4px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-family: var(--font-body); font-size: 11px; font-weight: 600; cursor: pointer; transition: all .15s; text-align: center; }
  .rq-urgency-btn:hover { border-color: rgba(245,166,35,.4); }
  .rq-urgency-btn.selected { border-color: currentColor; }
  .rq-list-head { display: flex; align-items: center; justify-content: space-between; }
  .rq-list-title { font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 1px; }
  .rq-badge { background: rgba(245,166,35,.15); border: 1px solid rgba(245,166,35,.25); color: var(--accent); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
  .rq-list { display: flex; flex-direction: column; gap: 10px; }
  .rq-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; transition: border-color .15s; }
  .rq-card:hover { border-color: rgba(245,166,35,.2); }
  .rq-card-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .rq-card-title { font-size: 14px; font-weight: 600; color: var(--text); font-family: var(--font-head); flex: 1; }
  .rq-pill { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; border: 1px solid; white-space: nowrap; }
  .rq-card-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }
  .rq-card-foot { display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--muted); }
  .rq-empty { padding: 48px; text-align: center; color: var(--muted); font-size: 13px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
  .rq-toast { position: fixed; top: 18px; right: 22px; z-index: 9999; padding: 10px 18px; border-radius: var(--radius); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 30px rgba(0,0,0,.5); border: 1px solid; animation: rqSlide .2s ease; font-family: var(--font-body); }
  .rq-toast.success { background: rgba(62,207,90,.1); border-color: #3ecf5a; color: #3ecf5a; }
  .rq-toast.error   { background: rgba(239,68,68,.1);  border-color: #ef4444; color: #ef4444; }
  @keyframes rqSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .rq-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 300; display: flex; align-items: center; justify-content: center; }
  .rq-modal { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; width: 480px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 60px rgba(0,0,0,.6); animation: rqSlide .2s ease; }
  .rq-modal-head { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .rq-modal-title { font-family: var(--font-head); font-size: 17px; font-weight: 800; color: var(--text); }
  .rq-modal-close { background: transparent; border: 1px solid var(--border); border-radius: 7px; color: var(--muted); cursor: pointer; padding: 5px 8px; font-size: 14px; transition: all .2s; }
  .rq-modal-close:hover { border-color: var(--accent); color: var(--accent); }
  .rq-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .rq-modal-foot { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; }
  .rq-cancel-btn { background: transparent; border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-family: var(--font-body); font-size: 13px; padding: 9px 18px; cursor: pointer; transition: all .2s; }
  .rq-cancel-btn:hover { border-color: var(--accent); color: var(--accent); }
  .rq-status-select { background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; color: var(--text); padding: 4px 8px; font-size: 12px; cursor: pointer; font-family: var(--font-body); outline: none; }
  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
`;

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const EMPTY_FORM = { typeId: "", description: "", urgencyLevel: 3 };
const EMPTY_HOUSEHOLD = {
  householdName: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  notes: "",
};

const Footer = () => (
  <footer className="al-footer">
    <div className="al-footer-l">
      <span className="al-dot" />
      <strong>Aegis</strong> Afet Yönetim Sistemi &nbsp;·&nbsp; v1.0.0
    </div>
    <div className="al-footer-r">©️ 2026 Aegis. Tüm hakları saklıdır.</div>
  </footer>
);

export default function Requests() {
  const role = localStorage.getItem("role") || "User";
  const isAdmin = role === "Admin" || role === "Calisan";

  const [phase, setPhase] = useState("loading");
  const [household, setHousehold] = useState(null);
  const [requests, setRequests] = useState([]);
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [hhForm, setHhForm] = useState(EMPTY_HOUSEHOLD);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  const loadTypes = () =>
    authFetch(`${API}/types`)
      .then((r) => r.json())
      .then(setTypes)
      .catch(() => {});
  const loadRequests = (hhId) =>
    authFetch(`${API}/household/${hhId}`)
      .then((r) => r.json())
      .then(setRequests)
      .catch(() => {});

  useEffect(() => {
    loadTypes();

    if (isAdmin) {
      authFetch(API)
        .then((r) => r.json())
        .then((data) => {
          setRequests(Array.isArray(data) ? data : []);
          setPhase("admin");
        })
        .catch(() => setPhase("admin"));
    } else {
      authFetch(`${API}/my-household`)
        .then((r) => r.json())
        .then((data) => {
          if (data && data.householdId) {
            setHousehold(data);
            loadRequests(data.householdId);
            setPhase("main");
          } else {
            setPhase("setup");
          }
        })
        .catch(() => setPhase("setup"));
    }
  }, []);

  const handleCreateHousehold = async () => {
    if (!hhForm.householdName.trim()) {
      showToast("Aile adı zorunludur", "error");
      return;
    }
    if (!hhForm.emergencyContactPhone.trim()) {
      showToast("Acil telefon zorunludur", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await authFetch(`${API}/my-household`, {
        method: "POST",
        body: JSON.stringify(hhForm),
      });
      const data = await res.json();
      setHousehold(data);
      setPhase("main");
      showToast("Kayıt oluşturuldu!");
    } catch {
      showToast("Kayıt oluşturulamadı", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!form.typeId) {
      showToast("Yardım türü seçiniz", "error");
      return;
    }
    if (!form.description.trim()) {
      showToast("Açıklama zorunludur", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await authFetch(API, {
        method: "POST",
        body: JSON.stringify({
          householdId: household.householdId,
          typeId: Number(form.typeId),
          description: form.description,
          urgencyLevel: form.urgencyLevel,
        }),
      });
      const data = await res.json();
      setRequests((prev) => [data, ...prev]);
      setForm(EMPTY_FORM);
      setShowModal(false);
      showToast("Talebiniz iletildi!");
    } catch {
      showToast("Talep gönderilemedi", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const res = await authFetch(API, {
        method: "PUT",
        body: JSON.stringify({ requestId, status: newStatus }),
      });
      const updated = await res.json();
      setRequests((prev) =>
        prev.map((x) => (x.requestId === updated.requestId ? updated : x)),
      );
      showToast("Statü güncellendi");
    } catch {
      showToast("Güncellenemedi", "error");
    }
  };

  const RequestCard = ({ r, showHousehold = false }) => {
    const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.PENDING;
    const uc = URGENCY_CONFIG[r.urgencyLevel] || URGENCY_CONFIG[3];
    return (
      <div className="rq-card">
        <div className="rq-card-top">
          <span className="rq-card-title">{r.typeName}</span>
          {showHousehold && (
            <span style={{ fontSize: 12, color: "var(--muted)" }}>
              🏠 {r.householdName}
            </span>
          )}
          <span
            className="rq-pill"
            style={{
              color: sc.color,
              background: sc.bg,
              borderColor: sc.border,
            }}
          >
            {sc.label}
          </span>
          <span
            className="rq-pill"
            style={{
              color: uc.color,
              background: "transparent",
              borderColor: uc.color + "44",
            }}
          >
            {uc.label} Aciliyet
          </span>
          {r.category && (
            <span
              style={{
                fontSize: 11,
                color: "var(--muted)",
                background: "var(--surface2)",
                padding: "2px 8px",
                borderRadius: 20,
                border: "1px solid var(--border)",
              }}
            >
              {r.category}
            </span>
          )}
        </div>
        {r.description && <div className="rq-card-desc">{r.description}</div>}
        <div className="rq-card-foot">
          <span>
            #{r.requestId} · {formatDate(r.createdAt)}
          </span>
          {isAdmin && (
            <select
              className="rq-status-select"
              value={r.status}
              onChange={(e) => handleStatusChange(r.requestId, e.target.value)}
            >
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    );
  };

  // LOADING
  if (phase === "loading")
    return (
      <>
        <style>{CSS}</style>
        <div className="rq-shell">
          <Header />
          <Sidebar />
          <main
            className="rq-main"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <p style={{ color: "var(--muted)", fontSize: 14 }}>Yükleniyor...</p>
          </main>
          <Footer />
        </div>
      </>
    );

  // SETUP — Depremzede ilk kez, household yok
  if (phase === "setup")
    return (
      <>
        <style>{CSS}</style>
        <div className="rq-shell">
          <Header />
          <Sidebar />
          <main className="rq-main">
            <div className="rq-setup">
              <div className="rq-setup-head">
                <div className="rq-setup-title">
                  Hane Kaydı <span>Oluştur</span>
                </div>
                <div className="rq-setup-desc">
                  Yardım talebinde bulunabilmek için önce hane bilgilerinizi
                  kaydediniz. Bu bilgiler yardım ekiplerine ulaşmamızı sağlar.
                </div>
              </div>
              <div className="rq-setup-body">
                <div className="rq-field">
                  <label className="rq-label">Aile / Hane Adı *</label>
                  <input
                    className="rq-input"
                    placeholder="örn. Yılmaz Ailesi"
                    value={hhForm.householdName}
                    onChange={(e) =>
                      setHhForm((p) => ({
                        ...p,
                        householdName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="rq-row">
                  <div className="rq-field">
                    <label className="rq-label">Acil İletişim Adı *</label>
                    <input
                      className="rq-input"
                      placeholder="Ad Soyad"
                      value={hhForm.emergencyContactName}
                      onChange={(e) =>
                        setHhForm((p) => ({
                          ...p,
                          emergencyContactName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="rq-field">
                    <label className="rq-label">Acil Telefon *</label>
                    <input
                      className="rq-input"
                      placeholder="05XX XXX XX XX"
                      value={hhForm.emergencyContactPhone}
                      onChange={(e) =>
                        setHhForm((p) => ({
                          ...p,
                          emergencyContactPhone: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="rq-field">
                  <label className="rq-label">Notlar</label>
                  <textarea
                    className="rq-textarea"
                    placeholder="Ek bilgi varsa buraya yazınız..."
                    value={hhForm.notes}
                    onChange={(e) =>
                      setHhForm((p) => ({ ...p, notes: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="rq-setup-foot">
                <button
                  className="rq-btn-primary"
                  onClick={handleCreateHousehold}
                  disabled={saving}
                >
                  {saving ? "Kaydediliyor..." : "Kaydı Tamamla ve Devam Et →"}
                </button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );

  // ADMIN — Tüm talepler + statü güncelleme
  if (phase === "admin")
    return (
      <>
        <style>{CSS}</style>
        {toast && (
          <div className={`rq-toast ${toast.type}`}>
            {toast.type === "success" ? "✓" : "✕"} {toast.msg}
          </div>
        )}
        <div className="rq-shell">
          <Header />
          <Sidebar />
          <main className="rq-main">
            <div className="rq-topbar">
              <div className="rq-title">
                Yardım <span>Talepleri</span>
              </div>
              <span className="rq-badge">{requests.length} talep</span>
            </div>
            {requests.length === 0 ? (
              <div className="rq-empty">Henüz yardım talebi bulunmuyor.</div>
            ) : (
              <div className="rq-list">
                {requests.map((r) => (
                  <RequestCard key={r.requestId} r={r} showHousehold={true} />
                ))}
              </div>
            )}
          </main>
          <Footer />
        </div>
      </>
    );

  // MAIN — Depremzede kendi talepleri
  return (
    <>
      <style>{CSS}</style>
      {toast && (
        <div className={`rq-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div className="rq-shell">
        <Header />
        <Sidebar />
        <main className="rq-main">
          <div className="rq-topbar">
            <div className="rq-title">
              Yardım <span>Taleplerim</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="rq-household-chip">
                🏠 <strong>{household?.householdName}</strong>
              </div>
              <button
                className="rq-btn-secondary"
                onClick={() => setShowModal(true)}
              >
                + Yeni Talep
              </button>
            </div>
          </div>

          <div>
            <div className="rq-list-head" style={{ marginBottom: 14 }}>
              <span className="rq-list-title">Talepler</span>
              <span className="rq-badge">{requests.length}</span>
            </div>
            {requests.length === 0 ? (
              <div className="rq-empty">
                Henüz yardım talebiniz bulunmuyor.
                <br />
                <span
                  style={{ color: "var(--accent)", cursor: "pointer" }}
                  onClick={() => setShowModal(true)}
                >
                  + Yeni talep oluşturun
                </span>
              </div>
            ) : (
              <div className="rq-list">
                {requests.map((r) => (
                  <RequestCard key={r.requestId} r={r} />
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {showModal && (
        <div
          className="rq-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="rq-modal">
            <div className="rq-modal-head">
              <span className="rq-modal-title">Yeni Yardım Talebi</span>
              <button
                className="rq-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="rq-modal-body">
              <div className="rq-field">
                <label className="rq-label">Yardım Türü *</label>
                <select
                  className="rq-select"
                  value={form.typeId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, typeId: e.target.value }))
                  }
                >
                  <option value="">— Seçiniz —</option>
                  {types.map((t) => (
                    <option key={t.typeId} value={t.typeId}>
                      {t.typeName} ({t.category})
                    </option>
                  ))}
                </select>
              </div>
              <div className="rq-field">
                <label className="rq-label">Aciliyet Seviyesi</label>
                <div className="rq-urgency-grid">
                  {[1, 2, 3, 4, 5].map((u) => {
                    const uc = URGENCY_CONFIG[u];
                    const sel = form.urgencyLevel === u;
                    return (
                      <button
                        key={u}
                        className={`rq-urgency-btn ${sel ? "selected" : ""}`}
                        style={{
                          color: sel ? uc.color : undefined,
                          borderColor: sel ? uc.color : undefined,
                          background: sel ? uc.color + "18" : undefined,
                        }}
                        onClick={() =>
                          setForm((p) => ({ ...p, urgencyLevel: u }))
                        }
                      >
                        {u}
                        <br />
                        {uc.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="rq-field">
                <label className="rq-label">Açıklama *</label>
                <textarea
                  className="rq-textarea"
                  placeholder="İhtiyacınızı detaylı açıklayınız... Kaç kişisiniz? Özel durumunuz var mı?"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="rq-modal-foot">
              <button
                className="rq-cancel-btn"
                onClick={() => setShowModal(false)}
              >
                İptal
              </button>
              <button
                className="rq-btn-primary"
                style={{ width: "auto", padding: "9px 24px" }}
                onClick={handleCreateRequest}
                disabled={saving}
              >
                {saving ? "Gönderiliyor..." : "Talebi Gönder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
