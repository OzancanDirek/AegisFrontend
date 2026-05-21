import { useEffect, useRef, useState } from "react";
import { authFetch } from "./authFetch";
import { API_BASE_URL } from "./config";
import Sidebar from "./sidebar";
import Header from "./Header.jsx";



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
  .wm-shell { display: grid; grid-template-rows: var(--header-h) 1fr var(--footer-h); grid-template-columns: var(--sidebar-w) 1fr; grid-template-areas: "header header" "sidebar main" "footer footer"; height: 100vh; width: 100vw; }
  .wm-main { grid-area: main; display: flex; overflow: hidden; }
  .wm-panel { width: 260px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto; z-index: 10; }
  .wm-panel-head { padding: 16px; border-bottom: 1px solid var(--border); background: var(--surface2); }
  .wm-panel-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; color: var(--text); }
  .wm-panel-sub { font-size: 11px; color: var(--muted); margin-top: 3px; }
  .wm-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px 14px; border-bottom: 1px solid var(--border); }
  .wm-stat { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; }
  .wm-stat-label { font-size: 10px; color: var(--muted); letter-spacing: .8px; text-transform: uppercase; }
  .wm-stat-value { font-family: var(--font-head); font-size: 20px; font-weight: 700; margin-top: 2px; }
  .wm-list { display: flex; flex-direction: column; padding: 8px 0; flex: 1; }
  .wm-list-title { font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted); padding: 8px 16px 4px; }
  .wm-item { padding: 10px 16px; cursor: pointer; transition: background .15s; border-left: 3px solid transparent; }
  .wm-item:hover { background: var(--surface2); }
  .wm-item.selected { background: rgba(245,166,35,.08); border-left-color: var(--accent); }
  .wm-item-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .wm-item-location { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .wm-item-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
  .wm-status-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
  .wm-status-ACTIVE { background: rgba(62,207,90,.1); color: #3ecf5a; border: 1px solid rgba(62,207,90,.3); }
  .wm-status-FULL { background: rgba(245,166,35,.1); color: var(--accent); border: 1px solid rgba(245,166,35,.3); }
  .wm-status-INACTIVE { background: rgba(107,128,153,.1); color: var(--muted); border: 1px solid rgba(107,128,153,.3); }
  .wm-no-coord { font-size: 10px; color: #ef4444; }
  .wm-capacity { font-size: 11px; color: var(--muted); }
  .wm-map-container { flex: 1; position: relative; }
  #wm-leaflet-map { width: 100%; height: 100%; }
  .wm-loading { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; background: var(--bg); z-index: 500; }
  .wm-loading-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }
  .wm-loading-txt { font-size: 13px; color: var(--muted); }
  .wm-no-coord-info { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 8px 16px; font-size: 12px; color: var(--muted); z-index: 400; white-space: nowrap; }
  .warehouse-pin { width: 32px; height: 32px; background: #F5A623; border: 2px solid #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 3px 10px rgba(0,0,0,.5); cursor: pointer; transition: transform .15s; }
  .warehouse-pin:hover { transform: scale(1.15); }
  .warehouse-pin.full { background: #ef4444; }
  .warehouse-pin.inactive { background: #6b8099; }
  .leaflet-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; }
  .leaflet-container { background: #0d1117 !important; }
  .leaflet-control-zoom a { background: #161d27 !important; color: #e8f0fe !important; border-color: #253045 !important; }
  .leaflet-control-zoom a:hover { background: #1e2a3a !important; }
  .al-footer { grid-area: footer; background: var(--surface); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; }
  .al-footer-l { font-size: 12px; color: var(--muted); } .al-footer-l strong { color: var(--accent); } .al-footer-r { font-size: 12px; color: var(--muted); }
  .al-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #3ecf5a; margin-right: 7px; animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  .wm-empty { padding: 24px 16px; text-align: center; color: var(--muted); font-size: 13px; }
`;

let leafletLoadPromise = null;

function loadLeaflet() {
  if (window.L) return Promise.resolve();
  if (leafletLoadPromise) return leafletLoadPromise;
  leafletLoadPromise = new Promise((resolve, reject) => {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve();
    script.onerror = () => {
      leafletLoadPromise = null;
      reject(new Error("Leaflet yüklenemedi"));
    };
    document.head.appendChild(script);
  });
  return leafletLoadPromise;
}

// Natural Earth 50m'den Türkiye sınırını çek — sadece ülke konturu (ADM0)
async function fetchTurkeyBorder() {
  const res = await fetch(
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson",
  );
  const data = await res.json();
  return data.features.find(
    (f) => f.properties.ISO_A3 === "TUR" || f.properties.NAME === "Turkey",
  );
}

export default function WarehouseMap() {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef([]);
  const circlesRef = useRef([]);
  const borderRef = useRef(null);

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [mapError, setMapError] = useState(false);

  const withCoords = warehouses.filter((w) => w.latitude && w.longitude);
  const noCoords = warehouses.filter((w) => !w.latitude || !w.longitude);
  const activeCount = warehouses.filter((w) => w.status === "ACTIVE").length;
  const fullCount = warehouses.filter((w) => w.status === "FULL").length;

  useEffect(() => {
    authFetch(`${API_BASE_URL}/warehouse/getAllWarehouse`)
      .then((r) => r.json())
      .then((data) => setWarehouses(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let destroyed = false;

    const initMap = async () => {
      let attempts = 0;
      while (!mapRef.current && attempts < 20) {
        await new Promise((r) => setTimeout(r, 50));
        attempts++;
      }
      if (!mapRef.current || destroyed) return;

      try {
        await loadLeaflet();
      } catch {
        if (!destroyed) setMapError(true);
        return;
      }

      if (destroyed || leafletRef.current) return;

      const L = window.L;
      const map = L.map(mapRef.current, {
        center: [39.0, 35.5],
        zoom: 6,
        zoomControl: true,
        attributionControl: false,
      });

      // Karanlık tile — Türkiye diğer ülkelerle aynı tonda
      L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
        { maxZoom: 20 },
      ).addTo(map);

      leafletRef.current = map;

      // Türkiye sınır konturu — sadece ince çizgi, fill yok
      try {
        const turkey = await fetchTurkeyBorder();
        if (!destroyed && turkey && leafletRef.current) {
          const border = L.geoJSON(turkey, {
            style: {
              color: "rgba(255,255,255,0.55)", // beyazın donuk tonu — tile'dan ayrışır ama bağırmaz
              weight: 1.5,
              fill: false,
              interactive: false,
            },
          }).addTo(leafletRef.current);
          borderRef.current = border;
        }
      } catch {
        // sınır yüklenemezse sessizce devam et
      }

      setTimeout(() => {
        if (!destroyed && leafletRef.current)
          leafletRef.current.invalidateSize();
      }, 150);
    };

    initMap();

    return () => {
      destroyed = true;
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (warehouses.length === 0) return;

    const addMarkers = async () => {
      let attempts = 0;
      while (!leafletRef.current && attempts < 30) {
        await new Promise((r) => setTimeout(r, 100));
        attempts++;
      }
      if (!leafletRef.current || !window.L) return;

      const L = window.L;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      circlesRef.current.forEach((c) => c.remove());
      circlesRef.current = [];

      withCoords.forEach((w) => {
        const pinClass =
          w.status === "FULL"
            ? "full"
            : w.status === "INACTIVE"
              ? "inactive"
              : "";
        const statusLabel =
          w.status === "ACTIVE"
            ? "Aktif"
            : w.status === "FULL"
              ? "Dolu"
              : "Pasif";
        const statusColor =
          w.status === "ACTIVE"
            ? "#3ecf5a"
            : w.status === "FULL"
              ? "#ef4444"
              : "#6b8099";

        const icon = L.divIcon({
          html: `<div class="warehouse-pin ${pinClass}">📦</div>`,
          className: "",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([Number(w.latitude), Number(w.longitude)], {
          icon,
        })
          .addTo(leafletRef.current)
          .bindTooltip(
            `<div style="background:#161d27;border:1px solid #F5A623;border-radius:8px;padding:10px 14px;font-family:'DM Sans',sans-serif;min-width:180px">
              <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#F5A623;margin-bottom:6px">📦 ${w.name}</div>
              <div style="font-size:11px;color:#6b8099;margin-bottom:4px">${[w.district, w.city].filter(Boolean).join(", ") || "—"}</div>
              <div style="font-size:11px;display:flex;justify-content:space-between;padding:3px 0;border-top:1px solid #253045;margin-top:4px">
                <span style="color:#6b8099">Durum</span>
                <span style="color:${statusColor};font-weight:600">${statusLabel}</span>
              </div>
              ${w.capacityM3 ? `<div style="font-size:11px;display:flex;justify-content:space-between;padding:3px 0;border-top:1px solid #253045"><span style="color:#6b8099">Kapasite</span><span style="color:#e8f0fe">${w.capacityM3} m³</span></div>` : ""}
            </div>`,
            { sticky: true, className: "leaflet-tooltip" },
          )
          .on("click", () => setSelectedId(w.warehouseId));

        markersRef.current.push(marker);

        const circle = L.circle([Number(w.latitude), Number(w.longitude)], {
          radius: 1500,
          color: statusColor,
          fillColor: statusColor,
          fillOpacity: 0.06,
          weight: 1,
          opacity: 0.25,
        }).addTo(leafletRef.current);

        circlesRef.current.push(circle);
      });

      if (borderRef.current) borderRef.current.bringToBack();
    };

    addMarkers();
  }, [warehouses]);

  const handleSelectWarehouse = (w) => {
    setSelectedId(w.warehouseId);
    if (w.latitude && w.longitude && leafletRef.current) {
      leafletRef.current.flyTo([Number(w.latitude), Number(w.longitude)], 13, {
        duration: 1,
      });
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="wm-shell">
        <Header />
        <Sidebar />

        <main className="wm-main">
          <div className="wm-panel">
            <div className="wm-panel-head">
              <div className="wm-panel-title">Depo Haritası</div>
              <div className="wm-panel-sub">
                {warehouses.length} depo · {withCoords.length} konumlu
              </div>
            </div>

            <div className="wm-stats">
              <div className="wm-stat">
                <div className="wm-stat-label">Aktif</div>
                <div className="wm-stat-value" style={{ color: "#3ecf5a" }}>
                  {activeCount}
                </div>
              </div>
              <div className="wm-stat">
                <div className="wm-stat-label">Dolu</div>
                <div className="wm-stat-value" style={{ color: "#ef4444" }}>
                  {fullCount}
                </div>
              </div>
            </div>

            <div className="wm-list">
              {loading ? (
                <div className="wm-empty">Yükleniyor...</div>
              ) : warehouses.length === 0 ? (
                <div className="wm-empty">Depo bulunamadı</div>
              ) : (
                <>
                  {withCoords.length > 0 && (
                    <>
                      <div className="wm-list-title">Konumlu Depolar</div>
                      {withCoords.map((w) => (
                        <div
                          key={w.warehouseId}
                          className={`wm-item ${selectedId === w.warehouseId ? "selected" : ""}`}
                          onClick={() => handleSelectWarehouse(w)}
                        >
                          <div className="wm-item-name">{w.name}</div>
                          <div className="wm-item-location">
                            {[w.district, w.city].filter(Boolean).join(", ") ||
                              "—"}
                          </div>
                          <div className="wm-item-footer">
                            <span
                              className={`wm-status-badge wm-status-${w.status || "ACTIVE"}`}
                            >
                              {w.status === "ACTIVE"
                                ? "Aktif"
                                : w.status === "FULL"
                                  ? "Dolu"
                                  : "Pasif"}
                            </span>
                            {w.capacityM3 && (
                              <span className="wm-capacity">
                                {w.capacityM3} m³
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {noCoords.length > 0 && (
                    <>
                      <div className="wm-list-title" style={{ marginTop: 8 }}>
                        Koordinat Eksik
                      </div>
                      {noCoords.map((w) => (
                        <div key={w.warehouseId} className="wm-item">
                          <div
                            className="wm-item-name"
                            style={{ color: "var(--muted)" }}
                          >
                            {w.name}
                          </div>
                          <div className="wm-item-location">
                            {[w.district, w.city].filter(Boolean).join(", ") ||
                              "—"}
                          </div>
                          <div className="wm-item-footer">
                            <span className="wm-no-coord">
                              📍 Koordinat yok
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="wm-map-container">
            {loading && (
              <div className="wm-loading">
                <div className="wm-loading-dot" />
                <span className="wm-loading-txt">Harita yükleniyor...</span>
              </div>
            )}
            {mapError && (
              <div className="wm-loading">
                <span className="wm-loading-txt" style={{ color: "#ef4444" }}>
                  ⚠ Harita yüklenemedi. İnternet bağlantınızı kontrol edin.
                </span>
              </div>
            )}
            <div id="wm-leaflet-map" ref={mapRef} />
            {noCoords.length > 0 && (
              <div className="wm-no-coord-info">
                ⚠ {noCoords.length} deponun koordinatı eksik — Depolar
                sayfasından düzenleyebilirsiniz.
              </div>
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
    </>
  );
}
