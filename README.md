# NEXORA — Full-Stack Education & Academic Portal

A modern, production-ready, full-stack education platform built with React, TypeScript, Vite, Tailwind CSS, Node.js, Express.js, SQLite, and Prisma ORM.

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript%20%7C%20Vite-blue.svg)](client/)
[![Backend](https://img.shields.io/badge/Backend-Express%20%7C%20Prisma%20%7C%20SQLite-green.svg)](server/)

---

## 🌟 Key Features

### 1. 🏛️ Comprehensive University, College & School Directory
- **Universities Directory:** Official profiles for major universities including:
  - APJ Abdul Kalam Technological University (KTU)
  - University of Calicut
  - Mahatma Gandhi University (MGU)
  - University of Kerala
  - Cochin University of Science and Technology (CUSAT)
  - Kannur University
  - Indian Institute of Science (IISc Bangalore), IIT Madras, Anna University, University of Delhi, and University of Calcutta (Rajabazar Science College).
- **Colleges Directory:** Filterable by affiliated university, institution category (*Government*, *Government-Aided*, *Autonomous*, *Private Self-Financing*, *University Department*), and Kerala districts.
- **Schools Directory:** Verified schools (*Government School*, *Government-Aided*, *Private School*) under Kerala State Board (DHSE / SSLC), CBSE, ICSE / CISCE, and IHRD Technical Higher Secondary.
- **Itemized Fee Structures:** Verified annual tuition, lab, exam, and hostel charges from official university gazettes.

### 2. 📝 7-Step Centralized Admission Portal (`/admission`)
- **Step 1: Personal Details:** Real-time Unicode name validation supporting English and Malayalam names (e.g. `മുഹമ്മദ് അലി`, `Rahul Kumar`).
- **Step 2: Contact Details:** Strict 10-digit mobile number and RFC-compliant email verification.
- **Step 3: Guardian Records:** Parent/guardian details for emergency and fee concession records.
- **Step 4: Academic Qualifications:** Adapts conditionally between Undergraduate (10th + 12th + KEAM/JEE) and Postgraduate (Bachelor Degree + CGPA + GATE/CAT).
- **Step 5: Multi-Step Cascading Preferences:** Select University $\rightarrow$ Filtered Colleges $\rightarrow$ Filtered Programs $\rightarrow$ Real-time inspection of semesters, eligibility, and fees.
- **Step 6: Dynamic Document Requirements:**
  - *Class 10:* Does not ask for Class 10 certificate (requests photo & birth certificate).
  - *Plus One:* Requests Class 10 certificate / marksheet.
  - *Plus Two:* Requests Class 10 & Plus One marksheets.
  - *Undergraduate:* Requests Class 12 / Plus Two marksheet.
  - *Postgraduate:* Requests Bachelor degree certificate and consolidated marksheets.
- **Step 7: Verification & Application Tracking:** Instant reference number generation with public tracking status (`/api/admissions/track/:referenceNumber`).

### 3. 📚 Hierarchical Study Resources Repository (`/study-resources`)
- **Dual Domain Modes:**
  - *College & University Mode:* University $\rightarrow$ College $\rightarrow$ Course $\rightarrow$ Semester (S1–S8) $\rightarrow$ Subject $\rightarrow$ Material Type.
  - *School Mode:* Board (DHSE / CBSE / ICSE) $\rightarrow$ Class (Class 10, Plus One, Plus Two) $\rightarrow$ Stream (Science, Commerce, Humanities) $\rightarrow$ Subject.
- **Protected Access:** Guests are safely prompted to login/register before downloading or previewing verified academic materials.

### 4. 📊 Role-Based Dashboards
- **Student Dashboard:** Track admission application statuses, bookmarked institutions, study materials, and academic profile.
- **Faculty Dashboard:** Manage classroom resources, departmental syllabus updates, and student queries.
- **University Dashboard:** Review incoming admission applications, verify student records, and manage academic programs.
- **Admin Dashboard:** Platform metrics including real database counts for Students, Universities, Colleges, Schools, Courses, and Resources, with CSV export and governance audit logs.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 1. Installation
Clone the repository and install dependencies for both server and client:
```bash
git clone git@github.com:fanna5900/pathumma.git
cd pathumma

# Install dependencies
npm run install:all
```

### 2. Database Setup
```bash
# Push schema and generate Prisma client
npm --prefix server run prisma:generate
```

### 3. Start Development Servers
```bash
# Concurrently starts Backend (port 5000) and Frontend (port 3000)
npm run dev
```

- **Frontend Client:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Login Credentials

For testing and demonstration, use the pre-configured accounts on the Login page:

| Role | Username | Password | Access |
|---|---|---|---|
| **Student** | `aaravsharma` | `StudentPass@2026` | Student Dashboard & Applications |
| **Faculty** | `drradhakrishnan` | `FacultyPass@2026` | Faculty Repository Management |
| **University** | `nitcofficial` | `UniAdmin@2026` | Institution Admission Processing |
| **Platform Admin** | `edunexaadmin` | `SuperAdmin@2026` | Full Platform & User Governance |

---

## 🛡️ Validation & Security Rules
- **Name Validation:** Allows alphabetic characters and spaces (including Malayalam Unicode script `\p{L}\p{M}`); immediately rejects numbers and symbols.
- **Username Validation:** Strictly English alphabetic characters only (`[A-Za-z]`).
- **Contact Number:** Exactly 10 digits required for Indian mobile numbers.
- **Authentication:** Salted bcrypt password hashing with signed JWT bearer tokens.

---

## 📜 License
This project is licensed under the MIT License.
