import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AegisLogo from "./images/Aegislogo.jpeg";
import Sidebar from "./sidebar";
import { authFetch } from "./authFetch";

const ShieldIcon = () => (
  <img src={AegisLogo} alt="Logo" style={{ width: 39, height: 39 }} />
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill="currentColor" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="currentColor" />
  </svg>
);
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
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 4v6h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 10A8 8 0 1 1 6 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path
      d="M21 21l-4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
  .al-header { grid-area: header; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px 0 0; position: sticky; top: 0; z-index: 100; }
  .al-logo { display: flex; align-items: center; gap: 10px; padding: 0 20px; width: var(--sidebar-w); border-right: 1px solid var(--border); height: 100%; flex-shrink: 0; }
  .al-logo-text { font-family: var(--font-head); font-weight: 800; font-size: 20px; letter-spacing: -0.5px; color: var(--text); }
  .al-logo-text span { color: var(--accent); }
  .al-header-right { display: flex; align-items: center; gap: 10px; }
  .al-user-chip { display: flex; align-items: center; gap: 8px; background: var(--surface2); border: 1px solid var(--border); border-radius: 40px; padding: 5px 14px 5px 5px; }
  .al-avatar { width: 30px; height: 30px; border-radius: 50%; background: rgba(245,166,35,0.18); border: 1px solid rgba(245,166,35,0.35); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
  .al-user-name { font-size: 13px; font-weight: 500; color: var(--text); white-space: nowrap; }
  .al-logout-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-family: var(--font-body); font-size: 13px; padding: 7px 14px; cursor: pointer; transition: all .2s; }
  .al-logout-btn:hover { border-color: var(--accent); color: var(--accent); }
  .al-main { grid-area: main; padding: 28px; overflow-y: auto; background: var(--bg); }
  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .dash-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; }
  .dash-title span { color: var(--accent); }
  .wh-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
  .wh-stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; display: flex; flex-direction: column; gap: 4px; }
  .wh-stat-label { font-size: 11px; color: var(--muted); letter-spacing: .8px; text-transform: uppercase; }
  .wh-stat-value { font-family: var(--font-head); font-size: 26px; font-weight: 700; color: var(--text); }
  .wh-stat-value.green { color: #3ecf5a; }
  .wh-stat-value.accent { color: var(--accent2); }
  .wh-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .wh-search-wrap { display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 7px 12px; flex: 1; min-width: 200px; max-width: 320px; }
  .wh-search-wrap input { background: transparent; border: none; outline: none; color: var(--text); font-family: var(--font-body); font-size: 13px; width: 100%; }
  .wh-search-wrap input::placeholder { color: var(--muted); }
  .wh-add-btn { display: flex; align-items: center; gap: 6px; background: var(--accent); border: none; border-radius: 8px; color: #0d1117; font-family: var(--font-body); font-size: 13px; font-weight: 500; padding: 8px 16px; cursor: pointer; transition: opacity .2s; }
  .wh-add-btn:hover { opacity: .85; }
  .wh-refresh-btn { display: flex; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-family: var(--font-body); font-size: 13px; padding: 8px 14px; cursor: pointer; transition: all .2s; }
  .wh-refresh-btn:hover { border-color: var(--accent); color: var(--accent2); }
  .dash-table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .dash-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .dash-table thead tr { background: var(--surface2); border-bottom: 1px solid var(--border); }
  .dash-table th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
  .dash-table td { padding: 13px 16px; color: var(--text); border-bottom: 1px solid var(--border); vertical-align: middle; }
  .dash-table tbody tr:last-child td { border-bottom: none; }
  .dash-table tbody tr:hover td { background: var(--surface2); }
  .dash-id { font-family: monospace; font-size: 11px; color: var(--muted); }
  .dash-empty { padding: 48px; text-align: center; color: var(--muted); font-size: 14px; }
  .dash-error { background: rgba(245,166,35,.08); border: 1px solid rgba(245,166,35,.2); border-radius: var(--radius); padding: 16px 20px; color: var(--accent2); font-size: 14px; margin-bottom: 16px; }
  .wh-status { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 500; padding: 3px 10px; border-radius: 20px; }
  .wh-status.ACTIVE { background: rgba(62,207,90,.1); color: #3ecf5a; }
  .wh-status.INACTIVE { background: rgba(107,128,153,.1); color: var(--muted); }
  .wh-status.FULL { background: rgba(245,166,35,.1); color: var(--accent2); }
  .wh-delete-btn { display: flex; align-items: center; gap: 5px; background: transparent; border: 1px solid var(--border); border-radius: 7px; color: var(--muted); font-family: var(--font-body); font-size: 12px; padding: 5px 10px; cursor: pointer; transition: all .2s; }
  .wh-delete-btn:hover { border-color: #e05c5c; color: #e05c5c; }
  .wh-edit-btn { display: flex; align-items: center; gap: 5px; background: transparent; border: 1px solid var(--border); border-radius: 7px; color: var(--muted); font-family: var(--font-body); font-size: 12px; padding: 5px 10px; cursor: pointer; transition: all .2s; margin-right: 6px; }
  .wh-edit-btn:hover { border-color: var(--accent); color: var(--accent); }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin .8s linear infinite; vertical-align: middle; margin-right: 8px; }
  .loading-row td { text-align: center; padding: 48px !important; color: var(--muted); font-size: 14px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.72); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal-box { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; animation: modalIn .2s ease; }
  @keyframes modalIn { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: none; } }
  .modal-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid var(--border); }
  .modal-title { font-family: var(--font-head); font-size: 17px; font-weight: 700; color: var(--text); }
  .modal-close { background: transparent; border: 1px solid var(--border); border-radius: 7px; color: var(--muted); cursor: pointer; padding: 5px; display: flex; align-items: center; transition: all .2s; }
  .modal-close:hover { border-color: var(--accent); color: var(--accent); }
  .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
  .modal-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-field { display: flex; flex-direction: column; gap: 6px; }
  .modal-field.full { grid-column: 1 / -1; }
  .modal-label { font-size: 11px; font-weight: 600; letter-spacing: .8px; text-transform: uppercase; color: var(--muted); }
  .modal-input { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: var(--font-body); font-size: 13px; padding: 9px 12px; outline: none; transition: border-color .2s; width: 100%; }
  .modal-input:focus { border-color: var(--accent); }
  .modal-input::placeholder { color: var(--muted); }
  select.modal-input option { background: var(--surface2); }
  .modal-foot { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; }
  .modal-cancel { background: transparent; border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-family: var(--font-body); font-size: 13px; padding: 8px 18px; cursor: pointer; transition: all .2s; }
  .modal-cancel:hover { border-color: var(--accent); color: var(--accent); }
  .modal-submit { background: var(--accent); border: none; border-radius: 8px; color: #0d1117; font-family: var(--font-body); font-size: 13px; font-weight: 500; padding: 8px 20px; cursor: pointer; transition: opacity .2s; }
  .modal-submit:hover { opacity: .85; }
  .modal-submit:disabled { opacity: .5; cursor: not-allowed; }
`;

const EMPTY_FORM = {
  name: "",
  managerId: "",
  addressId: "",
  capacityM3: "",
  status: "ACTIVE",
};

export default function Warehouses() {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userList, setUserList] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const userName = localStorage.getItem("name") || "Admin";
  const adminEmail = localStorage.getItem("email") || "";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchAll = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await authFetch(
        "http://localhost:8080/api/warehouse/getAllWarehouse",
      );
      const data = await res.json();
      setWarehouses(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Depolar getirilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await authFetch(
        `http://localhost:8080/api/admin/adminUserList?email=${adminEmail}`,
      );
      const data = await res.json();
      setUserList(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Kullanıcılar getirilemedi.");
    }
  };

  useEffect(() => {
    fetchAll();
    fetchUsers();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = () => {
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setMessage("Depo adı zorunludur.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await authFetch("http://localhost:8080/api/warehouse", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          managerId: form.managerId || null,
          addressId: form.addressId ? Number(form.addressId) : null,
          capacityM3: form.capacityM3 ? Number(form.capacityM3) : null,
          status: form.status,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        fetchAll();
      } else {
        const data = await res.json();
        setMessage(data.message || "Depo oluşturulamadı.");
        setShowModal(false);
      }
    } catch {
      setMessage("Depo oluşturulamadı.");
      setShowModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (w) => {
    setEditForm({
      warehouseId: w.warehouseId,
      name: w.name || "",
      managerId: w.managerId || "",
      addressId: w.addressId || "",
      capacityM3: w.capacityM3 || "",
      status: w.status || "ACTIVE",
    });
    setEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editForm.name.trim()) {
      setMessage("Depo adı zorunludur.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await authFetch(
        `http://localhost:8080/api/warehouse/${editForm.warehouseId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: editForm.name,
            managerId: editForm.managerId || null,
            addressId: editForm.addressId ? Number(editForm.addressId) : null,
            capacityM3: editForm.capacityM3
              ? Number(editForm.capacityM3)
              : null,
            status: editForm.status,
          }),
        },
      );
      if (res.ok) {
        setEditModal(false);
        fetchAll();
      } else {
        const data = await res.json();
        setMessage(data.message || "Güncelleme başarısız.");
      }
    } catch {
      setMessage("Güncelleme başarısız.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu depoyu silmek istediğinize emin misiniz?")) return;
    try {
      const res = await authFetch(`http://localhost:8080/api/warehouse/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWarehouses((prev) => prev.filter((w) => w.warehouseId !== id));
      } else {
        setMessage("Depo silinemedi.");
      }
    } catch {
      setMessage("Depo silinemedi.");
    }
  };

  const filtered = warehouses.filter((w) => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    return (
      String(w.warehouseId).includes(q) ||
      (w.name || "").toLowerCase().includes(q) ||
      (w.city || "").toLowerCase().includes(q) ||
      (w.managerName || "").toLowerCase().includes(q)
    );
  });

  const totalCount = warehouses.length;
  const activeCount = warehouses.filter((w) => w.status === "ACTIVE").length;
  const totalCapacity = warehouses.reduce(
    (sum, w) => sum + (w.capacityM3 || 0),
    0,
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="al-shell">
        <header className="al-header">
          <div className="al-logo">
            <ShieldIcon />
            <span className="al-logo-text">
              Aegis<span>.</span>
            </span>
          </div>
          <div className="al-header-right">
            <div className="al-user-chip">
              <div className="al-avatar">
                <UserIcon />
              </div>
              <span className="al-user-name">{userName}</span>
            </div>
            <button className="al-logout-btn" onClick={handleLogout}>
              <LogoutIcon /> Çıkış Yap
            </button>
          </div>
        </header>

        <Sidebar />

        <main className="al-main">
          <div className="page-header">
            <div className="dash-title">
              Depo <span>Yönetimi</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="wh-add-btn" onClick={openModal}>
                <PlusIcon /> Depo Ekle
              </button>
              <button className="wh-refresh-btn" onClick={fetchAll}>
                <RefreshIcon /> Yenile
              </button>
            </div>
          </div>

          <div className="wh-stats">
            <div className="wh-stat-card">
              <div className="wh-stat-label">Toplam Depo</div>
              <div className="wh-stat-value">{totalCount}</div>
            </div>
            <div className="wh-stat-card">
              <div className="wh-stat-label">Aktif</div>
              <div className="wh-stat-value green">{activeCount}</div>
            </div>
            <div className="wh-stat-card">
              <div className="wh-stat-label">Toplam Kapasite</div>
              <div className="wh-stat-value accent">
                {totalCapacity > 0
                  ? `${totalCapacity.toLocaleString()} m³`
                  : "—"}
              </div>
            </div>
          </div>

          <div className="wh-toolbar">
            <div className="wh-search-wrap">
              <SearchIcon />
              <input
                placeholder="Depo adı, şehir, yönetici ara…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          {message && <div className="dash-error">{message}</div>}

          <div className="dash-table-wrap">
            {filtered.length === 0 && !loading ? (
              <div className="dash-empty">Depo bulunamadı.</div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Depo Adı</th>
                    <th>Yönetici</th>
                    <th>Konum</th>
                    <th>Kapasite</th>
                    <th>Durum</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="loading-row">
                      <td colSpan={7}>
                        <span className="spinner" />
                        Yükleniyor…
                      </td>
                    </tr>
                  ) : (
                    filtered.map((w) => (
                      <tr key={w.warehouseId}>
                        <td>
                          <span className="dash-id">#{w.warehouseId}</span>
                        </td>
                        <td style={{ fontWeight: 500 }}>{w.name || "—"}</td>
                        <td>{w.managerName || "—"}</td>
                        <td style={{ fontSize: 13, color: "var(--muted)" }}>
                          {w.addressText ||
                            [w.neighborhood, w.district, w.city]
                              .filter(Boolean)
                              .join(", ") ||
                            "—"}
                        </td>
                        <td>
                          {w.capacityM3 != null ? (
                            <span
                              style={{
                                color: "var(--accent2)",
                                fontWeight: 500,
                              }}
                            >
                              {w.capacityM3.toLocaleString()} m³
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          <span className={`wh-status ${w.status || "ACTIVE"}`}>
                            {w.status === "ACTIVE"
                              ? "Aktif"
                              : w.status === "FULL"
                                ? "Dolu"
                                : "Pasif"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="wh-edit-btn"
                            onClick={() => openEdit(w)}
                          >
                            <EditIcon /> Düzenle
                          </button>
                          <button
                            className="wh-delete-btn"
                            onClick={() => handleDelete(w.warehouseId)}
                          >
                            <TrashIcon /> Sil
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">Yeni Depo Ekle</span>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-field full">
                <label className="modal-label">Depo Adı *</label>
                <input
                  className="modal-input"
                  name="name"
                  placeholder="örn. Merkez Depo"
                  value={form.name}
                  onChange={handleFormChange}
                />
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label className="modal-label">Yönetici</label>
                  <select
                    className="modal-input"
                    name="managerId"
                    value={form.managerId}
                    onChange={handleFormChange}
                  >
                    <option value="">— Seçiniz —</option>
                    {userList.map((u) => (
                      <option key={u.userId} value={u.userId}>
                        {u.name} {u.surname}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Durum</label>
                  <select
                    className="modal-input"
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    <option value="ACTIVE">Aktif</option>
                    <option value="INACTIVE">Pasif</option>
                    <option value="FULL">Dolu</option>
                  </select>
                </div>
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label className="modal-label">Kapasite (m³)</label>
                  <input
                    className="modal-input"
                    name="capacityM3"
                    type="number"
                    placeholder="örn. 500"
                    value={form.capacityM3}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Adres ID</label>
                  <input
                    className="modal-input"
                    name="addressId"
                    type="number"
                    placeholder="örn. 12"
                    value={form.addressId}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button
                className="modal-cancel"
                onClick={() => setShowModal(false)}
              >
                İptal
              </button>
              <button
                className="modal-submit"
                onClick={handleCreate}
                disabled={submitting}
              >
                {submitting ? "Kaydediliyor…" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal && editForm && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setEditModal(false)}
        >
          <div className="modal-box">
            <div className="modal-head">
              <span className="modal-title">
                Depo Düzenle{" "}
                <span style={{ color: "var(--accent)" }}>
                  #{editForm.warehouseId}
                </span>
              </span>
              <button
                className="modal-close"
                onClick={() => setEditModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-field full">
                <label className="modal-label">Depo Adı *</label>
                <input
                  className="modal-input"
                  placeholder="örn. Merkez Depo"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label className="modal-label">Yönetici</label>
                  <select
                    className="modal-input"
                    value={editForm.managerId}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, managerId: e.target.value }))
                    }
                  >
                    <option value="">— Seçiniz —</option>
                    {userList.map((u) => (
                      <option key={u.userId} value={u.userId}>
                        {u.name} {u.surname}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Durum</label>
                  <select
                    className="modal-input"
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, status: e.target.value }))
                    }
                  >
                    <option value="ACTIVE">Aktif</option>
                    <option value="INACTIVE">Pasif</option>
                    <option value="FULL">Dolu</option>
                  </select>
                </div>
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label className="modal-label">Kapasite (m³)</label>
                  <input
                    className="modal-input"
                    type="number"
                    placeholder="örn. 500"
                    value={editForm.capacityM3}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, capacityM3: e.target.value }))
                    }
                  />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Adres ID</label>
                  <input
                    className="modal-input"
                    type="number"
                    placeholder="örn. 12"
                    value={editForm.addressId}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, addressId: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button
                className="modal-cancel"
                onClick={() => setEditModal(false)}
              >
                İptal
              </button>
              <button
                className="modal-submit"
                onClick={handleUpdate}
                disabled={submitting}
              >
                {submitting ? "Güncelleniyor…" : "Güncelle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
