import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AegisLogo from "./images/Aegislogo.jpeg";
import Sidebar from "./sidebar";

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

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #0d1117; --surface: #161d27; --surface2: #1e2a3a;
    --border: #253045; --accent: #F5A623; --accent2: #ffc04a;
    --text: #e8f0fe; --muted: #6b8099;
    --sidebar-w: 230px; --header-h: 60px; --footer-h: 48px; --radius: 10px;
    --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
  }
  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-body); overflow: hidden; }

  .al-shell {
    display: grid;
    grid-template-rows: var(--header-h) 1fr var(--footer-h);
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-areas: "header header" "sidebar main" "footer footer";
    height: 100vh;
    width: 100vw;
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

  .al-main { grid-area: main; padding: 28px; overflow-y: auto; background: var(--bg); }

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

  .dash-title {
    font-family: var(--font-head); font-size: 22px; font-weight: 700;
    color: var(--text); margin-bottom: 24px; letter-spacing: -0.3px;
  }
  .dash-title span { color: var(--accent); }
  
  .dash-table-wrap {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  .dash-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .dash-table thead tr { background: var(--surface2); border-bottom: 1px solid var(--border); }
  .dash-table th {
    text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase; color: var(--muted);
  }
  .dash-table td { padding: 13px 16px; color: var(--text); border-bottom: 1px solid var(--border); }
  .dash-table tbody tr:last-child td { border-bottom: none; }
  .dash-table tbody tr:hover td { background: var(--surface2); }
  
  .dash-status {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 500; padding: 3px 10px; border-radius: 20px;
  }
  .dash-status.ACTIVE    { background: rgba(62,207,90,.1);  color: #3ecf5a; }
  .dash-status.INACTIVE  { background: rgba(107,128,153,.1); color: var(--muted); }
  
  .dash-id {
    font-family: monospace; font-size: 11px; color: var(--muted);
    max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;
  }
  .dash-error {
    background: rgba(245,166,35,.08); border: 1px solid rgba(245,166,35,.2);
    border-radius: var(--radius); padding: 16px 20px; color: var(--accent2); font-size: 14px;
  }
  .dash-empty { padding: 48px; text-align: center; color: var(--muted); font-size: 14px; }
`;

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const userName = localStorage.getItem("name") || "Admin";
  const adminEmail = localStorage.getItem("email") || "";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (!adminEmail) return;

    const fetch = async () => {
      try {
        const token = localStorage.getItem("aegis_token");

        const res = await axios.get(
          `http://localhost:8080/api/admin/adminUserList?email=${adminEmail}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUsers(res.data);
      } catch (err) {
        console.log(err);
        setMessage(err.response?.data || "Kullanıcılar getirilemedi.");
      }
    };

    fetch();
  }, [adminEmail]);

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
          <div className="dash-title">
            Kullanıcı <span>Listesi</span>
          </div>

          {!adminEmail && (
            <div className="dash-error">
              Oturum bulunamadı, lütfen giriş yapın.
            </div>
          )}
          {message && <div className="dash-error">{message}</div>}

          {!message && adminEmail && (
            <div className="dash-table-wrap">
              {users.length === 0 ? (
                <div className="dash-empty">Kullanıcı bulunamadı.</div>
              ) : (
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Ad</th>
                      <th>Soyad</th>
                      <th>Email</th>
                      <th>Telefon</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.userId}>
                        <td>
                          <span className="dash-id">#{user.userId}</span>
                        </td>
                        <td>{user.name}</td>
                        <td>{user.surname}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || "—"}</td>
                        <td>
                          <span
                            className={`dash-status ${user.status || "ACTIVE"}`}
                          >
                            {user.status || "ACTIVE"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
    </>
  );
}
