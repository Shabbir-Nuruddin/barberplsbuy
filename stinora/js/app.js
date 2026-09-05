/**
 * StinOra App Logic
 * Single Page App Navigation, State, and Mock Data
 */

 const app = {
  history: ['view-home'],
  
  state: {
    selectedBarber: null,
    selectedDate: 'Today',
    selectedTime: null,
    services: [],
    serviceTotal: 0,
    paymentMethod: 'upi',
  },

  data: {
    recentBookings: [
      { id: 1, salon: 'The Crown Salon', barber: 'Rohan Mehra', date: '19 Aug', service: 'Skin Fade + Beard Sculpt' },
      { id: 2, salon: 'Truefitt & Hill', barber: 'Samir Khan', date: '02 Aug', service: 'Royal Haircut' }
    ],
    topSalons: [
      { id: 1, name: 'The Crown Salon', rating: '4.8', dist: '1.2 km' },
      { id: 2, name: 'Gentleman\'s Cut', rating: '4.6', dist: '2.5 km' },
      { id: 3, name: 'Urban Edge', rating: '4.5', dist: '3.0 km' }
    ],
    barbers: [
      { id: 'b1', name: 'Rohan Mehra', specialty: 'Skin Fade Specialist', exp: '8+ Years', rating: '4.9', avail: 'green', img: 'https://ui-avatars.com/api/?name=Rohan+Mehra&background=1E2022&color=D4AF37' },
      { id: 'b2', name: 'Vikram Singh', specialty: 'Classic Cuts & Styling', exp: '12+ Years', rating: '4.7', avail: 'green', img: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=1E2022&color=D4AF37' },
      { id: 'b3', name: 'Imran Ali', specialty: 'Beard Sculpting Expert', exp: '5+ Years', rating: '4.8', avail: 'red', img: 'https://ui-avatars.com/api/?name=Imran+Ali&background=1E2022&color=D4AF37' }
    ],
    slots: [
      '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
      '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ],
    bookedSlots: ['10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM']
  },

  init() {
    this.renderHome();
    this.renderBarbers();
    this.renderSchedule();
    this.updateServiceSelection();
  },

  // ------------------------------------------------------------------------
  // NAVIGATION ROUTING
  // ------------------------------------------------------------------------
  goTo(viewId) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    this.history.push(viewId);
  },

  goBack() {
    if (this.history.length > 1) {
      this.history.pop(); // remove current
      const prev = this.history[this.history.length - 1];
      document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
      document.getElementById(prev).classList.add('active');
    }
  },

  resetToHome() {
    this.history = ['view-home'];
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById('view-home').classList.add('active');
    document.getElementById('success-overlay').classList.remove('show');
    
    // reset state
    this.state.selectedTime = null;
    this.updateServiceSelection();
    this.renderSchedule();
  },

  // ------------------------------------------------------------------------
  // RENDER HOME SCREEN
  // ------------------------------------------------------------------------
  renderHome() {
    const recentCont = document.getElementById('recent-bookings-list');
    recentCont.innerHTML = this.data.recentBookings.map(b => `
      <div class="booking-card">
        <h3>${b.salon}</h3>
        <p>${b.date} &bull; ${b.barber}</p>
        <div class="svc">${b.service}</div>
        <button class="btn-rebook" onclick="app.goTo('view-salon')">Rebook</button>
      </div>
    `).join('');

    const topCont = document.getElementById('top-salons-list');
    topCont.innerHTML = this.data.topSalons.map(s => `
      <div class="booking-card" onclick="app.goTo('view-salon')">
        <h3>${s.name}</h3>
        <p><i data-lucide="star" style="width:12px; height:12px; color:var(--c-gold)"></i> ${s.rating} &bull; ${s.dist}</p>
      </div>
    `).join('');
  },

  // ------------------------------------------------------------------------
  // RENDER BARBER SELECTION
  // ------------------------------------------------------------------------
  renderBarbers() {
    const cont = document.getElementById('barber-list');
    cont.innerHTML = this.data.barbers.map(b => `
      <button class="barber-card" onclick="app.selectBarber('${b.id}')">
        <div class="barber-avatar">
          <img src="${b.img}" alt="${b.name}" />
          <div class="avail-badge ${b.avail}"></div>
        </div>
        <div class="barber-info">
          <h3>${b.name}</h3>
          <span class="specialty">${b.specialty}</span>
          <span class="exp">${b.exp} Experience</span>
        </div>
        <div class="barber-rating">
          <span class="r-val">${b.rating} <i data-lucide="star"></i></span>
        </div>
      </button>
    `).join('');
  },

  selectBarber(id) {
    const b = this.data.barbers.find(x => x.id === id);
    if (!b) return;
    this.state.selectedBarber = b;
    
    // Setup schedule view
    document.getElementById('sched-barber-img').src = b.img;
    document.getElementById('sched-barber-name').textContent = b.name;
    document.getElementById('sched-barber-specialty').textContent = b.specialty;

    this.goTo('view-schedule');
  },

  // ------------------------------------------------------------------------
  // RENDER SCHEDULE & SERVICES
  // ------------------------------------------------------------------------
  renderSchedule() {
    // Dates
    const dates = ['Today', 'Tomorrow', 'Mon', 'Tue', 'Wed', 'Thu'];
    const dateCont = document.getElementById('date-strip');
    dateCont.innerHTML = dates.map((d, i) => `
      <div class="date-card ${i === 0 ? 'active' : ''}">
        <span class="day">${d}</span>
        <span class="num">${new Date().getDate() + i}</span>
      </div>
    `).join('');

    // Time Slots
    const slotsCont = document.getElementById('slots-grid');
    slotsCont.innerHTML = this.data.slots.map(t => {
      const isBooked = this.data.bookedSlots.includes(t);
      const isSel = this.state.selectedTime === t;
      return `
        <button class="time-slot ${isBooked ? 'booked' : 'available'} ${isSel ? 'selected' : ''}" 
                ${isBooked ? 'disabled' : ''}
                onclick="app.selectTime('${t}')">
          ${t}
        </button>
      `;
    }).join('');

    this.validateScheduleState();
  },

  selectTime(t) {
    this.state.selectedTime = t;
    this.renderSchedule();
  },

  updateServiceSelection() {
    const checks = document.querySelectorAll('#service-options input[type="checkbox"]');
    this.state.services = [];
    this.state.serviceTotal = 0;
    
    checks.forEach(c => {
      if (c.checked) {
        this.state.services.push(c.value);
        this.state.serviceTotal += parseInt(c.dataset.price);
      }
    });
    this.validateScheduleState();
  },

  validateScheduleState() {
    const btn = document.getElementById('btn-confirm-slot');
    if (this.state.selectedTime && this.state.services.length > 0) {
      btn.disabled = false;
    } else {
      btn.disabled = true;
    }
  },

  goToBilling() {
    // Populate Billing View
    const b = this.state.selectedBarber;
    document.getElementById('summ-barber').textContent = b ? b.name : 'Unknown';
    document.getElementById('summ-time').textContent = \`\${this.state.selectedDate}, \${this.state.selectedTime}\`;
    document.getElementById('summ-services').textContent = this.state.services.join(', ');
    
    // Calc amounts
    const sTotal = this.state.serviceTotal;
    const tax = Math.round(sTotal * 0.05);
    const gTotal = sTotal + tax;
    
    document.getElementById('bill-service').textContent = \`₹\${sTotal}\`;
    document.getElementById('bill-tax').textContent = \`₹\${tax}\`;
    document.getElementById('bill-total').textContent = \`₹\${gTotal}\`;
    
    this.updatePaymentLabel();
    this.goTo('view-billing');
  },

  // ------------------------------------------------------------------------
  // BILLING & PAYMENT
  // ------------------------------------------------------------------------
  updatePaymentLabel() {
    const val = document.querySelector('input[name="payment"]:checked').value;
    const btn = document.getElementById('btn-pay');
    this.state.paymentMethod = val;
    
    if (val === 'store') {
      btn.textContent = 'Confirm Booking (Pay at Store)';
    } else {
      btn.textContent = 'Pay & Confirm';
    }
  },

  simulatePayment() {
    const btn = document.getElementById('btn-pay');
    btn.innerHTML = '<i class="lucide lucide-loader" style="animation: spin 1s linear infinite;"></i> Processing...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = 'Pay & Confirm';
      btn.disabled = false;
      document.getElementById('success-time').textContent = this.state.selectedTime;
      document.getElementById('success-overlay').classList.add('show');
    }, 1200);
  }
};

// Add generic loader animation
const style = document.createElement('style');
style.innerHTML = \`@keyframes spin { 100% { transform: rotate(360deg); } }\`;
document.head.appendChild(style);

// Init on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
