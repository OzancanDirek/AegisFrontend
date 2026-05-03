import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AegisLogo from "./images/Aegislogo.jpeg";

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

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TYPE_COLORS = {
  GENERAL: { bg: "rgba(99,179,237,.1)", color: "#63b3ed", label: "Genel" },
  URGENT: { bg: "rgba(245,101,101,.1)", color: "#fc8181", label: "Acil" },
  TASK: { bg: "rgba(72,187,120,.1)", color: "#68d391", label: "Görev" },
};

const CSS = `
  .al-header {
    grid-area: header; background: #161d27; border-bottom: 1px solid #253045;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px 0 0; position: sticky; top: 0; z-index: 100;
  }
  .al-logo {
    display: flex; align-items: center; gap: 10px; padding: 0 20px;
    width: 230px; border-right: 1px solid #253045; height: 100%; flex-shrink: 0;
  }
  .al-logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; color: #e8f0fe; }
  .al-logo-text span { color: #F5A623; }
  .al-header-right { display: flex; align-items: center; gap: 10px; }
  .al-user-chip {
    display: flex; align-items: center; gap: 8px; background: #1e2a3a;
    border: 1px solid #253045; border-radius: 40px; padding: 5px 14px 5px 5px;
  }
  .al-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: rgba(245,166,35,0.18); border: 1px solid rgba(245,166,35,0.35);
    display: flex; align-items: center; justify-content: center; color: #F5A623; flex-shrink: 0;
  }
  .al-user-name { font-size: 13px; font-weight: 500; color: #e8f0fe; white-space: nowrap; }
  .al-logout-btn {
    display: flex; align-items: center; gap: 6px; background: transparent;
    border: 1px solid #253045; border-radius: 8px; color: #6b8099;
    font-family: 'DM Sans', sans-serif; font-size: 13px; padding: 7px 14px; cursor: pointer; transition: all .2s;
  }
  .al-logout-btn:hover { border-color: #F5A623; color: #F5A623; }

  /* Zil */
  .al-bell-wrap { position: relative; }
  .al-bell-btn {
    width: 36px; height: 36px; border-radius: 10px;
    background: #1e2a3a; border: 1px solid #253045;
    display: flex; align-items: center; justify-content: center;
    color: #6b8099; cursor: pointer; transition: all .2s; position: relative;
  }
  .al-bell-btn:hover { border-color: #F5A623; color: #F5A623; }
  .al-bell-badge {
    position: absolute; top: -4px; right: -4px;
    width: 16px; height: 16px; border-radius: 50%;
    background: #F5A623; color: #0d1117;
    font-size: 9px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }

  /* Dropdown */
  .al-bell-dropdown {
    position: absolute; top: calc(100% + 10px); right: 0;
    width: 340px; background: #161d27; border: 1px solid #253045;
    border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,.4);
    z-index: 200; overflow: hidden;
  }
  .al-bell-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; border-bottom: 1px solid #253045;
  }
  .al-bell-header-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #e8f0fe; }
  .al-bell-see-all {
    font-size: 12px; color: #F5A623; cursor: pointer; background: none;
    border: none; font-family: 'DM Sans', sans-serif;
  }
  .al-bell-see-all:hover { text-decoration: underline; }
  .al-bell-item { padding: 12px 16px; border-bottom: 1px solid #1e2a3a; cursor: pointer; transition: background .15s; }
  .al-bell-item:last-child { border-bottom: none; }
  .al-bell-item:hover { background: #1e2a3a; }
  .al-bell-item-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .al-bell-type {
    font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px;
  }
  .al-bell-title { font-size: 13px; font-weight: 600; color: #e8f0fe; }
  .al-bell-msg { font-size: 12px; color: #6b8099; line-height: 1.5; 
    overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .al-bell-time { font-size: 11px; color: #3a5068; margin-top: 4px; }
  .al-bell-empty { padding: 24px; text-align: center; color: #6b8099; font-size: 13px; }
`;

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s önce`;
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

export default function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "Kullanıcı";
  const role = localStorage.getItem("role") || "User";

  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/announcements/top5?role=${role}`)
      .then((res) => setAnnouncements(res.data))
      .catch(() => {});
  }, [role]);

  // Dropdown dışına tıklayınca kapat
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <style>{CSS}</style>
      <header className="al-header">
        <div className="al-logo">
          <ShieldIcon />
          <span className="al-logo-text">
            Aegis<span>.</span>
          </span>
        </div>
        <div className="al-header-right">
          {/* Zil */}
          <div className="al-bell-wrap" ref={dropdownRef}>
            <div className="al-bell-btn" onClick={() => setOpen((o) => !o)}>
              <BellIcon />
              {announcements.length > 0 && (
                <span className="al-bell-badge">{announcements.length}</span>
              )}
            </div>

            {open && (
              <div className="al-bell-dropdown">
                <div className="al-bell-header">
                  <span className="al-bell-header-title">Duyurular</span>
                  <button
                    className="al-bell-see-all"
                    onClick={() => {
                      setOpen(false);
                      navigate("/announcements");
                    }}
                  >
                    Tümünü Gör
                  </button>
                </div>
                {announcements.length === 0 ? (
                  <div className="al-bell-empty">Duyuru yok</div>
                ) : (
                  announcements.map((a) => {
                    const tc = TYPE_COLORS[a.type] || TYPE_COLORS.GENERAL;
                    return (
                      <div key={a.id} className="al-bell-item">
                        <div className="al-bell-item-top">
                          <span
                            className="al-bell-type"
                            style={{ background: tc.bg, color: tc.color }}
                          >
                            {tc.label}
                          </span>
                          <span className="al-bell-title">{a.title}</span>
                        </div>
                        <div className="al-bell-msg">{a.message}</div>
                        <div className="al-bell-time">
                          {timeAgo(a.createdAt)} · {a.createdByName}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Kullanıcı chip */}
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
    </>
  );
}
