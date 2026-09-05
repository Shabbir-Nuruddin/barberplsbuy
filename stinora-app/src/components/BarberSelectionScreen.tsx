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
    <div className="flex-1 flex flex-col bg-earth-50 overflow-hidden">
      
      <header className="px-6 py-5 flex items-center gap-4 bg-earth-50 shrink-0 z-10 border-b border-earth-200/50">
        <button 
          onClick={back}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-earth-200 flex items-center justify-center text-earth-800 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-sans font-bold text-lg tracking-tight text-earth-900">Select Barber</h2>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-4">
        {MOCK_DATA.barbers.map((barber) => (
          <motion.button 
            key={barber.id}
            variants={item}
            onClick={() => { onSelect(barber); nav('schedule'); }}
            className="flex items-center gap-4 p-5 bg-white border border-earth-200 shadow-diffusion-sm rounded-[1.5rem] text-left active:scale-[0.98] transition-transform"
          >
            <div className="relative w-16 h-16 shrink-0">
              <img 
                src={getAvatar(barber.name.toLowerCase().replace(' ', '-'), barber.name[0], 120)} 
                alt={barber.name} 
                className="w-full h-full rounded-full border border-earth-100 shadow-sm"
              />
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${barber.available ? 'bg-emerald-500' : 'bg-earth-300'}`}></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-sans font-bold text-base text-earth-900 mb-0.5">{barber.name}</h3>
              <p className="text-xs font-semibold text-earth-500 mb-1">{barber.spec}</p>
              <p className="text-[11px] font-medium text-earth-400">{barber.exp}</p>
            </div>

            <div className="shrink-0 flex items-center gap-1 font-bold text-sm text-earth-900 bg-earth-50 px-3 py-1.5 rounded-lg border border-earth-100">
              {barber.rating}
              <Star weight="fill" className="text-earth-400" />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
