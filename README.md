# Aegis Frontend

> **Post-Disaster Neighborhood Solidarity and Resource Management System** — React + Vite

Backend repository: [AegisBackend](https://github.com/OzancanDirek/AegisBackend)

---

## About

Aegis is a multi-actor management system designed to answer critical questions during a disaster:

- Who is where, who is safe, who needs help?
- Which buildings are at risk, which households have elderly / children / disabled individuals?
- Which volunteer has which skills, how much stock is in each warehouse?
- Who submitted an aid request, who took it, when was it resolved?

This repository contains the **React-based frontend** of the application.

---

## Screens

| Screen | Description |
|---|---|
| **Dashboard** | Active requests, critical stock alerts, volunteer and risk summary |
| **User Management** | System users list and details |
| **Role Management** | Role assignment panel for users |
| **Volunteers** | Volunteer list and profile details |
| **Skills** | Skill and expertise definitions |
| **Address Management** | Add, edit and delete addresses |
| **Special Needs** | Assign special needs to residents |
| **Risk Map** | Province-based earthquake risk map + live earthquake data |
| **Warehouses** | Stock and warehouse management |

---

## Risk Map Features

- All 81 provinces of Turkey categorized into 5 risk levels based on AFAD earthquake zone data
- Filter by risk level (Very High / High / Medium / Low)
- Click on a province to see fault line, population and active request info
- **Live earthquake data** via [api.orhanaydogdu.com.tr](https://api.orhanaydogdu.com.tr) — Kandilli Observatory

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Routing | React Router DOM |
| HTTP | Fetch API / Axios |
| Map | Leaflet.js |
| Styling | CSS-in-JS (inline CSS strings) |
| Fonts | Syne + DM Sans (Google Fonts) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend service running

### Steps

```bash
git clone https://github.com/OzancanDirek/AegisFrontend.git
cd AegisFrontend
npm install
npm run dev
```

App will be available at `http://localhost:5173`.

### Map setup

The risk map requires a WGS84 Turkey province GeoJSON file:

1. Download for free from [simplemaps.com/gis/country/tr](https://simplemaps.com/gis/country/tr)
2. Save the file as `public/tr-cities.json`

---

## Backend

| | |
|---|---|
| API Base URL | `http://localhost:8080/api` |
| Backend Repo | [AegisBackend](https://github.com/OzancanDirek/AegisBackend) |

### Key Endpoints Used

```
GET    /api/residents/all
POST   /api/residents/{id}/special-needs
GET    /api/special-needs/all
GET    /api/addresses/allAdresses
POST   /api/addresses
PUT    /api/addresses/{id}
DELETE /api/addresses/{id}
GET    /api/UserRole/users
GET    /api/UserRole/all
POST   /api/UserRole/assign
```

---

## User Roles

`ADMIN` · `MODERATOR` · `USER` · `GUEST` · `Neighborhood Coordinator` · `Volunteer` · `Warehouse Manager`

---

## Project Structure

```
aegis-frontend/
├── public/
│   └── tr-cities.json         # Turkey province GeoJSON (add manually)
├── src/
│   ├── images/                # Logo and assets
│   ├── adminDashboard.jsx     # Main dashboard
│   ├── adminUsers.jsx         # User list
│   ├── Adress.jsx             # Address management
│   ├── mapPage.jsx            # Risk map
│   ├── ResidentSpecialNeeds.jsx
│   ├── RoleManager.jsx
│   ├── sidebar.jsx            # Global sidebar
│   ├── volunteers.jsx
│   ├── skills.jsx
│   └── main.jsx               # Route definitions
├── index.html
├── package.json
└── vite.config.js
```

---

## Design System

All pages share a consistent dark theme:

| Token | Value |
|---|---|
| Background | `#0d1117` |
| Surface | `#161d27` |
| Accent | `#F5A623` |
| Text | `#e8f0fe` |
| Muted | `#6b8099` |
| Heading Font | Syne 800 |
| Body Font | DM Sans 400/500 |

---

## Notes

- Backend CORS is configured for `http://localhost:5173`
- Application is currently in development
- Some data (e.g. active request count) is static for now and will be fetched dynamically from the backend in future iterations

---

*Aegis Disaster Management System · v1.0.0 · 2026*
