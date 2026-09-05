import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { MOCK_DATA } from '../App';

export default function HomeScreen({ nav, onSelectSalon, setBarber }: { nav: any, onSelectSalon: any, setBarber: any }) {
  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8 relative bg-editorial-900">
      
      {/* Header */}
      <header className="px-6 pt-10 pb-8 flex items-start justify-between">
        <div>
          <div className="inline-block border border-editorial-600 rounded-full px-3 py-1 mb-4">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-editorial-200">Bespoke Grooming</p>
          </div>
          <h1 className="font-sans font-bold text-[2.5rem] leading-[1.1] tracking-tighter text-editorial-50 mb-1">
            Evening, <span className="font-serif italic font-normal text-editorial-200">Aarav.</span>
          </h1>
          <p className="flex items-center gap-1.5 text-xs text-editorial-400 font-medium mt-3">
            <MapPin size={12} className="text-editorial-500" />
            Sohna Road, Gurugram
          </p>
        </div>
        <div className="flex gap-2">
           <button className="w-10 h-10 rounded-full bg-brand-500 text-white shadow-glow font-bold text-sm flex items-center justify-center">
             A
           </button>
        </div>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="px-6 flex flex-col gap-6">
        
        {/* Rebook The Usual (CollectiveOS style card) */}
        <motion.div variants={item} className="bg-editorial-800 border border-editorial-600 rounded-[1rem] p-6 shadow-bento">
          
          <div className="flex justify-between items-start mb-12">
             <div>
                <div className="border border-editorial-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-editorial-50 font-serif italic text-lg">
                  R
                </div>
                <h3 className="font-bold text-editorial-50 text-lg tracking-tight mb-1">Skin Fade + Beard Sculpt</h3>
                <p className="text-xs text-editorial-400 font-medium">45 min &bull; Rohan</p>
             </div>
             <div className="font-mono text-base font-bold text-editorial-100">₹530</div>
          </div>

          <div className="border-t border-editorial-700 pt-5 mb-6 flex gap-3 items-start">
             <div className="w-1.5 h-1.5 rounded-full bg-editorial-50 mt-1.5 shrink-0"></div>
             <p className="text-xs text-editorial-300 leading-relaxed max-w-[240px]">
               Next free chair is <strong className="text-editorial-50 font-bold">today, 6:30 PM</strong>. It has been 17 days since your last fade.
             </p>
          </div>

          <button 
             onClick={() => { setBarber(MOCK_DATA.barbers[0]); nav('schedule'); }}
             className="w-full bg-brand-500 text-white shadow-glow font-bold py-3.5 rounded-lg active:scale-[0.98] transition-all flex justify-between items-center px-5 group hover:bg-brand-400"
          >
             <span>Rebook</span>
             <span className="font-mono text-[9px] font-bold tracking-widest text-editorial-500 bg-black/5 px-2 py-1 rounded uppercase">2 Taps</span>
          </button>
        </motion.div>

        {/* Switch It Up (Bento Grid) */}
        <motion.div variants={item}>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-mono text-[10px] tracking-widest uppercase font-semibold text-editorial-400">Switch It Up</h2>
            <button onClick={() => nav('explore')} className="text-[10px] uppercase tracking-wider font-bold text-editorial-300 hover:text-editorial-50 transition-colors">See all</button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {MOCK_DATA.barbers.slice(0, 4).map((barber, i) => (
              <button 
                key={barber.id}
                onClick={() => { onSelectSalon(MOCK_DATA.salons[i]); nav('salon'); }}
                className="bg-editorial-800 border border-editorial-600 rounded-[1rem] p-5 text-left active:scale-[0.98] transition-all shadow-bento hover:shadow-bento-hover"
              >
                <div className="border border-editorial-600 w-8 h-8 rounded flex items-center justify-center mb-4 text-editorial-200 font-serif italic text-sm">
                  {barber.name[0]}
                </div>
                <h3 className="font-bold text-sm text-editorial-50 mb-1">{barber.name.split(' ')[0]}</h3>
                <p className="text-[10px] text-editorial-400 mb-4">{barber.spec}</p>
                <div className="flex items-center justify-between mt-auto">
                   <span className="text-[10px] font-mono text-editorial-200">{barber.rating}</span>
                   <span className="text-[9px] uppercase tracking-wider font-bold text-editorial-300">Free</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
