import { useNavigate } from "react-router-dom";
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
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const BoxIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" fill="currentColor" opacity=".8" />
    <path d="M3 8l9 5 9-5M12 13v8" stroke="#0d1117" strokeWidth="1.2" />
  </svg>
);

const AlertIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 19h20L12 2z" fill="currentColor" opacity=".8" />
    <path d="M12 9v4M12 16.5v.5" stroke="#0d1117" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const UsersIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="4" fill="currentColor" />
    <path d="M2 21v-1a7 7 0 0114 0v1" fill="currentColor" opacity=".7" />
    <circle cx="19" cy="8" r="3" fill="currentColor" opacity=".5" />
    <path d="M22 21v-1a5 5 0 00-4-4.9" stroke="currentColor" strokeWidth="1.5" opacity=".5" />
  </svg>
);

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:       #0d1117;
    --surface:  #161d27;
    --surface2: #1e2a3a;
    --border:   #253045;
    --accent:   #F5A623;
    --accent2:  #ffc04a;
    --text:     #e8f0fe;
    --muted:    #6b8099;
    --sidebar-w: 230px; --header-h: 60px; --footer-h: 48px; --radius: 10px;
    --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
  }
  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-body); overflow: hidden; }
  .al-shell {
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
    color: var(--accent); flex-shrink: 0;
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

  .welcome-wrap { display: flex; flex-direction: column; gap: 24px; }
  .welcome-hero {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 36px 40px; position: relative; overflow: hidden;
  }
  .welcome-hero::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(245,166,35,.12) 0%, transparent 70%);
    border-radius: 50%;
  }
  .welcome-greeting {
    font-family: var(--font-head); font-size: 28px; font-weight: 800;
    color: var(--text); letter-spacing: -0.5px; margin-bottom: 10px;
  }
  .welcome-greeting span { color: var(--accent); }
  .welcome-sub { font-size: 14px; color: var(--muted); line-height: 1.6; max-width: 480px; }
  .welcome-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .welcome-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 22px; cursor: pointer; transition: all .2s;
  }
  .welcome-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .welcome-card-icon {
    width: 38px; height: 38px;
    background: rgba(245,166,35,.12); border: 0.5px solid rgba(245,166,35,.25);
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    color: var(--accent2); margin-bottom: 14px;
  }
  .welcome-card-title {
    font-family: var(--font-head); font-size: 15px; font-weight: 700;
    color: var(--text); margin-bottom: 4px;
  }
  .welcome-card-desc { font-size: 12px; color: var(--muted); }
`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const CARDS = [
    { icon: <UsersIcon />, title: "Kullanıcılar", desc: "Tüm kullanıcıları yönet",       path: "/adminUsers" },
    { icon: <AlertIcon />, title: "Talepler",     desc: "Yardım taleplerini görüntüle",  path: "/requests" },
    { icon: <BoxIcon />,   title: "Depolar",      desc: "Stok ve depo yönetimi",         path: "/warehouses" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="al-shell">
        <header className="al-header">
          <div className="al-logo">
            <ShieldIcon />
            <span className="al-logo-text">Aegis<span>.</span></span>
          </div>
          <div className="al-header-right">
            <div className="al-user-chip">
              <div className="al-avatar"><UserIcon /></div>
              <span className="al-user-name">{userName}</span>
            </div>
            <button className="al-logout-btn" onClick={handleLogout}>
              <LogoutIcon /> Çıkış Yap
            </button>
          </div>
        </header>

        <Sidebar />

        <main className="al-main">
          <div className="welcome-wrap">
            <div className="welcome-hero">
              <div className="welcome-greeting">
                Hoş Geldiniz, <span>{userName}</span> 👋
              </div>
              <p className="welcome-sub">
                Aegis Afet Yönetim Sistemi'ne hoş geldiniz. Sol menüden yönetmek
                istediğiniz bölümü seçebilir ya da aşağıdaki kartlardan hızlıca erişebilirsiniz.
              </p>
            </div>
            <div className="welcome-cards">
              {CARDS.map((card) => (
                <div className="welcome-card" key={card.path} onClick={() => navigate(card.path)}>
                  <div className="welcome-card-icon">{card.icon}</div>
                  <div className="welcome-card-title">{card.title}</div>
                  <div className="welcome-card-desc">{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="al-footer">
          <div className="al-footer-l">
            <span className="al-dot" />
            <strong>Aegis</strong> Afet Yönetim Sistemi &nbsp;·&nbsp; v1.0.0
          </div>
          <div className="al-footer-r">©️ 2026 Aegis. Tüm hakları saklıdır.</div>
        </footer>
      </div>
    </>
  );
}