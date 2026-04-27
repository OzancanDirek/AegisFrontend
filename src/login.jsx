import { useState } from "react";
import { useNavigate } from "react-router-dom";
import aegisstyles from "./aegisstyle";
import AegisLeftPanel from "./AegisLeftPanel";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("E-posta ve şifre boş bırakılamaz.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Giriş başarısız. Bilgilerinizi kontrol edin.",
        );
        return;
      }

      if (data.token) {
        localStorage.setItem("aegis_token", data.token);
      }
      localStorage.setItem("email", email);
      if (data.name) localStorage.setItem("name", data.name);
      if (data.role) localStorage.setItem("role", data.role);

      navigate("/adminDashboard");
    } catch (err) {
      setError("Sunucuya bağlanılamadı. Lütfen tekrar deneyin. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{aegisstyles}</style>
      <div className="ag-page">
        <div className="ag-grid-bg" />
        <div className="ag-card">
          <AegisLeftPanel />
          <div className="ag-divider" />

          <div className="ag-right">
            <h2>Giriş yap</h2>
            <p className="ag-subtitle">
              Sisteme erişmek için bilgilerinizi girin
            </p>

            {error && <div className="ag-error">{error}</div>}

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="ag-field">
              <div className="ag-field-header">
                <span className="ag-label">ŞİFRE</span>
                <button className="ag-forgot" type="button">
                  Şifremi unuttum
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
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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

            {/* Beni hatırla */}
            <div className="ag-remember" onClick={() => setRemember(!remember)}>
              <div className="ag-checkbox">
                {remember && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path
                      d="M1 3.5L3.5 6L8 1"
                      stroke="#C4A44A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
              <span>Beni hatırla</span>
            </div>

            <button
              className="ag-btn-login"
              type="button"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
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
              Hesabınız yok mu?{" "}
              <button type="button" onClick={() => navigate("/register")}>
                Kayıt ol
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
