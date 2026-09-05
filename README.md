# StinOra — Bespoke Grooming & Studio Appointments

A mobile-first luxury barber and salon booking experience crafted with an **Urban Light** aesthetic, responsive geometry, and an adaptive theme engine.

![StinOra Cover](https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&auto=format&fit=crop&q=80)

---

## 💈 Core Architecture & Experience

1. **Urban Light Default Theme**
   - Warm cream canvas surfaces (`#FBFBF9`), crisp elevated cards (`#FFFFFF`), and refined architectural stone borders (`#EAE9E4`).
   - Signature electric blurple accents (`#4F46E5` / `#5452FF`) for actionable touch targets.

2. **Adaptive Theme Engine (User Profile Settings)**
   - **Urban Light**: Active by default.
   - **Dark Noir**: High-contrast editorial dark mode (`#0A0A0A` canvas, `#161616` cards).
   - **Device Match**: Automatically listens to and synchronizes with system OS light/dark preferences.
   - Persisted across sessions via `localStorage`.

3. **Booking & Rebooking Loop**
   - Fast 2-tap rebook on the home dashboard ("17 days since your last fade").
   - Master stylist roster with live chair availability indicators.
   - Step-by-step verified checkout with date & timeslot reservation.
   - Dynamic bookings archive with live cancellation support and receipt breakdown.

4. **Directory & Discovery**
   - Multi-category search (Fades, Beard Trims, Color, Spa treatments).
   - Location filtering across Bangalore's premier studio locations.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Run Locally (Development)
From the repository root:
```bash
npm run dev
```
Or directly within the app workspace:
```bash
cd stinora-app
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### Production Build
```bash
npm run build
```
Build output is generated in `stinora-app/dist` and synchronized to the root for zero-config static hosting (GitHub Pages, Vercel, Netlify).

---

## 📁 Repository Structure

- `stinora-app/` — Main React + Vite + Tailwind CSS application source code
  - `src/App.tsx` — Root state container, theme engine, and screen navigation router
  - `src/components/HomeScreen.tsx` — Customer rebooking dashboard and stylist preview
  - `src/components/UserProfileScreen.tsx` — Account settings and Theme & Palette switcher
  - `src/components/BookingsScreen.tsx` — Upcoming and past booking receipts archive
  - `src/components/ExploreScreen.tsx` — Studio search and category filtering
  - `src/components/ScheduleScreen.tsx` — Slot reservation and service selection
  - `src/components/BillingScreen.tsx` — Checkout review and payment confirmation
- `legacy/` — Preserved legacy prototypes
- `index.html` — Production entrypoint
- `vercel.json` — Deployment routing configuration
