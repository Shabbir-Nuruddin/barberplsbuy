# StinOra - Developer Handoff Document

Welcome! This document provides the necessary context to pick up the development of **StinOra**, a premium salon and barber booking application.

## 1. Project Overview
StinOra is a high-end, mobile-first booking experience. We recently transitioned the UI into a **Hybrid Dark-Luxury Vibe**—balancing the high-conversion consumer psychology of top-tier utility apps (like Uber) with the premium typography and physics of luxury branding.

## 2. Tech Stack
- **Framework**: React 18 with TypeScript, bundled via Vite.
- **Styling**: Tailwind CSS v3.
- **Motion & Physics**: `framer-motion` (used extensively for Spring physics and layout transitions).
- **Icons**: `lucide-react`.

## 3. Design System & Aesthetics (Hybrid Dark-Luxury)
- **Palette**: Warm Espresso/Charcoal base (`#11100E` to `#1A1816`) to maintain organic warmth rather than mechanical `#000000` black. 
- **Accent Conversion**: We use a vibrant Blurple (`#7E93FF`) for primary CTAs to drive high-contrast consumer conversion.
- **Shadows**: Premium `shadow-diffusion-dark` (`0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)`).
- **Typography**: The `Geist` and `Geist Mono` font pairing.
- **Physics**: Every interaction (buttons, page transitions) uses Framer Motion spring physics (`type: 'spring', stiffness: 300, damping: 24`). Buttons use `active:scale-[0.98]` to provide tactile push feedback.
- **Visuals**: CSS linear-gradients used for high-end avatar styling.

## 4. Current Architecture & State (Production Ready)
- **Routing**: Handled manually via state (`screen`, `history`, and `activeTab` arrays) in `src/App.tsx`.
- **Navigation**: Features a fixed **Bottom Navigation Bar** (Home, Explore, Bookings, You) for maximal ease-of-use.
- **Global State**: Managed at the top level in `src/App.tsx`. This includes `selectedSalon`, `selectedBarber`, `selectedDate`, `selectedTime`, and `selectedServices`.
- **Data Layer (`MOCK_DATA`)**: Contains 20 real premium salons in Bangalore (e.g., Lakme, BBlunt) with accurate local addresses and real market pricing tiers. Also includes a 10-stylist global barber pool.

## 5. Application Flow (Completed Features)
1. **WelcomeScreen**: Simulated mobile number login with a beautiful dark overlay.
2. **HomeScreen**: Features a high-utility "Rebook the usual" block with contextual data (Next free chair), and a "Switch it up" horizontal scroll of gradient barber cards.
3. **UserProfileScreen**: Accessible via the Bottom Nav ("You").
4. **SalonProfileScreen**: Details of the selected salon with real addresses and dynamic imagery.
5. **BarberSelectionScreen**: List of barbers with availability indicators.
6. **ScheduleScreen**: Fully functional state. You can tap through different dates, which accurately updates the UI state and filters available time slots.
7. **BillingScreen**: Checkout summary with payment method selection, culminating in an animated SVG Success Overlay.

## 6. Recommended Next Steps (For Claude/Next Dev)
If you are taking over this codebase, here are the logical next steps:
1. **Database Migration**: Migrate the 20 real salons and barbers from `MOCK_DATA` directly into Supabase (PostgreSQL) or Firebase Firestore.
2. **Implement Real Routing**: Replace the custom state router and Bottom Nav logic in `App.tsx` with `react-router-dom` or migrate the components to a Next.js App Router setup.
3. **State Management**: Move the drilled props into a proper `Zustand` store or React Context.
4. **Authentication**: Replace the simulated Welcome Screen login with actual Supabase/Firebase Auth (Mobile OTP flow).

*Godspeed and happy coding! Keep the physics springy and the conversion rates high.*
