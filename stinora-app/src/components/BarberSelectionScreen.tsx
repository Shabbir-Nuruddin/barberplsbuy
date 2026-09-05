import { ArrowLeft } from 'lucide-react';
import { MOCK_DATA } from '../App';
import { motion } from 'framer-motion';

export default function BarberSelectionScreen({ nav, back, onSelect }: { nav: any, back: any, onSelect: any }) {
  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 flex flex-col bg-editorial-900 overflow-hidden">
      
      <header className="px-6 py-6 flex items-center gap-4 bg-editorial-900 shrink-0 z-10 border-b border-editorial-600/50">
        <button 
          onClick={back}
          aria-label="Back to salon profile"
          className="w-10 h-10 rounded border border-editorial-600 flex items-center justify-center text-editorial-200 hover:bg-editorial-800 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-serif italic text-xl tracking-tight text-editorial-50">Select Master Stylist</h2>
          <p className="text-[10px] font-mono tracking-widest uppercase text-editorial-400">Direct chair reservation</p>
        </div>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-4 pb-24">
        {MOCK_DATA.barbers.map((barber) => {
          const isAvailable = barber.available;
          return (
            <motion.button 
              key={barber.id}
              variants={item}
              disabled={!isAvailable}
              aria-disabled={!isAvailable}
              onClick={() => {
                if (!isAvailable) return;
                onSelect(barber); 
                nav('schedule'); 
              }}
              className={`flex items-center gap-5 p-5 border rounded-[1rem] text-left transition-all ${
                isAvailable 
                  ? 'bg-editorial-800 border-editorial-600 shadow-bento hover:bg-editorial-700 hover:border-editorial-500 active:scale-[0.98] cursor-pointer' 
                  : 'bg-editorial-900/80 border-editorial-700/60 opacity-50 cursor-not-allowed filter grayscale'
              }`}
            >
              <div className="relative w-14 h-14 shrink-0">
                <div className={`w-full h-full rounded border flex items-center justify-center font-serif italic text-2xl ${
                  isAvailable ? 'border-editorial-600 bg-editorial-900 text-editorial-200' : 'border-editorial-700 bg-editorial-950 text-editorial-500'
                }`}>
                  {barber.name[0]}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-sans font-bold text-base text-editorial-50 mb-0.5 tracking-tight">{barber.name}</h3>
                  {!isAvailable && (
                    <span className="text-[8px] font-mono tracking-wider uppercase font-bold text-red-400 bg-red-950/60 border border-red-800/60 px-1.5 py-0.5 rounded">
                      Booked Out
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-editorial-400 mb-1">{barber.spec}</p>
                <p className="text-[11px] text-editorial-400 font-medium">{barber.exp} experience</p>
              </div>

              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <span className="font-mono text-xs text-editorial-200 font-bold">{barber.rating} ★</span>
                <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                  isAvailable ? 'text-brand-300 bg-brand-950/50 border border-brand-800/40' : 'text-editorial-500 bg-editorial-800'
                }`}>
                  {isAvailable ? 'Available' : 'Fully Booked'}
                </span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
