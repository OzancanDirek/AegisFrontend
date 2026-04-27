import { useNavigate, useLocation } from "react-router-dom";

const DashboardIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1"
      fill="currentColor"
      opacity=".9"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1"
      fill="currentColor"
      opacity=".6"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1"
      fill="currentColor"
      opacity=".6"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="1"
      fill="currentColor"
      opacity=".3"
    />
  </svg>
);
const UsersIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="4" fill="currentColor" />
    <path d="M2 21v-1a7 7 0 0114 0v1" fill="currentColor" opacity=".7" />
    <circle cx="19" cy="8" r="3" fill="currentColor" opacity=".5" />
    <path
      d="M22 21v-1a5 5 0 00-4-4.9"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity=".5"
    />
  </svg>
);
const VolunteerIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"
      fill="currentColor"
      opacity=".9"
    />
    <path
      d="M3 21c0-4 2.7-7.4 6.5-8.5M21 21c0-4-2.7-7.4-6.5-8.5"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity=".6"
      strokeLinecap="round"
    />
    <path
      d="M12 14v7M9 18l3 3 3-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity=".8"
    />
  </svg>
);
const SkillIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
      fill="currentColor"
      opacity=".8"
    />
  </svg>
);
const AlertIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 19h20L12 2z" fill="currentColor" opacity=".8" />
    <path
      d="M12 9v4M12 16.5v.5"
      stroke="#0d1117"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
const MapIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"
      fill="currentColor"
      opacity=".7"
    />
    <path d="M9 3v15M15 6v15" stroke="#0d1117" strokeWidth="1.2" />
  </svg>
);
const BoxIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" fill="currentColor" opacity=".8" />
    <path d="M3 8l9 5 9-5M12 13v8" stroke="#0d1117" strokeWidth="1.2" />
  </svg>
);
const AddressIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 22s7-5.4 7-12a7 7 0 10-14 0c0 6.6 7 12 7 12z"
      fill="currentColor"
      opacity=".85"
    />
    <circle cx="12" cy="10" r="2.5" fill="#0d1117" />
  </svg>
);
const SpecialNeedsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21s-7-4.6-9.5-9.5C.7 8.2 3 5 6.5 5c2 0 3.5 1 4.5 2.5C12.5 6 14 5 16 5c3.5 0 5.8 3.2 4 6.5C19 16.4 12 21 12 21z"
      fill="currentColor"
      opacity=".85"
    />
    <path
      d="M12 8v6M9 11h6"
      stroke="#0d1117"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const NAV_ITEMS = [
  {
    icon: <DashboardIcon />,
    label: "Dashboard",
    path: "/adminDashboard",
    section: "genel",
  },
  {
    icon: <UsersIcon />,
    label: "Kullanıcılar",
    path: "/adminUsers",
    section: "genel",
  },
  {
    icon: <VolunteerIcon />,
    label: "Gönüllüler",
    path: "/volunteers",
    section: "genel",
  },
  {
    icon: <UsersIcon />,
    label: "Rol Yönetimi",
    path: "/Admin/roles",
    section: "genel",
  },
  {
    icon: <SkillIcon />,
    label: "Yetenekler",
    path: "/skills",
    section: "genel",
  },

  {
    icon: <AddressIcon />,
    label: "Adresler",
    path: "/addresses",
    section: "genel",
  },
   {
    icon: <SpecialNeedsIcon />,
    label: "Özel İhtiyaçlar",
    path: "/residentspecialneeds",
    section: "genel",
  },
  {
    icon: <AlertIcon />,
    label: "Talepler",
    path: "/requests",
    section: "operasyon",
    badge: "3",
  },
  { icon: <MapIcon />, label: "Harita", path: "/map", section: "operasyon" },
  {
    icon: <BoxIcon />,
    label: "Depolar",
    path: "/warehouses",
    section: "operasyon",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .al-sidebar {
          grid-area: sidebar;
          background: #161d27;
          border-right: 1px solid #253045;
          display: flex; flex-direction: column; padding: 20px 0;
          position: sticky; top: 60px;
          height: calc(100vh - 60px - 48px);
          overflow-y: auto; z-index: 90;
        }
        .al-nav-section { padding: 0 10px; margin-bottom: 6px; }
        .al-nav-label {
          font-size: 10px; font-weight: 600; letter-spacing: 1.6px;
          text-transform: uppercase; color: #3a5068;
          padding: 2px 10px 10px; font-family: 'DM Sans', sans-serif;
        }
        .al-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 10px; cursor: pointer;
          transition: all .15s; color: #6b8099; font-size: 13.5px;
          margin-bottom: 1px; position: relative;
          font-family: 'DM Sans', sans-serif;
        }
        .al-nav-item:hover { background: #1e2a3a; color: #a8c0d6; }
        .al-nav-item.active { background: rgba(245,166,35,.12); color: #F5A623; }
        .al-nav-item.active::before {
          content: ''; position: absolute; left: 0; top: 20%; height: 60%;
          width: 3px; background: #F5A623; border-radius: 0 3px 3px 0;
        }
        .al-badge {
          margin-left: auto; background: #F5A623; color: #0d1117;
          font-size: 10px; font-weight: 700; padding: 1px 6px;
          border-radius: 20px; min-width: 20px; text-align: center;
        }
        .al-divider { height: 1px; background: #253045; margin: 14px 14px; }
      `}</style>

      <aside className="al-sidebar">
        <div className="al-nav-section">
          <div className="al-nav-label">Genel</div>
          {NAV_ITEMS.filter((i) => i.section === "genel").map((item) => (
            <div
              key={item.path}
              className={`al-nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon} {item.label}
              {item.badge && <span className="al-badge">{item.badge}</span>}
            </div>
          ))}
        </div>
        <div className="al-divider" />
        <div className="al-nav-section">
          <div className="al-nav-label">Operasyon</div>
          {NAV_ITEMS.filter((i) => i.section === "operasyon").map((item) => (
            <div
              key={item.path}
              className={`al-nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon} {item.label}
              {item.badge && <span className="al-badge">{item.badge}</span>}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
