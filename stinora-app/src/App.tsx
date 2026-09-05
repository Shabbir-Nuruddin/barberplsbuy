import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Search, Calendar, User } from 'lucide-react';
import WelcomeScreen from './components/WelcomeScreen';
import HomeScreen from './components/HomeScreen';
import SalonProfileScreen from './components/SalonProfileScreen';
import BarberSelectionScreen from './components/BarberSelectionScreen';
import ScheduleScreen from './components/ScheduleScreen';
import BillingScreen from './components/BillingScreen';
import UserProfileScreen from './components/UserProfileScreen';
import ExploreScreen from './components/ExploreScreen';
import BookingsScreen from './components/BookingsScreen';

// --- PRODUCTION MOCK DATA ---
export const MOCK_DATA = {
  salons: [
    { id: 's1', name: 'Lakme Salon', rating: 4.6, dist: '1.2 km', address: '12th Main Road, HAL 2nd Stage, Indiranagar', image: 'https://picsum.photos/seed/lakme/800/800', tags: ['Skin Fade', 'Classic', 'Bridal'] },
    { id: 's2', name: 'Toni & Guy Essensuals', rating: 4.8, dist: '0.8 km', address: 'Opposite Axis Bank, 100 Feet Road, Indiranagar', image: 'https://picsum.photos/seed/toniguy/800/800', tags: ['Luxury', 'Keratin', 'Color'] },
    { id: 's3', name: 'BBlunt Salon', rating: 4.7, dist: '1.5 km', address: '1st Stage, Indiranagar', image: 'https://picsum.photos/seed/bblunt/800/800', tags: ['Modern', 'Balayage'] },
    { id: 's4', name: 'Bellance Salon', rating: 4.9, dist: '2.1 km', address: '12th Main, HAL 2nd Stage, Indiranagar', image: 'https://picsum.photos/seed/bellance/800/800', tags: ['Luxury', 'Ayurvedic', 'Spa'] },
    { id: 's5', name: 'Marie Claire Paris', rating: 4.5, dist: '2.5 km', address: '12th Main Road, Indiranagar', image: 'https://picsum.photos/seed/marieclaire/800/800', tags: ['HydraFacial', 'Spa'] },
    { id: 's6', name: 'Bodycraft Salon & Spa', rating: 4.8, dist: '3.0 km', address: '100 Feet Rd, HAL 2nd Stage, Indiranagar', image: 'https://picsum.photos/seed/bodycraft/800/800', tags: ['Clinical', 'Spa'] },
    { id: 's7', name: 'Bounce Salon & Spa', rating: 4.7, dist: '1.8 km', address: 'Double Road, Indiranagar', image: 'https://picsum.photos/seed/bounce/800/800', tags: ['Luxury', 'Color'] },
    { id: 's8', name: 'YLG Salon', rating: 4.4, dist: '1.0 km', address: 'CMH Road, Indiranagar', image: 'https://picsum.photos/seed/ylg/800/800', tags: ['Classic', 'Waxing'] },
    { id: 's9', name: 'Green Trends', rating: 4.3, dist: '2.2 km', address: '80 Feet Road, Indiranagar', image: 'https://picsum.photos/seed/greentrends/800/800', tags: ['Classic', 'Family'] },
    { id: 's10', name: 'Naturals Salon', rating: 4.2, dist: '2.8 km', address: 'HAL 3rd Stage, Indiranagar', image: 'https://picsum.photos/seed/naturals/800/800', tags: ['Classic', 'Organic'] },
    { id: 's11', name: 'Jean Claude Biguine', rating: 4.9, dist: '3.5 km', address: '100 Feet Road, Indiranagar', image: 'https://picsum.photos/seed/jcb/800/800', tags: ['French', 'Luxury'] },
    { id: 's12', name: 'Play Salon', rating: 4.6, dist: '1.4 km', address: '1st Cross, Indiranagar', image: 'https://picsum.photos/seed/play/800/800', tags: ['Modern', 'Creative'] },
    { id: 's13', name: 'Apple The Original', rating: 4.5, dist: '1.1 km', address: 'CMH Road, Indiranagar', image: 'https://picsum.photos/seed/apple/800/800', tags: ['Classic', 'Spa'] },
    { id: 's14', name: 'Snippets Salon', rating: 4.4, dist: '2.0 km', address: 'HAL 2nd Stage, Indiranagar', image: 'https://picsum.photos/seed/snippets/800/800', tags: ['Family', 'Quick'] },
    { id: 's15', name: 'Vurve Signature Salon', rating: 4.8, dist: '3.2 km', address: '100 Feet Road, Indiranagar', image: 'https://picsum.photos/seed/vurve/800/800', tags: ['Luxury', 'Signature'] },
    { id: 's16', name: 'Salon Srishti', rating: 4.3, dist: '0.9 km', address: 'Appareddy Palya, Indiranagar', image: 'https://picsum.photos/seed/srishti/800/800', tags: ['Local', 'Classic'] },
    { id: 's17', name: 'Gloss Salon', rating: 4.7, dist: '2.4 km', address: '12th Main Road, Indiranagar', image: 'https://picsum.photos/seed/gloss/800/800', tags: ['Premium', 'Nails'] },
    { id: 's18', name: 'Mirrors & Within', rating: 4.9, dist: '4.0 km', address: 'UB City (Near Indiranagar)', image: 'https://picsum.photos/seed/mirrors/800/800', tags: ['Elite', 'Luxury'] },
    { id: 's19', name: 'The White Door', rating: 4.8, dist: '3.8 km', address: 'Lavelle Road', image: 'https://picsum.photos/seed/whitedoor/800/800', tags: ['Spa', 'Elite'] },
    { id: 's20', name: 'Salon Mousse', rating: 4.6, dist: '1.7 km', address: 'Domlur Layout, Indiranagar', image: 'https://picsum.photos/seed/mousse/800/800', tags: ['Trendy', 'Color'] },
  ],
  barbers: [
    { id: 'b1', name: 'Rohan Mehra', spec: 'Skin Fade Specialist', exp: '8+ Years', rating: 4.9, available: true },
    { id: 'b2', name: 'Vikram Singh', spec: 'Classic Cuts', exp: '12+ Years', rating: 4.7, available: false },
    { id: 'b3', name: 'Imran Ali', spec: 'Scalp & Spa Expert', exp: '5+ Years', rating: 4.8, available: true },
    { id: 'b4', name: 'Alex Thomas', spec: 'Precision Styling', exp: '4+ Years', rating: 4.6, available: true },
    { id: 'b5', name: 'Samir Khan', spec: 'Beard Sculpting', exp: '6+ Years', rating: 4.5, available: true },
    { id: 'b6', name: 'Kunal Verma', spec: 'Color & Highlights', exp: '7+ Years', rating: 4.8, available: false },
    { id: 'b7', name: 'Arjun Das', spec: 'Keratin Specialist', exp: '9+ Years', rating: 4.9, available: true },
    { id: 'b8', name: 'Farhan Qureshi', spec: 'Bridal & Occasion', exp: '10+ Years', rating: 4.7, available: true },
    { id: 'b9', name: 'David Lee', spec: 'Creative Cuts', exp: '3+ Years', rating: 4.4, available: true },
    { id: 'b10', name: 'Rishabh Pant', spec: 'Express Grooming', exp: '5+ Years', rating: 4.3, available: true },
  ],
  services: [
    { id: 'srv1', name: 'Classic Haircut', price: 400 },
    { id: 'srv2', name: 'Skin Fade & Trim', price: 650 },
    { id: 'srv3', name: 'Premium Beard Sculpt', price: 350 },
    { id: 'srv4', name: 'Scalp Detox Spa', price: 1200 },
    { id: 'srv5', name: 'Global Hair Color', price: 3500 },
    { id: 'srv6', name: 'Keratin Treatment', price: 5000 },
    { id: 'srv7', name: 'HydraFacial', price: 2500 },
    { id: 'srv8', name: 'Express Massage', price: 800 },
  ],
  slots: [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:30 PM', '04:00 PM', '05:30 PM', '06:00 PM'
  ],
  bookedSlots: ['10:00 AM', '11:30 AM', '02:30 PM', '06:00 PM'],
  dates: [
    { id: 'd1', day: 'Today', num: '06' },
    { id: 'd2', day: 'Tom', num: '07' },
    { id: 'd3', day: 'Mon', num: '08' },
    { id: 'd4', day: 'Tue', num: '09' },
    { id: 'd5', day: 'Wed', num: '10' },
    { id: 'd6', day: 'Thu', num: '11' },
    { id: 'd7', day: 'Fri', num: '12' }
  ]
};

export function getAvatar(seed: string, initial: string, size: number, colors?: string[]) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="g${h}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors?.[0] || `hsl(${h}, 50%, 70%)`}" />
          <stop offset="100%" stop-color="${colors?.[1] || `hsl(${h + 40}, 60%, 50%)`}" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#g${h})"/>
      <circle cx="50" cy="40" r="20" fill="rgba(255,255,255,0.2)"/>
      <path d="M12 100c6-24 20-35 38-35s32 11 38 35z" fill="rgba(255,255,255,0.2)"/>
      <text x="50" y="57" font-family="sans-serif" font-size="32" font-weight="700" fill="white" text-anchor="middle">${initial}</text>
    </svg>
  `)}`;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface BookingRecord {
  id: string;
  salonName: string;
  barberName: string;
  barberSpec: string;
  dateDay: string;
  dateNum: string;
  time: string;
  serviceNames: string;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

function App() {
  const [screen, setScreen] = useState('home');
  const [history, setHistory] = useState(['home']);
  const [direction, setDirection] = useState(1);
  const [activeTab, setActiveTab] = useState('home');

  // Theme Engine (Default: Light Urban Salon Mode)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('stinora_theme') as ThemeMode) || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (themeMode === 'dark') {
        root.classList.add('dark');
      } else if (themeMode === 'light') {
        root.classList.remove('dark');
      } else {
        // System preference
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();
    localStorage.setItem('stinora_theme', themeMode);

    const handler = () => {
      if (themeMode === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [themeMode]);

  // Persistent Bookings Engine
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('stinora_bookings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'STN-8291',
        salonName: 'Lakme Salon',
        barberName: 'Rohan Mehra',
        barberSpec: 'Skin Fade Specialist',
        dateDay: 'Mon',
        dateNum: '08 Sept',
        time: '06:30 PM',
        serviceNames: 'Skin Fade & Trim, Premium Beard Sculpt',
        totalPrice: 1050,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
    ];
  });

  const addBooking = (newBooking: BookingRecord) => {
    setBookings(prev => {
      const updated = [newBooking, ...prev];
      try {
        localStorage.setItem('stinora_bookings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
      try {
        localStorage.setItem('stinora_bookings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Global Booking Wizard State
  const [selectedSalon, setSelectedSalon] = useState<any>(null);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(MOCK_DATA.dates[0].id);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const nav = (toScreen: string) => {
    // STATE GUARD: Prevent bypassing to schedule/billing without data
    if (toScreen === 'schedule' && !selectedBarber) return;
    if (toScreen === 'billing' && (!selectedTime || selectedServices.length === 0)) return;

    setDirection(1);
    setHistory([...history, toScreen]);
    setScreen(toScreen);
    if (['home', 'explore', 'bookings', 'profile'].includes(toScreen)) {
        setActiveTab(toScreen);
    }
  };

  const back = () => {
    if (history.length > 1) {
      setDirection(-1);
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      const targetScreen = newHistory[newHistory.length - 1];
      setScreen(targetScreen);
      if (['home', 'explore', 'bookings', 'profile'].includes(targetScreen)) {
        setActiveTab(targetScreen);
      }
    }
  };

  const resetHome = () => {
    setDirection(-1);
    setHistory(['home']);
    setScreen('home');
    setActiveTab('home');
    setSelectedBarber(null);
    setSelectedTime(null);
    setSelectedServices([]);
    setSelectedDate(MOCK_DATA.dates[0].id);
  };

  const variants: any = {
    initial: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 0.98 }),
    animate: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 35 } },
    exit: (dir: number) => ({ x: dir > 0 ? '-20%' : '100%', opacity: 0, scale: 0.98, transition: { type: 'spring', stiffness: 350, damping: 35 } })
  };

  const showBottomNav = ['home', 'explore', 'bookings', 'profile'].includes(screen);

  return (
    <div className="min-h-[100dvh] w-full bg-editorial-950 md:p-6 flex items-center justify-center font-sans overflow-y-auto">
      <div className="relative w-full max-w-[430px] h-[100dvh] md:h-[840px] md:max-h-[92vh] bg-editorial-900 md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:border border-editorial-600">
        
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            
            {screen === 'welcome' && (
              <motion.div key="welcome" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 bg-editorial-900 flex flex-col z-50">
                <WelcomeScreen nav={nav} />
              </motion.div>
            )}

            {screen === 'home' && (
              <motion.div key="home" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 bg-editorial-900 flex flex-col">
                <HomeScreen 
                  nav={nav} 
                  onSelectSalon={setSelectedSalon} 
                  setBarber={setSelectedBarber}
                  setSelectedServices={setSelectedServices}
                />
              </motion.div>
            )}

            {screen === 'explore' && (
              <motion.div key="explore" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 bg-editorial-900 flex flex-col">
                <ExploreScreen nav={nav} onSelectSalon={setSelectedSalon} />
              </motion.div>
            )}

            {screen === 'bookings' && (
              <motion.div key="bookings" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 bg-editorial-900 flex flex-col">
                <BookingsScreen 
                  bookings={bookings} 
                  onCancelBooking={cancelBooking} 
                  nav={nav} 
                />
              </motion.div>
            )}

            {screen === 'profile' && (
              <motion.div key="profile" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 bg-editorial-900 flex flex-col">
                <UserProfileScreen 
                  back={back} 
                  resetHome={() => { setHistory(['welcome']); setScreen('welcome'); }}
                  nav={nav}
                  themeMode={themeMode}
                  setThemeMode={setThemeMode}
                />
              </motion.div>
            )}

            {screen === 'salon' && (
              <motion.div key="salon" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 bg-editorial-900 flex flex-col z-20">
                <SalonProfileScreen nav={nav} back={back} salon={selectedSalon} />
              </motion.div>
            )}

            {screen === 'barbers' && (
              <motion.div key="barbers" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 bg-editorial-900 flex flex-col z-20">
                <BarberSelectionScreen nav={nav} back={back} onSelect={setSelectedBarber} />
              </motion.div>
            )}

            {screen === 'schedule' && (
              <motion.div key="schedule" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 bg-editorial-900 flex flex-col z-20">
                <ScheduleScreen 
                  nav={nav} back={back} barber={selectedBarber}
                  selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                  selectedTime={selectedTime} setSelectedTime={setSelectedTime}
                  selectedServices={selectedServices} setSelectedServices={setSelectedServices}
                />
              </motion.div>
            )}

            {screen === 'billing' && (
              <motion.div key="billing" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 bg-editorial-900 flex flex-col z-30">
                <BillingScreen 
                  back={back} 
                  resetHome={resetHome} 
                  nav={nav}
                  salon={selectedSalon}
                  barber={selectedBarber}
                  date={MOCK_DATA.dates.find(d => d.id === selectedDate)}
                  time={selectedTime} 
                  services={selectedServices}
                  onAddBooking={addBooking}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* BOTTOM NAVIGATION */}
        <AnimatePresence>
          {showBottomNav && (
            <motion.div 
              initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-editorial-900 border-t border-editorial-600 px-6 py-2 pb-6 md:pb-4 flex justify-between items-center z-10 shrink-0"
              role="navigation"
              aria-label="Bottom tab navigation"
            >
              {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'explore', icon: Search, label: 'Explore' },
                { id: 'bookings', icon: Calendar, label: 'Bookings' },
                { id: 'profile', icon: User, label: 'You' },
              ].map(tab => {
                const active = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button 
                    key={tab.id} 
                    onClick={() => nav(tab.id)} 
                    className="flex flex-col items-center gap-1.5 p-2 w-16 active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-lg"
                    aria-label={`Navigate to ${tab.label}`}
                    aria-selected={active}
                  >
                    <Icon size={24} className={active ? 'text-brand-400' : 'text-editorial-400'} />
                    <span className={`text-[10px] font-semibold tracking-wide ${active ? 'text-brand-400' : 'text-editorial-500'}`}>{tab.label}</span>
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default App;
