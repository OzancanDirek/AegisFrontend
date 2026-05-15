import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "./authFetch.js";
import Sidebar from "./sidebar.jsx";
import Header from "./Header.jsx";

const API = "http://localhost:8080/api";

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
  .vr-shell {
    display: grid;
    grid-template-rows: var(--header-h) 1fr var(--footer-h);
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-areas: "header header" "sidebar main" "footer footer";
    height: 100vh; width: 100vw;
  }
  .vr-main { grid-area: main; padding: 32px; overflow-y: auto; background: var(--bg); display: flex; justify-content: center; }
  .vr-toast {
    position: fixed; top: 18px; right: 22px; z-index: 9999;
    padding: 10px 18px; border-radius: var(--radius);
    font-family: var(--font-body); font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,.5); border: 1px solid; animation: vrSlide .2s ease;
  }
  .vr-toast.success { background: rgba(62,207,90,.1); border-color: #3ecf5a; color: #3ecf5a; }
  .vr-toast.error   { background: rgba(239,68,68,.1);  border-color: #ef4444; color: #ef4444; }
  @keyframes vrSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .vr-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 32px; width: 100%; max-width: 560px; display: flex; flex-direction: column; gap: 24px; height: fit-content; }
  .vr-card-title { font-family: var(--font-head); font-size: 20px; font-weight: 700; color: var(--text); }
  .vr-card-sub { font-size: 13px; color: var(--muted); margin-top: 4px; }

  .vr-section { display: flex; flex-direction: column; gap: 8px; }
  .vr-label { font-size: 10px; letter-spacing: 1.4px; text-transform: uppercase; color: var(--muted); font-weight: 600; }
  .vr-input { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 10px 14px; font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color .2s; }
  .vr-input:focus { border-color: rgba(245,166,35,.5); }
  .vr-input::placeholder { color: var(--muted); }
  .vr-select { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 10px 14px; font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color .2s; cursor: pointer; }
  .vr-select:focus { border-color: rgba(245,166,35,.5); }

  .vr-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* Toggle switch */
  .vr-toggle-wrap { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; }
  .vr-toggle-label { font-size: 13px; color: var(--text); }
  .vr-toggle-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .vr-toggle { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
  .vr-toggle input { opacity: 0; width: 0; height: 0; }
  .vr-toggle-slider { position: absolute; inset: 0; background: var(--border); border-radius: 22px; cursor: pointer; transition: background .2s; }
  .vr-toggle-slider::before { content: ''; position: absolute; width: 16px; height: 16px; left: 3px; top: 3px; background: var(--muted); border-radius: 50%; transition: transform .2s, background .2s; }
  .vr-toggle input:checked + .vr-toggle-slider { background: rgba(245,166,35,.25); }
  .vr-toggle input:checked + .vr-toggle-slider::before { transform: translateX(18px); background: var(--accent); }

  /* Skill grid */
  .vr-skill-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .vr-skill-chip { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--bg); color: var(--muted); font-size: 12px; font-weight: 600; font-family: var(--font-body); cursor: pointer; transition: all .15s; }
  .vr-skill-chip:hover { border-color: rgba(245,166,35,.4); color: var(--text); }
  .vr-skill-chip.selected { border-color: var(--accent); background: rgba(245,166,35,.1); color: var(--accent); }

  /* Info box */
  .vr-info { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; background: rgba(245,166,35,.06); border: 1px solid rgba(245,166,35,.2); border-radius: 8px; }
  .vr-info-text { font-size: 12px; color: var(--muted); line-height: 1.6; }

  .vr-submit-btn { width: 100%; padding: 13px; border-radius: var(--radius); border: none; background: var(--accent); color: #0d1117; font-size: 14px; font-weight: 700; font-family: var(--font-head); cursor: pointer; transition: background .15s, opacity .15s; }
  .vr-submit-btn:hover:not(:disabled) { background: var(--accent2); }
  .vr-submit-btn:disabled { opacity: .4; cursor: not-allowed; }

  .vr-divider { border: none; border-top: 1px solid var(--border); }

  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
`;

export default function VolunteerRegister() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    availabilityStatus: true,
    transportType: "",
    maxDistanceKm: "",
    selectedSkills: [],
  });

  const userId = localStorage.getItem("userId");
  const addressId = localStorage.getItem("addressId");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    authFetch(`${API}/skill`)
      .then((r) => r.json())
      .then((data) => setSkills(Array.isArray(data) ? data : []))
      .catch(() => showToast("Yetenekler yüklenemedi", "error"));
  }, []);

  const toggleSkill = (skillId) => {
    setForm((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skillId)
        ? prev.selectedSkills.filter((s) => s !== skillId)
        : [...prev.selectedSkills, skillId],
    }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      showToast(
        "Kullanıcı bilgisi bulunamadı, lütfen tekrar giriş yapın",
        "error",
      );
      return;
    }

    setLoading(true);
    try {
      const body = {
        userId: userId,
        availabilityStatus: form.availabilityStatus,
        transportType: form.transportType || null,
        maxDistanceKm: form.maxDistanceKm ? parseInt(form.maxDistanceKm) : null,
        addressId: addressId ? parseInt(addressId) : null,
        skillIds: form.selectedSkills.length > 0 ? form.selectedSkills : null,
      };

      const res = await authFetch(`${API}/volunteer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast("Gönüllü kaydınız başarıyla oluşturuldu!", "success");
        setTimeout(() => navigate("/home"), 1800);
      } else {
        const data = await res.json();
        showToast(data.message || "Kayıt başarısız", "error");
      }
    } catch {
      showToast("Sunucuya bağlanılamadı", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      {toast && (
        <div className={`vr-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div className="vr-shell">
        <Header />
        <Sidebar />

        <main className="vr-main">
          <div className="vr-card">
            <div>
              <div className="vr-card-title">Gönüllü Ol</div>
              <div className="vr-card-sub">
                Bilgilerini doldurarak gönüllü olarak kayıt ol
              </div>
            </div>

            <div className="vr-info">
              <span style={{ fontSize: 18 }}>ℹ️</span>
              <span className="vr-info-text">
                Adres bilgilerin kayıt sırasında girdiğin adres ile otomatik
                eşleştirilecek. Yeteneklerini ve ulaşım bilgilerini ekleyerek
                daha uygun görevlere atanabilirsin.
              </span>
            </div>

            <hr className="vr-divider" />

            {/* Müsaitlik */}
            <div className="vr-section">
              <span className="vr-label">Müsaitlik Durumu</span>
              <div className="vr-toggle-wrap">
                <div>
                  <div className="vr-toggle-label">
                    {form.availabilityStatus ? "Müsaitim" : "Müsait Değilim"}
                  </div>
                  <div className="vr-toggle-sub">
                    Görev almaya hazır olup olmadığını belirt
                  </div>
                </div>
                <label className="vr-toggle">
                  <input
                    type="checkbox"
                    checked={form.availabilityStatus}
                    onChange={(e) =>
                      setForm({ ...form, availabilityStatus: e.target.checked })
                    }
                  />
                  <span className="vr-toggle-slider" />
                </label>
              </div>
            </div>

            {/* Ulaşım */}
            <div className="vr-row">
              <div className="vr-section">
                <span className="vr-label">Ulaşım Türü</span>
                <select
                  className="vr-select"
                  value={form.transportType}
                  onChange={(e) =>
                    setForm({ ...form, transportType: e.target.value })
                  }
                >
                  <option value="">Seçin...</option>
                  <option value="Yaya">Yaya</option>
                  <option value="Bisiklet">Bisiklet</option>
                  <option value="Motosiklet">Motosiklet</option>
                  <option value="Otomobil">Otomobil</option>
                  <option value="4x4 Araç">4x4 Araç</option>
                  <option value="Kamyonet">Kamyonet</option>
                </select>
              </div>

              <div className="vr-section">
                <span className="vr-label">Maksimum Mesafe (km)</span>
                <input
                  className="vr-input"
                  type="number"
                  placeholder="50"
                  value={form.maxDistanceKm}
                  onChange={(e) =>
                    setForm({ ...form, maxDistanceKm: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Yetenekler */}
            <div className="vr-section">
              <span className="vr-label">
                Yetenekler
                {form.selectedSkills.length > 0 && (
                  <span
                    style={{
                      marginLeft: 8,
                      color: "var(--accent)",
                      fontWeight: 700,
                    }}
                  >
                    ({form.selectedSkills.length} seçili)
                  </span>
                )}
              </span>
              {skills.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  Yetenekler yükleniyor...
                </div>
              ) : (
                <div className="vr-skill-grid">
                  {skills.map((s) => (
                    <button
                      key={s.skillId}
                      className={`vr-skill-chip ${form.selectedSkills.includes(s.skillId) ? "selected" : ""}`}
                      onClick={() => toggleSkill(s.skillId)}
                    >
                      {s.skillName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="vr-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Kaydediliyor..." : "Gönüllü Olarak Kayıt Ol"}
            </button>
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
