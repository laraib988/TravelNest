# 🌍 TravelNest (Vaitour) - OTA Marketplace

TravelNest (production name: **Vaitour**) is a comprehensive multi-sided Online Travel Agency (OTA) marketplace. It connects global travelers with local tour operators, focusing on immersive travel experiences in Japan and worldwide.

The platform consists of three main portals:
1. **Customer Portal:** For discovering, comparing, and booking tours.
2. **Supplier Portal:** For tour operators to manage listings, bookings, and availability.
3. **Admin Portal:** For platform owners to moderate users, reviews, payouts, and content.

---

## 🏗️ Architecture & Monorepo Structure

This project uses a Monorepo structure containing the frontend, backend, and database configurations.

```
TravelNest/
├── frontend/       # Next.js 14 App Router (Customer, Supplier, Admin UIs)
├── backend/        # NestJS API Gateway & Domain Services
├── supabase/       # SQL schemas, RLS policies, migrations
├── package.json    # Root scripts for monorepo management
└── render.yaml     # Render deployment blueprint for backend
```

---

## 💻 Tech Stack

### Frontend (Next.js)
* **Framework:** Next.js 14.1 (App Router)
* **Language:** TypeScript
* **UI/Styling:** React 18, Tailwind CSS, Lucide Icons
* **State Management:** React Context (Auth, Currency) + SWR (Data Fetching)
* **Maps & Rich Text:** Leaflet, TipTap Editor
* **AI Integration:** Groq SDK

### Backend (NestJS)
* **Framework:** NestJS 10
* **Authentication:** Passport JWT
* **Caching & Rate Limiting:** Redis (Cache Manager), Throttler Guard
* **Validation:** class-validator, class-transformer

### Database & Infrastructure
* **Database:** Supabase (PostgreSQL)
* **Security:** Row Level Security (RLS)
* **Realtime:** Supabase Realtime (Community Forum)
* **Media & Emails:** Cloudinary, Resend
* **Hosting:** Vercel (Frontend), Render.com (Backend)

---

## ✨ Key Features

### 👤 Customer Experience
* **Smart Search & Filters:** Mapbox-powered autocomplete, category filters, and tour comparisons.
* **Booking System:** Interactive calendar, time-slot selection, and secure OTP verification via email.
* **i18n & Multi-Currency:** 5 languages (English, Urdu, Japanese, French, Arabic) with RTL support, and 8 currencies with live exchange rates.
* **AI Travel Planner:** AI-driven personalized itinerary generation.
* **Community Forum:** Real-time discussions and AI-seeded community guides.
* **SEO Optimized:** Server-Side Rendering (SSR), JSON-LD schemas, and dynamic sitemaps.

### 🏢 Supplier Dashboard
* **Tour Management:** 5-step wizard for creating comprehensive tour listings (Pricing, Logistics, Itineraries).
* **Booking Management:** Confirm, reject, and manage customer bookings.
* **KYC System:** Identity verification flow for trusted suppliers.
* **Payouts & Analytics:** Bank detail management and revenue tracking.

### 👑 Admin Control Panel
* **Moderation:** Approve/Reject reviews, tours, and supplier KYC records.
* **CMS:** TipTap powered blog management with AI generation capabilities.
* **Platform Configuration:** Manage promotions, destination pages, and platform-wide settings.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v20 or higher)
* npm or pnpm
* Supabase Account (for Database/Auth)
* Redis Server (Local or Cloud)

### 1. Install Dependencies
Run the following command from the root directory to install dependencies for both frontend and backend:
```bash
npm run install:backend
npm run install:frontend
```

### 2. Environment Variables
You need to set up `.env` files in both the `frontend` and `backend` directories.

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Add other keys like Cloudinary, Resend, Mapbox, etc.
```

**Backend (`backend/.env`):**
```env
PORT=4000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
# Add other backend secrets
```

### 3. Run the Development Servers

You can run both servers independently from the root directory:

**Start Frontend (Port 3000):**
```bash
npm run dev:frontend
```

**Start Backend (Port 4000):**
```bash
npm run dev:backend
```

---

## 🔒 Security Measures

* **Database Level:** Comprehensive Row Level Security (RLS) policies ensure data isolation (e.g., Suppliers can only view their own bookings).
* **API Level:** Distributed locking via Redis to prevent double bookings, strict DTO validation, and IP-based rate limiting (Throttler).
* **Frontend Level:** Middleware rate-limiting, strict Content Security Policy (CSP), and Cloudflare Turnstile for bot protection.

---

## 📄 License
Private Repository. All rights reserved.
