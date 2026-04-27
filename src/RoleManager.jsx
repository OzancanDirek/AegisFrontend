import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AegisLogo from "./images/Aegislogo.jpeg";
import Sidebar from "./sidebar";

const API = "http://localhost:8080/api/UserRole";

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

const roleColors = {
  ADMIN: { bg: "rgba(239,68,68,0.15)", border: "#ef4444", text: "#ef4444" },
  MODERATOR: {
    bg: "rgba(245,166,35,0.15)",
    border: "#F5A623",
    text: "#F5A623",
  },
  USER: { bg: "rgba(99,179,237,0.15)", border: "#63b3ed", text: "#63b3ed" },
  GUEST: { bg: "rgba(107,128,153,0.15)", border: "#6b8099", text: "#6b8099" },
};

function getRoleStyle(roleName) {
  const key = roleName?.toUpperCase();
  return (
    roleColors[key] || {
      bg: "rgba(107,128,153,0.15)",
      border: "#6b8099",
      text: "#6b8099",
    }
  );
}

const getRoleId = (r) => r?.roleId ?? r?.id;
const getRoleName = (r) => r?.roleName ?? r?.name;
const getUserId = (u) => u?.userId ?? u?.id;
const getDisplayName = (u) =>
  u?.username ?? u?.email ?? u?.name ?? getUserId(u) ?? "?";

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

  .rm-shell {
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
    display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0;
  }
  .al-user-name { font-size: 13px; font-weight: 500; color: var(--text); white-space: nowrap; }
  .al-logout-btn {
    display: flex; align-items: center; gap: 6px; background: transparent;
    border: 1px solid var(--border); border-radius: 8px; color: var(--muted);
    font-family: var(--font-body); font-size: 13px; padding: 7px 14px; cursor: pointer; transition: all .2s;
  }
  .al-logout-btn:hover { border-color: var(--accent); color: var(--accent); }

  .rm-main { grid-area: main; padding: 24px; overflow-y: auto; background: var(--bg); }

  .rm-toast {
    position: fixed; top: 18px; right: 22px; z-index: 9999;
    padding: 10px 18px; border-radius: var(--radius);
    font-family: var(--font-body); font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,.5); border: 1px solid;
    animation: rmSlide .2s ease;
  }
  .rm-toast.success { background: rgba(62,207,90,.1); border-color: #3ecf5a; color: #3ecf5a; }
  .rm-toast.error   { background: rgba(239,68,68,.1);  border-color: #ef4444; color: #ef4444; }
  @keyframes rmSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .rm-content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: calc(100vh - var(--header-h) - var(--footer-h) - 48px); }

  .rm-panel {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); display: flex; flex-direction: column; overflow: hidden;
  }
  .rm-panel-head {
    padding: 13px 18px; border-bottom: 1px solid var(--border);
    background: var(--surface2); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .rm-panel-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; color: var(--text); }
  .rm-panel-count {
    background: rgba(245,166,35,.15); border: 1px solid rgba(245,166,35,.25);
    color: var(--accent); font-size: 11px; font-weight: 700;
    padding: 2px 8px; border-radius: 20px; font-family: var(--font-body);
  }

  .rm-search-wrap { padding: 12px 14px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .rm-search {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text); padding: 8px 12px;
    font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color .2s;
  }
  .rm-search:focus { border-color: rgba(245,166,35,.5); }
  .rm-search::placeholder { color: var(--muted); }

  .rm-user-list { overflow-y: auto; flex: 1; }
  .rm-user-btn {
    width: 100%; display: flex; align-items: center; gap: 11px;
    padding: 11px 14px; background: transparent; border: none;
    border-bottom: 1px solid var(--border); color: var(--muted);
    cursor: pointer; text-align: left; transition: background .12s; font-family: var(--font-body);
  }
  .rm-user-btn:hover { background: var(--surface2); color: var(--text); }
  .rm-user-btn.active { background: rgba(245,166,35,.07); }
  .rm-avatar {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; background: var(--surface2); border: 1px solid var(--border); color: var(--muted);
  }
  .rm-user-btn.active .rm-avatar { background: rgba(245,166,35,.18); border-color: rgba(245,166,35,.4); color: var(--accent); }
  .rm-uinfo { flex: 1; display: flex; flex-direction: column; gap: 1px; }
  .rm-uname { font-size: 13px; font-weight: 500; color: var(--text); }
  .rm-uid   { font-size: 11px; color: var(--muted); }
  .rm-active-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }

  .rm-empty { padding: 28px; text-align: center; color: var(--muted); font-size: 13px; }
  .rm-empty-state {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 12px; padding: 40px;
  }
  .rm-empty-icon {
    width: 50px; height: 50px; border-radius: 50%;
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; font-size: 20px;
  }
  .rm-empty-txt { font-size: 13px; color: var(--muted); text-align: center; line-height: 1.6; }

  .rm-assign-area { flex: 1; padding: 18px; display: flex; flex-direction: column; gap: 18px; overflow-y: auto; }

  .rm-ucard {
    display: flex; align-items: center; gap: 12px; padding: 14px;
    background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius);
  }
  .rm-ucard-avatar {
    width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; font-weight: 700;
    background: rgba(245,166,35,.15); border: 1.5px solid rgba(245,166,35,.4); color: var(--accent);
  }
  .rm-ucard-name { font-size: 15px; font-weight: 700; color: var(--text); font-family: var(--font-head); }
  .rm-ucard-id   { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .rm-section { display: flex; flex-direction: column; gap: 8px; }
  .rm-section-lbl {
    font-size: 10px; letter-spacing: 1.4px; text-transform: uppercase;
    color: var(--muted); font-weight: 600;
  }
  .rm-role-tags { display: flex; flex-wrap: wrap; gap: 7px; }
  .rm-role-tag {
    padding: 4px 11px; border-radius: 20px; font-size: 12px;
    font-weight: 600; border: 1px solid; font-family: var(--font-body);
  }
  .rm-no-role { font-size: 12px; color: var(--muted); font-style: italic; }

  .rm-role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .rm-role-card {
    padding: 14px; border-radius: var(--radius); border: 1px solid var(--border);
    background: var(--bg); cursor: pointer; transition: all .15s;
    display: flex; flex-direction: column; gap: 5px; position: relative;
  }
  .rm-role-card:hover { border-color: rgba(245,166,35,.4); background: rgba(245,166,35,.04); }
  .rm-role-card.chosen { border-color: var(--accent); background: rgba(245,166,35,.09); }
  .rm-rc-dot { width: 8px; height: 8px; border-radius: 50%; margin-bottom: 2px; }
  .rm-rc-name { font-size: 13px; font-weight: 700; font-family: var(--font-head); color: var(--muted); }
  .rm-role-card.chosen .rm-rc-name { color: var(--accent); }
  .rm-rc-check {
    position: absolute; top: 10px; right: 10px;
    width: 16px; height: 16px; border-radius: 50%; background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; color: #0d1117; font-weight: 900;
  }

  .rm-assign-btn {
    width: 100%; padding: 12px; border-radius: var(--radius); border: none;
    background: var(--accent); color: #0d1117;
    font-size: 13px; font-weight: 700; font-family: var(--font-head);
    cursor: pointer; transition: background .15s, opacity .15s; margin-top: auto;
  }
  .rm-assign-btn:hover:not(:disabled) { background: var(--accent2); }
  .rm-assign-btn:disabled { opacity: .4; cursor: not-allowed; }

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
`;

export default function RoleManager() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const userName = localStorage.getItem("name") || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    Promise.all([
      fetch(`${API}/users`).then((r) => r.json()),
      fetch(`${API}/all`).then((r) => r.json()),
    ])
      .then(([uData, rData]) => {
        setUsers(uData.users || []);
        setRoles(rData.roles || []);
      })
      .catch(() => showToast("Veriler yüklenemedi", "error"))
      .finally(() => setLoading(false));
  }, []);

  const loadUserRoles = async (userId) => {
    const data = await fetch(`${API}/user/${userId}`).then((r) => r.json());
    return data.roles || [];
  };

  const handleSelectUser = async (user) => {
    setSelected(null);
    setSelectedRole(null);
    const userRoles = await loadUserRoles(getUserId(user));
    setSelected({ ...user, currentRoles: userRoles });
    if (userRoles.length > 0) setSelectedRole(getRoleId(userRoles[0]));
  };

  const handleAssign = async () => {
    if (!selected || !selectedRole) return;
    setAssigning(true);
    try {
      const res = await fetch(
        `${API}/assign?userId=${getUserId(selected)}&roleId=${selectedRole}`,
        { method: "POST" },
      );
      const data = await res.json();
      showToast(data.message || "Rol atandı!", "success");
      const updatedRoles = await loadUserRoles(getUserId(selected));
      setSelected((prev) => ({ ...prev, currentRoles: updatedRoles }));
      const uData = await fetch(`${API}/users`).then((r) => r.json());
      setUsers(uData.users || []);
    } catch {
      showToast("Rol atanamadı", "error");
    } finally {
      setAssigning(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const filteredUsers = users.filter((u) =>
    getDisplayName(u).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <style>{CSS}</style>

      {toast && (
        <div className={`rm-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div className="rm-shell">
        {/* ── HEADER ── */}
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

        {/* ── SIDEBAR ── */}
        <Sidebar />

        {/* ── MAIN ── */}
        <main className="rm-main">
          <div className="rm-content">
            {/* LEFT: USER LIST */}
            <div className="rm-panel">
              <div className="rm-panel-head">
                <span className="rm-panel-title">Kullanıcılar</span>
                <span className="rm-panel-count">{filteredUsers.length}</span>
              </div>
              <div className="rm-search-wrap">
                <input
                  className="rm-search"
                  placeholder="İsim veya e-posta ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="rm-user-list">
                {loading ? (
                  <div className="rm-empty">Yükleniyor...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="rm-empty">Kullanıcı bulunamadı</div>
                ) : (
                  filteredUsers.map((u) => {
                    const uid = getUserId(u);
                    const isActive = getUserId(selected) === uid;
                    const name = getDisplayName(u);
                    return (
                      <button
                        key={uid}
                        className={`rm-user-btn ${isActive ? "active" : ""}`}
                        onClick={() => handleSelectUser(u)}
                      >
                        <div className="rm-avatar">
                          {name[0]?.toUpperCase()}
                        </div>
                        <div className="rm-uinfo">
                          <span className="rm-uname">{name}</span>
                          <span className="rm-uid">#{uid?.slice(0, 8)}</span>
                        </div>
                        {isActive && <div className="rm-active-dot" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT: ROLE ASSIGNMENT */}
            <div className="rm-panel">
              <div className="rm-panel-head">
                <span className="rm-panel-title">Rol Atama</span>
                {selected && (
                  <span className="rm-panel-count">
                    {getDisplayName(selected)}
                  </span>
                )}
              </div>

              {!selected ? (
                <div className="rm-empty-state">
                  <div className="rm-empty-icon">👤</div>
                  <p className="rm-empty-txt">
                    Sol listeden bir kullanıcı seçin
                    <br />
                    rol atama paneli burada görünecek
                  </p>
                </div>
              ) : (
                <div className="rm-assign-area">
                  <div className="rm-ucard">
                    <div className="rm-ucard-avatar">
                      {getDisplayName(selected)[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="rm-ucard-name">
                        {getDisplayName(selected)}
                      </div>
                      <div className="rm-ucard-id">
                        ID: {getUserId(selected)}
                      </div>
                    </div>
                  </div>

                  <div className="rm-section">
                    <div className="rm-section-lbl">Mevcut Rol</div>
                    <div className="rm-role-tags">
                      {selected.currentRoles?.length > 0 ? (
                        selected.currentRoles.map((r) => {
                          const rName = getRoleName(r);
                          const s = getRoleStyle(rName);
                          return (
                            <span
                              key={getRoleId(r)}
                              className="rm-role-tag"
                              style={{
                                background: s.bg,
                                borderColor: s.border,
                                color: s.text,
                              }}
                            >
                              {rName}
                            </span>
                          );
                        })
                      ) : (
                        <span className="rm-no-role">Henüz rol atanmamış</span>
                      )}
                    </div>
                  </div>

                  <div className="rm-section">
                    <div className="rm-section-lbl">Yeni Rol Seç</div>
                    <div className="rm-role-grid">
                      {roles.map((r) => {
                        const rId = getRoleId(r);
                        const rName = getRoleName(r);
                        const s = getRoleStyle(rName);
                        const isChosen = selectedRole === rId;
                        return (
                          <div
                            key={rId}
                            className={`rm-role-card ${isChosen ? "chosen" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRole(rId);
                            }}
                          >
                            <div
                              className="rm-rc-dot"
                              style={{
                                background: isChosen ? s.border : "#253045",
                              }}
                            />
                            <span className="rm-rc-name">{rName}</span>
                            {isChosen && <div className="rm-rc-check">✓</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    className="rm-assign-btn"
                    onClick={handleAssign}
                    disabled={assigning || !selectedRole}
                  >
                    {assigning ? "Atanıyor..." : "Rolü Ata"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ── FOOTER ── */}
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
