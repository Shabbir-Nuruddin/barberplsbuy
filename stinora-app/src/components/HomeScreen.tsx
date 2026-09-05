import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { Star } from '@phosphor-icons/react';
import { MOCK_DATA } from '../App';

export default function HomeScreen({ nav, onSelectSalon }: { nav: any, onSelectSalon: any }) {
  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-1">StinOra App</p>
          <h1 className="font-sans font-bold text-3xl tracking-tight text-brand-500 mb-1">StinOra</h1>
          <p className="flex items-center gap-1.5 text-xs text-zinc-400">
            <MapPin size={14} className="text-brand-500" />
            Indiranagar, BLR
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 font-semibold text-sm">
          AM
        </div>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="px-6 flex flex-col gap-8">
        
        {/* Search */}
        <motion.div variants={item}>
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 shadow-liquid rounded-2xl p-4">
            <Search size={18} className="text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search salons, services..." 
              className="bg-transparent border-none outline-none text-sm text-zinc-100 flex-1 placeholder:text-zinc-600"
              readOnly
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4 -mx-6 px-6">
            {['Skin Fade', 'Toni & Guy', 'Beard Sculpt'].map((chip, i) => (
              <button key={i} className="flex-none px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-400 active:scale-95 transition-transform">
                {chip}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Previous Bookings */}
        <motion.div variants={item}>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">Your Usual</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 snap-x snap-mandatory">
            <button 
              className="snap-start flex-none w-[260px] bg-zinc-900 border border-zinc-800 shadow-liquid rounded-[1.25rem] p-5 text-left active:scale-[0.98] transition-transform"
              onClick={() => { onSelectSalon(MOCK_DATA.salons[0]); nav('salon'); }}
            >
              <h3 className="font-sans font-semibold text-lg leading-tight mb-1">The Crown Salon</h3>
              <p className="text-xs text-zinc-400 mb-4">19 Aug &bull; Rohan Mehra</p>
              <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                <span className="text-xs text-zinc-300">Skin Fade + Sculpt</span>
                <span className="text-xs font-semibold text-brand-500 bg-brand-500/10 px-3 py-1.5 rounded-lg">Rebook</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Top Rated */}
        <motion.div variants={item}>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">Top Rated Near You</h2>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_DATA.salons.map((salon) => (
              <button 
                key={salon.id}
                className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 shadow-liquid rounded-2xl active:scale-[0.98] transition-transform text-left"
                onClick={() => { onSelectSalon(salon); nav('salon'); }}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-none">
                  <img src={salon.image} alt={salon.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-sans font-semibold text-base mb-1">{salon.name}</h3>
                  <p className="text-xs text-zinc-400">{salon.dist}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-none">
                  <span className="flex items-center gap-1 font-semibold text-sm">
                    {salon.rating}
                    <Star weight="fill" className="text-brand-500" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
