import { useState, useEffect } from "react";
import { authFetch } from "./authFetch.js";
import Sidebar from "./sidebar.jsx";
import Header from "./Header.jsx";

import { API_BASE_URL } from "./config";

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
  .am-shell {
    display: grid;
    grid-template-rows: var(--header-h) 1fr var(--footer-h);
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-areas: "header header" "sidebar main" "footer footer";
    height: 100vh; width: 100vw;
  }
  .am-main { grid-area: main; padding: 24px; overflow: hidden; background: var(--bg); display: flex; flex-direction: column; gap: 16px; }
  .am-toast {
    position: fixed; top: 18px; right: 22px; z-index: 9999;
    padding: 10px 18px; border-radius: var(--radius);
    font-family: var(--font-body); font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,.5); border: 1px solid; animation: amSlide .2s ease;
  }
  .am-toast.success { background: rgba(62,207,90,.1); border-color: #3ecf5a; color: #3ecf5a; }
  .am-toast.error   { background: rgba(239,68,68,.1);  border-color: #ef4444; color: #ef4444; }
  @keyframes amSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .am-topbar { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .am-title { font-family: var(--font-head); font-size: 18px; font-weight: 700; color: var(--text); }
  .am-new-btn { padding: 9px 18px; border-radius: var(--radius); border: none; background: var(--accent); color: #0d1117; font-size: 13px; font-weight: 700; font-family: var(--font-head); cursor: pointer; transition: background .15s; }
  .am-new-btn:hover { background: var(--accent2); }

  .am-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; flex: 1; overflow: hidden; }
  .am-col { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); display: flex; flex-direction: column; overflow: hidden; }
  .am-col-head { padding: 12px 14px; border-bottom: 1px solid var(--border); background: var(--surface2); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .am-col-title { font-family: var(--font-head); font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
  .am-col-dot { width: 8px; height: 8px; border-radius: 50%; }
  .am-col-count { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; background: rgba(255,255,255,.06); color: var(--muted); }
  .am-col-body { overflow-y: auto; flex: 1; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
  .am-empty-col { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 12px; }

  .am-card { background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; display: flex; flex-direction: column; gap: 8px; cursor: pointer; transition: border-color .15s, background .15s; }
  .am-card:hover { border-color: rgba(245,166,35,.4); background: rgba(245,166,35,.03); }
  .am-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .am-card-id { font-size: 10px; color: var(--muted); font-family: var(--font-body); }
  .am-card-type { font-size: 12px; font-weight: 700; font-family: var(--font-head); color: var(--text); flex: 1; }
  .am-urgency { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px; border: 1px solid; flex-shrink: 0; }
  .am-card-household { font-size: 11px; color: var(--muted); }
  .am-card-assignee { display: flex; align-items: center; gap: 6px; padding-top: 4px; border-top: 1px solid var(--border); }
  .am-assignee-avatar { width: 20px; height: 20px; border-radius: 50%; background: var(--surface2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: var(--muted); flex-shrink: 0; }
  .am-assignee-name { font-size: 11px; color: var(--muted); }
  .am-card-notes { font-size: 11px; color: var(--muted); font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .am-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 1000; display: flex; align-items: center; justify-content: center; }
  .am-modal { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; width: 480px; max-height: 80vh; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
  .am-modal-title { font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--text); }
  .am-modal-section { display: flex; flex-direction: column; gap: 6px; }
  .am-modal-label { font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted); font-weight: 600; }
  .am-modal-value { font-size: 13px; color: var(--text); }
  .am-select { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 9px 12px; font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color .2s; }
  .am-select:focus { border-color: rgba(245,166,35,.5); }
  .am-textarea { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 9px 12px; font-size: 13px; font-family: var(--font-body); outline: none; resize: vertical; min-height: 80px; transition: border-color .2s; }
  .am-textarea:focus { border-color: rgba(245,166,35,.5); }
  .am-modal-actions { display: flex; gap: 10px; margin-top: 4px; }
  .am-btn-primary { flex: 1; padding: 10px; border-radius: 8px; border: none; background: var(--accent); color: #0d1117; font-size: 13px; font-weight: 700; font-family: var(--font-head); cursor: pointer; transition: background .15s; }
  .am-btn-primary:hover:not(:disabled) { background: var(--accent2); }
  .am-btn-primary:disabled { opacity: .4; cursor: not-allowed; }
  .am-btn-secondary { padding: 10px 16px; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: 13px; font-weight: 600; font-family: var(--font-body); cursor: pointer; transition: all .15s; }
  .am-btn-secondary:hover { color: var(--text); border-color: var(--muted); }
  .am-btn-danger { padding: 10px 16px; border-radius: 8px; border: 1px solid #ef4444; background: rgba(239,68,68,.08); color: #ef4444; font-size: 13px; font-weight: 600; font-family: var(--font-body); cursor: pointer; transition: all .15s; }
  .am-btn-danger:hover { background: rgba(239,68,68,.15); }
  .am-divider { border: none; border-top: 1px solid var(--border); }

  .am-input { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text); padding: 9px 12px; font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color .2s; }
  .am-input:focus { border-color: rgba(245,166,35,.5); }
  .am-input::placeholder { color: var(--muted); }

  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
`;

export default function AssignmentManager() {
  const [assignments, setAssignments] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [detailModal, setDetailModal] = useState(null);
  const [newModal, setNewModal] = useState(false);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    requestId: "",
    volunteerId: "",
    teamId: "",
    notes: "",
  });

  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchAssignments = () =>
    authFetch(`${API_BASE_URL}/assignments`)
      .then((r) => r.json())
      .then(setAssignments);

  useEffect(() => {
    Promise.all([
      authFetch(`${API_BASE_URL}/assignments`).then((r) => r.json()),
      authFetch(`${API_BASE_URL}/volunteer`).then((r) => r.json()),
      authFetch(`${API_BASE_URL}/teams/getAllTeams`).then((r) => r.json()),
      authFetch(`${API_BASE_URL}/aid-requests`).then((r) => r.json()),
    ])
      .then(([a, v, t, r]) => {
        setAssignments(Array.isArray(a) ? a : a.assignments || []);
        setVolunteers(Array.isArray(v) ? v : v.volunteers || []);
        setTeams(Array.isArray(t) ? t : t.teams || []);
        setRequests(Array.isArray(r) ? r : r.requests || []);
      })
      .catch(() => showToast("Veriler yüklenemedi", "error"))
      .finally(() => setLoading(false));
  }, []);

  const colMap = {};
  STATUS_COLS.forEach((c) => {
    colMap[c.key] = [];
  });
  assignments.forEach((a) => {
    const key = a.status || "PENDING";
    if (colMap[key]) colMap[key].push(a);
    else colMap["PENDING"].push(a);
  });

  const handleCreate = async () => {
    if (!form.requestId) return showToast("Talep seçiniz", "error");
    if (!form.volunteerId && !form.teamId)
      return showToast("Gönüllü veya ekip seçiniz", "error");
    setBusy(true);
    try {
      const body = {
        requestId: parseInt(form.requestId),
        volunteerId: form.volunteerId ? parseInt(form.volunteerId) : null,
        teamId: form.teamId ? parseInt(form.teamId) : null,
        notes: form.notes || null,
      };
      const res = await authFetch(`${API_BASE_URL}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) {
        await fetchAssignments();
        setNewModal(false);
        setForm({ requestId: "", volunteerId: "", teamId: "", notes: "" });
      }
    } catch {
      showToast("Görev oluşturulamadı", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async () => {
    if (!detailModal) return;
    setBusy(true);
    try {
      const body = {
        assignmentId: detailModal.assignmentId,
        status: editStatus || null,
        notes: editNotes || null,
      };
      const res = await authFetch(`${API_BASE_URL}/assignments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) {
        await fetchAssignments();
        setDetailModal(null);
      }
    } catch {
      showToast("Güncelleme başarısız", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu görevi silmek istiyor musunuz?")) return;
    try {
      const res = await authFetch(`${API_BASE_URL}/assignments/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      showToast(data.message, data.success ? "success" : "error");
      if (data.success) {
        await fetchAssignments();
        setDetailModal(null);
      }
    } catch {
      showToast("Silinemedi", "error");
    }
  };

  const openDetail = (a) => {
    setDetailModal(a);
    setEditStatus(a.status);
    setEditNotes(a.notes || "");
  };

  return (
    <>
      <style>{CSS}</style>
      {toast && (
        <div className={`am-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div className="am-shell">
        <Header />
        <Sidebar />

        <main className="am-main">
          <div className="am-topbar">
            <span className="am-title">Görev Yönetimi</span>
            <button className="am-new-btn" onClick={() => setNewModal(true)}>
              + Yeni Görev
            </button>
          </div>

          {loading ? (
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              Yükleniyor...
            </div>
          ) : (
            <div className="am-board">
              {STATUS_COLS.map((col) => (
                <div key={col.key} className="am-col">
                  <div className="am-col-head">
                    <span className="am-col-title">
                      <span
                        className="am-col-dot"
                        style={{ background: col.color }}
                      />
                      {col.label}
                    </span>
                    <span className="am-col-count">
                      {colMap[col.key].length}
                    </span>
                  </div>
                  <div className="am-col-body">
                    {colMap[col.key].length === 0 ? (
                      <div className="am-empty-col">Görev yok</div>
                    ) : (
                      colMap[col.key].map((a) => (
                        <div
                          key={a.assignmentId}
                          className="am-card"
                          onClick={() => openDetail(a)}
                        >
                          <div className="am-card-top">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                              }}
                            >
                              <span className="am-card-id">
                                #{a.assignmentId}
                              </span>
                              <span className="am-card-type">
                                {a.requestType || "Yardım Talebi"}
                              </span>
                            </div>
                            {a.urgencyLevel && (
                              <span
                                className="am-urgency"
                                style={{
                                  color: URGENCY_COLORS[a.urgencyLevel],
                                  borderColor: URGENCY_COLORS[a.urgencyLevel],
                                  background: `${URGENCY_COLORS[a.urgencyLevel]}18`,
                                }}
                              >
                                A{a.urgencyLevel}
                              </span>
                            )}
                          </div>
                          {a.householdName && (
                            <span className="am-card-household">
                              📍 {a.householdName}
                            </span>
                          )}
                          {(a.volunteerName || a.teamName) && (
                            <div className="am-card-assignee">
                              <div className="am-assignee-avatar">
                                {(a.volunteerName ||
                                  a.teamName)?.[0]?.toUpperCase()}
                              </div>
                              <span className="am-assignee-name">
                                {a.volunteerName || a.teamName}
                              </span>
                            </div>
                          )}
                          {a.notes && (
                            <span className="am-card-notes">{a.notes}</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
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

      {/* YENİ GÖREV MODALI */}
      {newModal && (
        <div className="am-overlay" onClick={() => setNewModal(false)}>
          <div className="am-modal" onClick={(e) => e.stopPropagation()}>
            <span className="am-modal-title">Yeni Görev Oluştur</span>

            <div className="am-modal-section">
              <span className="am-modal-label">Yardım Talebi</span>
              <select
                className="am-select"
                value={form.requestId}
                onChange={(e) =>
                  setForm({ ...form, requestId: e.target.value })
                }
              >
                <option value="">Talep seçin...</option>
                {requests
                  .filter(
                    (r) => r.status === "PENDING" || r.status === "VERIFIED",
                  )
                  .map((r) => (
                    <option key={r.requestId} value={r.requestId}>
                      #{r.requestId} —{" "}
                      {r.requestType?.typeName || r.requestType || "Talep"} (
                      {r.status})
                    </option>
                  ))}
              </select>
            </div>

            <div className="am-modal-section">
              <span className="am-modal-label">Gönüllü (isteğe bağlı)</span>
              <select
                className="am-select"
                value={form.volunteerId}
                onChange={(e) =>
                  setForm({ ...form, volunteerId: e.target.value })
                }
              >
                <option value="">Gönüllü seçin...</option>
                {volunteers
                  .filter((v) => v.availabilityStatus)
                  .map((v) => (
                    <option key={v.volunteerId} value={v.volunteerId}>
                      {v.name} {v.surname}
                    </option>
                  ))}
              </select>
            </div>

            <div className="am-modal-section">
              <span className="am-modal-label">Ekip (isteğe bağlı)</span>
              <select
                className="am-select"
                value={form.teamId}
                onChange={(e) => setForm({ ...form, teamId: e.target.value })}
              >
                <option value="">Ekip seçin...</option>
                {teams
                  .filter((t) => t.status === "AKTIF")
                  .map((t) => (
                    <option key={t.teamId} value={t.teamId}>
                      {t.teamName} — {t.teamType || ""}
                    </option>
                  ))}
              </select>
            </div>

            <div className="am-modal-section">
              <span className="am-modal-label">Notlar</span>
              <textarea
                className="am-textarea"
                placeholder="Görev notu ekleyin..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div className="am-modal-actions">
              <button
                className="am-btn-secondary"
                onClick={() => setNewModal(false)}
              >
                İptal
              </button>
              <button
                className="am-btn-primary"
                onClick={handleCreate}
                disabled={busy}
              >
                {busy ? "Oluşturuluyor..." : "Görevi Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAY / GÜNCELLEME MODALI */}
      {detailModal && (
        <div className="am-overlay" onClick={() => setDetailModal(null)}>
          <div className="am-modal" onClick={(e) => e.stopPropagation()}>
            <span className="am-modal-title">
              Görev #{detailModal.assignmentId}
            </span>

            <div className="am-modal-section">
              <span className="am-modal-label">Talep</span>
              <span className="am-modal-value">
                {detailModal.requestType || "—"} ·{" "}
                {detailModal.householdName || "—"}
              </span>
            </div>

            <div className="am-modal-section">
              <span className="am-modal-label">Atanan</span>
              <span className="am-modal-value">
                {detailModal.volunteerName || detailModal.teamName || "—"}
              </span>
            </div>

            <div className="am-modal-section">
              <span className="am-modal-label">Atanma Tarihi</span>
              <span className="am-modal-value">
                {detailModal.assignedAt
                  ? new Date(detailModal.assignedAt).toLocaleString("tr-TR")
                  : "—"}
              </span>
            </div>

            {detailModal.completedAt && (
              <div className="am-modal-section">
                <span className="am-modal-label">Tamamlanma Tarihi</span>
                <span className="am-modal-value">
                  {new Date(detailModal.completedAt).toLocaleString("tr-TR")}
                </span>
              </div>
            )}

            <hr className="am-divider" />

            <div className="am-modal-section">
              <span className="am-modal-label">Durum Güncelle</span>
              <select
                className="am-select"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                {STATUS_COLS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="am-modal-section">
              <span className="am-modal-label">Notlar</span>
              <textarea
                className="am-textarea"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Not ekleyin..."
              />
            </div>

            <div className="am-modal-actions">
              <button
                className="am-btn-danger"
                onClick={() => handleDelete(detailModal.assignmentId)}
              >
                Sil
              </button>
              <button
                className="am-btn-secondary"
                onClick={() => setDetailModal(null)}
              >
                Kapat
              </button>
              <button
                className="am-btn-primary"
                onClick={handleUpdate}
                disabled={busy}
              >
                {busy ? "Kaydediliyor..." : "Güncelle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
