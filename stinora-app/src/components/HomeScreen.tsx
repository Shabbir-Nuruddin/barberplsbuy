import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Star } from 'lucide-react'; // Using Lucide since phosphor isn't strictly needed
import { MOCK_DATA, getAvatar } from '../App';

export default function HomeScreen({ nav, onSelectSalon }: { nav: any, onSelectSalon: any }) {
  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // Hardcoded gradient colors for the "Switch it up" cards based on the screenshot
  const gradients = [
    { start: '#6EE7B7', end: '#3B82F6' }, // Mint to Blue
    { start: '#FCA5A5', end: '#F59E0B' }, // Red to Amber
    { start: '#93C5FD', end: '#3B82F6' }, // Light Blue to Blue
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8 relative bg-dark-900">
      
      {/* Header */}
      <header className="px-6 pt-10 pb-6 flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-dark-400 mb-1">Friday, 5 Sept</p>
          <h1 className="font-sans font-bold text-2xl tracking-tight text-dark-50 mb-1">Evening, Aarav</h1>
          <p className="flex items-center gap-1.5 text-xs text-dark-300 font-medium">
            <MapPin size={12} className="text-dark-500" />
            Sohna Road, Gurugram
          </p>
        </div>
        <div className="flex gap-2">
           <button className="w-10 h-10 rounded-full border border-dark-600 bg-dark-800 flex items-center justify-center">
             <div className="w-4 h-4 bg-white rounded-full"></div>
           </button>
           <button className="w-10 h-10 rounded-full bg-accent-blue/20 border border-accent-blue/30 text-accent-blue font-bold text-sm flex items-center justify-center">
             A
           </button>
        </div>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="px-6 flex flex-col gap-10">
        
        {/* Rebook The Usual */}
        <motion.div variants={item} className="bg-dark-800 border border-dark-600 rounded-[2rem] p-5 shadow-diffusion-dark">
          
          <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 shrink-0">
               <img src={getAvatar('rohan', 'R', 80, ['#6EE7B7', '#3B82F6'])} alt="Rohan" className="w-full h-full rounded-full" />
             </div>
             <div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-dark-100 mb-0.5">
                   <Star size={12} fill="#FFB020" color="#FFB020" />
                   <span>4.9</span>
                   <span className="text-dark-400 font-medium text-xs ml-1">&bull; Your last 6 cuts</span>
                </div>
             </div>
          </div>

          <div className="flex justify-between items-start mb-4">
             <div>
                <h3 className="font-bold text-dark-50 text-base mb-1">Skin Fade + Beard Sculpt</h3>
                <p className="text-xs text-dark-400 font-medium">45 min</p>
             </div>
             <div className="font-mono text-base font-bold text-dark-100">₹530</div>
          </div>

          <div className="bg-[#1C2C1D] border border-[#274029] rounded-xl p-3.5 mb-5 flex gap-3 items-start">
             <div className="w-2 h-2 rounded-full bg-accent-green mt-1 shrink-0 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
             <p className="text-[11px] text-[#A6C4A8] leading-relaxed">
               Next free chair with Rohan is <strong className="text-accent-green font-bold">today, 6:30 PM</strong>. It has been <strong className="text-white">17 days</strong> since your last fade.
             </p>
          </div>

          <button 
             onClick={() => nav('schedule')}
             className="w-full bg-accent-blue text-dark-950 font-bold py-4 rounded-[1.25rem] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
             Rebook the usual
             <span className="font-mono text-[9px] font-bold tracking-widest text-dark-900 bg-black/10 px-2 py-0.5 rounded-md ml-1 uppercase">2 Taps</span>
          </button>
        </motion.div>

        {/* Switch It Up (Horizontal Gradients) */}
        <motion.div variants={item}>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-mono text-[10px] tracking-widest uppercase font-semibold text-dark-500">Switch It Up</h2>
            <button className="text-xs font-semibold text-accent-blue">See all 12</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 snap-x snap-mandatory pb-4">
            {MOCK_DATA.barbers.slice(0, 3).map((barber, i) => (
              <button 
                key={barber.id}
                onClick={() => { onSelectSalon(MOCK_DATA.salons[i]); nav('salon'); }}
                className="snap-start flex-none w-[160px] bg-dark-800 border border-dark-600 rounded-[1.5rem] overflow-hidden text-left active:scale-95 transition-transform"
              >
                <div className="h-[120px] w-full p-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${gradients[i].start}, ${gradients[i].end})` }}>
                   <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                      {barber.name[0]}
                   </div>
                </div>
                <div className="p-4 border-t border-dark-700">
                   <h3 className="font-bold text-sm text-dark-50 mb-0.5">{barber.name.split(' ')[0]} {barber.name.split(' ')[1]?.[0]}.</h3>
                   <p className="text-[10px] text-dark-400 mb-3">{barber.spec}</p>
                   <div className="flex items-center justify-between">
                     <span className="flex items-center gap-1 text-[10px] font-bold text-dark-200">
                        <Star size={10} fill="#FFB020" color="#FFB020" /> {barber.rating}
                     </span>
                     <span className="text-[10px] font-bold text-accent-green">Free {MOCK_DATA.slots[i]}</span>
                   </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Last Visit */}
        <motion.div variants={item}>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-mono text-[10px] tracking-widest uppercase font-semibold text-dark-500">Last Visit</h2>
          </div>
          <button className="w-full flex items-center gap-4 p-4 bg-dark-800 border border-dark-600 rounded-[1.25rem] active:scale-[0.98] transition-transform text-left mb-6">
            <div className="w-10 h-10 shrink-0">
               <img src={getAvatar('rohan', 'R', 80, ['#6EE7B7', '#3B82F6'])} alt="Rohan" className="w-full h-full rounded-xl" />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="font-bold text-sm text-dark-50 mb-0.5">Skin Fade + Beard Sculpt</h3>
               <p className="text-[11px] text-dark-400">19 Aug &bull; Rohan &bull; ₹530 &bull; you tipped ₹50</p>
            </div>
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
