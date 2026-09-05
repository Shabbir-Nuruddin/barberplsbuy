import { ArrowLeft, Star } from 'lucide-react';
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

  const gradients = [
    ['#6EE7B7', '#3B82F6'],
    ['#FCA5A5', '#F59E0B'],
    ['#93C5FD', '#3B82F6'],
    ['#D8B4FE', '#8B5CF6'],
    ['#FDBA74', '#EF4444'],
  ];

  return (
    <div className="flex-1 flex flex-col bg-dark-900 overflow-hidden">
      
      <header className="px-6 py-5 flex items-center gap-4 bg-dark-900 shrink-0 z-10 border-b border-dark-600/50">
        <button 
          onClick={back}
          className="w-10 h-10 rounded-full bg-dark-800 shadow-sm border border-dark-600 flex items-center justify-center text-dark-100 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-sans font-bold text-lg tracking-tight text-dark-50">Select Barber</h2>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-4 pb-24">
        {MOCK_DATA.barbers.map((barber, i) => (
          <motion.button 
            key={barber.id}
            variants={item}
            onClick={() => { onSelect(barber); nav('schedule'); }}
            className="flex items-center gap-4 p-5 bg-dark-800 border border-dark-600 shadow-diffusion-sm rounded-[1.5rem] text-left active:scale-[0.98] transition-transform"
          >
            <div className="relative w-16 h-16 shrink-0">
              <img 
                src={getAvatar(barber.name.toLowerCase().replace(' ', '-'), barber.name[0], 120, gradients[i % gradients.length])} 
                alt={barber.name} 
                className="w-full h-full rounded-full border border-dark-600 shadow-sm"
              />
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-dark-800 shadow-sm ${barber.available ? 'bg-accent-green' : 'bg-dark-600'}`}></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-sans font-bold text-base text-dark-50 mb-0.5">{barber.name}</h3>
              <p className="text-xs font-semibold text-dark-300 mb-1">{barber.spec}</p>
              <p className="text-[11px] font-medium text-dark-500">{barber.exp}</p>
            </div>

            <div className="shrink-0 flex items-center gap-1 font-bold text-sm text-dark-100 bg-dark-900 px-3 py-1.5 rounded-lg border border-dark-600">
              {barber.rating}
              <Star size={12} fill="#FFB020" color="#FFB020" />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
