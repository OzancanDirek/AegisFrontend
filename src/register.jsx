import { useState } from "react";
import { useNavigate } from "react-router-dom";
import aegisstyles from "./aegisstyle";
import AegisLeftPanel from "./AegisLeftPanel";

const addressModalStyles = `
  .ag-address-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(8, 5, 18, 0.72);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: ag-fade-in 0.18s ease;
  }
  @keyframes ag-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .ag-address-modal {
    background: linear-gradient(145deg, #1a1228 0%, #130e1f 100%);
    border: 1px solid rgba(120, 80, 200, 0.28);
    border-radius: 16px;
    padding: 2rem 2rem 1.6rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(120,80,200,0.10);
    animation: ag-slide-up 0.22s cubic-bezier(0.34,1.56,0.64,1);
    position: relative;
  }
  @keyframes ag-slide-up {
    from { transform: translateY(24px) scale(0.97); opacity: 0; }
    to   { transform: translateY(0) scale(1);      opacity: 1; }
  }
  .ag-address-modal h3 {
    margin: 0 0 0.25rem;
    font-size: 1.05rem;
    font-weight: 700;
    color: #e8deff;
    letter-spacing: 0.01em;
  }
  .ag-address-modal p.ag-modal-sub {
    margin: 0 0 1.4rem;
    font-size: 0.78rem;
    color: #7a6a9a;
  }
  .ag-address-modal .ag-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(120,80,200,0.12);
    border: none;
    border-radius: 8px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
    color: #9b82cc;
  }
  .ag-address-modal .ag-modal-close:hover {
    background: rgba(120,80,200,0.25);
    color: #c8b0f8;
  }
  .ag-address-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  .ag-address-grid .ag-field {
    margin-bottom: 0 !important;
  }
  .ag-address-grid .ag-field:nth-child(3),
  .ag-address-grid .ag-field:nth-child(4) {
    grid-column: span 1;
  }
  .ag-address-modal .ag-modal-actions {
    display: flex;
    gap: 0.6rem;
    margin-top: 1.4rem;
  }
  .ag-address-modal .ag-btn-cancel {
    flex: 0 0 auto;
    padding: 0.6rem 1.1rem;
    background: rgba(120,80,200,0.1);
    border: 1px solid rgba(120,80,200,0.2);
    border-radius: 8px;
    color: #9b82cc;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.02em;
  }
  .ag-address-modal .ag-btn-cancel:hover {
    background: rgba(120,80,200,0.18);
    color: #c8b0f8;
  }
  .ag-address-modal .ag-btn-confirm {
    flex: 1;
    padding: 0.6rem 1.1rem;
    background: linear-gradient(135deg, #7c4fd4 0%, #5a2fa0 100%);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.03em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
  }
  .ag-address-modal .ag-btn-confirm:hover {
    background: linear-gradient(135deg, #8d5fe0 0%, #6a3fb8 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(120,80,200,0.35);
  }
  .ag-address-modal .ag-field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .ag-address-modal .ag-label {
    font-size: 0.68rem;
    font-weight: 700;
    color: #6a5888;
    letter-spacing: 0.08em;
  }
  .ag-address-modal .ag-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .ag-address-modal .ag-input-icon {
    position: absolute;
    left: 0.65rem;
    display: flex;
    align-items: center;
    pointer-events: none;
    opacity: 0.7;
  }
  .ag-address-modal input {
    width: 100%;
    padding: 0.55rem 0.75rem 0.55rem 2rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(120,80,200,0.18);
    border-radius: 8px;
    color: #e0d6f8;
    font-size: 0.83rem;
    transition: border-color 0.15s, background 0.15s;
    outline: none;
    box-sizing: border-box;
  }
  .ag-address-modal input::placeholder {
    color: #4a3e66;
  }
  .ag-address-modal input:focus {
    border-color: rgba(120,80,200,0.55);
    background: rgba(120,80,200,0.07);
  }
  .ag-address-modal .ag-modal-error {
    margin-top: 0.75rem;
    padding: 0.5rem 0.75rem;
    background: rgba(220,60,60,0.12);
    border: 1px solid rgba(220,60,60,0.25);
    border-radius: 8px;
    color: #f08080;
    font-size: 0.78rem;
  }

  /* Address badge row next to button */
  .ag-form-row-with-addr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
  .ag-addr-badge {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.75rem;
    background: rgba(100,220,120,0.1);
    border: 1px solid rgba(100,220,120,0.25);
    border-radius: 20px;
    color: #7de89a;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
  }
  .ag-addr-badge svg {
    flex-shrink: 0;
  }
  .ag-addr-edit-btn {
    background: none;
    border: none;
    color: #7a6a9a;
    font-size: 0.73rem;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.15s;
  }
  .ag-addr-edit-btn:hover {
    color: #b89edc;
  }
  .ag-btn-add-address {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.5rem 1rem;
    background: rgba(120,80,200,0.12);
    border: 1px dashed rgba(120,80,200,0.35);
    border-radius: 8px;
    color: #9b82cc;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }
  .ag-btn-add-address:hover {
    background: rgba(120,80,200,0.2);
    border-color: rgba(120,80,200,0.55);
    color: #c8b0f8;
  }
`;

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    address: {
      city: "",
      district: "",
      neighborhood: "",
      street: "",
      buildingNo: "",
      apartmentNo: "",
    },
  });

  const [showPw, setShowPw] = useState(false);
  const [showPwConf, setShowPwConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [tempAddress, setTempAddress] = useState({
    city: "",
    district: "",
    neighborhood: "",
    street: "",
    buildingNo: "",
    apartmentNo: "",
  });
  const [addressModalError, setAddressModalError] = useState("");

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const updateTemp = (field) => (e) =>
    setTempAddress({ ...tempAddress, [field]: e.target.value });

  const openAddressModal = () => {
    setTempAddress({ ...form.address });
    setAddressModalError("");
    setShowAddressModal(true);
  };

  const confirmAddress = () => {
    if (
      !tempAddress.city.trim() ||
      !tempAddress.district.trim() ||
      !tempAddress.neighborhood.trim() ||
      !tempAddress.street.trim() ||
      !tempAddress.buildingNo.trim() ||
      !tempAddress.apartmentNo.trim()
    ) {
      setAddressModalError("Lütfen tüm adres alanlarını doldurun.");
      return;
    }
    setForm({ ...form, address: { ...tempAddress } });
    setAddressSaved(true);
    setShowAddressModal(false);
    setAddressModalError("");
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!form.name || !form.surname || !form.email || !form.password) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (form.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (!addressSaved) {
      setError("Devam etmek için lütfen adres bilgilerinizi ekleyin.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          surname: form.surname,
          email: form.email,
          phone: form.phone,
          password: form.password,
          address: {
            city: form.address.city,
            district: form.address.district,
            neighborhood: form.address.neighborhood,
            street: form.address.street,
            buildingNo: form.address.buildingNo,
            apartmentNo: form.address.apartmentNo,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Kayıt başarısız. Lütfen tekrar deneyin.");
        return;
      }

      setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError("Sunucuya bağlanılamadı. Lütfen tekrar deneyin. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{aegisstyles}</style>
      <style>{addressModalStyles}</style>

      {/* ── Address Modal ── */}
      {showAddressModal && (
        <div
          className="ag-address-modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setShowAddressModal(false)
          }
        >
          <div className="ag-address-modal">
            <button
              className="ag-modal-close"
              type="button"
              onClick={() => setShowAddressModal(false)}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 1L11 11M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <h3>Adres Bilgileri</h3>
            <p className="ag-modal-sub">Tüm alanlar zorunludur</p>

            <div className="ag-address-grid">
              {/* Şehir */}
              <div className="ag-field">
                <span className="ag-label">ŞEHİR</span>
                <div className="ag-input-wrap">
                  <div className="ag-input-icon">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M7 1C4.8 1 3 2.8 3 5C3 8 7 13 7 13C7 13 11 8 11 5C11 2.8 9.2 1 7 1Z"
                        stroke="#6a5888"
                        strokeWidth="1.2"
                      />
                      <circle
                        cx="7"
                        cy="5"
                        r="1.5"
                        stroke="#6a5888"
                        strokeWidth="1.1"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="İstanbul"
                    value={tempAddress.city}
                    onChange={updateTemp("city")}
                    autoFocus
                  />
                </div>
              </div>

              {/* İlçe */}
              <div className="ag-field">
                <span className="ag-label">İLÇE</span>
                <div className="ag-input-wrap">
                  <div className="ag-input-icon">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M7 1C4.8 1 3 2.8 3 5C3 8 7 13 7 13C7 13 11 8 11 5C11 2.8 9.2 1 7 1Z"
                        stroke="#6a5888"
                        strokeWidth="1.2"
                      />
                      <circle
                        cx="7"
                        cy="5"
                        r="1.5"
                        stroke="#6a5888"
                        strokeWidth="1.1"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Kadıköy"
                    value={tempAddress.district}
                    onChange={updateTemp("district")}
                  />
                </div>
              </div>

              {/* Mahalle */}
              <div className="ag-field">
                <span className="ag-label">MAHALLE</span>
                <div className="ag-input-wrap">
                  <div className="ag-input-icon">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <rect
                        x="1"
                        y="5"
                        width="5"
                        height="8"
                        stroke="#6a5888"
                        strokeWidth="1.1"
                        rx="0.5"
                      />
                      <rect
                        x="8"
                        y="3"
                        width="5"
                        height="10"
                        stroke="#6a5888"
                        strokeWidth="1.1"
                        rx="0.5"
                      />
                      <path
                        d="M1 13H13"
                        stroke="#6a5888"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Moda Mahallesi"
                    value={tempAddress.neighborhood}
                    onChange={updateTemp("neighborhood")}
                  />
                </div>
              </div>

              {/* Sokak — full width */}
              <div className="ag-field" style={{ gridColumn: "span 2" }}>
                <span className="ag-label">SOKAK / CADDE</span>
                <div className="ag-input-wrap">
                  <div className="ag-input-icon">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 12L7 2L12 12"
                        stroke="#6a5888"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 8H10"
                        stroke="#6a5888"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Bahariye Cad."
                    value={tempAddress.street}
                    onChange={updateTemp("street")}
                  />
                </div>
              </div>

              {/* Bina / Daire — divider row */}
              <div className="ag-field" style={{ gridColumn: "span 2" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    margin: "0.1rem 0 0.05rem",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "rgba(120,80,200,0.15)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.67rem",
                      color: "#5a4878",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    BİNA BİLGİLERİ
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background: "rgba(120,80,200,0.15)",
                    }}
                  />
                </div>
              </div>

              {/* Bina No */}
              <div className="ag-field">
                <span className="ag-label">BİNA NO</span>
                <div className="ag-input-wrap">
                  <div className="ag-input-icon">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <rect
                        x="2"
                        y="2"
                        width="10"
                        height="11"
                        rx="1"
                        stroke="#6a5888"
                        strokeWidth="1.1"
                      />
                      <path
                        d="M5 13V9h4v4"
                        stroke="#6a5888"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="4"
                        y="4"
                        width="2"
                        height="2"
                        rx="0.3"
                        fill="#6a5888"
                        opacity="0.6"
                      />
                      <rect
                        x="8"
                        y="4"
                        width="2"
                        height="2"
                        rx="0.3"
                        fill="#6a5888"
                        opacity="0.6"
                      />
                      <rect
                        x="4"
                        y="7"
                        width="2"
                        height="1.5"
                        rx="0.3"
                        fill="#6a5888"
                        opacity="0.6"
                      />
                      <rect
                        x="8"
                        y="7"
                        width="2"
                        height="1.5"
                        rx="0.3"
                        fill="#6a5888"
                        opacity="0.6"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="12"
                    value={tempAddress.buildingNo}
                    onChange={updateTemp("buildingNo")}
                  />
                </div>
              </div>

              {/* Daire No */}
              <div className="ag-field">
                <span className="ag-label">DAİRE NO</span>
                <div className="ag-input-wrap">
                  <div className="ag-input-icon">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <rect
                        x="2"
                        y="2"
                        width="10"
                        height="11"
                        rx="1"
                        stroke="#6a5888"
                        strokeWidth="1.1"
                      />
                      <circle
                        cx="8.5"
                        cy="7"
                        r="0.9"
                        fill="#6a5888"
                        opacity="0.7"
                      />
                      <path
                        d="M5 13V9h4v4"
                        stroke="#6a5888"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="3"
                    value={tempAddress.apartmentNo}
                    onChange={updateTemp("apartmentNo")}
                    onKeyDown={(e) => e.key === "Enter" && confirmAddress()}
                  />
                </div>
              </div>
            </div>

            {addressModalError && (
              <div className="ag-modal-error">{addressModalError}</div>
            )}

            <div className="ag-modal-actions">
              <button
                className="ag-btn-cancel"
                type="button"
                onClick={() => setShowAddressModal(false)}
              >
                İptal
              </button>
              <button
                className="ag-btn-confirm"
                type="button"
                onClick={confirmAddress}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7L5.5 10.5L12 3.5"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Adresi Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Page ── */}
      <div className="ag-page">
        <div className="ag-grid-bg" />
        <div className="ag-card">
          <AegisLeftPanel />
          <div className="ag-divider" />

          <div className="ag-right">
            <h2>Kayıt ol</h2>
            <p className="ag-subtitle">
              Hesap oluşturmak için bilgilerinizi girin
            </p>

            {error && <div className="ag-error">{error}</div>}
            {success && <div className="ag-success">{success}</div>}

            {/* Ad */}
            <div className="ag-field">
              <div className="ag-field-header">
                <span className="ag-label">AD</span>
              </div>
              <div className="ag-input-wrap">
                <div className="ag-input-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle
                      cx="7"
                      cy="5"
                      r="2.5"
                      stroke="#4a3868"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5"
                      stroke="#4a3868"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Adınız"
                  value={form.name}
                  onChange={update("name")}
                />
              </div>
            </div>

            {/* Soyad */}
            <div className="ag-field">
              <div className="ag-field-header">
                <span className="ag-label">SOYAD</span>
              </div>
              <div className="ag-input-wrap">
                <div className="ag-input-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle
                      cx="7"
                      cy="5"
                      r="2.5"
                      stroke="#4a3868"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5"
                      stroke="#4a3868"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Soyadınız"
                  value={form.surname}
                  onChange={update("surname")}
                />
              </div>
            </div>

            {/* E-posta */}
            <div className="ag-field">
              <div className="ag-field-header">
                <span className="ag-label">E-POSTA</span>
              </div>
              <div className="ag-input-wrap">
                <div className="ag-input-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect
                      x="1"
                      y="3"
                      width="12"
                      height="8"
                      rx="1.5"
                      stroke="#4a3868"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M1 4.5L7 8L13 4.5"
                      stroke="#4a3868"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="ornek@aegis.gov.tr"
                  value={form.email}
                  onChange={update("email")}
                />
              </div>
            </div>

            {/* Telefon */}
            <div className="ag-field">
              <div className="ag-field-header">
                <span className="ag-label">
                  TELEFON{" "}
                  <span style={{ color: "#3d2f55", fontWeight: 400 }}>
                    (opsiyonel)
                  </span>
                </span>
              </div>
              <div className="ag-input-wrap">
                <div className="ag-input-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect
                      x="3"
                      y="1"
                      width="8"
                      height="12"
                      rx="1.5"
                      stroke="#4a3868"
                      strokeWidth="1.2"
                    />
                    <circle cx="7" cy="10.5" r="0.7" fill="#4a3868" />
                  </svg>
                </div>
                <input
                  type="tel"
                  placeholder="05xx xxx xx xx"
                  value={form.phone}
                  onChange={update("phone")}
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="ag-field">
              <div className="ag-field-header">
                <span className="ag-label">ŞİFRE</span>
              </div>
              <div className="ag-input-wrap has-toggle">
                <div className="ag-input-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect
                      x="2"
                      y="6"
                      width="10"
                      height="7"
                      rx="1.5"
                      stroke="#4a3868"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M4.5 6V4.5C4.5 3.1 5.6 2 7 2C8.4 2 9.5 3.1 9.5 4.5V6"
                      stroke="#4a3868"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="En az 6 karakter"
                  value={form.password}
                  onChange={update("password")}
                />
                <button
                  className="ag-toggle-btn"
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                >
                  <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                    <ellipse
                      cx="7"
                      cy="7"
                      rx="5"
                      ry="3.5"
                      stroke="#4a3868"
                      strokeWidth="1.2"
                    />
                    <circle cx="7" cy="7" r="1.5" fill="#4a3868" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Şifre tekrar + Adres Ekle */}
            <div className="ag-field">
              <div
                className="ag-field-header"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span className="ag-label">ŞİFRE TEKRAR</span>
                <button
                  className="ag-btn-add-address"
                  type="button"
                  onClick={openAddressModal}
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7 1C4.8 1 3 2.8 3 5C3 8 7 13 7 13C7 13 11 8 11 5C11 2.8 9.2 1 7 1Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <circle
                      cx="7"
                      cy="5"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="1.1"
                    />
                  </svg>
                  {addressSaved ? "Adresi Düzenle" : "Adres Ekle"}
                </button>
              </div>

              <div className="ag-input-wrap has-toggle">
                <div className="ag-input-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect
                      x="2"
                      y="6"
                      width="10"
                      height="7"
                      rx="1.5"
                      stroke="#4a3868"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M4.5 6V4.5C4.5 3.1 5.6 2 7 2C8.4 2 9.5 3.1 9.5 4.5V6"
                      stroke="#4a3868"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>
                <input
                  type={showPwConf ? "text" : "password"}
                  placeholder="Şifrenizi tekrar girin"
                  value={form.passwordConfirm}
                  onChange={update("passwordConfirm")}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
                <button
                  className="ag-toggle-btn"
                  type="button"
                  onClick={() => setShowPwConf(!showPwConf)}
                >
                  <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                    <ellipse
                      cx="7"
                      cy="7"
                      rx="5"
                      ry="3.5"
                      stroke="#4a3868"
                      strokeWidth="1.2"
                    />
                    <circle cx="7" cy="7" r="1.5" fill="#4a3868" />
                  </svg>
                </button>
              </div>

              {/* Address saved badge */}
              {addressSaved && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "0.45rem",
                  }}
                >
                  <div className="ag-addr-badge">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M1 6L4.5 9.5L11 2.5"
                        stroke="#7de89a"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {form.address.city}, {form.address.district} — Bina{" "}
                    {form.address.buildingNo}/{form.address.apartmentNo}
                  </div>
                  <button
                    className="ag-addr-edit-btn"
                    type="button"
                    onClick={openAddressModal}
                  >
                    değiştir
                  </button>
                </div>
              )}
            </div>

            <button
              className="ag-btn-login"
              type="button"
              onClick={handleRegister}
              disabled={loading}
              style={{ marginTop: "0.5rem" }}
            >
              {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
              {!loading && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7H11M8 4L11 7L8 10"
                    stroke="#0c0912"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            <p className="ag-hint">
              Zaten hesabınız var mı?{" "}
              <button type="button" onClick={() => navigate("/login")}>
                Giriş yap
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
