# NEXORA — Enterprise ERP Management System

> **"One Platform. Every Operation."**

NEXORA is a modern, enterprise-grade **Company ERP (Enterprise Resource Planning) System** frontend built with React, Vite, Tailwind CSS, Framer Motion, and Recharts.

It provides role-specific dashboards, workflows, and permissions across five corporate tiers:
1. 🛡️ **Super Admin** — Unified root control, system telemetry, cross-department access across Owner, HR, and Manager operations.
2. 👑 **Company Owner** — Executive oversight, revenue/expense P&L, headcount analytics, audit logs, and governance.
3. 👥 **HR Director** — Human capital, recruitment Kanban pipeline, onboarding checklists, training LMS, documents repository.
4. 📊 **Team Manager** — Engineering sprints, task delegation (Kanban/Table), project milestones, team velocity, leave reviews.
5. 👤 **Staff Employee** — Personal work portal, interactive attendance clock-in/out, task delivery, PTO applications, official payslip viewer.

---

## 🚀 Quick Start

Run the application locally in seconds:

```bash
# 1. Install dependencies
npm install

# 2. Launch Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Verified Demo Accounts

The login screen features an **interactive persona selector** with one-click demo account autofill:

| Role | Persona | Email | Password | Dedicated Landing Dashboard |
| :--- | :--- | :--- | :--- | :--- |
| **🛡️ Super Admin** | System Administrator | `admin@company.com` | `admin123` | `/admin/dashboard` |
| **👑 Company Owner** | Saurabh Kumar (CEO) | `owner@company.com` | `owner123` | `/owner/dashboard` |
| **👥 HR Director** | Sophia Montgomery (VP HR) | `hr@company.com` | `hr123` | `/hr/dashboard` |
| **📊 Team Manager** | Marcus Sterling (Eng. Lead) | `manager@company.com` | `manager123` | `/manager/dashboard` |
| **👤 Staff Employee** | Elena Rostova (Sr. Engineer) | `employee@company.com` | `employee123` | `/employee/dashboard` |

---

## 🌟 Key Features & Functional Modules

### 1. Interactive Architecture & Zero Dead Buttons
* **Full LocalStorage Persistence**: Every action (Adding employees, updating tasks, approving leaves, clocking in, changing themes) persists automatically across reloads.
* **Role-Based Route Protection**: Strict `ProtectedRoute` ensures users can only access modules authorized for their active clearance level (with custom `AccessDenied` fallback).
* **Smooth Framer Motion Animated Cursor**: Custom double-ring cursor with hover scaling, spring physics, and automatic disable on touch/mobile devices.
* **Global Command Palette / Search (`Cmd+K` / `Ctrl+K`)**: Live search across Employees, Tasks, Projects, Departments, and Announcements with instant keyboard navigation.
* **Real-time Attendance Clock & Office WiFi Geofence**: Employees can ONLY mark attendance when connected to an authorized Company Office WiFi (`NEXORA-CORP-5G`, etc.). External, home, and mobile hotspot connections are automatically blocked with real-time audit logging and interactive network switcher for testing.
* **Official Payslip Viewer**: Print-optimized and CSV-exportable payslip modal with earnings, tax withholdings, and net pay breakdown.
* **Recruitment Pipeline Kanban**: 6-stage candidate pipeline (`Applied` ➔ `Screening` ➔ `Interview` ➔ `Selected` ➔ `Hired` ➔ `Rejected`) with stage movement controls.
* **Audit Logging Engine**: Automatically records system mutations with timestamps, actor names, and module labels.
* **Dual Theme Engine**: Persistent Dark and Light modes with deep navy/slate glassmorphism and crisp typography.

---

## 📁 Project Structure

```text
Company Erp System/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ERPContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── ToastContext.jsx
│   ├── data/
│   │   ├── users.js
│   │   ├── employees.js
│   │   ├── departments.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   ├── attendance.js
│   │   ├── leaves.js
│   │   ├── payroll.js
│   │   ├── announcements.js
│   │   ├── notifications.js
│   │   ├── recruitment.js
│   │   ├── performance.js
│   │   └── auditLogs.js
│   ├── components/
│   │   ├── AnimatedCursor.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TopNavbar.jsx
│   │   ├── ERPLayout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── DataTable.jsx
│   │   ├── StatCard.jsx
│   │   ├── ChartCard.jsx
│   │   ├── Modal.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── GlobalSearchModal.jsx
│   │   ├── NotificationPanel.jsx
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Badge.jsx
│   │   └── Avatar.jsx
│   │   └── modals/
│   │       ├── EmployeeModal.jsx
│   │       ├── TaskModal.jsx
│   │       ├── ProjectModal.jsx
│   │       ├── DepartmentModal.jsx
│   │       ├── LeaveRequestModal.jsx
│   │       ├── PayslipViewModal.jsx
│   │       └── AnnouncementModal.jsx
│   └── pages/
│       ├── Login.jsx
│       ├── AccessDenied.jsx
│       ├── owner/
│       ├── hr/
│       ├── manager/
│       └── employee/
```

---

## 🛠️ Technology Stack

- **React 18** (Functional Components, Hooks, Context API)
- **Vite 5** (Fast Bundling & Hot Module Replacement)
- **React Router DOM v6** (Nested & Protected Routes)
- **Tailwind CSS v3** (Utility-first Modern Enterprise Theme)
- **Framer Motion** (Page transitions, modals, interactive cursor)
- **Recharts** (Area, Bar, Line, and Pie visual telemetry)
- **Lucide React** (Clean modern icon system)
