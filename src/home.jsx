import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./sidebar";
import Header from "./Header.jsx";

const NEWS_API_KEY = "718a053954c64344bf865467ab957da1";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d1117; --surface: #161d27; --surface2: #1e2a3a; --border: #253045;
    --accent: #F5A623; --accent2: #ffc04a; --text: #e8f0fe; --muted: #6b8099;
    --danger: #ef4444; --success: #3ecf5a;
    --sidebar-w: 230px; --header-h: 60px; --footer-h: 48px; --radius: 10px;
    --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
  }
  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-body); overflow: hidden; }
  .home-shell {
    display: grid;
    grid-template-rows: var(--header-h) 1fr var(--footer-h);
    grid-template-columns: var(--sidebar-w) 1fr;
    grid-template-areas: "header header" "sidebar main" "footer footer";
    height: 100vh; width: 100vw;
  }
  .home-main { grid-area: main; overflow-y: auto; background: var(--bg); }

  /* HERO */
  .home-hero {
    background: linear-gradient(160deg, #0f1923 0%, #161d27 60%, #1a2535 100%);
    border-bottom: 1px solid var(--border);
    padding: 52px 48px 44px;
    position: relative; overflow: hidden;
  }
  .home-hero::before {
    content: ''; position: absolute; top: -120px; right: -80px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(245,166,35,.05) 0%, transparent 65%);
    border-radius: 50%; pointer-events: none;
  }
  .home-hero-inner { position: relative; z-index: 1; }
  .home-hero-eyebrow {
    font-size: 11px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--accent);
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  }
  .home-hero-eyebrow::before { content: ''; display: inline-block; width: 24px; height: 1px; background: var(--accent); }
  .home-hero-title {
    font-family: var(--font-head); font-size: 40px; font-weight: 800;
    color: var(--text); letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 16px;
  }
  .home-hero-title span { color: var(--accent); }
  .home-hero-desc {
    font-size: 14px; color: var(--muted); line-height: 1.9;
    max-width: 580px; border-left: 2px solid var(--border); padding-left: 16px;
  }

  /* CONTENT */
  .home-content { display: grid; grid-template-columns: 1fr 320px; gap: 0; }

  /* LEFT */
  .home-left { padding: 32px 36px; border-right: 1px solid var(--border); display: flex; flex-direction: column; gap: 36px; }
  .home-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
  .home-section-title { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
  .home-section-link { font-size: 12px; color: var(--accent); background: none; border: none; cursor: pointer; font-family: var(--font-body); }
  .home-section-link:hover { text-decoration: underline; }

  /* ANNOUNCEMENTS */
  .home-ann-list { display: flex; flex-direction: column; }
  .home-ann-item {
    display: flex; gap: 20px; padding: 16px 0;
    border-bottom: 1px solid var(--border);
  }
  .home-ann-item:last-child { border-bottom: none; }
  .home-ann-left { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 48px; }
  .home-ann-type-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .home-ann-date { font-size: 10px; color: var(--muted); text-align: center; line-height: 1.4; }
  .home-ann-body { flex: 1; }
  .home-ann-type-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px; }
  .home-ann-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 5px; line-height: 1.4; }
  .home-ann-msg { font-size: 12px; color: var(--muted); line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  /* NEWS */
  .home-news-list { display: flex; flex-direction: column; }
  .home-news-item {
    display: flex; gap: 16px; padding: 14px 0;
    border-bottom: 1px solid var(--border); cursor: pointer; transition: opacity .15s;
  }
  .home-news-item:last-child { border-bottom: none; }
  .home-news-item:hover { opacity: .75; }
  .home-news-img { width: 80px; height: 56px; border-radius: 6px; object-fit: cover; flex-shrink: 0; background: var(--surface2); }
  .home-news-placeholder { width: 80px; height: 56px; border-radius: 6px; background: var(--surface2); border: 1px solid var(--border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .home-news-body { flex: 1; }
  .home-news-source { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--accent); margin-bottom: 5px; }
  .home-news-title { font-size: 13px; font-weight: 500; color: var(--text); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .home-news-time { font-size: 11px; color: var(--muted); margin-top: 5px; }

  /* RIGHT */
  .home-right { padding: 32px 24px; display: flex; flex-direction: column; gap: 28px; }

  /* QUAKE */
  .home-quake-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .home-quake-head { padding: 11px 16px; border-bottom: 1px solid var(--border); background: var(--surface2); display: flex; align-items: center; justify-content: space-between; }
  .home-quake-head-left { display: flex; align-items: center; gap: 8px; }
  .home-quake-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--danger); animation: livepulse 1.5s infinite; }
  @keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .home-quake-head-title { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
  .home-quake-source { font-size: 10px; color: var(--border); }
  .home-quake-body { padding: 20px 16px; }
  .home-quake-mag-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px; }
  .home-quake-mag { font-family: var(--font-head); font-size: 52px; font-weight: 800; line-height: 1; }
  .home-quake-mag.low { color: #22c55e; }
  .home-quake-mag.mid { color: var(--accent); }
  .home-quake-mag.high { color: var(--danger); }
  .home-quake-unit { font-size: 14px; color: var(--muted); font-weight: 400; }
  .home-quake-location { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 16px; line-height: 1.4; }
  .home-quake-divider { height: 1px; background: var(--border); margin-bottom: 14px; }
  .home-quake-meta { display: flex; flex-direction: column; gap: 8px; }
  .home-quake-row { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
  .home-quake-lbl { color: var(--muted); }
  .home-quake-val { color: var(--text); font-weight: 500; font-family: monospace; }

  /* EMERGENCY */
  .home-emergency { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .home-emergency-head { padding: 11px 16px; border-bottom: 1px solid var(--border); background: var(--surface2); }
  .home-emergency-head-title { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); }
  .home-emergency-list { padding: 8px 0; }
  .home-emergency-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid var(--border); }
  .home-emergency-item:last-child { border-bottom: none; }
  .home-emergency-name { font-size: 12px; color: var(--muted); }
  .home-emergency-num { font-family: var(--font-head); font-size: 18px; font-weight: 800; color: var(--text); }

  /* ABOUT */
  .home-about { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
  .home-about-title { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .home-about-text { font-size: 12px; color: var(--muted); line-height: 1.8; }
  .home-about-text strong { color: var(--text); }

  /* FOOTER */
  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); }
  .al-footer-l strong { color: var(--accent); }
  .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
`;

const TYPE_CONFIG = {
  GENERAL: { label: "Genel", color: "#63b3ed" },
  URGENT: { label: "Acil", color: "#ef4444" },
  TASK: { label: "Görev", color: "#3ecf5a" },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s önce`;
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

function magClass(mag) {
  const m = Number(mag);
  if (m >= 5) return "high";
  if (m >= 3) return "mid";
  return "low";
}

export default function Home() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "User";

  const [announcements, setAnnouncements] = useState([]);
  const [quake, setQuake] = useState(null);
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/announcements?role=${role}`)
      .then((res) => setAnnouncements(res.data.slice(0, 5)))
      .catch(() => {});

    fetch("https://api.orhanaydogdu.com.tr/deprem/kandilli/live")
      .then((r) => r.json())
      .then((data) => {
        if (data.result?.[0]) setQuake(data.result[0]);
      })
      .catch(() => {});

    fetch(
      `https://newsapi.org/v2/everything?q=%22deprem%22+OR+%22earthquake%22+OR+%22afet%22&language=tr&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.articles) setNews(data.articles);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="home-shell">
        <Header />
        <Sidebar />

        <main className="home-main">
          {/* HERO */}
          <div className="home-hero">
            <div className="home-hero-inner">
              <div className="home-hero-eyebrow">Aegis Platform</div>
              <div className="home-hero-title">
                Afet Yönetim
                <br />
                <span>Koordinasyon</span> Merkezi
              </div>
              <div className="home-hero-desc">
                Türkiye genelinde afet koordinasyonu, gönüllü yönetimi ve kaynak
                dağıtımı için entegre platform. Gerçek zamanlı saha verisi,
                anlık duyurular ve çok katmanlı koordinasyon tek merkezden
                yönetilir.
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="home-content">
            {/* LEFT */}
            <div className="home-left">
              {/* DUYURULAR */}
              <div>
                <div className="home-section-head">
                  <span className="home-section-title">Son Duyurular</span>
                  <button
                    className="home-section-link"
                    onClick={() => navigate("/announcements")}
                  >
                    Tümünü Gör →
                  </button>
                </div>
                <div className="home-ann-list">
                  {announcements.length === 0 ? (
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--muted)",
                        padding: "20px 0",
                      }}
                    >
                      Henüz duyuru yok.
                    </p>
                  ) : (
                    announcements.map((a) => {
                      const tc = TYPE_CONFIG[a.type] || TYPE_CONFIG.GENERAL;
                      return (
                        <div key={a.id} className="home-ann-item">
                          <div className="home-ann-left">
                            <div
                              className="home-ann-type-dot"
                              style={{ background: tc.color }}
                            />
                            <div className="home-ann-date">
                              {timeAgo(a.createdAt)}
                            </div>
                          </div>
                          <div className="home-ann-body">
                            <div
                              className="home-ann-type-label"
                              style={{ color: tc.color }}
                            >
                              {tc.label}
                            </div>
                            <div className="home-ann-title">{a.title}</div>
                            <div className="home-ann-msg">{a.message}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* HABERLER */}
              <div>
                <div className="home-section-head">
                  <span className="home-section-title">Türkiye'den Haberler</span>
                </div>
                <div className="home-news-list">
                  {news.length === 0 ? (
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--muted)",
                        padding: "20px 0",
                      }}
                    >
                      Haberler yükleniyor...
                    </p>
                  ) : (
                    news.map((n, i) => (
                      <div
                        key={i}
                        className="home-news-item"
                        onClick={() => window.open(n.url, "_blank")}
                      >
                        {n.urlToImage ? (
                          <img
                            className="home-news-img"
                            src={n.urlToImage}
                            alt=""
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ) : (
                          <div className="home-news-placeholder">📰</div>
                        )}
                        <div className="home-news-body">
                          <div className="home-news-source">
                            {n.source?.name || "Haber"}
                          </div>
                          <div className="home-news-title">{n.title}</div>
                          <div className="home-news-time">
                            {timeAgo(n.publishedAt)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="home-right">
              {/* SON DEPREM */}
              <div className="home-quake-card">
                <div className="home-quake-head">
                  <div className="home-quake-head-left">
                    <div className="home-quake-live-dot" />
                    <span className="home-quake-head-title">Son Deprem</span>
                  </div>
                  <span className="home-quake-source">
                    Kandilli Rasathanesi
                  </span>
                </div>
                <div className="home-quake-body">
                  {quake ? (
                    <>
                      <div className="home-quake-mag-row">
                        <span
                          className={`home-quake-mag ${magClass(quake.mag)}`}
                        >
                          {Number(quake.mag).toFixed(1)}
                        </span>
                        <span className="home-quake-unit">Mw büyüklüğünde</span>
                      </div>
                      <div className="home-quake-location">{quake.title}</div>
                      <div className="home-quake-divider" />
                      <div className="home-quake-meta">
                        <div className="home-quake-row">
                          <span className="home-quake-lbl">Derinlik</span>
                          <span className="home-quake-val">
                            {quake.depth} km
                          </span>
                        </div>
                        <div className="home-quake-row">
                          <span className="home-quake-lbl">Tarih / Saat</span>
                          <span className="home-quake-val">
                            {quake.date_time}
                          </span>
                        </div>
                        <div className="home-quake-row">
                          <span className="home-quake-lbl">En Yakın İl</span>
                          <span className="home-quake-val">
                            {quake.location_properties?.epiCenter?.name || "—"}
                          </span>
                        </div>
                        <div className="home-quake-row">
                          <span className="home-quake-lbl">En Yakın Şehir</span>
                          <span className="home-quake-val">
                            {quake.location_properties?.closestCity?.name ||
                              "—"}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: 13, color: "var(--muted)" }}>
                      Yükleniyor...
                    </p>
                  )}
                </div>
              </div>

              {/* ACİL NUMARALAR */}
              <div className="home-emergency">
                <div className="home-emergency-head">
                  <span className="home-emergency-head-title">
                    Acil İletişim
                  </span>
                </div>
                <div className="home-emergency-list">
                  {[
                    { name: "Acil Yardım", num: "112" },
                    { name: "AFAD", num: "122" },
                    { name: "Kızılay", num: "168" },
                    { name: "Polis", num: "155" },
                    { name: "İtfaiye", num: "110" },
                  ].map((e) => (
                    <div key={e.num} className="home-emergency-item">
                      <span className="home-emergency-name">{e.name}</span>
                      <span className="home-emergency-num">{e.num}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* HAKKINDA */}
              <div className="home-about">
                <div className="home-about-title">Aegis Nedir?</div>
                <div className="home-about-text">
                  <strong>Aegis</strong>, doğal afet süreçlerinde saha
                  koordinasyonunu, gönüllü yönetimini ve kaynak dağıtımını tek
                  platformda birleştiren bir afet yönetim sistemidir. Gerçek
                  zamanlı veri ve çok katmanlı yetki yapısıyla kriz anında hızlı
                  karar almayı destekler.
                </div>
              </div>
            </div>
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
    </>
  );
}
