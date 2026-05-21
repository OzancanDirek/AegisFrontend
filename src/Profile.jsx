import { useState, useEffect } from "react";
import { authFetch } from "./authFetch.js";
import { API_BASE_URL } from "./config";
import Sidebar from "./sidebar.jsx";
import Header from "./Header.jsx";



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
  .pr-shell {
    display: grid;
    grid-template-rows: var(--header-h) 1fr var(--footer-h);
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-areas: "header header" "sidebar main" "footer footer";
    height: 100vh; width: 100vw;
  }
  .pr-main { grid-area: main; padding: 32px; overflow-y: auto; background: var(--bg); display: flex; justify-content: center; }
  .pr-toast {
    position: fixed; top: 18px; right: 22px; z-index: 9999;
    padding: 10px 18px; border-radius: var(--radius);
    font-family: var(--font-body); font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,.5); border: 1px solid; animation: prSlide .2s ease;
  }
  .pr-toast.success { background: rgba(62,207,90,.1); border-color: #3ecf5a; color: #3ecf5a; }
  .pr-toast.error   { background: rgba(239,68,68,.1);  border-color: #ef4444; color: #ef4444; }
  @keyframes prSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .pr-container { width: 100%; max-width: 620px; display: flex; flex-direction: column; gap: 20px; }

  /* Avatar card */
  .pr-avatar-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px; display: flex; align-items: center; gap: 20px; }
  .pr-avatar { width: 72px; height: 72px; border-radius: 50%; background: rgba(245,166,35,.15); border: 2px solid rgba(245,166,35,.4); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; color: var(--accent); font-family: var(--font-head); flex-shrink: 0; }
  .pr-avatar-info { flex: 1; }
  .pr-fullname { font-family: var(--font-head); font-size: 20px; font-weight: 700; color: var(--text); }
  .pr-email { font-size: 13px; color: var(--muted); margin-top: 3px; }
  .pr-role-chip { display: inline-flex; align-items: center; margin-top: 8px; padding: 3px 12px; border-radius: 20px; background: rgba(245,166,35,.1); border: 1px solid rgba(245,166,35,.3); color: var(--accent); font-size: 11px; font-weight: 700; font-family: var(--font-body); }
  .pr-location { font-size: 12px; color: var(--muted); margin-top: 6px; }

  /* Info card */
  .pr-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px; display: flex; flex-direction: column; gap: 18px; }
  .pr-card-header { display: flex; align-items: center; justify-content: space-between; }
  .pr-card-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; color: var(--text); }
  .pr-edit-btn { padding: 6px 14px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 12px; font-weight: 600; font-family: var(--font-body); cursor: pointer; transition: all .15s; }
  .pr-edit-btn:hover { color: var(--text); border-color: var(--muted); }
  .pr-edit-btn.active { background: var(--accent); border-color: var(--accent); color: #0d1117; }

  .pr-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .pr-field { display: flex; flex-direction: column; gap: 5px; }
  .pr-label { font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted); font-weight: 600; }
  .pr-value { font-size: 13px; color: var(--text); }
  .pr-input { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 9px 12px; font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color .2s; }
  .pr-input:focus { border-color: rgba(245,166,35,.5); }

  /* Gönüllü bilgileri */
  .pr-toggle-wrap { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; }
  .pr-toggle-label { font-size: 13px; color: var(--text); }
  .pr-toggle { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
  .pr-toggle input { opacity: 0; width: 0; height: 0; }
  .pr-toggle-slider { position: absolute; inset: 0; background: var(--border); border-radius: 22px; cursor: pointer; transition: background .2s; }
  .pr-toggle-slider::before { content: ''; position: absolute; width: 16px; height: 16px; left: 3px; top: 3px; background: var(--muted); border-radius: 50%; transition: transform .2s, background .2s; }
  .pr-toggle input:checked + .pr-toggle-slider { background: rgba(245,166,35,.25); }
  .pr-toggle input:checked + .pr-toggle-slider::before { transform: translateX(18px); background: var(--accent); }

  .pr-skill-grid { display: flex; flex-wrap: wrap; gap: 7px; }
  .pr-skill-tag { padding: 4px 12px; border-radius: 20px; background: rgba(245,166,35,.08); border: 1px solid rgba(245,166,35,.2); color: var(--accent); font-size: 12px; font-weight: 600; }

  .pr-save-btn { width: 100%; padding: 11px; border-radius: var(--radius); border: none; background: var(--accent); color: #0d1117; font-size: 13px; font-weight: 700; font-family: var(--font-head); cursor: pointer; transition: background .15s, opacity .15s; }
  .pr-save-btn:hover:not(:disabled) { background: var(--accent2); }
  .pr-save-btn:disabled { opacity: .4; cursor: not-allowed; }
  .pr-cancel-btn { width: 100%; padding: 11px; border-radius: var(--radius); border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 13px; font-weight: 600; font-family: var(--font-body); cursor: pointer; transition: all .15s; }
  .pr-cancel-btn:hover { color: var(--text); border-color: var(--muted); }
  .pr-btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .pr-empty { font-size: 12px; color: var(--muted); font-style: italic; }

  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
`;

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({ name: "", surname: "", phone: "" });


  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchProfile = () => {
    authFetch(`${API_BASE_URL}/users/profile`)
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setForm({
          name: data.name || "",
          surname: data.surname || "",
          phone: data.phone || "",
        });
      })
      .catch(() => showToast("Profil yüklenemedi", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setBusy(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setProfile(data);
      setForm({
        name: data.name || "",
        surname: data.surname || "",
        phone: data.phone || "",
      });
      localStorage.setItem("name", data.name);
      showToast("Profil güncellendi", "success");
      setEditing(false);
    } catch {
      showToast("Güncelleme başarısız", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: profile.name || "",
      surname: profile.surname || "",
      phone: profile.phone || "",
    });
    setEditing(false);
  };

  if (loading)
    return (
      <>
        <style>{CSS}</style>
        <div className="pr-shell">
          <Header />
          <Sidebar />
          <main className="pr-main">
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
        <div className={`pr-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div className="pr-shell">
        <Header />
        <Sidebar />

        <main className="pr-main">
          <div className="pr-container">
            {/* Avatar kartı */}
            <div className="pr-avatar-card">
              <div className="pr-avatar">
                {profile?.name?.[0]?.toUpperCase()}
              </div>
              <div className="pr-avatar-info">
                <div className="pr-fullname">
                  {profile?.name} {profile?.surname}
                </div>
                <div className="pr-email">{profile?.email}</div>
                <div className="pr-role-chip">{profile?.role}</div>
                {(profile?.city || profile?.district) && (
                  <div className="pr-location">
                    📍{" "}
                    {[profile?.city, profile?.district]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </div>
            </div>

            {/* Kişisel bilgiler */}
            <div className="pr-card">
              <div className="pr-card-header">
                <span className="pr-card-title">Kişisel Bilgiler</span>
                {!editing && (
                  <button
                    className="pr-edit-btn"
                    onClick={() => setEditing(true)}
                  >
                    Düzenle
                  </button>
                )}
              </div>

              <div className="pr-row">
                <div className="pr-field">
                  <span className="pr-label">Ad</span>
                  {editing ? (
                    <input
                      className="pr-input"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  ) : (
                    <span className="pr-value">{profile?.name || "—"}</span>
                  )}
                </div>
                <div className="pr-field">
                  <span className="pr-label">Soyad</span>
                  {editing ? (
                    <input
                      className="pr-input"
                      value={form.surname}
                      onChange={(e) =>
                        setForm({ ...form, surname: e.target.value })
                      }
                    />
                  ) : (
                    <span className="pr-value">{profile?.surname || "—"}</span>
                  )}
                </div>
              </div>

              <div className="pr-row">
                <div className="pr-field">
                  <span className="pr-label">E-posta</span>
                  <span className="pr-value" style={{ color: "var(--muted)" }}>
                    {profile?.email}
                  </span>
                </div>
                <div className="pr-field">
                  <span className="pr-label">Telefon</span>
                  {editing ? (
                    <input
                      className="pr-input"
                      value={form.phone}
                      placeholder="05xx xxx xx xx"
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  ) : (
                    <span className="pr-value">{profile?.phone || "—"}</span>
                  )}
                </div>
              </div>

              {editing && (
                <div className="pr-btn-row">
                  <button className="pr-cancel-btn" onClick={handleCancel}>
                    İptal
                  </button>
                  <button
                    className="pr-save-btn"
                    onClick={handleSave}
                    disabled={busy}
                  >
                    {busy ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
              )}
            </div>

            {/* Gönüllü bilgileri — sadece Gonullu rolündeyse göster */}
            {profile?.role === "Gonullu" && (
              <div className="pr-card">
                <div className="pr-card-header">
                  <span className="pr-card-title">Gönüllü Bilgileri</span>
                </div>

                <div className="pr-toggle-wrap">
                  <span className="pr-toggle-label">
                    Müsaitlik:{" "}
                    {profile?.availabilityStatus
                      ? "✅ Müsaitim"
                      : "❌ Müsait Değilim"}
                  </span>
                </div>

                <div className="pr-row">
                  <div className="pr-field">
                    <span className="pr-label">Ulaşım Türü</span>
                    <span className="pr-value">
                      {profile?.transportType || "—"}
                    </span>
                  </div>
                  <div className="pr-field">
                    <span className="pr-label">Maksimum Mesafe</span>
                    <span className="pr-value">
                      {profile?.maxDistanceKm
                        ? `${profile.maxDistanceKm} km`
                        : "—"}
                    </span>
                  </div>
                </div>

                <div className="pr-field">
                  <span className="pr-label">Yetenekler</span>
                  {profile?.skills && profile.skills.length > 0 ? (
                    <div className="pr-skill-grid">
                      {profile.skills.map((s, i) => (
                        <span key={i} className="pr-skill-tag">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="pr-empty">Yetenek eklenmemiş</span>
                  )}
                </div>
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
