# Aegis — Afet Sonrası Mahalle Dayanışma ve Kaynak Yönetim Sistemi

> **"Dayanıklı Şehir"** — Deprem, sel, yangın ve büyük kriz anlarında mahallelerin organize olmasını ve kaynakların yönetilmesini sağlayan dijital platform.

---

## 🧭 Proje Hakkında

Aegis, afet anında kritik soruları yanıtlamak için tasarlanmış çok aktörlü bir yönetim sistemidir:

- Kim nerede, kim güvende, kim yardıma muhtaç?
- Hangi binada risk var, hangi ailede yaşlı / çocuk / engelli birey var?
- Hangi gönüllü ne iş biliyor, hangi depoda ne kadar stok var?
- Yardım talebi kimden geldi, kim üstlendi, ne zaman çözüldü?

Bu repository projenin **React tabanlı frontend** uygulamasını içermektedir.

---

## 🖥️ Ekranlar

| Ekran | Açıklama |
|---|---|
| **Dashboard** | Aktif talepler, kritik stok uyarıları, gönüllü ve risk özeti |
| **Kullanıcı Yönetimi** | Sistem kullanıcıları listesi ve detayları |
| **Rol Yönetimi** | Kullanıcılara rol atama paneli |
| **Gönüllüler** | Gönüllü listesi ve profil bilgileri |
| **Yetenekler** | Yetenek/uzmanlık tanımları |
| **Adres Yönetimi** | Adres ekleme, düzenleme, silme |
| **Özel İhtiyaçlar** | Sakinlere özel ihtiyaç atama |
| **Risk Haritası** | Türkiye il bazlı deprem risk haritası + canlı son deprem verisi |
| **Depolar** | Stok ve depo yönetimi |

---

## 🗺️ Risk Haritası Özellikleri

- Türkiye'nin 81 ili AFAD deprem bölgesi verisine göre 5 risk seviyesine ayrılmış
- Risk seviyesine göre filtreleme (Çok Yüksek / Yüksek / Orta / Düşük)
- İle tıklayınca fay hattı, nüfus ve aktif talep bilgisi
- **Canlı son deprem verisi** — [api.orhanaydogdu.com.tr](https://api.orhanaydogdu.com.tr) üzerinden Kandilli Rasathanesi verisi

---

## 🛠️ Teknoloji Stack

| Katman | Teknoloji |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Routing | React Router DOM |
| HTTP | Fetch API / Axios |
| Harita | Leaflet.js |
| Stil | CSS-in-JS (inline CSS strings) |
| Font | Syne + DM Sans (Google Fonts) |

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Backend servisinin çalışıyor olması

### Adımlar

```bash
# Repoyu klonla
git clone https://github.com/OzancanDirek/AegisFrontend.git
cd AegisFrontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

---

## 🔗 Backend

Bu frontend aşağıdaki backend servisiyle çalışmaktadır:

| Servis | URL |
|---|---|
| API Base URL | `http://localhost:8080/api` |
| Backend Repo | *(backend repository linki buraya eklenecek)* |

### Kullanılan Başlıca Endpointler

```
GET  /api/residents/all
POST /api/residents/{id}/special-needs
GET  /api/special-needs/all
GET  /api/addresses/allAdresses
POST /api/addresses
PUT  /api/addresses/{id}
DELETE /api/addresses/{id}
GET  /api/UserRole/users
GET  /api/UserRole/all
POST /api/UserRole/assign
```

---

## 👥 Roller

Sistem aşağıdaki kullanıcı rollerini desteklemektedir:

`ADMIN` · `MODERATOR` · `USER` · `GUEST` · `Mahalle Koordinatörü` · `Gönüllü` · `Depo Sorumlusu`

---

## 📁 Proje Yapısı

```
aegis-frontend/
├── public/
│   
├── src/
│   ├── images/               # Logo ve görseller
│   ├── adminDashboard.jsx    # Ana dashboard
│   ├── adminUsers.jsx        # Kullanıcı listesi
│   ├── Adress.jsx            # Adres yönetimi
│   ├── mapPage.jsx           # Risk haritası
│   ├── ResidentSpecialNeeds.jsx
│   ├── RoleManager.jsx
│   ├── sidebar.jsx           # Global sidebar
│   ├── volunteers.jsx
│   ├── skills.jsx
│   └── main.jsx              # Route tanımları
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎨 Tasarım Sistemi

Tüm sayfalar tutarlı bir dark theme üzerine inşa edilmiştir:

| Token | Değer |
|---|---|
| Background | `#0d1117` |
| Surface | `#161d27` |
| Accent | `#F5A623` |
| Text | `#e8f0fe` |
| Muted | `#6b8099` |
| Font Heading | Syne 800 |
| Font Body | DM Sans 400/500 |

---

## 📌 Notlar

- Backend CORS ayarı `http://localhost:5173` için yapılandırılmıştır
- Uygulama şu an geliştirme aşamasındadır
- Aktif talep sayısı gibi bazı veriler henüz statik, ilerleyen aşamada backend'den dinamik çekilecek

---

*Aegis Afet Yönetim Sistemi · v1.0.0 · 2026*
