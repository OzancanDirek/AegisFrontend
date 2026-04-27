import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AegisLogo from "./images/Aegislogo.jpeg";
import Sidebar from "./sidebar";

const API = "http://localhost:8080/api/addresses";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d1117; --surface: #161d27; --surface2: #1e2a3a; --border: #253045;
    --accent: #F5A623; --accent2: #ffc04a; --text: #e8f0fe; --muted: #6b8099;
    --danger: #ef4444; --success: #3ecf5a;
    --sidebar-w: 230px; --header-h: 60px; --footer-h: 48px; --radius: 10px;
    --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
  }
  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-body); overflow: hidden; }

  .addr-shell {
    display: grid;
    grid-template-rows: var(--header-h) 1fr var(--footer-h);
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-areas: "header header" "sidebar main" "footer footer";
    height: 100vh; width: 100vw;
  }

  .al-header {
    grid-area: header; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px 0 0; position: sticky; top: 0; z-index: 100;
  }
  .al-logo {
    display: flex; align-items: center; gap: 10px; padding: 0 20px;
    width: var(--sidebar-w); border-right: 1px solid var(--border); height: 100%; flex-shrink: 0;
  }
  .al-logo-text { font-family: var(--font-head); font-weight: 800; font-size: 20px; letter-spacing: -0.5px; color: var(--text); }
  .al-logo-text span { color: var(--accent); }
  .al-header-right { display: flex; align-items: center; gap: 10px; }
  .al-user-chip {
    display: flex; align-items: center; gap: 8px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 40px; padding: 5px 14px 5px 5px;
  }
  .al-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: rgba(245,166,35,0.18); border: 1px solid rgba(245,166,35,0.35);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent); font-size: 13px; font-weight: 700; flex-shrink: 0;
  }
  .al-user-name { font-size: 13px; font-weight: 500; color: var(--text); white-space: nowrap; }
  .al-logout-btn {
    display: flex; align-items: center; gap: 6px; background: transparent;
    border: 1px solid var(--border); border-radius: 8px; color: var(--muted);
    font-family: var(--font-body); font-size: 13px; padding: 7px 14px; cursor: pointer; transition: all .2s;
  }
  .al-logout-btn:hover { border-color: var(--accent); color: var(--accent); }

  .addr-main {
    grid-area: main; padding: 28px; overflow-y: auto; background: var(--bg);
    display: flex; flex-direction: column; gap: 20px;
  }
  .addr-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; letter-spacing: -.3px; flex-shrink: 0; }
  .addr-title span { color: var(--accent); }

  .addr-content {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 20px;
    flex: 1;
    min-height: 0;
    height: calc(100vh - var(--header-h) - var(--footer-h) - 80px);
  }

  .addr-panel {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); display: flex; flex-direction: column; overflow: hidden;
  }
  .addr-panel-head {
    padding: 13px 18px; border-bottom: 1px solid var(--border);
    background: var(--surface2); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .addr-panel-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; }
  .addr-badge {
    background: rgba(245,166,35,.15); border: 1px solid rgba(245,166,35,.25);
    color: var(--accent); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
  }

  .addr-table-wrap { overflow-y: auto; flex: 1; }
  .addr-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .addr-table thead tr { background: var(--surface2); position: sticky; top: 0; z-index: 1; }
  .addr-table th {
    text-align: left; padding: 10px 14px; font-size: 10px;
    letter-spacing: 1px; text-transform: uppercase; color: var(--muted);
    font-weight: 600; border-bottom: 1px solid var(--border);
  }
  .addr-table td { padding: 11px 14px; border-bottom: 1px solid var(--border); color: var(--text); }
  .addr-table tbody tr:last-child td { border-bottom: none; }
  .addr-table tbody tr:hover td { background: var(--surface2); }
  .addr-id { font-family: monospace; font-size: 11px; color: var(--muted); }
  .addr-city { font-size: 13px; font-weight: 500; }
  .addr-district { font-size: 11px; color: var(--muted); margin-top: 1px; }
  .addr-coord { font-family: monospace; font-size: 11px; color: var(--muted); }
  .addr-del-btn {
    background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.3);
    color: var(--danger); border-radius: 6px; padding: 4px 10px;
    font-size: 11px; font-weight: 600; cursor: pointer;
    font-family: var(--font-body); transition: all .15s;
  }
  .addr-del-btn:hover { background: rgba(239,68,68,.2); border-color: var(--danger); }
  .addr-empty { padding: 40px; text-align: center; color: var(--muted); font-size: 13px; }

  .addr-form-area { padding: 18px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; flex: 1; }
  .addr-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .addr-field { display: flex; flex-direction: column; gap: 5px; }
  .addr-label { font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted); font-weight: 600; }
  .addr-input {
    background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); padding: 9px 12px; font-size: 13px;
    font-family: var(--font-body); outline: none; transition: border-color .2s; width: 100%;
  }
  .addr-input:focus { border-color: rgba(245,166,35,.5); }
  .addr-input::placeholder { color: var(--muted); }
  .addr-input.error { border-color: rgba(239,68,68,.5); }

  .addr-err { font-size: 11px; color: var(--danger); }
  .addr-submit-btn {
    width: 100%; padding: 12px; border-radius: var(--radius); border: none;
    background: var(--accent); color: #0d1117;
    font-size: 13px; font-weight: 700; font-family: var(--font-head);
    cursor: pointer; transition: background .15s; margin-top: 4px;
  }
  .addr-submit-btn:hover:not(:disabled) { background: var(--accent2); }
  .addr-submit-btn:disabled { opacity: .4; cursor: not-allowed; }

  .al-footer {
    grid-area: footer; background: var(--surface); border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
  }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot {
    display: inline-block; width: 7px; height: 7px; border-radius: 50%;
    background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .addr-toast {
    position: fixed; top: 18px; right: 22px; z-index: 9999;
    padding: 10px 18px; border-radius: var(--radius);
    font-family: var(--font-body); font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,.5); border: 1px solid;
    animation: addrSlide .2s ease;
  }
  .addr-toast.success { background: rgba(62,207,90,.1); border-color: #3ecf5a; color: #3ecf5a; }
  .addr-toast.error   { background: rgba(239,68,68,.1);  border-color: #ef4444; color: #ef4444; }
  @keyframes addrSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .addr-edit-btn {
    background: rgba(245,166,35,.1); border: 1px solid rgba(245,166,35,.3);
    color: var(--accent); border-radius: 6px; padding: 4px 10px;
    font-size: 11px; font-weight: 600; cursor: pointer;
    font-family: var(--font-body); transition: all .15s; margin-right: 6px;
  }
  .addr-edit-btn:hover { background: rgba(245,166,35,.2); border-color: var(--accent); }

  .addr-modal-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,.7);
    display: flex; align-items: center; justify-content: center;
  }
  .addr-modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); width: 520px; max-height: 90vh;
    display: flex; flex-direction: column; overflow: hidden;
    animation: modalIn .2s ease;
  }
  @keyframes modalIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
  .addr-modal-head {
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    background: var(--surface2); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .addr-modal-title { font-family: var(--font-head); font-size: 15px; font-weight: 700; }
  .addr-modal-close {
    background: transparent; border: 1px solid var(--border); border-radius: 6px;
    color: var(--muted); width: 28px; height: 28px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all .15s;
  }
  .addr-modal-close:hover { border-color: var(--danger); color: var(--danger); }
  .addr-modal-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; }
  .addr-modal-footer {
    padding: 14px 20px; border-top: 1px solid var(--border);
    display: flex; gap: 10px; flex-shrink: 0;
  }
  .addr-modal-save {
    flex: 1; padding: 10px; border-radius: var(--radius); border: none;
    background: var(--accent); color: #0d1117; font-size: 13px; font-weight: 700;
    font-family: var(--font-head); cursor: pointer; transition: background .15s;
  }
  .addr-modal-save:hover:not(:disabled) { background: var(--accent2); }
  .addr-modal-save:disabled { opacity: .4; cursor: not-allowed; }
  .addr-modal-cancel {
    padding: 10px 20px; border-radius: var(--radius);
    border: 1px solid var(--border); background: transparent;
    color: var(--muted); font-size: 13px; font-family: var(--font-body); cursor: pointer; transition: all .15s;
  }
  .addr-modal-cancel:hover { border-color: var(--accent); color: var(--accent); }
`;

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

const emptyForm = {
  city: "",
  district: "",
  neighborhood: "",
  street: "",
  buildingNo: "",
  apartmentNo: "",
  latitude: "",
  longitude: "",
};

export default function Addresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const userName = localStorage.getItem("name") || "Admin";
  const [editModal, setEditModal] = useState(null);
  const [editErr, setEditErr] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const openEditModal = (a) => {
    setEditModal({
      id: a.addressId,
      form: {
        city: a.city || "",
        district: a.district || "",
        neighborhood: a.neighborhood || "",
        street: a.street || "",
        buildingNo: a.buildingNo || "",
        apartmentNo: a.apartmentNo || "",
        latitude: a.latitude ? String(a.latitude) : "",
        longitude: a.longitude ? String(a.longitude) : "",
      },
    });
    setEditErr("");
  };

  const handleEditChange = (e) => {
    setEditModal((prev) => ({
      ...prev,
      form: { ...prev.form, [e.target.name]: e.target.value },
    }));
    setEditErr("");
  };

  const updateAddress = async () => {
    const { city, district, neighborhood, street } = editModal.form;
    if (!city || !district || !neighborhood || !street) {
      setEditErr("Şehir, ilçe, mahalle ve sokak zorunludur.");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`${API}/${editModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editModal.form,
          latitude: editModal.form.latitude
            ? parseFloat(editModal.form.latitude)
            : null,
          longitude: editModal.form.longitude
            ? parseFloat(editModal.form.longitude)
            : null,
        }),
      });
      if (res.ok) {
        showToast("Adres güncellendi!", "success");
        setEditModal(null);
        loadAddresses();
      } else {
        setEditErr("Güncelleme başarısız.");
      }
    } catch {
      showToast("Sunucu hatası", "error");
    } finally {
      setUpdating(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const res = await fetch(`${API}/allAdresses`);
      const data = await res.json();
      setAddresses(Array.isArray(data) ? data : []);
    } catch {
      showToast("Adresler yüklenemedi", "error");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormErr("");
  };

  const createAddress = async () => {
    const { city, district, neighborhood, street } = form;
    if (!city || !district || !neighborhood || !street) {
      setFormErr("Şehir, ilçe, mahalle ve sokak zorunludur.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          latitude: form.latitude ? parseFloat(form.latitude) : null,
          longitude: form.longitude ? parseFloat(form.longitude) : null,
        }),
      });
      if (res.ok) {
        showToast("Adres başarıyla eklendi!", "success");
        setForm(emptyForm);
        loadAddresses();
      } else {
        const txt = await res.text();
        setFormErr(
          txt.includes("mevcut")
            ? "Bu adres zaten kayıtlı."
            : "Kayıt başarısız.",
        );
      }
    } catch {
      showToast("Sunucu hatası", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Bu adresi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Adres silindi", "success");
        loadAddresses();
      } else showToast("Silinemedi", "error");
    } catch {
      showToast("Sunucu hatası", "error");
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fields = [
    { name: "city", label: "Şehir *", placeholder: "İstanbul" },
    { name: "district", label: "İlçe *", placeholder: "Kadıköy" },
    { name: "neighborhood", label: "Mahalle *", placeholder: "Moda Mah." },
    { name: "street", label: "Sokak *", placeholder: "Bahariye Cad." },
    { name: "buildingNo", label: "Bina No", placeholder: "12" },
    { name: "apartmentNo", label: "Daire No", placeholder: "3" },
    { name: "latitude", label: "Enlem (Latitude)", placeholder: "41.0082" },
    { name: "longitude", label: "Boylam (Longitude)", placeholder: "28.9784" },
  ];

  const pairs = [];
  for (let i = 0; i < fields.length; i += 2)
    pairs.push([fields[i], fields[i + 1]]);

  return (
    <>
      <style>{CSS}</style>

      {toast && (
        <div className={`addr-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div className="addr-shell">
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

        <main className="addr-main">
          <div className="addr-title">
            Adres <span>Yönetimi</span>
          </div>

          <div className="addr-content">
            {/* SOL: TABLO */}
            <div className="addr-panel">
              <div className="addr-panel-head">
                <span className="addr-panel-title">Adres Listesi</span>
                <span className="addr-badge">{addresses.length}</span>
              </div>
              <div className="addr-table-wrap">
                <table className="addr-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Şehir / İlçe</th>
                      <th>Mahalle / Sokak</th>
                      <th>Bina / Daire</th>
                      <th>Koordinat</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {addresses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="addr-empty">
                          Henüz adres yok
                        </td>
                      </tr>
                    ) : (
                      addresses.map((a) => (
                        <tr key={a.addressId}>
                          <td>
                            <span className="addr-id">#{a.addressId}</span>
                          </td>
                          <td>
                            <div className="addr-city">{a.city}</div>
                            <div className="addr-district">{a.district}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: 13 }}>{a.neighborhood}</div>
                            <div className="addr-district">
                              {a.street || "—"}
                            </div>
                          </td>
                          <td>
                            {a.buildingNo || "—"} / {a.apartmentNo || "—"}
                          </td>
                          <td>
                            <span className="addr-coord">
                              {a.latitude ? Number(a.latitude).toFixed(4) : "—"}
                              ,&nbsp;
                              {a.longitude
                                ? Number(a.longitude).toFixed(4)
                                : "—"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="addr-edit-btn"
                              onClick={() => openEditModal(a)}
                            >
                              Düzenle
                            </button>
                            <button
                              className="addr-del-btn"
                              onClick={() => deleteAddress(a.addressId)}
                            >
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SAĞ: FORM */}
            <div className="addr-panel">
              <div className="addr-panel-head">
                <span className="addr-panel-title">Yeni Adres Ekle</span>
              </div>
              <div className="addr-form-area">
                {pairs.map((pair, i) => (
                  <div className="addr-form-row" key={i}>
                    {pair.map(
                      (f) =>
                        f && (
                          <div className="addr-field" key={f.name}>
                            <label className="addr-label">{f.label}</label>
                            <input
                              className={`addr-input ${formErr && ["city", "district", "neighborhood", "street"].includes(f.name) && !form[f.name] ? "error" : ""}`}
                              name={f.name}
                              value={form[f.name]}
                              onChange={handleChange}
                              placeholder={f.placeholder}
                            />
                          </div>
                        ),
                    )}
                  </div>
                ))}

                {formErr && <div className="addr-err">{formErr}</div>}

                <button
                  className="addr-submit-btn"
                  onClick={createAddress}
                  disabled={saving}
                >
                  {saving ? "Kaydediliyor..." : "Adresi Kaydet"}
                </button>
              </div>
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

      {/* DÜZENLEME MODALI */}
      {editModal && (
        <div className="addr-modal-overlay" onClick={() => setEditModal(null)}>
          <div className="addr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="addr-modal-head">
              <span className="addr-modal-title">
                Adres Düzenle{" "}
                <span style={{ color: "var(--accent)" }}>#{editModal.id}</span>
              </span>
              <button
                className="addr-modal-close"
                onClick={() => setEditModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="addr-modal-body">
              {[
                [
                  { name: "city", label: "Şehir *", placeholder: "İstanbul" },
                  { name: "district", label: "İlçe *", placeholder: "Kadıköy" },
                ],
                [
                  {
                    name: "neighborhood",
                    label: "Mahalle *",
                    placeholder: "Moda Mah.",
                  },
                  {
                    name: "street",
                    label: "Sokak *",
                    placeholder: "Bahariye Cad.",
                  },
                ],
                [
                  { name: "buildingNo", label: "Bina No", placeholder: "12" },
                  { name: "apartmentNo", label: "Daire No", placeholder: "3" },
                ],
                [
                  { name: "latitude", label: "Enlem", placeholder: "41.0082" },
                  {
                    name: "longitude",
                    label: "Boylam",
                    placeholder: "28.9784",
                  },
                ],
              ].map((pair, i) => (
                <div className="addr-form-row" key={i}>
                  {pair.map((f) => (
                    <div className="addr-field" key={f.name}>
                      <label className="addr-label">{f.label}</label>
                      <input
                        className={`addr-input ${editErr && ["city", "district", "neighborhood", "street"].includes(f.name) && !editModal.form[f.name] ? "error" : ""}`}
                        name={f.name}
                        value={editModal.form[f.name]}
                        onChange={handleEditChange}
                        placeholder={f.placeholder}
                      />
                    </div>
                  ))}
                </div>
              ))}
              {editErr && <div className="addr-err">{editErr}</div>}
            </div>
            <div className="addr-modal-footer">
              <button
                className="addr-modal-cancel"
                onClick={() => setEditModal(null)}
              >
                İptal
              </button>
              <button
                className="addr-modal-save"
                onClick={updateAddress}
                disabled={updating}
              >
                {updating ? "Güncelleniyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
