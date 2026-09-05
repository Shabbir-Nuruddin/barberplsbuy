import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { Star } from '@phosphor-icons/react';
import HomeScreen from './components/HomeScreen';
import SalonProfileScreen from './components/SalonProfileScreen';
import BarberSelectionScreen from './components/BarberSelectionScreen';
import ScheduleScreen from './components/ScheduleScreen';
import BillingScreen from './components/BillingScreen';

// --- MOCK DATA ---
export const MOCK_DATA = {
  salons: [
    { id: 's1', name: 'The Crown Salon', rating: 4.9, dist: '1.2 km', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 's2', name: 'Urban Groomers', rating: 4.7, dist: '2.5 km', image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  ],
  barbers: [
    { id: 'b1', name: 'Rohan Mehra', spec: 'Skin Fade Specialist', exp: '8+ Years', rating: 4.9, available: true },
    { id: 'b2', name: 'Vikram Singh', spec: 'Classic Cuts', exp: '12+ Years', rating: 4.7, available: false },
    { id: 'b3', name: 'Imran Ali', spec: 'Scalp & Spa Expert', exp: '5+ Years', rating: 4.8, available: true },
  ],
  services: [
    { id: 'srv1', name: 'Skin Fade', price: 400 },
    { id: 'srv2', name: 'Beard Sculpt', price: 200 },
    { id: 'srv3', name: 'Head Massage', price: 350 },
  ],
  slots: [
    '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:30 PM', '04:30 PM'
  ],
  bookedSlots: ['10:00 AM', '11:00 AM', '03:30 PM'],
  dates: [
    { day: 'Today', num: '06' },
    { day: 'Tom', num: '07' },
    { day: 'Mon', num: '08' },
    { day: 'Tue', num: '09' }
  ]
};

// SVG Avatar generator
export function getAvatar(seed: string, initial: string, size: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="hsl(${h},44%,15%)"/>
      <circle cx="50" cy="40" r="16" fill="rgba(255,255,255,.1)"/>
      <path d="M18 100c4-19 16-28 32-28s28 9 32 28z" fill="rgba(255,255,255,.1)"/>
      <text x="50" y="57" font-family="sans-serif" font-size="28" font-weight="700" fill="rgba(255,255,255,.8)" text-anchor="middle">${initial}</text>
    </svg>
  `)}`;
}


function App() {
  const [screen, setScreen] = useState('home');
  const [history, setHistory] = useState(['home']);
  const [direction, setDirection] = useState(1);

  // State
  const [selectedSalon, setSelectedSalon] = useState(MOCK_DATA.salons[0]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const nav = (toScreen: string) => {
    setDirection(1);
    setHistory([...history, toScreen]);
    setScreen(toScreen);
  };

  const back = () => {
    if (history.length > 1) {
      setDirection(-1);
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setScreen(newHistory[newHistory.length - 1]);
    }
  };

  const resetHome = () => {
    setDirection(-1);
    setHistory(['home']);
    setScreen('home');
    setSelectedBarber(null);
    setSelectedTime(null);
    setSelectedServices([]);
  };

  const variants = {
    initial: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.96,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-20%' : '100%',
      opacity: 0,
      scale: 0.96,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    })
  };

  return (
    <div className="min-h-[100dvh] w-full bg-black md:p-8 flex items-center justify-center font-sans">
      <div className="relative w-full max-w-[440px] h-[100dvh] md:h-[880px] md:max-h-[calc(100vh-4rem)] bg-zinc-950 md:rounded-[3rem] md:border border-zinc-800 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            
            {screen === 'home' && (
              <motion.div
                key="home"
                custom={direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 bg-zinc-950 flex flex-col"
              >
                <HomeScreen nav={nav} onSelectSalon={setSelectedSalon} />
              </motion.div>
            )}

            {screen === 'salon' && (
              <motion.div
                key="salon"
                custom={direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 bg-zinc-950 flex flex-col"
              >
                <SalonProfileScreen nav={nav} back={back} salon={selectedSalon} />
              </motion.div>
            )}

            {screen === 'barbers' && (
              <motion.div
                key="barbers"
                custom={direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 bg-zinc-950 flex flex-col"
              >
                <BarberSelectionScreen nav={nav} back={back} onSelect={setSelectedBarber} />
              </motion.div>
            )}

            {screen === 'schedule' && (
              <motion.div
                key="schedule"
                custom={direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 bg-zinc-950 flex flex-col"
              >
                <ScheduleScreen 
                  nav={nav} 
                  back={back} 
                  barber={selectedBarber}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  selectedServices={selectedServices}
                  setSelectedServices={setSelectedServices}
                />
              </motion.div>
            )}

            {screen === 'billing' && (
              <motion.div
                key="billing"
                custom={direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 bg-zinc-950 flex flex-col z-50"
              >
                <BillingScreen 
                  back={back}
                  resetHome={resetHome}
                  barber={selectedBarber}
                  time={selectedTime}
                  services={selectedServices}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
