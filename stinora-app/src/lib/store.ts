/**
 * The application's single source of truth.
 *
 * Before this, state lived in three unrelated places: a `MOCK_DATA` constant that
 * never changed, a `stinora_bookings` key in localStorage, and hardcoded arrays
 * inside individual screens (the "past sessions" list, the salon review count, the
 * booked-slot list). Nothing derived from anything else, so a booking never
 * reserved a slot, a completed visit never reached the archive, and a rating never
 * came from a real review.
 *
 * Everything below is either stored once or derived from what is stored — never
 * both.
 */
import { useSyncExternalStore } from 'react';
import { salonImage } from './images';

// =========================================================================
//  CATALOGUE  (fixed reference data, not user state)
// =========================================================================

export interface Salon {
  id: string;
  name: string;
  address: string;
  area: string;
  dist: string;
  tags: string[];
  image: string;
  /** Rating carried over from the studio's own listing, used until this app has
   *  enough reviews of its own to speak for it. */
  baseRating: number;
  baseReviews: number;
  barberIds: string[];
  openMinutes: number;
  closeMinutes: number;
  slotMinutes: number;
}

export interface Barber {
  id: string;
  name: string;
  spec: string;
  exp: string;
  baseRating: number;
  baseReviews: number;
  chair: string;
  /** Multiplier applied to a service's list price for this stylist. */
  priceFactor: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  minutes: number;
}

export const SERVICES: Service[] = [
  { id: 'srv1', name: 'Classic Haircut', price: 400, minutes: 30 },
  { id: 'srv2', name: 'Skin Fade & Trim', price: 650, minutes: 45 },
  { id: 'srv3', name: 'Premium Beard Sculpt', price: 350, minutes: 30 },
  { id: 'srv4', name: 'Scalp Detox Spa', price: 1200, minutes: 45 },
  { id: 'srv5', name: 'Global Hair Color', price: 3500, minutes: 90 },
  { id: 'srv6', name: 'Keratin Treatment', price: 5000, minutes: 120 },
  { id: 'srv7', name: 'HydraFacial', price: 2500, minutes: 60 },
  { id: 'srv8', name: 'Express Massage', price: 800, minutes: 30 },
];

export const BARBERS: Barber[] = [
  { id: 'b1', name: 'Rohan Mehra', spec: 'Skin Fade Specialist', exp: '8+ Years', baseRating: 4.9, baseReviews: 212, chair: 'Chair 1', priceFactor: 1.1 },
  { id: 'b2', name: 'Vikram Singh', spec: 'Classic Cuts', exp: '12+ Years', baseRating: 4.7, baseReviews: 341, chair: 'Chair 2', priceFactor: 1.0 },
  { id: 'b3', name: 'Imran Ali', spec: 'Scalp & Spa Expert', exp: '5+ Years', baseRating: 4.8, baseReviews: 118, chair: 'Chair 3', priceFactor: 1.05 },
  { id: 'b4', name: 'Alex Thomas', spec: 'Precision Styling', exp: '4+ Years', baseRating: 4.6, baseReviews: 87, chair: 'Chair 4', priceFactor: 0.95 },
  { id: 'b5', name: 'Samir Khan', spec: 'Beard Sculpting', exp: '6+ Years', baseRating: 4.5, baseReviews: 144, chair: 'Chair 1', priceFactor: 1.0 },
  { id: 'b6', name: 'Kunal Verma', spec: 'Color & Highlights', exp: '7+ Years', baseRating: 4.8, baseReviews: 96, chair: 'Chair 2', priceFactor: 1.15 },
  { id: 'b7', name: 'Arjun Das', spec: 'Keratin Specialist', exp: '9+ Years', baseRating: 4.9, baseReviews: 176, chair: 'Chair 3', priceFactor: 1.2 },
  { id: 'b8', name: 'Farhan Qureshi', spec: 'Bridal & Occasion', exp: '10+ Years', baseRating: 4.7, baseReviews: 203, chair: 'Chair 4', priceFactor: 1.1 },
  { id: 'b9', name: 'David Lee', spec: 'Creative Cuts', exp: '3+ Years', baseRating: 4.4, baseReviews: 52, chair: 'Chair 5', priceFactor: 0.9 },
  { id: 'b10', name: 'Rishabh Pant', spec: 'Express Grooming', exp: '5+ Years', baseRating: 4.3, baseReviews: 61, chair: 'Chair 5', priceFactor: 0.85 },
];

/** Each studio staffs a different subset of the stylist pool. */
const SALON_SEED: Array<[string, string, string, string, string, number, number, string[], number[]]> = [
  ['s1', 'Lakme Salon', '12th Main Road, HAL 2nd Stage, Indiranagar', 'Indiranagar', '1.2 km', 4.6, 812, ['Skin Fade', 'Classic', 'Bridal'], [0, 1, 4, 7]],
  ['s2', 'Toni & Guy Essensuals', 'Opposite Axis Bank, 100 Feet Road, Indiranagar', 'Indiranagar', '0.8 km', 4.8, 640, ['Luxury', 'Keratin', 'Color'], [5, 6, 1, 3]],
  ['s3', 'BBlunt Salon', '1st Stage, Indiranagar', 'Indiranagar', '1.5 km', 4.7, 421, ['Modern', 'Balayage', 'Color'], [8, 5, 0]],
  ['s4', 'Bellance Salon', '12th Main, HAL 2nd Stage, Indiranagar', 'Indiranagar', '2.1 km', 4.9, 358, ['Luxury', 'Ayurvedic', 'Spa'], [2, 6, 7]],
  ['s5', 'Marie Claire Paris', '12th Main Road, Indiranagar', 'Indiranagar', '2.5 km', 4.5, 274, ['HydraFacial', 'Spa'], [2, 9, 3]],
  ['s6', 'Bodycraft Salon & Spa', '100 Feet Rd, HAL 2nd Stage, Indiranagar', 'Indiranagar', '3.0 km', 4.8, 903, ['Clinical', 'Spa'], [2, 3, 6, 9]],
  ['s7', 'Bounce Salon & Spa', 'Double Road, Indiranagar', 'Indiranagar', '1.8 km', 4.7, 512, ['Luxury', 'Color'], [5, 7, 0]],
  ['s8', 'YLG Salon', 'CMH Road, Indiranagar', 'Indiranagar', '1.0 km', 4.4, 388, ['Classic', 'Waxing'], [1, 9, 3]],
  ['s9', 'Green Trends', '80 Feet Road, Indiranagar', 'Indiranagar', '2.2 km', 4.3, 611, ['Classic', 'Family'], [9, 1, 4]],
  ['s10', 'Naturals Salon', 'HAL 3rd Stage, Indiranagar', 'Indiranagar', '2.8 km', 4.2, 447, ['Classic', 'Organic'], [3, 9, 4]],
  ['s11', 'Jean Claude Biguine', '100 Feet Road, Indiranagar', 'Indiranagar', '3.5 km', 4.9, 296, ['French', 'Luxury'], [6, 7, 5]],
  ['s12', 'Play Salon', '1st Cross, Indiranagar', 'Indiranagar', '1.4 km', 4.6, 233, ['Modern', 'Creative'], [8, 0, 4]],
  ['s13', 'Apple The Original', 'CMH Road, Indiranagar', 'Indiranagar', '1.1 km', 4.5, 519, ['Classic', 'Spa'], [1, 2, 4]],
  ['s14', 'Snippets Salon', 'HAL 2nd Stage, Indiranagar', 'Indiranagar', '2.0 km', 4.4, 172, ['Family', 'Quick'], [9, 3]],
  ['s15', 'Vurve Signature Salon', '100 Feet Road, Indiranagar', 'Indiranagar', '3.2 km', 4.8, 407, ['Luxury', 'Signature'], [6, 5, 7, 0]],
  ['s16', 'Salon Srishti', 'Appareddy Palya, Indiranagar', 'Indiranagar', '0.9 km', 4.3, 128, ['Local', 'Classic'], [4, 9]],
  ['s17', 'Gloss Salon', '12th Main Road, Indiranagar', 'Indiranagar', '2.4 km', 4.7, 264, ['Premium', 'Nails'], [7, 5, 3]],
  ['s18', 'Mirrors & Within', 'UB City, Bangalore', 'UB City', '4.0 km', 4.9, 341, ['Elite', 'Luxury'], [6, 7, 0, 5]],
  ['s19', 'The White Door', 'Lavelle Road, Bangalore', 'Lavelle Road', '3.8 km', 4.8, 288, ['Spa', 'Elite'], [2, 6, 7]],
  ['s20', 'Salon Mousse', 'Domlur Layout, Bangalore', 'Domlur', '1.7 km', 4.6, 199, ['Trendy', 'Color'], [5, 8, 0]],
];

export const SALONS: Salon[] = SALON_SEED.map(([id, name, address, area, dist, baseRating, baseReviews, tags, idx]) => ({
  id,
  name,
  address,
  area,
  dist,
  tags,
  baseRating,
  baseReviews,
  image: salonImage(id + name),
  barberIds: (idx as number[]).map((i) => BARBERS[i].id),
  openMinutes: 10 * 60,
  closeMinutes: 20 * 60,
  slotMinutes: 30,
}));

export const AREAS = ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield', 'Jayanagar', 'UB City', 'Domlur', 'Lavelle Road'];

export function getSalon(id: string | null | undefined): Salon | null {
  return SALONS.find((s) => s.id === id) || null;
}
export function getBarber(id: string | null | undefined): Barber | null {
  return BARBERS.find((b) => b.id === id) || null;
}
export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}
export function barbersOf(salonId: string): Barber[] {
  const salon = getSalon(salonId);
  if (!salon) return BARBERS;
  return salon.barberIds.map((id) => getBarber(id)!).filter(Boolean);
}

/** A stylist's price for a service — seniority actually costs something now. */
export function priceFor(service: Service, barber: Barber | null): number {
  return Math.round((service.price * (barber?.priceFactor ?? 1)) / 10) * 10;
}

// =========================================================================
//  TIME
// =========================================================================

export function dayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function dateFromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export interface DayOption {
  key: string;
  day: string;
  num: string;
  monthLabel: string;
}

/**
 * The date rail, generated from today. It used to be a hardcoded list running
 * 06–12 September with a fixed "Today"/"Tom" label, which was wrong on every
 * other day of the year.
 */
export function upcomingDays(count = 7): DayOption[] {
  const out: DayOption[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push({
      key: dayKey(d),
      day: i === 0 ? 'Today' : i === 1 ? 'Tom' : d.toLocaleDateString('en-GB', { weekday: 'short' }),
      num: String(d.getDate()).padStart(2, '0'),
      monthLabel: d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    });
  }
  return out;
}

export function minutesToLabel(mins: number): string {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
}

export function labelToMinutes(label: string): number {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(label.trim());
  if (!m) return 0;
  let h = Number(m[1]) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return h * 60 + Number(m[2]);
}

export type SlotPeriod = 'morning' | 'afternoon' | 'evening';
export interface Slot {
  time: string;
  minutes: number;
  period: SlotPeriod;
  status: 'available' | 'booked' | 'past';
}

// =========================================================================
//  PERSISTED STATE
// =========================================================================

export interface Customer {
  name: string;
  phone: string;
  email: string;
  area: string;
  photo: string;
  onboarded: boolean;
  favouriteServices: string[];
}

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  salonId: string;
  salonName: string;
  barberId: string;
  barberName: string;
  barberSpec: string;
  dateKey: string;
  time: string;
  serviceIds: string[];
  serviceNames: string;
  subtotal: number;
  tax: number;
  totalPrice: number;
  paymentMethod: string;
  status: BookingStatus;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  /**
   * True for visits belonging to the person using the app.
   *
   * One store holds both sides of the product: the customer's own history and
   * the studio's full ledger. Without this flag "Past sessions" showed the
   * customer every walk-in the salon had ever billed as though it were theirs.
   */
  isMine: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  salonId: string;
  barberId: string;
  barberName: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface StinoraState {
  version: number;
  customer: Customer;
  bookings: Booking[];
  reviews: Review[];
  /** Which salon the signed-in user manages in Salon OS. */
  ownedSalonId: string;
}

const STORAGE_KEY = 'stinora_state_v2';
const LEGACY_BOOKINGS_KEY = 'stinora_bookings';

const EMPTY: StinoraState = {
  version: 2,
  customer: { name: '', phone: '', email: '', area: '', photo: '', onboarded: false, favouriteServices: [] },
  bookings: [],
  reviews: [],
  ownedSalonId: 's1',
};

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

/*
 * Declared here, assigned at the very bottom of the module.
 *
 * `load()` seeds a first run, and the seed reads the DEMO_NAMES / DEMO_TEXT
 * constants that are declared further down. Initialising `state` at this point
 * would run the seed while those are still in their temporal dead zone, which
 * threw "Cannot access before initialization" and left the app a blank screen.
 */
let state!: StinoraState;
const listeners = new Set<() => void>();

/** False when this launch had to seed itself, i.e. a genuinely fresh install. */
let seededFromStorage = true;

function load(): StinoraState {
  let stored: Partial<StinoraState> | null = null;
  try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    stored = null;
  }

  const next: StinoraState = { ...clone(EMPTY), ...(stored || {}) };
  next.customer = { ...EMPTY.customer, ...(next.customer || {}) };
  if (!Array.isArray(next.bookings)) next.bookings = [];
  if (!Array.isArray(next.reviews)) next.reviews = [];
  if (!getSalon(next.ownedSalonId)) next.ownedSalonId = 's1';

  // A first run opens on a salon that has actually been trading, rather than on
  // empty charts and a "no data yet" dashboard.
  if (!stored) {
    seededFromStorage = false;
    try {
      localStorage.removeItem(LEGACY_BOOKINGS_KEY);
    } catch {
      /* nothing to clean up */
    }
    seedInto(next);
  }
  return next;
}

/** Persist. A refused write warns rather than throwing, so a full quota degrades
 *  into "this change was not saved" instead of losing everything on reload. */
let quotaWarned = false;
export function persist(): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    if (!quotaWarned) {
      quotaWarned = true;
      console.error('Could not save — device storage is full.', err);
    }
    return false;
  }
}

function emit() {
  persist();
  state = { ...state };
  listeners.forEach((l) => l());
}

export function useStore(): StinoraState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => state
  );
}

export function getState(): StinoraState {
  return state;
}

// =========================================================================
//  ACTIONS
// =========================================================================

export function saveCustomer(patch: Partial<Customer>) {
  state.customer = { ...state.customer, ...patch };
  emit();
}

export function setOwnedSalon(id: string) {
  if (!getSalon(id)) return;
  state.ownedSalonId = id;
  emit();
}

export function addBooking(b: Booking) {
  state.bookings = [b, ...state.bookings];
  emit();
}

export function cancelBooking(id: string) {
  state.bookings = state.bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b));
  emit();
}

export function completeBooking(id: string) {
  state.bookings = state.bookings.map((b) => (b.id === id ? { ...b, status: 'completed' as const } : b));
  emit();
}

export function addReview(r: Omit<Review, 'id' | 'createdAt'>) {
  state.reviews = [{ ...r, id: `rv-${Date.now().toString(36)}`, createdAt: new Date().toISOString() }, ...state.reviews];
  emit();
}

export function resetAll() {
  state = clone(EMPTY);
  emit();
}

export function reseedDemo() {
  seedInto(state);
  emit();
}

// =========================================================================
//  DERIVED  (never stored)
// =========================================================================

/**
 * A confirmed booking whose slot is in the past has, as far as the app can tell,
 * happened. Promoting it on read means the archive, the sales figures and the
 * "rate your stylist" prompts stay correct without a background job.
 */
export function settleElapsed(): boolean {
  const now = Date.now();
  let changed = false;
  state.bookings = state.bookings.map((b) => {
    if (b.status !== 'confirmed') return b;
    const at = dateFromKey(b.dateKey).getTime() + labelToMinutes(b.time) * 60000;
    if (at + 45 * 60000 < now) {
      changed = true;
      return { ...b, status: 'completed' as const };
    }
    return b;
  });
  if (changed) emit();
  return changed;
}

export function bookingsFor(barberId: string, dateKey: string): Booking[] {
  return state.bookings.filter((b) => b.barberId === barberId && b.dateKey === dateKey && b.status !== 'cancelled');
}

export function periodOf(mins: number): SlotPeriod {
  if (mins < 12 * 60) return 'morning';
  if (mins < 16 * 60) return 'afternoon';
  return 'evening';
}

/**
 * Slot availability is computed from the salon's trading hours minus the
 * bookings that exist. It used to be `(t.length + selectedDate.length + …) % 5`
 * — a hash of string lengths — so the same slots looked "booked" for every
 * stylist on every date, and confirming a booking reserved nothing.
 */
export function buildSlots(salonId: string, barberId: string, dateKey: string): Slot[] {
  const salon = getSalon(salonId) || SALONS[0];
  const taken = new Set(bookingsFor(barberId, dateKey).map((b) => labelToMinutes(b.time)));
  const isToday = dateKey === dayKey();
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: Slot[] = [];
  for (let m = salon.openMinutes; m + salon.slotMinutes <= salon.closeMinutes; m += salon.slotMinutes) {
    let status: Slot['status'] = 'available';
    if (taken.has(m)) status = 'booked';
    else if (isToday && m <= nowMinutes) status = 'past';
    slots.push({ minutes: m, time: minutesToLabel(m), period: periodOf(m), status });
  }
  return slots;
}

/**
 * The first upcoming day this stylist actually has a chair free.
 *
 * Opening the schedule on "today" is wrong whenever today is already fully
 * booked or the salon has closed for the evening — the customer lands on a grid
 * of struck-through times and has to work out for themselves to tap forward.
 */
export function firstOpenDay(salonId: string, barberId: string): string {
  const days = upcomingDays(7);
  return days.find((d) => openSlotCount(salonId, barberId, d.key) > 0)?.key ?? days[0].key;
}

export function openSlotCount(salonId: string, barberId: string, dateKey: string): number {
  return buildSlots(salonId, barberId, dateKey).filter((s) => s.status === 'available').length;
}

export interface RatingSummary {
  average: number;
  count: number;
  ownCount: number;
}

/** Ratings blend the studio's carried-over listing score with reviews left here,
 *  so a real review moves the number instead of being ignored. */
function blend(base: number, baseCount: number, ours: number[]): RatingSummary {
  if (!ours.length) return { average: base, count: baseCount, ownCount: 0 };
  const sum = base * baseCount + ours.reduce((a, b) => a + b, 0);
  const count = baseCount + ours.length;
  return { average: Math.round((sum / count) * 10) / 10, count, ownCount: ours.length };
}

export function salonRating(salonId: string): RatingSummary {
  const salon = getSalon(salonId);
  const ours = state.reviews.filter((r) => r.salonId === salonId).map((r) => r.rating);
  return blend(salon?.baseRating ?? 4.5, salon?.baseReviews ?? 0, ours);
}

export function barberRating(barberId: string): RatingSummary {
  const barber = getBarber(barberId);
  const ours = state.reviews.filter((r) => r.barberId === barberId).map((r) => r.rating);
  return blend(barber?.baseRating ?? 4.5, barber?.baseReviews ?? 0, ours);
}

export function reviewsForSalon(salonId: string): Review[] {
  return state.reviews.filter((r) => r.salonId === salonId);
}

export function myBookings(): Booking[] {
  return state.bookings.filter((b) => b.isMine).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function upcomingBookings(): Booking[] {
  return myBookings().filter((b) => b.status === 'confirmed');
}

export function pastBookings(): Booking[] {
  return myBookings().filter((b) => b.status === 'completed');
}

/** Completed visits the customer has not rated yet, newest first. */
export function awaitingReview(): Booking[] {
  const rated = new Set(state.reviews.map((r) => r.bookingId));
  return pastBookings()
    .filter((b) => !rated.has(b.id))
    .slice(0, 3);
}

export function ticketId(): string {
  return `STN-${Math.floor(1000 + Math.random() * 9000)}`;
}

// =========================================================================
//  DEMO SEED
// =========================================================================

const DEMO_NAMES = [
  'Aarav Sharma', 'Neha Iyer', 'Rahul Nair', 'Priya Menon', 'Karan Bhatia', 'Ananya Rao',
  'Vivek Joshi', 'Sneha Kulkarni', 'Aditya Pillai', 'Meera Desai', 'Rohit Gupta', 'Tara Shetty',
];
const DEMO_TEXT = [
  'Cleanest fade I have had in Bangalore. Worth the wait.',
  'Quick, precise and no upselling. Booked again on the spot.',
  'Good cut, but the chair was ready fifteen minutes late.',
  'The scalp spa is the real thing — walked out completely reset.',
  'Great with curly hair. Actually listened to what I asked for.',
  'Solid work, slightly pricey for what it is.',
  '',
  '',
  'Beard lineup was surgical. Exactly the shape I wanted.',
  '',
];

/**
 * Six weeks of trading for the salon the user manages, so the dashboard opens on
 * real revenue, a real leaderboard and real reviews rather than placeholders.
 * Everything created here is an ordinary record — no special-cased demo fields.
 */
function seedInto(target: StinoraState) {
  const salon = getSalon(target.ownedSalonId) || SALONS[0];
  const staff = salon.barberIds.map((id) => getBarber(id)!).filter(Boolean);
  const bookings: Booking[] = [];
  const reviews: Review[] = [];

  let rnd = 20260906;
  const rand = () => {
    rnd = (rnd * 1103515245 + 12345) % 2147483648;
    return rnd / 2147483648;
  };
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  for (let dayAgo = 42; dayAgo >= 1; dayAgo--) {
    const d = new Date();
    d.setDate(d.getDate() - dayAgo);
    const key = dayKey(d);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const visits = Math.floor(rand() * (isWeekend ? 5 : 3)) + (isWeekend ? 4 : 2);

    for (let i = 0; i < visits; i++) {
      const barber = pick(staff);
      const serviceCount = rand() > 0.62 ? 2 : 1;
      const chosen: Service[] = [];
      for (let s = 0; s < serviceCount; s++) {
        const svc = pick(SERVICES);
        if (!chosen.some((c) => c.id === svc.id)) chosen.push(svc);
      }
      const subtotal = chosen.reduce((sum, s) => sum + priceFor(s, barber), 0);
      const tax = Math.round(subtotal * 0.05);
      const minutes = salon.openMinutes + Math.floor(rand() * ((salon.closeMinutes - salon.openMinutes) / 30)) * 30;
      const customerName = pick(DEMO_NAMES);

      const booking: Booking = {
        id: `STN-${(90000 + bookings.length).toString(36).toUpperCase()}`,
        salonId: salon.id,
        salonName: salon.name,
        barberId: barber.id,
        barberName: barber.name,
        barberSpec: barber.spec,
        dateKey: key,
        time: minutesToLabel(minutes),
        serviceIds: chosen.map((c) => c.id),
        serviceNames: chosen.map((c) => c.name).join(', '),
        subtotal,
        tax,
        totalPrice: subtotal + tax,
        paymentMethod: pick(['upi', 'card', 'store']),
        status: 'completed',
        createdAt: new Date(d.getTime() - 86400000).toISOString(),
        customerName,
        customerPhone: `98${Math.floor(10000000 + rand() * 89999999)}`,
        // A handful of the salon's visits are the app user's own, spaced out, so
        // "rebook the usual" and the rating prompts have something real to work
        // with on a fresh install.
        isMine: dayAgo % 9 === 1 && i === 0,
      };
      bookings.push(booking);

      if (rand() < 0.3) {
        const rating = rand() < 0.72 ? 5 : rand() < 0.75 ? 3 : 4;
        reviews.push({
          id: `rv-seed-${reviews.length}`,
          bookingId: booking.id,
          salonId: salon.id,
          barberId: barber.id,
          barberName: barber.name,
          authorName: customerName,
          rating,
          text: pick(DEMO_TEXT),
          createdAt: new Date(d.getTime() + 7200000).toISOString(),
        });
      }
    }
  }

  // Every other studio carries a few reviews as well, so opening any of the
  // twenty shows real words rather than an empty "what guests said" section.
  SALONS.filter((s) => s.id !== salon.id).forEach((other) => {
    const otherStaff = other.barberIds.map((id) => getBarber(id)!).filter(Boolean);
    const count = 3 + Math.floor(rand() * 5);
    for (let i = 0; i < count; i++) {
      const barber = pick(otherStaff);
      const daysBack = 1 + Math.floor(rand() * 60);
      reviews.push({
        id: `rv-seed-${other.id}-${i}`,
        bookingId: `seed-${other.id}-${i}`,
        salonId: other.id,
        barberId: barber.id,
        barberName: barber.name,
        authorName: pick(DEMO_NAMES),
        rating: rand() < 0.7 ? 5 : rand() < 0.8 ? 3 : 4,
        text: pick(DEMO_TEXT),
        createdAt: new Date(Date.now() - daysBack * 86400000).toISOString(),
      });
    }
  });

  target.bookings = bookings;
  target.reviews = reviews;
}

// Module initialisation happens last: every constant the seed reads now exists.
state = load();

// Write the seeded first run straight back, so the demo studio is a saved record
// from the first launch rather than something regenerated on every reload.
if (!seededFromStorage) persist();
