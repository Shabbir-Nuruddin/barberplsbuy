# Customer app redesign — working prototype

`rebook.html` is a self-contained prototype of the redesigned **customer** home screen and
booking flow. Open it directly in a browser; there is no build step and no external assets.

## Why this exists

The current app in the repo root has two problems that a visual pass would not fix.

**1. It boots empty.** `app.js` wipes all seeded state on every load:

```js
if (localStorage.getItem('tb_cleaned_no_sample_v6') !== 'true') {
  localStorage.removeItem('tb_stylists');
  localStorage.removeItem('tb_chairs');
  // ...
}
```

A first-time viewer sees "No Barbers Onboarded Yet" and a barber count of 0. None of the
polished demo the design implies is ever visible.

**2. It is a desktop layout imitating a phone.** There is a "Phone View" mockup toggle in the
header. For a consumer app competing on speed and habit, the phone is not a preview mode — it
is the product.

## What the prototype argues

The hero action is **rebook, not browse**. A returning customer opens to their regular barber,
their usual service, the next free chair, and one button. Discovery still exists ("Switch it
up") but sits below the fold. Competitors open with a directory; this opens with a decision
already made.

The "17 days since your last fade" line is the 15-day retention engine from the README surfaced
as something the customer *sees as useful*, rather than fired at them over WhatsApp.

Certainty is the other half: "we hold your chair for 10 minutes", "we nudge you 30 minutes
before". Knowing when you sit down is this product's equivalent of a delivery timer.

## Implementation notes

- Single file, vanilla HTML/CSS/JS. No framework, no build.
- **Zero non-ASCII bytes** — every symbol is an HTML entity, so `₹` and `·` cannot mojibake
  regardless of how the file is served.
- Full-bleed on phones; a centred 448px column with a device frame at ≥540px. No fixed-size
  phone mockup, no nested scroll containers.
- Portraits are generated as deterministic data-URI SVGs, so the file renders complete offline.
- Themes are token-driven and cover all three viewer states: no attribute (system), and an
  explicit `data-theme` of `light` or `dark`.
- Honours `prefers-reduced-motion`; tap targets are >=44px; Escape closes the sheet.

## Placeholder data

Every name, price, rating and review count in this file is **invented placeholder data for
layout purposes only**. "Rohan Mehra", "The Crown Salon", `₹530`, "4.9" — none of it is real
and none of it should ship. Replace with confirmed figures from the owner before this goes in
front of any customer.

## Not done yet

This is one screen of a two-sided product. Still to design:

- First booking for a customer who has no "usual" yet (rebook only works on the second visit)
- Explore / discovery, barber profile, Bookings, You
- The Salon OS business side

## Open decision

Whether to stay vanilla or move the customer app to React. It changes what tooling is worth
adding (21st.dev component generation only pays off under React) and it should be settled
before the remaining screens are built, not after.
