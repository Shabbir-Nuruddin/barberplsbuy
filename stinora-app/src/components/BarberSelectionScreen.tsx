import { ArrowLeft } from 'lucide-react';
import { Star } from '@phosphor-icons/react';
import { MOCK_DATA, getAvatar } from '../App';
import { motion } from 'framer-motion';

export default function BarberSelectionScreen({ nav, back, onSelect }: { nav: any, back: any, onSelect: any }) {
  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
      
      <header className="px-6 py-5 flex items-center gap-4 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shrink-0 z-10">
        <button 
          onClick={back}
          className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-100 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-sans font-semibold text-lg tracking-tight text-white">Select Barber</h2>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-3">
        {MOCK_DATA.barbers.map((barber) => (
          <motion.button 
            key={barber.id}
            variants={item}
            onClick={() => { onSelect(barber); nav('schedule'); }}
            className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 shadow-liquid rounded-2xl text-left active:scale-[0.98] transition-transform"
          >
            <div className="relative w-14 h-14 shrink-0">
              <img 
                src={getAvatar(barber.name.toLowerCase().replace(' ', '-'), barber.name[0], 120)} 
                alt={barber.name} 
                className="w-full h-full rounded-full"
              />
              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-zinc-900 ${barber.available ? 'bg-emerald-500' : 'bg-zinc-500'}`}></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-sans font-semibold text-base text-zinc-100 mb-0.5">{barber.name}</h3>
              <p className="text-xs font-medium text-brand-500 mb-1">{barber.spec}</p>
              <p className="text-[11px] text-zinc-500">{barber.exp}</p>
            </div>

            <div className="shrink-0 flex items-center gap-1 font-semibold text-sm text-zinc-200">
              {barber.rating}
              <Star weight="fill" className="text-brand-500" />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
