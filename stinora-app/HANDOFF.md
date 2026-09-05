# StinOra - Developer Handoff Document

Welcome! This document provides the necessary context to pick up the development of **StinOra**, a premium salon and barber booking application.

## 1. Project Overview
StinOra is a high-end, mobile-first booking experience designed to look and feel like a professional, luxury salon. It eschews generic "AI slop" designs in favor of an "Art Gallery" aesthetic characterized by generous whitespace, clean typography, and tactile physics-based interactions.

## 2. Tech Stack
- **Framework**: React 18 with TypeScript, bundled via Vite.
- **Styling**: Tailwind CSS v3.
- **Motion & Physics**: `framer-motion` (used extensively for Spring physics and layout transitions).
- **Icons**: `@phosphor-icons/react` and `lucide-react`.

## 3. Design System & Aesthetics (The "District" Vibe)
The UI strictly adheres to a "Light Earth" theme inspired by the District app:
- **Palette**: Creams and warm whites (`#FCFAF8`, `#F5F0E6`) for backgrounds. Deep earthy browns (`#2E2214`, `#4A3720`) for typography. Accents in soft camel/gold.
- **Shadows**: We use premium `shadow-diffusion` (`0 20px 40px -15px rgba(74, 55, 32, 0.08)`) instead of harsh borders or standard box-shadows.
- **Typography**: The `Geist` and `Geist Mono` font pairing.
- **Physics**: **No linear easing.** Every interaction (buttons, page transitions) uses Framer Motion spring physics (`type: 'spring', stiffness: 300, damping: 24`). Buttons use `active:scale-[0.98]` to provide tactile push feedback.
- **Orchestration**: Lists (like barbers or salons) use `staggerChildren` to create waterfall reveals.

## 4. Current Architecture & State
Currently, the application is a deeply fleshed-out frontend prototype.
- **Routing**: Handled manually via state (`screen` and `history` arrays) in `src/App.tsx`. There is no `react-router-dom` installed yet.
- **Global State**: Managed at the top level in `src/App.tsx` and drilled down via props. This includes `searchQuery`, `selectedSalon`, `selectedBarber`, `selectedTime`, and `selectedServices`.
- **Mock Data**: Hardcoded inside `src/App.tsx` (`MOCK_DATA`).

## 5. Application Flow (Completed Features)
1. **WelcomeScreen**: Simulated mobile number login.
2. **HomeScreen**: Displays "Your Usual" and "Top Rated". Includes a fully functional search bar that filters the salon list.
3. **UserProfileScreen**: Accessible via the top-right avatar on the Home screen.
4. **SalonProfileScreen**: Details of the selected salon.
5. **BarberSelectionScreen**: List of barbers with availability indicators.
6. **ScheduleScreen**: Date, Time Slot, and Service selection.
7. **BillingScreen**: Checkout summary with payment method selection, culminating in an animated SVG Success Overlay.

## 6. Recommended Next Steps (For Claude/Next Dev)
If you are taking over this codebase, here are the logical next steps:
1. **Implement Real Routing**: Replace the custom state router in `App.tsx` with `react-router-dom` or migrate the components to a Next.js App Router setup.
2. **State Management**: Move the drilled props (`selectedSalon`, `searchQuery`) into a proper `Zustand` store or React Context.
3. **Backend Integration**: Connect the `MOCK_DATA` to a real backend (like Supabase or Firebase) for live booking synchronization.
4. **Authentication**: Replace the simulated Welcome Screen login with actual Supabase Auth or Firebase Auth (OTP flow).

*Godspeed and happy coding! Keep the physics springy and the layouts clean.*
