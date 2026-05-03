import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./sidebar";
import Header from "./Header.jsx";

const role = () => localStorage.getItem("role") || "User";

const TYPE_CONFIG = {
  GENERAL: {
    label: "Genel",
    color: "#63b3ed",
    bg: "rgba(99,179,237,.12)",
    border: "rgba(99,179,237,.3)",
  },
  URGENT: {
    label: "Acil",
    color: "#fc8181",
    bg: "rgba(245,101,101,.12)",
    border: "rgba(245,101,101,.3)",
  },
  TASK: {
    label: "Görev",
    color: "#68d391",
    bg: "rgba(72,187,120,.12)",
    border: "rgba(72,187,120,.3)",
  },
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
  .an-shell { display: grid; grid-template-rows: var(--header-h) 1fr var(--footer-h); grid-template-columns: var(--sidebar-w) 1fr; grid-template-areas: "header header" "sidebar main" "footer footer"; height: 100vh; width: 100vw; }
  .an-main { grid-area: main; padding: 28px; overflow-y: auto; background: var(--bg); display: flex; flex-direction: column; gap: 20px; }
  .an-topbar { display: flex; align-items: center; justify-content: space-between; }
  .an-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; letter-spacing: -.3px; }
  .an-title span { color: var(--accent); }
  .an-new-btn { display: flex; align-items: center; gap: 7px; background: var(--accent); color: #0d1117; border: none; border-radius: var(--radius); padding: 9px 18px; font-family: var(--font-head); font-size: 13px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .an-new-btn:hover { background: var(--accent2); }

  .an-filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .an-filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-family: var(--font-body); font-size: 12px; font-weight: 600; cursor: pointer; transition: all .15s; }
  .an-filter-btn:hover { border-color: var(--accent); color: var(--accent); }
  .an-filter-btn.active { border-color: var(--accent); background: rgba(245,166,35,.12); color: var(--accent); }

  .an-list { display: flex; flex-direction: column; gap: 12px; }
  .an-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; display: flex; flex-direction: column; gap: 10px; transition: border-color .15s; }
  .an-card:hover { border-color: rgba(245,166,35,.3); }
  .an-card-top { display: flex; align-items: center; gap: 10px; }
  .an-type-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; border: 1px solid; white-space: nowrap; }
  .an-card-title { font-family: var(--font-head); font-size: 15px; font-weight: 700; color: var(--text); flex: 1; }
  .an-card-msg { font-size: 13px; color: var(--muted); line-height: 1.6; }
  .an-card-footer { display: flex; align-items: center; justify-content: space-between; }
  .an-card-meta { font-size: 11px; color: #3a5068; }
  .an-del-btn { display: flex; align-items: center; gap: 5px; background: transparent; border: 1px solid transparent; border-radius: 7px; color: var(--muted); font-family: var(--font-body); font-size: 12px; padding: 4px 10px; cursor: pointer; transition: all .15s; }
  .an-del-btn:hover { border-color: rgba(239,68,68,.4); color: #ef4444; }

  .an-empty { padding: 48px; text-align: center; color: var(--muted); font-size: 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }

  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .an-toast { position: fixed; top: 18px; right: 22px; z-index: 9999; padding: 10px 18px; border-radius: var(--radius); font-family: var(--font-body); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 30px rgba(0,0,0,.5); border: 1px solid; animation: anSlide .2s ease; }
  .an-toast.success { background: rgba(62,207,90,.1); border-color: #3ecf5a; color: #3ecf5a; }
  .an-toast.error   { background: rgba(239,68,68,.1);  border-color: #ef4444; color: #ef4444; }
  @keyframes anSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .an-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 300; display: flex; align-items: center; justify-content: center; }
  .an-modal { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; width: 480px; padding: 26px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 24px 60px rgba(0,0,0,.6); animation: modalIn .2s ease; }
  @keyframes modalIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
  .an-modal-title { font-family: var(--font-head); font-size: 18px; font-weight: 800; color: var(--text); }
  .an-field { display: flex; flex-direction: column; gap: 6px; }
  .an-label { font-size: 10px; letter-spacing: 1.3px; text-transform: uppercase; color: var(--muted); font-weight: 600; }
  .an-input, .an-select, .an-textarea { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 10px 13px; font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color .2s; width: 100%; }
  .an-input:focus, .an-select:focus, .an-textarea:focus { border-color: rgba(245,166,35,.55); }
  .an-select option { background: var(--surface); }
  .an-textarea { resize: vertical; min-height: 90px; }
  .an-modal-actions { display: flex; gap: 10px; padding-top: 4px; }
  .an-cancel-btn { flex: 1; padding: 11px; border-radius: var(--radius); border: 1px solid var(--border); background: transparent; color: var(--muted); font-family: var(--font-head); font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
  .an-cancel-btn:hover { border-color: var(--accent); color: var(--accent); }
  .an-confirm-btn { flex: 1; padding: 11px; border-radius: var(--radius); border: none; background: var(--accent); color: #0d1117; font-family: var(--font-head); font-size: 13px; font-weight: 700; cursor: pointer; transition: background .15s; }
  .an-confirm-btn:hover:not(:disabled) { background: var(--accent2); }
  .an-confirm-btn:disabled { opacity: .4; cursor: not-allowed; }
`;

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s önce`;
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

const canCreate = () =>
  ["Admin", "Calisan"].includes(localStorage.getItem("role"));

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "GENERAL",
    targetRole: "",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = () => {
    axios
      .get(`http://localhost:8080/api/announcements?role=${role()}`)
      .then((res) => setAnnouncements(res.data))
      .catch(() => showToast("Duyurular yüklenemedi", "error"));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      showToast("Başlık ve mesaj zorunludur", "error");
      return;
    }
    setSaving(true);
    try {
      await axios.post("http://localhost:8080/api/announcements", {
        title: form.title,
        message: form.message,
        type: form.type,
        targetRole: form.targetRole || null,
      });
      setModal(false);
      setForm({ title: "", message: "", type: "GENERAL", targetRole: "" });
      showToast("Duyuru oluşturuldu!");
      load();
    } catch {
      showToast("Duyuru oluşturulamadı", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu duyuruyu silmek istediğinize emin misiniz?"))
      return;
    try {
      await axios.delete(`http://localhost:8080/api/announcements/${id}`);
      showToast("Duyuru silindi");
      load();
    } catch {
      showToast("Silinemedi", "error");
    }
  };

  const filtered = announcements.filter(
    (a) => filter === "ALL" || a.type === filter,
  );

  const ROLES = [
    "",
    "Admin",
    "Calisan",
    "Gonullu",
    "Depremzede",
    "WAREHOUSE_MANAGER",
  ];

  return (
    <>
      <style>{CSS}</style>
      {toast && (
        <div className={`an-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div className="an-shell">
        <Header />
        <Sidebar />

        <main className="an-main">
          <div className="an-topbar">
            <div className="an-title">
              Duyuru <span>Merkezi</span>
            </div>
            {canCreate() && (
              <button className="an-new-btn" onClick={() => setModal(true)}>
                + Duyuru Oluştur
              </button>
            )}
          </div>

          <div className="an-filters">
            {["ALL", "GENERAL", "URGENT", "TASK"].map((t) => (
              <button
                key={t}
                className={`an-filter-btn ${filter === t ? "active" : ""}`}
                onClick={() => setFilter(t)}
              >
                {t === "ALL" ? "Tümü" : TYPE_CONFIG[t]?.label}
              </button>
            ))}
          </div>

          <div className="an-list">
            {filtered.length === 0 ? (
              <div className="an-empty">Henüz duyuru yok.</div>
            ) : (
              filtered.map((a) => {
                const tc = TYPE_CONFIG[a.type] || TYPE_CONFIG.GENERAL;
                return (
                  <div key={a.id} className="an-card">
                    <div className="an-card-top">
                      <span
                        className="an-type-badge"
                        style={{
                          color: tc.color,
                          background: tc.bg,
                          borderColor: tc.border,
                        }}
                      >
                        {tc.label}
                      </span>
                      {a.targetRole && (
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
                          → {a.targetRole}
                        </span>
                      )}
                      <span className="an-card-title">{a.title}</span>
                    </div>
                    <div className="an-card-msg">{a.message}</div>
                    <div className="an-card-footer">
                      <span className="an-card-meta">
                        {timeAgo(a.createdAt)} · {a.createdByName}
                      </span>
                      {canCreate() && (
                        <button
                          className="an-del-btn"
                          onClick={() => handleDelete(a.id)}
                        >
                          ✕ Sil
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
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

      {modal && (
        <div
          className="an-overlay"
          onClick={(e) => e.target === e.currentTarget && setModal(false)}
        >
          <div className="an-modal">
            <div className="an-modal-title">
              Yeni <span style={{ color: "var(--accent)" }}>Duyuru</span>
            </div>

            <div className="an-field">
              <label className="an-label">Başlık *</label>
              <input
                className="an-input"
                placeholder="Duyuru başlığı"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>

            <div className="an-field">
              <label className="an-label">Mesaj *</label>
              <textarea
                className="an-textarea"
                placeholder="Duyuru içeriği..."
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div className="an-field">
                <label className="an-label">Tür</label>
                <select
                  className="an-select"
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, type: e.target.value }))
                  }
                >
                  <option value="GENERAL">Genel</option>
                  <option value="URGENT">Acil</option>
                  <option value="TASK">Görev</option>
                </select>
              </div>
              <div className="an-field">
                <label className="an-label">Hedef Rol (opsiyonel)</label>
                <select
                  className="an-select"
                  value={form.targetRole}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, targetRole: e.target.value }))
                  }
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r || "— Herkese —"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="an-modal-actions">
              <button className="an-cancel-btn" onClick={() => setModal(false)}>
                İptal
              </button>
              <button
                className="an-confirm-btn"
                onClick={handleCreate}
                disabled={saving}
              >
                {saving ? "Kaydediliyor..." : "Yayınla"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
