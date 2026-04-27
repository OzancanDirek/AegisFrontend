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
const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const SKILLS_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #0d1117; --surface: #161d27; --surface2: #1e2a3a;
    --border: #253045; --accent: #F5A623; --accent2: #ffc04a;
    --text: #e8f0fe; --muted: #6b8099;
  }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
  
  .al-shell { 
    display: grid; 
    grid-template-rows: 60px 1fr 48px; 
    grid-template-columns: 230px 1fr; 
    grid-template-areas: "header header" "sidebar main" "footer footer"; 
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
  
  .al-header { 
    grid-area: header; background: var(--surface); border-bottom: 1px solid var(--border); 
    display: flex; align-items: center; justify-content: space-between; 
    padding-right: 20px; z-index: 100; 
  }
  
  .al-logo { 
    display: flex; align-items: center; gap: 10px; padding: 0 20px; 
    width: 230px; border-right: 1px solid var(--border); height: 100%; 
  }
  
  .al-logo-text { font-weight: 800; font-size: 20px; font-family: 'Syne', sans-serif; color: var(--text); }
  .al-logo-text span { color: var(--accent); }
  
  .al-main { grid-area: main; padding: 28px; overflow-y: auto; background: var(--bg); }
  
  .skill-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  .skill-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 18px 20px; display: flex; align-items: center; gap: 12px;
  }
  .skill-delete-btn { margin-left: auto; background: transparent; border: none; color: var(--muted); cursor: pointer; }
  .skill-delete-btn:hover { color: var(--accent); }
  
  .al-footer { 
    grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); 
    display: flex; align-items: center; justify-content: space-between; 
    padding: 0 24px; font-size: 12px; color: var(--muted); 
  }
`;

export default function Skills() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const userName = localStorage.getItem("name") || "Admin";

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/skill");
      setSkills(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newSkill.trim()) return;
    setSaving(true);
    try {
      await axios.post("http://localhost:8080/api/skill", {
        skillName: newSkill.trim(),
      });
      setNewSkill("");
      fetchSkills();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`${name} silinsin mi?`)) return;
    try {
      await axios.delete(`http://localhost:8080/api/skill/${id}`);
      fetchSkills();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const filtered = skills.filter((s) =>
    s.skillName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <style>{SKILLS_CSS}</style>
      <div className="al-shell">
        <header className="al-header">
          <div className="al-logo">
            <ShieldIcon />{" "}
            <span className="al-logo-text">
              Aegis<span>.</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span
              style={{ fontSize: "13px", fontWeight: 500, color: "#e8f0fe" }}
            >
              {userName}
            </span>
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              style={{
                background: "transparent",
                border: "1px solid #253045",
                color: "#6b8099",
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <LogoutIcon /> Çıkış
            </button>
          </div>
        </header>

        <Sidebar />

        <main className="al-main">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "24px",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                fontFamily: "'Syne', sans-serif",
                color: "#e8f0fe",
              }}
            >
              Yetenek <span style={{ color: "#F5A623" }}>Yönetimi</span>
            </h2>
            <div
              style={{
                background: "#161d27",
                padding: "10px 20px",
                borderRadius: "10px",
                border: "1px solid #253045",
                fontSize: "13px",
                color: "#e8f0fe",
              }}
            >
              <span style={{ color: "#F5A623", fontWeight: 700 }}>
                {skills.length}
              </span>{" "}
              Toplam Yetenek
            </div>
          </div>

          <div
            style={{
              background: "#161d27",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid #253045",
              marginBottom: "24px",
              display: "flex",
              gap: "10px",
            }}
          >
            <input
              style={{
                flex: 1,
                background: "#1e2a3a",
                border: "1px solid #253045",
                color: "#e8f0fe",
                padding: "10px 14px",
                borderRadius: "8px",
                outline: "none",
                fontSize: "13px",
              }}
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Yeni yetenek ekle..."
            />
            <button
              onClick={handleCreate}
              disabled={saving}
              style={{
                background: "#F5A623",
                color: "#0d1117",
                border: "none",
                padding: "0 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              Ekle
            </button>
          </div>

          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#161d27",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #253045",
              maxWidth: "300px",
            }}
          >
            <SearchIcon />
            <input
              style={{
                background: "transparent",
                border: "none",
                color: "#e8f0fe",
                outline: "none",
                width: "100%",
                fontSize: "13px",
              }}
              placeholder="Yetenek ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="skill-grid">
            {loading ? (
              <p style={{ color: "#6b8099" }}>Yükleniyor...</p>
            ) : filtered.length === 0 ? (
              <p style={{ color: "#6b8099", fontSize: "13px" }}>
                Yetenek bulunamadı.
              </p>
            ) : (
              filtered.map((skill) => (
                <div className="skill-card" key={skill.skillId}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "rgba(245,166,35,0.12)",
                      color: "#ffc04a",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    ★
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "13.5px",
                        fontWeight: "500",
                        color: "#e8f0fe",
                      }}
                    >
                      {skill.skillName}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6b8099",
                        fontFamily: "monospace",
                      }}
                    >
                      #{skill.skillId}
                    </div>
                  </div>
                  <button
                    className="skill-delete-btn"
                    onClick={() => handleDelete(skill.skillId, skill.skillName)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))
            )}
          </div>
        </main>

        <footer className="al-footer">
          <div>
            <strong style={{ color: "#F5A623" }}>Aegis</strong> Afet Yönetim
            Sistemi &nbsp;·&nbsp; v1.0.0
          </div>
          <div>©️ 2026 Aegis. Tüm hakları saklıdır.</div>
        </footer>
      </div>
    </>
  );
}
