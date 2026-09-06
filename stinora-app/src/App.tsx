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
import OwnerDashboardScreen from './components/OwnerDashboardScreen';
import ReviewSheet from './components/ReviewSheet';
import {
  useStore, settleElapsed, getSalon, getBarber, upcomingDays, firstOpenDay, SALONS,
  type Booking,
} from './lib/store';

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

function App() {
  const store = useStore();
  const [screen, setScreen] = useState(() => (store.customer.onboarded ? 'home' : 'welcome'));
  const [, setHistory] = useState<string[]>(() => (store.customer.onboarded ? ['home'] : ['welcome']));
  const [direction, setDirection] = useState(1);
  const [activeTab, setActiveTab] = useState('home');

  // Which completed visit the rating sheet is open for, if any.
  const [reviewFor, setReviewFor] = useState<Booking | null>(null);

  // --- Theme engine (default: light urban salon) --------------------------
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem('stinora_theme') as ThemeMode) || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const dark = themeMode === 'dark' || (themeMode === 'system' && mediaQuery.matches);
      root.classList.toggle('dark', dark);
      root.style.colorScheme = dark ? 'dark' : 'light';
      // Keep the Android status bar and the browser chrome in step with the theme;
      // previously the meta tag stayed on the dark colour in light mode.
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0C0B0A' : '#FAF8F5');
    };

    applyTheme();
    try {
      localStorage.setItem('stinora_theme', themeMode);
    } catch {
      /* a refused write only costs the preference on next launch */
    }

    const handler = () => {
      if (themeMode === 'system') applyTheme();
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [themeMode]);

  // Promote elapsed appointments to "completed" on launch and when the tab is
  // brought back to the foreground, so the archive and the sales figures do not
  // drift while the app sits open.
  useEffect(() => {
    settleElapsed();
    const onVisible = () => {
      if (document.visibilityState === 'visible') settleElapsed();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  // --- booking wizard state ------------------------------------------------
  const [salonId, setSalonId] = useState<string | null>(null);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => upcomingDays(1)[0].key);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const salon = getSalon(salonId);
  const barber = getBarber(barberId);

  const nav = (toScreen: string) => {
    if (toScreen === 'schedule' && !barberId) return;
    if (toScreen === 'billing' && (!selectedTime || selectedServices.length === 0)) return;

    setDirection(1);
    setHistory((h) => [...h, toScreen]);
    setScreen(toScreen);
    if (['home', 'explore', 'bookings', 'profile'].includes(toScreen)) setActiveTab(toScreen);
  };

  const back = () => {
    setHistory((h) => {
      if (h.length <= 1) return h;
      const next = h.slice(0, -1);
      const target = next[next.length - 1];
      setDirection(-1);
      setScreen(target);
      if (['home', 'explore', 'bookings', 'profile'].includes(target)) setActiveTab(target);
      return next;
    });
  };

  const resetHome = () => {
    setDirection(-1);
    setHistory(['home']);
    setScreen('home');
    setActiveTab('home');
    setBarberId(null);
    setSelectedTime(null);
    setSelectedServices([]);
    setSelectedDate(upcomingDays(1)[0].key);
  };

  /** Jump straight into the wizard with a salon, stylist and services chosen. */
  const startBooking = (sid: string, bid: string, services: string[] = []) => {
    setSalonId(sid);
    setBarberId(bid);
    setSelectedServices(services);
    setSelectedTime(null);
    setSelectedDate(firstOpenDay(sid, bid));
    setDirection(1);
    setHistory((h) => [...h, 'schedule']);
    setScreen('schedule');
  };

  const variants: any = {
    initial: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 0.98 }),
    animate: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 35 } },
    exit: (dir: number) => ({ x: dir > 0 ? '-20%' : '100%', opacity: 0, scale: 0.98, transition: { type: 'spring', stiffness: 350, damping: 35 } }),
  };

  const showBottomNav = ['home', 'explore', 'bookings', 'profile'].includes(screen);
  const pane = 'absolute inset-0 bg-editorial-900 flex flex-col';

  return (
    <div className="min-h-[100dvh] w-full bg-editorial-950 md:p-6 flex items-center justify-center font-sans overflow-y-auto">
      <div className="relative w-full max-w-[430px] h-[100dvh] md:h-[840px] md:max-h-[92vh] bg-editorial-900 md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:border border-editorial-600">

        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence custom={direction} initial={false} mode="popLayout">

            {screen === 'welcome' && (
              <motion.div key="welcome" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className={`${pane} z-50`}>
                <WelcomeScreen
                  onDone={() => {
                    setDirection(1);
                    setHistory(['home']);
                    setScreen('home');
                    setActiveTab('home');
                  }}
                />
              </motion.div>
            )}

            {screen === 'home' && (
              <motion.div key="home" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className={pane}>
                <HomeScreen nav={nav} setSalonId={setSalonId} startBooking={startBooking} onReview={setReviewFor} />
              </motion.div>
            )}

            {screen === 'explore' && (
              <motion.div key="explore" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className={pane}>
                <ExploreScreen nav={nav} setSalonId={setSalonId} />
              </motion.div>
            )}

            {screen === 'bookings' && (
              <motion.div key="bookings" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className={pane}>
                <BookingsScreen nav={nav} onReview={setReviewFor} />
              </motion.div>
            )}

            {screen === 'profile' && (
              <motion.div key="profile" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className={pane}>
                <UserProfileScreen
                  back={back}
                  nav={nav}
                  themeMode={themeMode}
                  setThemeMode={setThemeMode}
                  onSignOut={() => {
                    setHistory(['welcome']);
                    setScreen('welcome');
                  }}
                />
              </motion.div>
            )}

            {screen === 'owner' && (
              <motion.div key="owner" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className={`${pane} z-20`}>
                <OwnerDashboardScreen back={back} />
              </motion.div>
            )}

            {screen === 'salon' && (
              <motion.div key="salon" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className={`${pane} z-20`}>
                <SalonProfileScreen nav={nav} back={back} salon={salon} />
              </motion.div>
            )}

            {screen === 'barbers' && (
              <motion.div key="barbers" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className={`${pane} z-20`}>
                <BarberSelectionScreen
                  back={back}
                  salon={salon}
                  onSelect={(id) => startBooking(salon!.id, id, selectedServices)}
                />
              </motion.div>
            )}

            {screen === 'schedule' && (
              <motion.div key="schedule" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className={`${pane} z-20`}>
                <ScheduleScreen
                  nav={nav} back={back} salon={salon || SALONS[0]} barber={barber}
                  selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                  selectedTime={selectedTime} setSelectedTime={setSelectedTime}
                  selectedServices={selectedServices} setSelectedServices={setSelectedServices}
                />
              </motion.div>
            )}

            {screen === 'billing' && (
              <motion.div key="billing" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" className={`${pane} z-30`}>
                <BillingScreen
                  back={back} resetHome={resetHome} nav={nav}
                  salon={salon || SALONS[0]} barber={barber}
                  dateKey={selectedDate} time={selectedTime} services={selectedServices}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Rating sheet — reachable from Home and from the booking archive */}
        <ReviewSheet booking={reviewFor} onClose={() => setReviewFor(null)} />

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
              ].map((tab) => {
                const active = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => nav(tab.id)}
                    className="flex flex-col items-center gap-1.5 p-2 w-16 active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-lg"
                    aria-label={`Navigate to ${tab.label}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon size={24} className={active ? 'text-brand-400' : 'text-editorial-400'} />
                    <span className={`text-[10px] font-semibold tracking-wide ${active ? 'text-brand-400' : 'text-editorial-500'}`}>{tab.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default App;
