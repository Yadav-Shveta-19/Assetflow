# AssetFlow - Enterprise Asset & Resource Management System

> **AssetFlow** is a full-stack Enterprise Asset & Resource Management System developed for the **Odoo Hackathon 2026**. The application digitizes the complete lifecycle of organizational assets and shared resources through role-based workflows, centralized management, and real-time operational visibility.

---

##  Overview

Managing physical assets using spreadsheets or paper records often leads to duplicate allocations, scheduling conflicts, poor maintenance tracking, and limited visibility.

AssetFlow addresses these challenges by providing a centralized ERP platform where organizations can:

* Register and manage assets
* Allocate assets to employees and departments
* Book shared resources without scheduling conflicts
* Manage maintenance approval workflows
* Conduct structured asset audits
* Track asset lifecycle and history
* Generate operational reports
* Maintain complete activity logs

The platform is designed with modular architecture, secure authentication, and role-based access control to ensure scalability and maintainability.

---

#  Features

##  Authentication & Authorization

* Secure User Registration
* Email & Password Login
* JWT Authentication
* Refresh Token Support
* Forgot & Reset Password
* Email Verification
* Role-Based Access Control (RBAC)

---

##  Organization Setup

* Department Management
* Asset Category Management
* Employee Directory
* Role Assignment
* Department Hierarchy

---

##  Asset Management

* Asset Registration
* Auto-generated Asset Tags
* QR Code Generation
* Asset Directory
* Asset Search & Filters
* Asset Lifecycle Tracking
* Asset History

Asset Lifecycle:

```text
Available
    │
Allocated
    │
Returned
    │
Available

Available
    │
Under Maintenance
    │
Available

Available
    ├── Lost
    ├── Retired
    └── Disposed
```

---

##  Asset Allocation & Transfer

* Allocate Assets
* Return Assets
* Transfer Requests
* Transfer Approval Workflow
* Expected Return Date
* Conflict Detection
* Double Allocation Prevention

---

##  Resource Booking

* Shared Resource Booking
* Time Slot Validation
* Booking Status Tracking
* Booking Cancellation
* Booking Rescheduling
* Overlap Prevention

---

##  Maintenance Management

Workflow:

```text
Pending
   │
Approved
   │
Technician Assigned
   │
In Progress
   │
Resolved
```

Features:

* Raise Maintenance Request
* Priority Management
* Issue Description
* Technician Assignment
* Asset Status Synchronization
* Maintenance History

---

##  Asset Audit

* Audit Cycle Creation
* Auditor Assignment
* Asset Verification
* Missing Asset Detection
* Damage Reporting
* Discrepancy Reports
* Audit History

---

##  Dashboard & Reports

Dashboard includes:

* Assets Available
* Assets Allocated
* Active Bookings
* Pending Maintenance
* Upcoming Returns
* Overdue Returns

Reports:

* Asset Utilization
* Department-wise Allocation
* Maintenance Summary
* Resource Booking Summary
* Export Reports

---

##  Notifications & Activity Logs

* Asset Allocation Notifications
* Booking Notifications
* Maintenance Updates
* Transfer Alerts
* Audit Notifications
* Complete Activity History

---

#  User Roles

##  Admin

* Manage Departments
* Manage Asset Categories
* Manage Employees
* Assign Roles
* Create Audit Cycles
* View Reports & Dashboard

---

##  Asset Manager

* Register Assets
* Allocate Assets
* Approve Transfers
* Approve Maintenance
* Approve Asset Returns

---

##  Department Head

* View Department Assets
* Approve Department Transfers
* Book Shared Resources

---

##  Employee

* View Assigned Assets
* Book Shared Resources
* Raise Maintenance Requests
* Request Transfers
* Request Asset Returns

---

#  System Workflow

```text
Employee Signup/Login
          │
          ▼
Admin creates Departments & Categories
          │
          ▼
Admin assigns Roles
          │
          ▼
Asset Manager registers Assets
          │
          ▼
Assets become Available
          │
          ▼
Asset Allocation
          │
          ├── Return
          ├── Transfer
          └── Maintenance
                     │
                     ▼
              Audit Verification
                     │
                     ▼
          Reports & Notifications
```

---

#  Tech Stack

## Frontend

* React.js
* Vite
* React Router
* Context API
* Recharts
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Nodemailer
* Multer
* Cloudinary

---

#  Project Structure

```text
assetflow/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── helpers/
│   │   ├── jobs/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── uploads/
│   │   ├── utils/
│   │   └── validators/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   └── types/
│
└── README.md
```

---

#  API Modules

### Authentication

* Signup
* Login
* Refresh Token
* Logout
* Forgot Password
* Reset Password
* Email Verification
* Profile Management

### Organization

* Departments
* Asset Categories
* Employee Directory

### Assets

* Register Assets
* Asset Directory
* Asset Details
* Asset Updates

### Workflows

* Asset Allocation
* Asset Transfers
* Resource Booking
* Maintenance
* Asset Audit

### Reports

* Dashboard Summary
* CSV Export

### Notifications

* Read Notifications
* Activity Logs

---

#  Business Rules

* Employee signup creates only **Employee** accounts.
* Only Admin can assign or update user roles.
* Asset Tags are automatically generated.
* QR Codes are generated during asset registration.
* Duplicate asset allocation is prevented.
* Overlapping resource bookings are rejected.
* Maintenance approval automatically updates asset status.
* Audit verification can mark assets as Lost.
* Refresh Token Rotation improves session security.

---

#  Installation

Clone the repository:

```bash
git clone https://github.com/your-username/assetflow.git
cd assetflow
```

Install dependencies:

```bash
npm run install:all
```

Configure environment variables:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Run the application:

```bash
npm run dev
```

Backend

```text
http://localhost:4000
```

Frontend

```text
http://localhost:5173
```

---

#  Deployment

### Backend

* Render

### Frontend

* Vercel

### Database

* MongoDB Atlas

### File Storage

* Cloudinary

---

#  Testing Checklist

* User Authentication
* Role-Based Access
* Asset Registration
* Asset Allocation
* Transfer Workflow
* Booking Conflict Validation
* Maintenance Workflow
* Audit Cycle
* Dashboard
* Reports
* Notifications

---

#  Screenshots

> Screenshots and demo GIFs will be added after project completion.

---

#  Team

Developed as part of the **Odoo Hackathon 2026**.

---

#  License

This project is developed for educational and hackathon purposes.
