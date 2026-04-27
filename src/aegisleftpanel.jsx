import AegisLogo from "./images/Aegislogo.jpeg";

const features = [
  "Hane & Birey Takibi",
  "Gönüllü Eşleştirme",
  "Depo & Stok Yönetimi",
  "Toplanma Alanları",
  "Bina Risk Raporları",
  "Anlık İhbar Paneli",
];

export default function AegisLeftPanel() {
  return (
    <div className="ag-left">
      <div>
        <div className="ag-logo-row">
          <img
            src={AegisLogo}
            alt="Aegis"
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              objectFit: "cover",
            }}
          />
          <span className="ag-wordmark">AEGIS</span>
        </div>

        <div className="ag-badge">
          <span>AFET YÖNETİM SİSTEMİ</span>
        </div>

        <h1>
          Kriz anında koordinasyon
          <br />
          artık tek platformda
        </h1>
        <p>
          Gönüllü eşleştirme, yardım talebi yönetimi, stok takibi ve riskli bina
          raporlarını anlık olarak yönetin.
        </p>
      </div>

      <div>
        <div className="ag-features">
          {features.map((f) => (
            <div className="ag-feat" key={f}>
              <div className="ag-feat-dot" />
              <span>{f}</span>
            </div>
          ))}
        </div>
        <p className="ag-copyright">©️ 2026 Aegis. Tüm hakları saklıdır.</p>
      </div>
    </div>
  );
}
