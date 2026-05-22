# Aegis Frontend

React-based frontend for the **Aegis Disaster Management System**, developed to support post-earthquake relief coordination through role-based operations, warehouse management, volunteer tracking, aid request handling, and real-time disaster monitoring.

---

## Highlights

- JWT Authentication & Authorization
- Role-Based Access Control (RBAC)
- Interactive Earthquake Risk Map
- Warehouse & Inventory Management
- Volunteer Assignment Tracking
- Kanban Task Management
- Real-Time Disaster Coordination
- Audit Logging & Activity Tracking
- Responsive Dashboard Experience

---

## Screenshots

### Authentication

<img width="1703" height="942" alt="Login" src="https://github.com/user-attachments/assets/67c7b9e0-1371-46bb-81c9-0f6ccf83c2a4" />

### Admin Dashboard

<img width="1706" height="1026" alt="AdminDashboard" src="https://github.com/user-attachments/assets/b081c49b-006b-4070-9d65-ff467dac7439" />

### Earthquake Risk Map

<img width="1706" height="1027" alt="Map" src="https://github.com/user-attachments/assets/806fff1b-5fc4-4540-9e1e-2fdb50ebd671" />

### Warehouse Coverage Map

<img width="3412" height="2056" alt="WarehouseMap" src="https://github.com/user-attachments/assets/369bf3de-2e5c-4127-af08-a1bc2061c753" />

### Warehouse Stock

<img width="1703" height="1031" alt="WarehouseStock" src="https://github.com/user-attachments/assets/d9870c02-239d-4b5c-b60b-6048545e7f54" />


### Aid Requests

<img width="1706" height="1029" alt="Requests" src="https://github.com/user-attachments/assets/2f10d6de-755d-402e-9b20-d75bce91039c" />

### Volunteer Management

<img width="1708" height="1028" alt="Volunteers" src="https://github.com/user-attachments/assets/c2157757-49b5-4129-8b0f-c6f729369943" />

### Notifications

<img width="1705" height="1005" alt="Notifications" src="https://github.com/user-attachments/assets/49e6ee3d-8893-4dd6-861f-c0eb7b59f270" />

### Adresses
<img width="1710" height="1030" alt="Adresses" src="https://github.com/user-attachments/assets/be514c2b-13ff-4c01-8087-81a8de33f7cc" />


---

## Tech Stack

### Frontend

- React 18
- Vite
- React Router DOM
- Axios
- Leaflet.js
- JWT Authentication

### Mapping & Visualization

- Leaflet Maps
- Stadia Maps Dark Tiles
- Kandilli Observatory Earthquake Data

---

## Features

### Role-Based Dashboards

Each user role has a dedicated dashboard and navigation structure.

| Role | Dashboard | Access |
|--------|--------|--------|
| Admin | Command Center | Full system access |
| Calisan | Operations Dashboard | Assignments, requests, warehouses |
| Gonullu | Volunteer Dashboard | Personal assignments |
| Depremzede | Aid Request Dashboard | Personal requests |
| Warehouse Manager | Warehouse Dashboard | Assigned warehouses |

### Core Modules

- User Authentication & Registration
- Role Management
- Volunteer Management
- Team Management
- Aid Request Management
- Warehouse Management
- Inventory Tracking
- Assignment Board (Kanban)
- Announcement System
- Notification Center
- Audit Logging
- User Profile Management

### Interactive Maps

#### Risk Map

- Turkey earthquake risk visualization
- Live earthquake feed integration
- Geographic risk monitoring

#### Warehouse Map

- Warehouse locations visualization
- Coverage radius display
- Resource distribution planning

### Audit Logging

Administrative activity tracking with:

- Action filtering
- Module filtering
- User activity monitoring
- System transparency

---

## Application Pages

| Page | Route | Access |
|--------|--------|--------|
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
| Audit Logs | `/audit-logs` | Admin |
| Profile | `/profile` | Authenticated |
| Role Manager | `/admin/roles` | Admin |
| Announcements | `/announcements` | Authenticated |

---

## Project Structure

```text
src/
├── authFetch.js          # Authenticated fetch wrapper
├── config.js             # API configuration
├── main.jsx              # Router definitions
├── sidebar.jsx           # Role-based navigation
├── Header.jsx            # Top navigation
├── login.jsx
├── adminDashboard.jsx
├── assignments.jsx
├── warehouse.jsx
├── warehouseMap.jsx
├── mapPage.jsx
├── auditLog.jsx
├── Profile.jsx
├── volunteers.jsx
├── teams.jsx
├── requests.jsx
├── RoleManager.jsx
└── ...
```

---

## Authentication

- JWT tokens stored in localStorage
- Access token expiration management
- Automatic logout on 401/403 responses
- Protected routes based on user roles
- Role-aware navigation rendering

---

## Prerequisites

- Node.js 18+
- npm or yarn
- Aegis Backend running on `http://localhost:8080`

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/OzancanDirek/AegisFrontend.git
cd AegisFrontend
```

### Install Dependencies

```bash
npm install
```

### Configure API Endpoint

Edit:

```javascript
src/config.js
```

```javascript
export const API_BASE_URL = "http://localhost:8080/api";
```

### Start Development Server

```bash
npm run dev
```

Application will be available at:

```text
http://localhost:5173
```

---

## Production Build

```bash
npm run build
```

Compiled output will be generated inside:

```text
dist/
```

---

## Backend Repository

Aegis Frontend communicates with the Aegis Backend API for authentication, disaster management operations, warehouse tracking, volunteer coordination, and audit logging.

```

Bu sürüm hem GitHub'da profesyonel görünür hem de LinkedIn'den gelen birinin projeyi hızlıca anlamasını sağlar. Özellikle **Highlights + Screenshots + Features** sıralaması recruiter'ların en çok baktığı düzenlerden biridir.
