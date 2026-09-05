import { ArrowLeft } from 'lucide-react';
import { MOCK_DATA } from '../App';
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
    <div className="flex-1 flex flex-col bg-editorial-900 overflow-hidden">
      
      <header className="px-6 py-6 flex items-center gap-4 bg-editorial-900 shrink-0 z-10 border-b border-editorial-600/50">
        <button 
          onClick={back}
          className="w-10 h-10 rounded border border-editorial-600 flex items-center justify-center text-editorial-200 hover:bg-editorial-800 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-serif italic text-xl tracking-tight text-editorial-50">Stylists</h2>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-4 pb-24">
        {MOCK_DATA.barbers.map((barber) => (
          <motion.button 
            key={barber.id}
            variants={item}
            onClick={() => { onSelect(barber); nav('schedule'); }}
            className="flex items-center gap-5 p-5 bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] text-left hover:bg-editorial-700 transition-colors"
          >
            <div className="relative w-14 h-14 shrink-0">
              <div className="w-full h-full rounded border border-editorial-600 flex items-center justify-center bg-editorial-900 text-editorial-200 font-serif italic text-2xl">
                {barber.name[0]}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-sans font-bold text-base text-editorial-50 mb-0.5 tracking-tight">{barber.name}</h3>
              <p className="text-[10px] font-mono tracking-widest uppercase text-editorial-400 mb-1">{barber.spec}</p>
            </div>

            <div className="shrink-0 flex flex-col items-end gap-1">
              <span className="font-mono text-xs text-editorial-200">{barber.rating}</span>
              <span className={`text-[9px] uppercase tracking-wider font-bold ${barber.available ? 'text-editorial-300' : 'text-editorial-600'}`}>
                {barber.available ? 'Available' : 'Busy'}
              </span>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
