# TrimFlow OS | Salon & Barber Intelligence & Retention Dashboard

A web application and CRM system built for barbershops, salons, and groomers to solve customer churn and transform word-of-mouth walk-in shops into repeat revenue machines.

---

## 🚀 Key Features

1. **⚡ 15-Second Walk-in POS / Customer Check-in**
   - Record customer name, phone number, services rendered, attending barber, and payment type (UPI, Cash, Card).
   - Instantly calculates bill total with loyalty coupon support.
   - Automatically resets the 15-day haircut cycle timer for the client.

2. **📲 Smart 15-Day Haircut Retention Engine (WhatsApp / SMS)**
   - Automatically flags clients who visited 14–20 days ago (natural hair growth cycle).
   - Generates personalized 1-click WhatsApp deep links with their regular barber's name and dynamic offers (e.g. `₹50 / $5 Loyalty Discount`, `Free Beard Style`, `VIP Weekend Slot`).
   - Deep link syntax: `https://wa.me/<phone>?text=<encoded_personalized_message>`

3. **📊 Financial & Operational Analytics (Chart.js)**
   - Real-time gross revenue, net profit margin, and operating overheads.
   - 7-Day turnover and customer footfall trends.
   - Customer loyalty breakdown (New walk-ins vs. Repeat loyalists).
   - Top haircut & grooming services revenue ranking.

4. **👥 Client Master Directory (CRM)**
   - Lifetime spend tracking, total visit count, and favorite barber history.
   - Instant search by client name, phone number, or stylist.
   - 1-Click CSV Export for marketing & record keeping.

5. **✂️ Stylist & Barber Performance Leaderboard**
   - Track clients served, hair cuts completed, and revenue generated per chair.

6. **💰 Multi-Currency & International Support**
   - Seamless currency switcher between **₹ INR (India)**, **$ USD (US)**, **£ GBP (UK)**, **€ EUR (Europe)**, and **AED (UAE)** with adaptive phone codes and discount benchmarks.

---

## 🛠️ How to Run Locally

1. Simply open [index.html](file:///Users/dashaansinghvi/Desktop/Antigravity%20/Dashboard/index.html) in any modern web browser or start a local dev server:
```bash
npx serve /Users/dashaansinghvi/Desktop/Antigravity\ /Dashboard
```

---

## 🔌 Next-Step Integration Options

- **WhatsApp Cloud API Integration:** Connect to Twilio or Meta WhatsApp Business API for completely automated scheduled webhook dispatches without manual clicks.
- **Backend & Database:** Sync `localStorage` data to Supabase / Firebase for multi-store franchise management.
- **Hardware Integrations:** Thermal receipt printer (ESC/POS) support for instant physical receipt printing.
