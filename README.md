# Aegis Frontend

React-based frontend for the Aegis Disaster Management System. Built for post-earthquake relief coordination with role-based dashboards, interactive maps, and real-time data.

## Tech Stack

- React 18 + Vite
- React Router DOM
- Leaflet.js — interactive maps
- Axios
- JWT authentication

## Prerequisites

- Node.js 18+
- npm or yarn
- Aegis Backend running on `http://localhost:8080`

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/OzancanDirek/AegisFrontend.git
cd AegisFrontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API URL

Edit `src/config.js`:

```javascript
export const API_BASE_URL = "http://localhost:8080/api";
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Features

### Role-Based Dashboards
Each user role has a dedicated dashboard and navigation:

| Role | Dashboard | Access |
|------|-----------|--------|
| Admin | Command center with live stats | Full access |
| Calisan | Operational view | Assignments, requests, warehouses |
| Gonullu | Volunteer dashboard | Own assignments |
| Depremzede | Aid request management | Own requests |
| WAREHOUSE_MANAGER | Warehouse overview | Own warehouses |

### Pages

| Page | Route | Access |
|------|-------|--------|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Home | `/home` | Authenticated |
| Admin Dashboard | `/adminDashboard` | Admin, Calisan |
| Aid Requests | `/requests` | Authenticated |
| Assignments (Kanban) | `/assignments` | Admin, Calisan |
| Volunteers | `/volunteers` | Admin |
| Teams | `/teams` | Admin, Calisan |
| Warehouses | `/warehouses` | Authenticated |
| Warehouse Map | `/warehouse-map` | Admin, Calisan |
| Risk Map | `/map` | Authenticated |
| Inventory | `/inventory` | Authenticated |
| Audit Log | `/audit-logs` | Admin |
| Profile | `/profile` | Authenticated |
| Role Manager | `/admin/roles` | Admin |
| Announcements | `/announcements` | Authenticated |

### Maps
- **Risk Map** — Turkey earthquake risk zones with live Kandilli Observatory earthquake data
- **Warehouse Map** — Warehouse locations with coverage radius circles, powered by Stadia Maps dark tile

### Audit Log
Admin-only page showing all system activity with filters by action type and module.

## Project Structure

```
src/
├── authFetch.js          # Authenticated fetch wrapper (auto logout on 401/403)
├── config.js             # API base URL
├── main.jsx              # Router and route definitions
├── sidebar.jsx           # Role-based navigation
├── Header.jsx            # Top navigation bar
├── login.jsx
├── adminDashboard.jsx
├── assignments.jsx       # Kanban board
├── warehouse.jsx         # Warehouse + inventory management
├── warehouseMap.jsx      # Warehouse map with Leaflet
├── mapPage.jsx           # Turkey risk map
├── auditLog.jsx
├── Profile.jsx
├── volunteers.jsx
├── teams.jsx
├── requests.jsx
├── RoleManager.jsx
└── ...
```

## Authentication

- JWT tokens stored in `localStorage`
- Access token expires in 1 hour
- Auto logout on 401/403 responses via `authFetch.js`

## Build

```bash
npm run build
```

Output will be in the `dist/` folder.
