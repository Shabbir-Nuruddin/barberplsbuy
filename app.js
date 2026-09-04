/**
 * THE CROWN SALON - TWO-COMPONENT ARCHITECTURE
 * Component 1: Customer End (District-inspired booking, recruitment dossier cards & court schedules)
 * Component 2: Business Management End (Barber onboarding, real photo uploads, skill configurator, live chairs, cashbook)
 */

// --- Currency Config ---
const CURRENCIES = {
  INR: { symbol: '₹', rate: 1, phoneCode: '+91', discountDefault: 50 },
  USD: { symbol: '$', rate: 0.012, phoneCode: '+1', discountDefault: 5 },
  GBP: { symbol: '£', rate: 0.0095, phoneCode: '+44', discountDefault: 5 },
  EUR: { symbol: '€', rate: 0.011, phoneCode: '+49', discountDefault: 5 },
  AED: { symbol: 'AED ', rate: 0.044, phoneCode: '+971', discountDefault: 20 },
};

let currentCurrency = 'INR';

// Clean out sample data from previous sessions so NO mock people exist
if (localStorage.getItem('tb_cleaned_no_sample_v6') !== 'true') {
  localStorage.removeItem('tb_stylists');
  localStorage.removeItem('tb_chairs');
  localStorage.removeItem('tb_queue');
  localStorage.removeItem('tb_recall');
  localStorage.removeItem('tb_transactions');
  localStorage.setItem('tb_cleaned_no_sample_v6', 'true');
}

// --- Default Salon & Business Profile (Fully editable by the salon owner / barber) ---
const DEFAULT_BUSINESS = {
  name: 'The Crown Salon & Grooming Club',
  tagline: 'Luxury Haircuts, Precision Skin Fades & Restorative Scalp Spa',
  address: 'Lane 7, Koregaon Park, Pune • 1.2 km away',
  phone: '9820198765',
  coverPhoto: 'assets/salon_hero.jpg',
  hours: '10:00 AM – 09:00 PM',
  rating: 4.96,
  reviewsCount: 428
};

// --- Clean Service Catalog ---
const SERVICES = [
  { id: 'fade', name: 'Signature Skin Fade / Haircut', price: 350, duration: 30, tag: 'Most Popular', icon: 'scissors' },
  { id: 'beard', name: 'Precision Beard Trim & Sculpt', price: 180, duration: 20, tag: 'Razor Sharp', icon: 'smile' },
  { id: 'combo', name: 'Haircut + Beard Lineup Combo', price: 480, duration: 45, tag: 'Best Value', icon: 'sparkles' },
  { id: 'spa', name: 'Deep Conditioning Scalp Spa', price: 650, duration: 45, tag: 'Relaxing Ritual', icon: 'heart-pulse' },
  { id: 'facial', name: 'Charcoal Detox Face Cleanse', price: 220, duration: 20, tag: 'Skin Refresh', icon: 'zap' },
  { id: 'massage', name: 'Hot Oil Head & Shoulder Massage', price: 250, duration: 20, tag: 'Stress Relief', icon: 'coffee' }
];

const BASE_SLOTS = [
  { time: '10:00 AM', period: 'morning' },
  { time: '10:30 AM', period: 'morning' },
  { time: '11:00 AM', period: 'morning' },
  { time: '11:30 AM', period: 'morning' },
  { time: '12:00 PM', period: 'morning' },
  { time: '12:30 PM', period: 'morning' },
  { time: '01:00 PM', period: 'afternoon' },
  { time: '01:30 PM', period: 'afternoon' },
  { time: '02:00 PM', period: 'afternoon' },
  { time: '02:30 PM', period: 'afternoon' },
  { time: '03:00 PM', period: 'afternoon' },
  { time: '03:30 PM', period: 'afternoon' },
  { time: '04:00 PM', period: 'afternoon' },
  { time: '04:30 PM', period: 'afternoon' },
  { time: '05:00 PM', period: 'evening' },
  { time: '05:30 PM', period: 'evening' },
  { time: '06:00 PM', period: 'evening' },
  { time: '06:30 PM', period: 'evening' },
  { time: '07:00 PM', period: 'evening' },
  { time: '07:30 PM', period: 'evening' },
  { time: '08:00 PM', period: 'evening' },
  { time: '08:30 PM', period: 'evening' },
];

// --- Persistent Application State ---
class SalonState {
  constructor() {
    this.business = JSON.parse(localStorage.getItem('tb_business')) || DEFAULT_BUSINESS;
    this.stylists = JSON.parse(localStorage.getItem('tb_stylists')) || [];
    this.chairs = JSON.parse(localStorage.getItem('tb_chairs')) || [];
    this.queue = JSON.parse(localStorage.getItem('tb_queue')) || [];
    this.recall = JSON.parse(localStorage.getItem('tb_recall')) || [];
    this.transactions = JSON.parse(localStorage.getItem('tb_transactions')) || [];
    this.currency = localStorage.getItem('tb_currency') || 'INR';
    currentCurrency = this.currency;
  }

  save() {
    localStorage.setItem('tb_business', JSON.stringify(this.business));
    localStorage.setItem('tb_stylists', JSON.stringify(this.stylists));
    localStorage.setItem('tb_chairs', JSON.stringify(this.chairs));
    localStorage.setItem('tb_queue', JSON.stringify(this.queue));
    localStorage.setItem('tb_recall', JSON.stringify(this.recall));
    localStorage.setItem('tb_transactions', JSON.stringify(this.transactions));
    localStorage.setItem('tb_currency', this.currency);
  }
}

const state = new SalonState();

// --- Formatting Helpers ---
function formatMoney(amountINR) {
  const cfg = CURRENCIES[currentCurrency] || CURRENCIES.INR;
  const converted = amountINR * cfg.rate;
  if (currentCurrency === 'INR') {
    return '₹' + converted.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  } else if (currentCurrency === 'AED') {
    return 'AED ' + converted.toFixed(0);
  } else {
    return cfg.symbol + converted.toFixed(0);
  }
}

function showToast(msg) {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

function generateInitialsAvatar(name) {
  const parts = (name || 'B').trim().split(/\s+/);
  const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="16" fill="#1e293b"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-size="42" font-weight="800" fill="#3b82f6">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// --- District Customer Booking State ---
let activeViewMode = 'customer'; // 'customer' | 'manager'
let isPhoneFrame = false;
let selectedBarberId = state.stylists[0]?.id || null;
let selectedDateOffset = 0; // 0 = Today, 1 = Tomorrow, etc.
let selectedPeriodFilter = 'all'; // 'all' | 'morning' | 'afternoon' | 'evening'
let selectedSlotTime = '04:30 PM';
let customerSelectedServices = new Set(['fade']);
let activeCategoryFilter = 'all';

// Active Manager State
let activeCheckoutChairIndex = null;
let walkinSelectedServices = new Set(['fade']);
let activeRecallOffer = 'discount';
let currentUploadedPhotoBase64 = '';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initComponentSwitcher();
  initClock();
  initCurrency();
  initBusinessProfileModal();
  initClearDataButton();
  initDistrictCustomerApp();
  initManagerTabs();
  initBarberOnboardingModal();
  initWalkinModal();
  initCheckoutModal();
  initRecallOffers();
  initExpenseForm();

  renderAll();
});

// =========================================================================
// 1. GLOBAL COMPONENT SWITCHER (Customer End vs Business Management End)
// =========================================================================
function initComponentSwitcher() {
  const btnCustomer = document.getElementById('btn-mode-customer');
  const btnManager = document.getElementById('btn-mode-manager');
  const viewCustomer = document.getElementById('view-customer');
  const viewManager = document.getElementById('view-manager');
  const btnFrameToggle = document.getElementById('btn-frame-toggle');
  const frameShell = document.getElementById('district-app-shell');
  const frameToggleLbl = document.getElementById('frame-toggle-lbl');

  btnCustomer?.addEventListener('click', () => {
    activeViewMode = 'customer';
    btnCustomer.classList.add('active');
    btnManager?.classList.remove('active');
    viewCustomer?.classList.add('active');
    viewManager?.classList.remove('active');
    renderDistrictCustomerApp();
  });

  btnManager?.addEventListener('click', () => {
    activeViewMode = 'manager';
    btnManager.classList.add('active');
    btnCustomer?.classList.remove('active');
    viewManager?.classList.add('active');
    viewCustomer?.classList.remove('active');
    renderAll();
  });

  // Mobile Shell Preview Toggle
  btnFrameToggle?.addEventListener('click', () => {
    isPhoneFrame = !isPhoneFrame;
    if (frameShell) {
      if (isPhoneFrame) {
        frameShell.classList.add('phone-mockup-frame');
        if (frameToggleLbl) frameToggleLbl.textContent = 'Full View';
        showToast('📱 Switched to Phone Mockup Preview');
      } else {
        frameShell.classList.remove('phone-mockup-frame');
        if (frameToggleLbl) frameToggleLbl.textContent = 'Phone View';
        showToast('🖥️ Switched to Full Responsive View');
      }
    }
  });
}

// =========================================================================
// 2. THEME & CURRENCY CONTROLLERS
// =========================================================================
function initTheme() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-toggle-icon');
  const themeText = document.getElementById('theme-toggle-text');
  
  const savedTheme = localStorage.getItem('tb_21st_theme') || 'dark';
  applyTheme(savedTheme);

  themeBtn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    showToast(`Switched to 21st.dev ${nextTheme === 'dark' ? 'Darkmatter' : 'Light'} theme`);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tb_21st_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
      if (themeText) themeText.textContent = 'Light Mode';
    } else {
      document.documentElement.classList.remove('dark');
      if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
      if (themeText) themeText.textContent = 'Darkmatter';
    }
    if (window.lucide) window.lucide.createIcons();
  }
}

function initClock() {
  setInterval(() => {
    const d = new Date();
    const clock = document.getElementById('header-clock');
    if (clock) clock.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, 1000);
}

function initCurrency() {
  const sel = document.getElementById('currency-select');
  if (!sel) return;
  sel.value = state.currency;

  sel.addEventListener('change', (e) => {
    state.currency = e.target.value;
    currentCurrency = state.currency;
    state.save();
    document.querySelectorAll('.currency-label').forEach(el => el.textContent = CURRENCIES[currentCurrency].symbol);
    renderAll();
    showToast(`Switched currency to ${state.currency}`);
  });
}

// =========================================================================
// 3. COMPONENT 1: DISTRICT CUSTOMER APP & COURT SCHEDULE ENGINE
// =========================================================================

function getUpcomingDays() {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dayLabel = i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : dayNames[d.getDay()]);
    const dateStr = `${monthNames[d.getMonth()]} ${d.getDate()}`;
    days.push({
      offset: i,
      dayLabel: dayLabel,
      dateStr: dateStr,
      fullDate: d.toDateString(),
      openSlots: i === 0 ? 5 : (10 + ((i * 3) % 5))
    });
  }
  return days;
}

function getSlotsForBarberAndDate(barberId, dateOffset) {
  const barber = state.stylists.find(s => s.id === barberId) || state.stylists[0];
  if (!barber) return [];

  return BASE_SLOTS.map((slot, idx) => {
    let status = 'available';
    if (dateOffset === 0) {
      if (['04:00 PM', '04:15 PM', '05:00 PM'].includes(slot.time) && barber.chair === 'Chair 1') {
        status = 'booked';
      } else if (['03:30 PM', '04:00 PM'].includes(slot.time) && barber.chair === 'Chair 2') {
        status = 'booked';
      } else if (['11:30 AM', '02:30 PM', '06:30 PM'].includes(slot.time)) {
        status = 'filling-fast';
      } else if (idx % 6 === 0) {
        status = 'booked';
      }
    } else {
      if ((idx + dateOffset * 3) % 7 === 0) status = 'booked';
      else if ((idx + dateOffset) % 5 === 0) status = 'filling-fast';
    }

    return {
      time: slot.time,
      period: slot.period,
      status: status,
      chair: barber.chair,
      barberName: barber.name,
      price: barber.basePrice,
      duration: 30
    };
  });
}

function calculateCustomerTotal() {
  const barber = state.stylists.find(s => s.id === selectedBarberId) || state.stylists[0];
  let total = 0;
  let duration = 0;
  const selectedServiceNames = [];

  customerSelectedServices.forEach(srvId => {
    const s = SERVICES.find(item => item.id === srvId);
    if (s) {
      total += s.price;
      duration += s.duration;
      selectedServiceNames.push(s.name);
    }
  });

  if (total === 0 && barber) {
    total = barber.basePrice;
    duration = 30;
    selectedServiceNames.push('Signature Cut');
  }

  return { total, duration, selectedServiceNames };
}

function initDistrictCustomerApp() {
  // Category Filter Pills
  const catPills = document.querySelectorAll('.cat-filter-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategoryFilter = pill.getAttribute('data-cat') || 'all';
      renderBarberAssessmentCards();
    });
  });

  // Period Filter Pills for Court Matrix
  const periodPills = document.querySelectorAll('.period-filter-pill');
  periodPills.forEach(pill => {
    pill.addEventListener('click', () => {
      periodPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedPeriodFilter = pill.getAttribute('data-period') || 'all';
      renderCourtSlots();
    });
  });

  // Open Bottom Sheet from Sticky Bar
  document.getElementById('district-sticky-book-btn')?.addEventListener('click', () => {
    openDistrictBookingSheet();
  });

  // Close Booking Sheet
  document.getElementById('close-booking-sheet-btn')?.addEventListener('click', () => {
    document.getElementById('district-booking-sheet').style.display = 'none';
  });

  // Close Ticket Modal
  document.getElementById('close-ticket-modal-btn')?.addEventListener('click', () => {
    document.getElementById('district-ticket-modal').style.display = 'none';
  });

  // Confirm Booking Form
  document.getElementById('district-booking-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    confirmDistrictBooking();
  });
}

function renderDistrictCustomerApp() {
  renderBusinessProfile();

  const countSpan = document.getElementById('total-barbers-count');
  if (countSpan) countSpan.textContent = state.stylists.length;

  renderBarberAssessmentCards();
  renderDateScroller();
  renderCourtSlots();
  renderServiceCustomizer();
  renderBottomBookingBar();
}

function renderBarberAssessmentCards() {
  const container = document.getElementById('barber-cards-grid');
  if (!container) return;

  if (state.stylists.length === 0) {
    container.innerHTML = `
      <div class="empty-barber-box">
        <i data-lucide="scissors"></i>
        <h4>No Barbers Onboarded Yet</h4>
        <p>This salon is currently setting up its staff roster. Are you the salon owner or a barber?</p>
        <button class="btn-go-manager" onclick="switchToManager()">
          <i data-lucide="building-2"></i> Onboard Barbers in Business Management
        </button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Ensure valid selected barber
  if (!state.stylists.some(s => s.id === selectedBarberId)) {
    selectedBarberId = state.stylists[0].id;
  }

  const filtered = state.stylists.filter(s => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'available') return (s.openSlotsToday || 4) > 3;
    return s.category === activeCategoryFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-barber-box"><p>No barbers match this specialty. Try 'All Barbers'.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(b => {
    const isSelected = b.id === selectedBarberId;
    return `
      <div class="dossier-card ${isSelected ? 'selected' : ''}" onclick="selectBarber('${b.id}')">
        
        <!-- Portrait & Header -->
        <div class="dossier-top">
          <div class="dossier-photo-wrap">
            <img src="${b.photo}" alt="${b.name}" class="dossier-photo" onerror="this.src='assets/barber_alex.jpg'" />
            <span class="dossier-chair-badge">${b.chair}</span>
          </div>

          <div class="dossier-meta">
            <div class="dossier-title-row">
              <div>
                <h3 class="dossier-name">${b.name}</h3>
                <span class="dossier-role">${b.role}</span>
              </div>
              <div class="dossier-rating-badge">
                <i data-lucide="star"></i> ${b.rating || 4.9} <span>(${b.reviewsCount || 120})</span>
              </div>
            </div>

            <div class="dossier-stat-strip">
              <div class="d-chip"><i data-lucide="award"></i> ${b.experience || '5+ Years Exp.'}</div>
              <div class="d-chip price"><i data-lucide="banknote"></i> From ${formatMoney(b.basePrice)}</div>
              <div class="d-chip live"><span class="dot-online"></span> ${b.openSlotsToday || 4} Slots Today</div>
            </div>
          </div>
        </div>

        <!-- Skills Progress Meter Section (from Recruitment Dossier UI) -->
        <div class="dossier-skills-section">
          <div class="skills-sec-title">
            <span><i data-lucide="activity"></i> Verified Chair Skillset</span>
            <span class="skills-verified-tag">Verified Master</span>
          </div>

          <div class="skills-grid">
            ${(b.skills || []).map(sk => `
              <div class="skill-meter-row">
                <div class="skill-meter-lbl">
                  <span>${sk.name}</span>
                  <strong>${sk.level}</strong>
                </div>
                <div class="skill-track">
                  <div class="skill-fill" style="width: ${sk.meter}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Signature Traits & Perks -->
        <div class="dossier-traits-section">
          <div class="traits-sec-title"><i data-lucide="sparkles"></i> Signature Traits</div>
          <div class="traits-chips-list">
            ${(b.traits || []).map(tr => `
              <div class="trait-pill" title="${tr.desc || tr.title}">
                <i data-lucide="${tr.icon || 'check-circle-2'}"></i>
                <span>${tr.title}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Bio Dossier -->
        <div class="dossier-bio">
          <i data-lucide="quote" class="bio-quote-icon"></i>
          <p>${b.bio || 'Experienced stylist committed to top-tier haircuts and client satisfaction.'}</p>
        </div>

        <!-- Action Trigger -->
        <div class="dossier-footer">
          <button class="btn-dossier-select ${isSelected ? 'active' : ''}">
            <i data-lucide="${isSelected ? 'calendar-check' : 'calendar'}"></i>
            <span>${isSelected ? 'Selected Stylist (Viewing Schedule)' : 'View Available Slots & Schedule'}</span>
          </button>
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function renderDateScroller() {
  const container = document.getElementById('date-scroller-track');
  if (!container) return;

  const days = getUpcomingDays();

  container.innerHTML = days.map(d => {
    const isSelected = d.offset === selectedDateOffset;
    return `
      <div class="date-pill-card ${isSelected ? 'selected' : ''}" onclick="selectDate(${d.offset})">
        <span class="d-day-name">${d.dayLabel}</span>
        <strong class="d-day-date">${d.dateStr}</strong>
        <span class="d-slots-left">${d.openSlots} open</span>
      </div>
    `;
  }).join('');
}

function renderCourtSlots() {
  const container = document.getElementById('court-slots-grid');
  const barberHeading = document.getElementById('schedule-barber-name');
  if (!container) return;

  const barber = state.stylists.find(s => s.id === selectedBarberId) || state.stylists[0];
  if (!barber || state.stylists.length === 0) {
    if (barberHeading) barberHeading.textContent = 'No Barber Selected';
    container.innerHTML = `<div class="empty-slots-msg" style="grid-column: 1 / -1; padding: 28px 16px; text-align: center; color: var(--text-soft); font-size: 13px;">No barbers onboarded yet. Add your staff in Business Management to view live court availability slots.</div>`;
    return;
  }

  if (barberHeading) barberHeading.textContent = `${barber.name} (${barber.chair})`;

  const slots = getSlotsForBarberAndDate(selectedBarberId, selectedDateOffset);

  const filteredSlots = slots.filter(s => {
    if (selectedPeriodFilter === 'all') return true;
    return s.period === selectedPeriodFilter;
  });

  if (filteredSlots.length === 0) {
    container.innerHTML = `<div class="empty-slots-msg">No slots available for this period. Try another time of day!</div>`;
    return;
  }

  container.innerHTML = filteredSlots.map(slot => {
    const isSelected = slot.time === selectedSlotTime && slot.status !== 'booked';
    const isBooked = slot.status === 'booked';
    const isFillingFast = slot.status === 'filling-fast';

    let statusBadge = `<span class="court-badge available">Open</span>`;
    if (isBooked) statusBadge = `<span class="court-badge booked"><i data-lucide="lock"></i> Booked</span>`;
    else if (isFillingFast) statusBadge = `<span class="court-badge fast">Filling Fast</span>`;

    return `
      <div class="court-slot-card ${isSelected ? 'selected' : ''} ${slot.status}" 
           ${isBooked ? '' : `onclick="selectSlot('${slot.time}')"`}>
        
        <div class="slot-card-top">
          <span class="slot-time">${slot.time}</span>
          ${statusBadge}
        </div>

        <div class="slot-card-mid">
          <span class="slot-court-tag"><i data-lucide="armchair"></i> ${slot.chair}</span>
          <span class="slot-duration">${slot.duration}m duration</span>
        </div>

        <div class="slot-card-bot">
          <span class="slot-price">${formatMoney(slot.price)}</span>
          ${isSelected ? '<span class="slot-check-icon"><i data-lucide="check"></i></span>' : ''}
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function renderServiceCustomizer() {
  const container = document.getElementById('service-customizer-list');
  if (!container) return;

  container.innerHTML = SERVICES.map(s => {
    const isChecked = customerSelectedServices.has(s.id);
    return `
      <div class="service-select-row ${isChecked ? 'active' : ''}" onclick="toggleCustomerService('${s.id}')">
        <div class="srv-row-left">
          <div class="srv-checkbox ${isChecked ? 'checked' : ''}">
            ${isChecked ? '<i data-lucide="check"></i>' : ''}
          </div>
          <div>
            <div class="srv-name-row">
              <span class="srv-title">${s.name}</span>
              ${s.tag ? `<span class="srv-tag">${s.tag}</span>` : ''}
            </div>
            <span class="srv-dur">${s.duration} mins • Professional styling & finish</span>
          </div>
        </div>

        <div class="srv-row-right">
          <span class="srv-cost">${formatMoney(s.price)}</span>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function renderBottomBookingBar() {
  const bar = document.getElementById('district-sticky-bar');
  if (!bar) return;

  const barber = state.stylists.find(s => s.id === selectedBarberId) || state.stylists[0];
  if (!barber || state.stylists.length === 0) {
    bar.style.display = 'none';
    return;
  }
  bar.style.display = 'flex';

  const days = getUpcomingDays();
  const chosenDay = days[selectedDateOffset] || days[0];
  const calc = calculateCustomerTotal();

  const thumbImg = document.getElementById('sticky-barber-thumb');
  if (thumbImg) {
    thumbImg.src = barber.photo;
    thumbImg.onerror = () => { thumbImg.src = 'assets/barber_alex.jpg'; };
  }

  document.getElementById('sticky-barber-name').textContent = barber.name;
  document.getElementById('sticky-slot-preview').textContent = `${chosenDay.dayLabel}, ${chosenDay.dateStr} @ ${selectedSlotTime}`;
  document.getElementById('sticky-services-count').textContent = `${customerSelectedServices.size} service(s) • ${calc.duration} mins`;
  document.getElementById('sticky-total-price').textContent = formatMoney(calc.total);
}

function openDistrictBookingSheet() {
  const sheet = document.getElementById('district-booking-sheet');
  if (!sheet) return;

  const barber = state.stylists.find(s => s.id === selectedBarberId) || state.stylists[0];
  if (!barber) return;

  const days = getUpcomingDays();
  const chosenDay = days[selectedDateOffset] || days[0];
  const calc = calculateCustomerTotal();

  document.getElementById('sheet-barber-name').textContent = `${barber.name} (${barber.chair})`;
  document.getElementById('sheet-schedule-time').textContent = `${chosenDay.dayLabel}, ${chosenDay.dateStr} @ ${selectedSlotTime}`;
  document.getElementById('sheet-services-list').textContent = calc.selectedServiceNames.join(' + ');
  document.getElementById('sheet-total-amount').textContent = formatMoney(calc.total);

  sheet.style.display = 'flex';
}

function confirmDistrictBooking() {
  const name = document.getElementById('sheet-cust-name').value.trim();
  const phone = document.getElementById('sheet-cust-phone').value.trim();
  const payOption = document.querySelector('input[name="sheet-pay"]:checked')?.value || 'Pay at Salon';

  if (!name || !phone) {
    alert('Please enter your full name and WhatsApp phone number.');
    return;
  }

  const barber = state.stylists.find(s => s.id === selectedBarberId) || state.stylists[0];
  const days = getUpcomingDays();
  const chosenDay = days[selectedDateOffset] || days[0];
  const calc = calculateCustomerTotal();

  const newBooking = {
    id: `q-${Date.now()}`,
    time: selectedSlotTime,
    date: `${chosenDay.dayLabel}, ${chosenDay.dateStr}`,
    name: name,
    phone: phone,
    barber: barber ? barber.name : 'Master Barber',
    service: calc.selectedServiceNames.join(' + '),
    price: calc.total,
    payment: payOption,
  };

  // Add to salon queue
  state.queue.push(newBooking);
  state.save();

  // Hide booking sheet
  document.getElementById('district-booking-sheet').style.display = 'none';

  // Prepare Confirmation Ticket Modal
  document.getElementById('ticket-cust-name').textContent = name;
  document.getElementById('ticket-barber-name').textContent = `${barber ? barber.name : ''} (${barber ? barber.chair : ''})`;
  document.getElementById('ticket-time').textContent = `${chosenDay.dayLabel} @ ${selectedSlotTime}`;
  document.getElementById('ticket-services').textContent = calc.selectedServiceNames.join(' + ');
  document.getElementById('ticket-total').textContent = formatMoney(calc.total);
  document.getElementById('ticket-id').textContent = `TICKET #${newBooking.id.slice(-6).toUpperCase()}`;

  // WhatsApp Link
  const phoneCode = CURRENCIES[currentCurrency].phoneCode;
  const cleanPhone = phone.replace(/\D/g, '');
  const fullPhone = cleanPhone.startsWith(phoneCode.replace('+', '')) ? cleanPhone : `${phoneCode.replace('+', '')}${cleanPhone}`;
  const msg = `🎉 *The Crown Salon - Appointment Confirmation*\n\nHi ${name}!\nYour appointment is confirmed.\n\n• Barber: ${barber ? barber.name : ''} (${barber ? barber.chair : ''})\n• Time: ${chosenDay.dayLabel}, ${chosenDay.dateStr} @ ${selectedSlotTime}\n• Services: ${calc.selectedServiceNames.join(' + ')}\n• Total: ${formatMoney(calc.total)}\n• Payment: ${payOption}\n\n📍 The Crown Salon, Koregaon Park, Pune\nSee you soon! 💈`;

  const waBtn = document.getElementById('ticket-whatsapp-btn');
  if (waBtn) {
    waBtn.href = `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
  }

  document.getElementById('district-ticket-modal').style.display = 'flex';

  renderAll();
  showToast(`Booking confirmed for ${name} with ${barber ? barber.name : 'Barber'}!`);
}

// =========================================================================
// 4. COMPONENT 2: BUSINESS MANAGEMENT END (STAFF ONBOARDING & SALON OS)
// =========================================================================

function initManagerTabs() {
  const tabBtns = document.querySelectorAll('.manager-sub-header .tab-btn');
  const views = {
    staff: document.getElementById('view-staff'),
    chairs: document.getElementById('view-chairs'),
    recall: document.getElementById('view-recall'),
    money: document.getElementById('view-money'),
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      Object.values(views).forEach(v => v?.classList.remove('active'));
      if (views[tab]) views[tab].classList.add('active');

      renderAll();
    });
  });
}

// =========================================================================
// BUSINESS & SALON PROFILE SETUP
// =========================================================================

function initBusinessProfileModal() {
  const modal = document.getElementById('edit-business-modal');
  const openBtn = document.getElementById('open-edit-business-btn');
  const quickCoverBtn = document.getElementById('quick-change-cover-btn');
  const closeBtn = document.getElementById('close-business-modal');
  const cancelBtn = document.getElementById('cancel-business-btn');
  const form = document.getElementById('edit-business-form');
  const fileInput = document.getElementById('business-cover-file-input');
  const dropzone = document.getElementById('business-cover-dropzone');
  const previewImg = document.getElementById('biz-cover-preview');

  let currentCoverBase64 = state.business.coverPhoto || 'assets/salon_hero.jpg';

  const populateForm = () => {
    document.getElementById('biz-input-name').value = state.business.name;
    document.getElementById('biz-input-tagline').value = state.business.tagline;
    document.getElementById('biz-input-address').value = state.business.address;
    document.getElementById('biz-input-phone').value = state.business.phone;
    document.getElementById('biz-input-hours').value = state.business.hours || '10:00 AM – 09:00 PM';
    currentCoverBase64 = state.business.coverPhoto || 'assets/salon_hero.jpg';
    if (previewImg) previewImg.src = currentCoverBase64;
  };

  openBtn?.addEventListener('click', () => {
    populateForm();
    modal.style.display = 'flex';
  });

  quickCoverBtn?.addEventListener('click', () => {
    populateForm();
    modal.style.display = 'flex';
  });

  closeBtn?.addEventListener('click', () => { modal.style.display = 'none'; });
  cancelBtn?.addEventListener('click', () => { modal.style.display = 'none'; });

  // Cover photo upload & FileReader
  dropzone?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        currentCoverBase64 = evt.target.result;
        if (previewImg) previewImg.src = currentCoverBase64;
        showToast('Storefront photo uploaded!');
      };
      reader.readAsDataURL(file);
    }
  });

  // Drag and drop for cover
  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        currentCoverBase64 = evt.target.result;
        if (previewImg) previewImg.src = currentCoverBase64;
        showToast('Storefront photo uploaded!');
      };
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.business.name = document.getElementById('biz-input-name').value.trim();
    state.business.tagline = document.getElementById('biz-input-tagline').value.trim();
    state.business.address = document.getElementById('biz-input-address').value.trim();
    state.business.phone = document.getElementById('biz-input-phone').value.trim();
    state.business.hours = document.getElementById('biz-input-hours').value.trim();
    state.business.coverPhoto = currentCoverBase64;

    state.save();
    modal.style.display = 'none';
    renderAll();
    showToast('Salon & Business Profile saved successfully!');
  });
}

function renderBusinessProfile() {
  const b = state.business;
  // Customer End bindings:
  const globalShopName = document.getElementById('global-shop-name');
  const venueCoverImg = document.getElementById('venue-cover-img');
  const venueRatingVal = document.getElementById('venue-rating-val');
  const venueReviewsCount = document.getElementById('venue-reviews-count');
  const venueTitle = document.getElementById('venue-title');
  const venueSub = document.getElementById('venue-sub');
  const venueLocTxt = document.getElementById('venue-location-txt');

  if (globalShopName) globalShopName.textContent = b.name;
  if (venueCoverImg) {
    venueCoverImg.src = b.coverPhoto || 'assets/salon_hero.jpg';
    venueCoverImg.onerror = () => { venueCoverImg.src = 'assets/salon_hero.jpg'; };
  }
  if (venueRatingVal) venueRatingVal.textContent = b.rating || '4.96';
  if (venueReviewsCount) venueReviewsCount.textContent = b.reviewsCount || '428';
  if (venueTitle) venueTitle.textContent = b.name;
  if (venueSub) venueSub.textContent = b.tagline;
  if (venueLocTxt) venueLocTxt.textContent = b.address;

  // Business Management End bindings:
  const bizCardCover = document.getElementById('biz-card-cover');
  const bizCardName = document.getElementById('biz-card-name');
  const bizCardTagline = document.getElementById('biz-card-tagline');
  const bizCardAddress = document.getElementById('biz-card-address');
  const bizCardPhone = document.getElementById('biz-card-phone');
  const bizCardHours = document.getElementById('biz-card-hours');

  if (bizCardCover) {
    bizCardCover.src = b.coverPhoto || 'assets/salon_hero.jpg';
    bizCardCover.onerror = () => { bizCardCover.src = 'assets/salon_hero.jpg'; };
  }
  if (bizCardName) bizCardName.textContent = b.name;
  if (bizCardTagline) bizCardTagline.textContent = b.tagline;
  if (bizCardAddress) bizCardAddress.textContent = b.address;
  if (bizCardPhone) bizCardPhone.textContent = b.phone;
  if (bizCardHours) bizCardHours.textContent = b.hours;
}

function initClearDataButton() {
  const btn = document.getElementById('btn-clear-all-data');
  btn?.addEventListener('click', () => {
    if (!confirm('Start completely fresh? This will clear all sample barbers, chairs, and appointments so you can upload your real team from scratch.')) {
      return;
    }
    state.stylists = [];
    state.chairs = [];
    state.queue = [];
    state.recall = [];
    state.transactions = [];
    selectedBarberId = null;
    state.save();
    renderAll();
    showToast('✨ Clean slate ready! Click "+ Onboard Barber" to add your team.');
  });
}

// =========================================================================
// REAL BARBER ONBOARDING & STAFF ROSTER
// =========================================================================

function initBarberOnboardingModal() {
  const modal = document.getElementById('onboard-barber-modal');
  const openBtn1 = document.getElementById('open-onboard-modal-btn');
  const openBtn2 = document.getElementById('banner-onboard-barber-btn');
  const closeBtn = document.getElementById('close-onboard-modal');
  const cancelBtn = document.getElementById('cancel-onboard-btn');
  const form = document.getElementById('onboard-barber-form');
  const fileInput = document.getElementById('onboard-file-input');
  const dropzone = document.getElementById('photo-dropzone');
  const previewImg = document.getElementById('onboard-photo-preview');
  const placeholderAvatar = document.getElementById('onboard-photo-placeholder');
  const uploadTitle = document.getElementById('onboard-upload-title');
  const modalTitle = document.getElementById('onboard-modal-title');
  const saveBtnLbl = document.getElementById('btn-save-barber-lbl');
  const barberIdInput = document.getElementById('onboard-barber-id');

  window.openOnboardBarberModal = () => {
    if (barberIdInput) barberIdInput.value = '';
    currentUploadedPhotoBase64 = '';
    if (previewImg) { previewImg.style.display = 'none'; previewImg.src = ''; }
    if (placeholderAvatar) placeholderAvatar.style.display = 'flex';
    if (uploadTitle) uploadTitle.textContent = 'Click to upload barber photo';
    if (modalTitle) modalTitle.innerHTML = '<i data-lucide="user-plus"></i> Onboard New Barber';
    if (saveBtnLbl) saveBtnLbl.textContent = 'Add Barber to Roster';
    form.reset();
    updateSliderOutputs();
    modal.style.display = 'flex';
    if (window.lucide) window.lucide.createIcons();
  };

  openBtn1?.addEventListener('click', window.openOnboardBarberModal);
  openBtn2?.addEventListener('click', window.openOnboardBarberModal);

  closeBtn?.addEventListener('click', () => { modal.style.display = 'none'; });
  cancelBtn?.addEventListener('click', () => { modal.style.display = 'none'; });

  // Photo Upload Trigger & File Reader
  dropzone?.addEventListener('click', () => {
    fileInput?.click();
  });

  const handleImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      currentUploadedPhotoBase64 = event.target.result;
      if (previewImg) {
        previewImg.src = currentUploadedPhotoBase64;
        previewImg.style.display = 'block';
      }
      if (placeholderAvatar) placeholderAvatar.style.display = 'none';
      if (uploadTitle) uploadTitle.textContent = 'Photo selected (click to replace)';
      showToast('Barber photo uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  fileInput?.addEventListener('change', (e) => {
    handleImageFile(e.target.files[0]);
  });

  // Drag and Drop
  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone?.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  // Sliders Live Counter Sync
  const sFades = document.getElementById('slider-fades');
  const sBeards = document.getElementById('slider-beards');
  const sScissors = document.getElementById('slider-scissors');
  const sSpeed = document.getElementById('slider-speed');

  function updateSliderOutputs() {
    if (sFades) document.getElementById('slider-val-fades').textContent = `${sFades.value}%`;
    if (sBeards) document.getElementById('slider-val-beards').textContent = `${sBeards.value}%`;
    if (sScissors) document.getElementById('slider-val-scissors').textContent = `${sScissors.value}%`;
    if (sSpeed) document.getElementById('slider-val-speed').textContent = `${sSpeed.value} mins`;
  }

  sFades?.addEventListener('input', updateSliderOutputs);
  sBeards?.addEventListener('input', updateSliderOutputs);
  sScissors?.addEventListener('input', updateSliderOutputs);
  sSpeed?.addEventListener('input', updateSliderOutputs);

  // Form Submit -> Add or Edit Barber
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const editId = barberIdInput ? barberIdInput.value : '';
    const name = document.getElementById('onboard-name').value.trim();
    const chair = document.getElementById('onboard-chair').value;
    const role = document.getElementById('onboard-role').value.trim();
    const price = parseFloat(document.getElementById('onboard-price').value) || 350;
    const exp = document.getElementById('onboard-exp').value.trim() || '5+ Years Exp.';
    const category = document.getElementById('onboard-category').value;
    const bio = document.getElementById('onboard-bio').value.trim();

    // Traits
    const traitCheckboxes = document.querySelectorAll('input[name="onboard-trait"]:checked');
    const traits = Array.from(traitCheckboxes).map(cb => {
      let icon = 'check-circle-2';
      if (cb.value.includes('Lightning')) icon = 'zap';
      if (cb.value.includes('Razor')) icon = 'scissors';
      if (cb.value.includes('Silent')) icon = 'volume-x';
      if (cb.value.includes('Beard')) icon = 'shield-check';
      if (cb.value.includes('Instagram')) icon = 'award';
      return { icon, title: cb.value, desc: 'Verified specialty trait' };
    });

    if (traits.length === 0) {
      traits.push({ icon: 'zap', title: 'Speed & Precision', desc: 'Verified master cut' });
    }

    const finalPhoto = currentUploadedPhotoBase64 || generateInitialsAvatar(name);

    if (editId) {
      // Edit existing barber
      const existing = state.stylists.find(s => s.id === editId);
      if (existing) {
        existing.name = name;
        existing.chair = chair;
        existing.role = role;
        existing.photo = finalPhoto;
        existing.experience = exp;
        existing.basePrice = price;
        existing.category = category;
        existing.bio = bio;
        existing.skills = [
          { name: 'Fades & Tapers', level: `${sFades.value}%`, meter: parseInt(sFades.value) },
          { name: 'Beard Sculpting', level: `${sBeards.value}%`, meter: parseInt(sBeards.value) },
          { name: 'Scissors & Texture', level: `${sScissors.value}%`, meter: parseInt(sScissors.value) },
          { name: 'Turnaround Speed', level: `${sSpeed.value} mins`, meter: 95 },
        ];
        existing.traits = traits;
      }
      showToast(`Barber ${name} updated successfully!`);
    } else {
      // Add new barber
      const newId = `st-${Date.now()}`;
      const newBarber = {
        id: newId,
        name: name,
        chair: chair,
        role: role,
        photo: finalPhoto,
        experience: exp,
        basePrice: price,
        rating: 4.95,
        reviewsCount: 1,
        category: category,
        openSlotsToday: 6,
        skills: [
          { name: 'Fades & Tapers', level: `${sFades.value}%`, meter: parseInt(sFades.value) },
          { name: 'Beard Sculpting', level: `${sBeards.value}%`, meter: parseInt(sBeards.value) },
          { name: 'Scissors & Texture', level: `${sScissors.value}%`, meter: parseInt(sScissors.value) },
          { name: 'Turnaround Speed', level: `${sSpeed.value} mins`, meter: 95 },
        ],
        traits: traits,
        bio: bio
      };

      state.stylists.push(newBarber);

      // Provision chair
      state.chairs.push({
        chairId: newId,
        isBusy: false,
        clientName: '',
        clientPhone: '',
        service: '',
        price: 0,
        startTime: '',
        duration: 0,
        elapsedMinutes: 0,
      });

      if (!selectedBarberId) {
        selectedBarberId = newId;
      }

      showToast(`Barber ${name} onboarded successfully!`);
    }

    state.save();
    modal.style.display = 'none';
    renderAll();
  });
}

window.editBarber = function(id) {
  const barber = state.stylists.find(s => s.id === id);
  if (!barber) return;

  const modal = document.getElementById('onboard-barber-modal');
  const barberIdInput = document.getElementById('onboard-barber-id');
  const modalTitle = document.getElementById('onboard-modal-title');
  const saveBtnLbl = document.getElementById('btn-save-barber-lbl');
  const previewImg = document.getElementById('onboard-photo-preview');
  const placeholderAvatar = document.getElementById('onboard-photo-placeholder');
  const uploadTitle = document.getElementById('onboard-upload-title');

  if (barberIdInput) barberIdInput.value = barber.id;
  if (modalTitle) modalTitle.innerHTML = `<i data-lucide="edit-3"></i> Edit Barber: ${barber.name}`;
  if (saveBtnLbl) saveBtnLbl.textContent = 'Save Changes';

  document.getElementById('onboard-name').value = barber.name;
  document.getElementById('onboard-chair').value = barber.chair;
  document.getElementById('onboard-role').value = barber.role;
  document.getElementById('onboard-price').value = barber.basePrice;
  document.getElementById('onboard-exp').value = barber.experience || '5+ Years Exp.';
  document.getElementById('onboard-category').value = barber.category || 'fade';
  document.getElementById('onboard-bio').value = barber.bio || '';

  currentUploadedPhotoBase64 = barber.photo || '';
  if (barber.photo) {
    if (previewImg) { previewImg.src = barber.photo; previewImg.style.display = 'block'; }
    if (placeholderAvatar) placeholderAvatar.style.display = 'none';
    if (uploadTitle) uploadTitle.textContent = 'Click to replace photo';
  } else {
    if (previewImg) { previewImg.style.display = 'none'; }
    if (placeholderAvatar) placeholderAvatar.style.display = 'flex';
  }

  // Sliders
  const sFades = document.getElementById('slider-fades');
  const sBeards = document.getElementById('slider-beards');
  const sScissors = document.getElementById('slider-scissors');
  const sSpeed = document.getElementById('slider-speed');

  const skFade = barber.skills?.find(s => s.name.includes('Fade'))?.meter || 95;
  const skBeard = barber.skills?.find(s => s.name.includes('Beard'))?.meter || 90;
  const skSciss = barber.skills?.find(s => s.name.includes('Scissor'))?.meter || 88;
  const skSpeed = parseInt(barber.skills?.find(s => s.name.includes('Speed'))?.level) || 25;

  if (sFades) sFades.value = skFade;
  if (sBeards) sBeards.value = skBeard;
  if (sScissors) sScissors.value = skSciss;
  if (sSpeed) sSpeed.value = skSpeed;

  if (sFades) document.getElementById('slider-val-fades').textContent = `${skFade}%`;
  if (sBeards) document.getElementById('slider-val-beards').textContent = `${skBeard}%`;
  if (sScissors) document.getElementById('slider-val-scissors').textContent = `${skSciss}%`;
  if (sSpeed) document.getElementById('slider-val-speed').textContent = `${skSpeed} mins`;

  modal.style.display = 'flex';
  if (window.lucide) window.lucide.createIcons();
};

function renderStaffRoster() {
  const container = document.getElementById('staff-roster-grid');
  if (!container) return;

  if (state.stylists.length === 0) {
    container.innerHTML = `
      <div class="empty-barber-box">
        <i data-lucide="user-x"></i>
        <h4>No Barbers on Salon Roster</h4>
        <p>You have not added any barbers yet. Click "+ Onboard New Barber" above to upload photos and configure skills.</p>
        <button class="btn-primary-action" style="margin: 0 auto;" onclick="openOnboardBarberModal()">
          <i data-lucide="user-plus"></i> + Onboard First Barber
        </button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = state.stylists.map(b => `
    <div class="staff-card">
      <div class="staff-card-top">
        <img src="${b.photo}" alt="${b.name}" class="staff-photo" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'80\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'%23666\\' stroke-width=\\'2\\'%3E%3Cpath d=\\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\\'%3E%3C/path%3E%3Ccircle cx=\\'12\\' cy=\\'7\\' r=\\'4\\'%3E%3C/circle%3E%3C/svg%3E'" />
        <div class="staff-info">
          <h4 class="staff-name">${b.name}</h4>
          <span class="staff-role">${b.role}</span>
          <span class="staff-chair-tag">${b.chair} • ${formatMoney(b.basePrice)} base</span>
        </div>
      </div>

      <div class="staff-skills-summary">
        ${(b.skills || []).map(sk => `
          <div class="mini-skill-row">
            <span>${sk.name}</span>
            <div class="mini-skill-bar"><div class="mini-skill-fill" style="width:${sk.meter}%"></div></div>
            <strong>${sk.level}</strong>
          </div>
        `).join('')}
      </div>

      <div class="staff-card-actions">
        <button class="btn-staff-edit" onclick="editBarber('${b.id}')">
          <i data-lucide="edit-3"></i> Edit
        </button>
        <button class="btn-staff-delete" onclick="deleteBarber('${b.id}')">
          <i data-lucide="trash-2"></i> Remove
        </button>
      </div>
    </div>
  `).join('');

  // Update walk-in barber select
  const wBarber = document.getElementById('w-barber');
  if (wBarber) {
    wBarber.innerHTML = state.stylists.map(s => `
      <option value="${s.name}">${s.name} (${s.chair})</option>
    `).join('');
  }

  if (window.lucide) window.lucide.createIcons();
}

window.deleteBarber = function(id) {
  const barber = state.stylists.find(s => s.id === id);
  if (!confirm(`Are you sure you want to remove ${barber ? barber.name : 'this barber'} from the roster?`)) return;

  state.stylists = state.stylists.filter(s => s.id !== id);
  state.chairs = state.chairs.filter(c => c.chairId !== id);

  if (selectedBarberId === id) {
    selectedBarberId = state.stylists[0]?.id || null;
  }

  state.save();
  renderAll();
  showToast('Barber removed from roster.');
};

// =========================================================================
// 5. LIVE FLOOR OPERATIONS, CHAIRS & CASHBOOK
// =========================================================================

function renderChairs() {
  const container = document.getElementById('barber-chairs-container');
  if (!container) return;

  if (state.stylists.length === 0) {
    container.innerHTML = `
      <div class="empty-barber-box" style="grid-column: 1 / -1;">
        <i data-lucide="armchair"></i>
        <h4>No Active Barber Chairs</h4>
        <p>No barbers are currently on the floor. Onboard a barber to open their chair station.</p>
        <button class="btn-primary-action" style="margin: 0 auto;" onclick="openOnboardBarberModal()">
          <i data-lucide="user-plus"></i> + Onboard First Barber
        </button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Ensure chairs exist for each stylist
  state.stylists.forEach((stylist, idx) => {
    if (!state.chairs.some(c => c.chairId === stylist.id)) {
      state.chairs.push({
        chairId: stylist.id,
        isBusy: false,
        clientName: '',
        clientPhone: '',
        service: '',
        price: 0,
        startTime: '',
        duration: 0,
        elapsedMinutes: 0
      });
    }
  });

  // Filter chairs to match current stylists
  const activeChairs = state.chairs.filter(c => state.stylists.some(s => s.id === c.chairId));

  container.innerHTML = activeChairs.map((c, idx) => {
    const stylist = state.stylists.find(s => s.id === c.chairId) || state.stylists[idx] || { name: `Chair ${idx + 1}`, role: 'Stylist' };
    const isBusy = c.isBusy;

    return `
      <div class="chair-card ${isBusy ? 'busy' : 'available'}">
        <div class="chair-header">
          <div class="chair-barber-info">
            <span class="chair-title">${stylist.name}</span>
            <span class="chair-sub">${stylist.role} • ${stylist.chair || `Chair ${idx + 1}`}</span>
          </div>
          <span class="status-tag ${isBusy ? 'busy' : 'available'}">
            ${isBusy ? 'Cutting Hair' : 'Available'}
          </span>
        </div>

        <div class="chair-body">
          ${isBusy ? `
            <div class="chair-body-busy">
              <div class="c-client-name">${c.clientName}</div>
              <div class="c-services">${c.service}</div>
              <div class="c-timer">
                <i data-lucide="clock"></i>
                <span>${c.elapsedMinutes}m / ${c.duration} mins</span>
              </div>
            </div>
            <button class="btn-chair-action finish" onclick="openCheckoutModal(${idx})">
              <i data-lucide="check-circle-2"></i> Done & Take Payment (${formatMoney(c.price)})
            </button>
          ` : `
            <div class="chair-body-free">
              <i data-lucide="armchair"></i>
              <span>Ready for next client</span>
            </div>
            <button class="btn-chair-action seat" onclick="openWalkinForChair(${idx})">
              <i data-lucide="user-plus"></i> Seat Walk-In Customer
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function renderQueue() {
  const container = document.getElementById('queue-list-container');
  if (!container) return;

  if (state.queue.length === 0) {
    container.innerHTML = `<div style="color: var(--text-dim); padding: 14px; text-align: center;">No upcoming appointments in the queue.</div>`;
    return;
  }

  container.innerHTML = state.queue.map(q => `
    <div class="queue-item">
      <div class="q-time">${q.time}</div>
      <div class="q-details">
        <div class="q-name">${q.name}</div>
        <div class="q-barber-service">${q.barber} • ${q.service}</div>
      </div>
      <div class="q-price">${formatMoney(q.price)}</div>
      <button class="btn-q-seat" onclick="seatQueueItem('${q.id}')">
        Seat in Chair
      </button>
    </div>
  `).join('');
}

window.seatQueueItem = function(qId) {
  const item = state.queue.find(x => x.id === qId);
  if (!item) return;

  // Find free chair or chair 1
  let chairIdx = state.chairs.findIndex(c => !c.isBusy);
  if (chairIdx === -1) chairIdx = 0;

  state.chairs[chairIdx] = {
    chairId: `st-${chairIdx + 1}`,
    isBusy: true,
    clientName: item.name,
    clientPhone: item.phone,
    service: item.service,
    price: item.price,
    startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: 30,
    elapsedMinutes: 0,
  };

  state.queue = state.queue.filter(x => x.id !== qId);
  state.save();

  renderAll();
  showToast(`Seated ${item.name} in Chair ${chairIdx + 1}!`);
};

function initWalkinModal() {
  const modal = document.getElementById('walkin-modal');
  const openBtn = document.getElementById('quick-walkin-btn');
  const closeBtn = document.getElementById('close-walkin-modal');
  const form = document.getElementById('walkin-form');
  const chipsContainer = document.getElementById('walkin-service-chips');

  openBtn?.addEventListener('click', () => {
    modal.style.display = 'flex';
    renderWalkinChips();
  });

  closeBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  function renderWalkinChips() {
    if (!chipsContainer) return;
    chipsContainer.innerHTML = SERVICES.map(s => `
      <div class="srv-chip ${walkinSelectedServices.has(s.id) ? 'selected' : ''}" onclick="toggleWalkinService('${s.id}')">
        <span>${s.name}</span>
        <strong>${formatMoney(s.price)}</strong>
      </div>
    `).join('');

    let total = 0;
    let dur = 0;
    walkinSelectedServices.forEach(id => {
      const s = SERVICES.find(x => x.id === id);
      if (s) { total += s.price; dur += s.duration; }
    });

    document.getElementById('walkin-total-preview').textContent = formatMoney(total);
    document.getElementById('walkin-duration-preview').textContent = `(${dur} mins)`;
  }

  window.toggleWalkinService = function(id) {
    if (walkinSelectedServices.has(id)) {
      if (walkinSelectedServices.size > 1) walkinSelectedServices.delete(id);
    } else {
      walkinSelectedServices.add(id);
    }
    renderWalkinChips();
  };

  window.openWalkinForChair = function(chairIdx) {
    const s = state.stylists[chairIdx];
    if (s && document.getElementById('w-barber')) {
      document.getElementById('w-barber').value = s.name;
    }
    modal.style.display = 'flex';
    renderWalkinChips();
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('w-name').value.trim();
    const phone = document.getElementById('w-phone').value.trim();
    const barberName = document.getElementById('w-barber').value;
    const payment = document.getElementById('w-payment').value;

    if (!name || !phone) return;

    let chairIdx = state.stylists.findIndex(s => s.name === barberName);
    if (chairIdx === -1 || chairIdx >= state.chairs.length) chairIdx = 0;

    const selectedList = Array.from(walkinSelectedServices).map(id => SERVICES.find(x => x.id === id)).filter(Boolean);
    const serviceTitle = selectedList.map(s => s.name).join(' + ');
    const priceTotal = selectedList.reduce((sum, s) => sum + s.price, 0);
    const durTotal = selectedList.reduce((sum, s) => sum + s.duration, 0);

    state.chairs[chairIdx] = {
      chairId: `st-${chairIdx + 1}`,
      isBusy: true,
      clientName: name,
      clientPhone: phone,
      service: serviceTitle,
      price: priceTotal,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: durTotal,
      elapsedMinutes: 0,
    };

    state.save();
    form.reset();
    modal.style.display = 'none';

    renderAll();
    showToast(`Seated ${name} in Chair ${chairIdx + 1}!`);
  });
}

function initCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const closeBtn = document.getElementById('close-checkout-modal');
  const confirmBtn = document.getElementById('confirm-finish-bill-btn');

  closeBtn?.addEventListener('click', () => { modal.style.display = 'none'; });

  confirmBtn?.addEventListener('click', () => {
    if (activeCheckoutChairIndex === null) return;
    const chair = state.chairs[activeCheckoutChairIndex];
    if (!chair) return;

    // Record income transaction
    state.transactions.unshift({
      id: `t-${Date.now()}`,
      title: `${chair.service} (${chair.clientName})`,
      type: 'income',
      amount: chair.price,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    // Reset chair
    state.chairs[activeCheckoutChairIndex] = {
      chairId: `st-${activeCheckoutChairIndex + 1}`,
      isBusy: false,
      clientName: '',
      clientPhone: '',
      service: '',
      price: 0,
      startTime: '',
      duration: 0,
      elapsedMinutes: 0,
    };

    state.save();
    modal.style.display = 'none';
    renderAll();
    showToast(`Cleared Chair & Logged ${formatMoney(chair.price)}!`);
  });

  // Send WhatsApp Receipt
  document.getElementById('send-whatsapp-receipt-btn')?.addEventListener('click', () => {
    if (activeCheckoutChairIndex === null) return;
    const chair = state.chairs[activeCheckoutChairIndex];
    if (!chair) return;

    const phoneCode = CURRENCIES[currentCurrency].phoneCode;
    const cleanPhone = chair.clientPhone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith(phoneCode.replace('+', '')) ? cleanPhone : `${phoneCode.replace('+', '')}${cleanPhone}`;
    const barber = state.stylists[activeCheckoutChairIndex] || { name: 'Master Barber' };

    const msg = `✂️ *The Crown Salon - Receipt*\n\nHi ${chair.clientName},\nThank you for visiting us today!\n\n• Service: ${chair.service}\n• Barber: ${barber.name}\n• Total Bill: ${formatMoney(chair.price)}\n• Status: Paid & Completed ✅\n\nSee you again in 15 days for your next fresh trim! 💈`;

    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    showToast(`WhatsApp receipt sent to ${chair.clientName}!`);
  });
}

window.openCheckoutModal = function(chairIdx) {
  const chair = state.chairs[chairIdx];
  if (!chair || !chair.isBusy) return;

  activeCheckoutChairIndex = chairIdx;
  const barber = state.stylists[chairIdx] || { name: 'Stylist' };

  document.getElementById('chk-name').textContent = chair.clientName;
  document.getElementById('chk-phone').textContent = chair.clientPhone;
  document.getElementById('chk-barber').textContent = barber.name;
  document.getElementById('chk-services').textContent = chair.service;
  document.getElementById('chk-total').textContent = formatMoney(chair.price);

  document.getElementById('checkout-modal').style.display = 'flex';
};

// 15-Day Recall
function initRecallOffers() {
  const pills = document.querySelectorAll('.recall-offer-bar .offer-pill');
  pills.forEach(p => {
    p.addEventListener('click', () => {
      pills.forEach(b => b.classList.remove('active'));
      p.classList.add('active');
      activeRecallOffer = p.getAttribute('data-offer');
      renderRecall();
    });
  });
}

function renderRecall() {
  const container = document.getElementById('recall-cards-container');
  const countBadge = document.getElementById('recall-count-badge');
  const totalNum = document.getElementById('overdue-total-num');
  if (!container) return;

  countBadge.textContent = state.recall.length;
  if (totalNum) totalNum.textContent = state.recall.length;

  const phoneCode = CURRENCIES[currentCurrency].phoneCode;
  const discountText = currentCurrency === 'INR' ? '₹50 Off' : '$5 Off';

  let perkText = `we have a ${discountText} loyalty discount reserved for your next haircut!`;
  if (activeRecallOffer === 'beard') perkText = `get a free beard styling with your cut this week!`;
  if (activeRecallOffer === 'vip') perkText = `we have an exclusive VIP weekend chair open for you!`;

  container.innerHTML = state.recall.map(c => {
    const message = `Hey ${c.name}! 👋 It's been ${c.daysAgo} days since your last haircut at The Crown Salon. ${c.barber} has a few open slots this weekend, and ${perkText} ✂️ Tap here to book: https://thecrownsalon.com/book`;

    const cleanPhone = c.phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith(phoneCode.replace('+', '')) ? cleanPhone : `${phoneCode.replace('+', '')}${cleanPhone}`;
    const waUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;

    return `
      <div class="recall-row-card">
        <div class="r-left">
          <div class="r-days-badge">${c.daysAgo} Days Ago</div>
          <div>
            <div class="r-name">${c.name}</div>
            <div class="r-meta">${c.phone} • Preferred: ${c.barber} • Visited ${c.visits} times</div>
          </div>
        </div>
        <a href="${waUrl}" target="_blank" class="btn-whatsapp-recall" onclick="showToast('WhatsApp recall opened for ${c.name}!')">
          <i data-lucide="send"></i> Send WhatsApp Message
        </a>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

// Cashbook Bento
function initExpenseForm() {
  const form = document.getElementById('simple-expense-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('exp-title').value.trim();
    const amount = parseFloat(document.getElementById('exp-amount').value);
    const cat = document.getElementById('exp-cat').value;

    if (!title || isNaN(amount)) return;

    state.transactions.unshift({
      id: `t-${Date.now()}`,
      title: `${title} (${cat})`,
      type: 'expense',
      amount: amount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    state.save();
    form.reset();
    renderAll();
    showToast(`Expense saved: ${title} (${formatMoney(amount)})`);
  });
}

function renderMoney() {
  const incomeTotal = state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenseTotal = state.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = Math.max(0, incomeTotal - expenseTotal);
  const incomeCount = state.transactions.filter(t => t.type === 'income').length;
  const expenseCount = state.transactions.filter(t => t.type === 'expense').length;

  document.getElementById('today-income-display').textContent = formatMoney(incomeTotal);
  document.getElementById('today-cuts-display').textContent = `${incomeCount} haircuts logged today`;
  document.getElementById('today-expense-display').textContent = formatMoney(expenseTotal);
  document.getElementById('today-expense-count').textContent = `${expenseCount} expenses recorded`;
  document.getElementById('today-profit-display').textContent = formatMoney(netProfit);

  const receiptsList = document.getElementById('today-receipts-list');
  if (receiptsList) {
    if (state.transactions.length === 0) {
      receiptsList.innerHTML = `<div style="color: var(--text-dim); text-align: center; padding: 14px;">No transactions logged today yet.</div>`;
      return;
    }

    receiptsList.innerHTML = state.transactions.map(t => `
      <div class="receipt-row">
        <div>
          <div class="rec-title">${t.title}</div>
          <div class="rec-sub">${t.time}</div>
        </div>
        <div class="rec-amount ${t.type}">
          ${t.type === 'income' ? '+' : '-'}${formatMoney(t.amount)}
        </div>
      </div>
    `).join('');
  }
}

// Master Render
function renderAll() {
  renderBusinessProfile();
  renderDistrictCustomerApp();
  renderStaffRoster();
  renderChairs();
  renderQueue();
  renderRecall();
  renderMoney();
  if (window.lucide) window.lucide.createIcons();
}

// Window Global Callbacks
window.selectBarber = function(id) {
  selectedBarberId = id;
  renderBarberAssessmentCards();
  renderCourtSlots();
  renderBottomBookingBar();
  const scheduleElem = document.getElementById('court-schedule-section');
  if (scheduleElem) scheduleElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.selectDate = function(offset) {
  selectedDateOffset = offset;
  renderDateScroller();
  renderCourtSlots();
  renderBottomBookingBar();
};

window.selectSlot = function(time) {
  selectedSlotTime = time;
  renderCourtSlots();
  renderBottomBookingBar();
  showToast(`Selected ${time} slot`);
};

window.toggleCustomerService = function(srvId) {
  if (customerSelectedServices.has(srvId)) {
    if (customerSelectedServices.size > 1) {
      customerSelectedServices.delete(srvId);
    }
  } else {
    customerSelectedServices.add(srvId);
  }
  renderServiceCustomizer();
  renderBottomBookingBar();
};

window.switchToManager = function() {
  const btnManager = document.getElementById('btn-mode-manager');
  btnManager?.click();
};
