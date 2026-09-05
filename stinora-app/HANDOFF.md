# StinOra - Developer Handoff Document

Welcome! This document provides the necessary context to pick up the development of **StinOra**, a premium salon and barber booking application.

## 1. Project Overview
StinOra is a high-end, mobile-first booking experience. We recently transitioned the UI into an **Editorial Bento Aesthetic**, heavily inspired by top-tier `taste-skill` websites like Floria and CollectiveOS. It looks less like a tech app and more like a high-end interactive magazine.

## 2. Tech Stack
- **Framework**: React 18 with TypeScript, bundled via Vite.
- **Styling**: Tailwind CSS v3.
- **Motion & Physics**: `framer-motion` (used extensively for Spring physics).
- **Icons**: `lucide-react`.

## 3. Design System & Aesthetics (Editorial Bento)
- **Palette**: Monochromatic. Deep warm-black (`#0C0B0A`) backgrounds with crisp off-white (`#F5EBE1`) text. No primary brand colors (no blue/purple)—just stark black/white contrast for CTAs.
- **Typography**: The core of the design. We mix massive, tight `Geist` sans-serif headings with elegant `Playfair Display` italicized serifs.
- **Shadows & Borders**: We do not use heavy drop shadows. Everything structural uses an ultra-thin, barely-there border (`border-editorial-600`), grounding the UI in a "Flat Bento" layout.
- **Badges**: Thin border, uppercase, wide tracking, and tiny muted text (e.g., `[ BESPOKE GROOMING ]`).
- **Physics**: Every interaction (buttons, page transitions) uses Framer Motion spring physics (`type: 'spring', stiffness: 300, damping: 24`). Buttons use `active:scale-[0.98]` to provide tactile push feedback.

## 4. Current Architecture & State (Production Ready)
- **Routing**: Handled manually via state (`screen`, `history`, and `activeTab` arrays) in `src/App.tsx`.
- **Navigation**: Features a fixed **Bottom Navigation Bar** (Home, Explore, Bookings, You) for maximal ease-of-use, styled with minimal borders.
- **Global State**: Managed at the top level in `src/App.tsx`. This includes `selectedSalon`, `selectedBarber`, `selectedDate`, `selectedTime`, and `selectedServices`.
- **Data Layer (`MOCK_DATA`)**: Contains 20 real premium salons in Bangalore (e.g., Lakme, BBlunt) with accurate local addresses and real market pricing tiers. Also includes a 10-stylist global barber pool.

## 5. Application Flow (Completed Features)
1. **WelcomeScreen**: Massive Floria-inspired editorial typography.
2. **HomeScreen**: Features a CollectiveOS-style Bento Grid layout with boxed serif icons and structural borders.
3. **UserProfileScreen**: Accessible via the Bottom Nav ("You"). Clean, minimal list architecture.
4. **SalonProfileScreen**: Details of the selected salon with real addresses, grayscale imagery, and a "Manifesto".
5. **BarberSelectionScreen**: List of barbers with availability indicators and stark typography.
6. **ScheduleScreen**: Fully functional state. You can tap through different dates, which accurately updates the UI state and filters available time slots.
7. **BillingScreen**: Checkout summary with payment method selection, culminating in an animated, minimalist SVG Success Overlay.

## 6. Recommended Next Steps (For Claude/Next Dev)
If you are taking over this codebase, here are the logical next steps:
1. **Database Migration**: Migrate the 20 real salons and barbers from `MOCK_DATA` directly into Supabase (PostgreSQL) or Firebase Firestore.
2. **Implement Real Routing**: Replace the custom state router and Bottom Nav logic in `App.tsx` with `react-router-dom` or migrate the components to a Next.js App Router setup.
3. **State Management**: Move the drilled props into a proper `Zustand` store or React Context.
4. **Authentication**: Replace the simulated Welcome Screen login with actual Supabase/Firebase Auth (Mobile OTP flow).

*Godspeed and happy coding! Keep the physics springy, the typography tight, and the borders thin.*
