import { motion } from 'framer-motion';

export default function BookingsScreen() {
  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 flex flex-col bg-editorial-900 overflow-hidden relative">
      
      <header className="px-6 pt-10 pb-6 shrink-0 z-10 border-b border-editorial-600/50 bg-editorial-900">
        <h1 className="font-sans font-bold text-3xl tracking-tighter text-editorial-50">
          Your <span className="font-serif italic font-normal text-editorial-200">Archive.</span>
        </h1>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-6 pb-24">
        
        <div>
          <h2 className="font-mono text-[10px] tracking-widest uppercase font-semibold text-editorial-400 mb-4">Upcoming</h2>
          <motion.div variants={item} className="bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] p-6 text-left">
             <div className="flex justify-between items-start mb-4 border-b border-editorial-700 pb-4">
               <div>
                 <h3 className="font-bold text-sm text-editorial-50 mb-1">Rohan &bull; Lakme Salon</h3>
                 <p className="text-[10px] font-mono tracking-widest uppercase text-editorial-400">Skin Fade + Beard Sculpt</p>
               </div>
               <div className="text-right">
                 <span className="block font-serif italic text-lg text-editorial-200">14 Sept</span>
                 <span className="font-mono text-[10px] text-editorial-500 font-bold">06:30 PM</span>
               </div>
             </div>
             <div className="flex gap-3">
               <button className="flex-1 border border-editorial-600 bg-editorial-900 text-editorial-200 text-xs font-bold py-3 rounded hover:bg-editorial-800 transition-colors">Reschedule</button>
               <button className="flex-1 border border-editorial-600 bg-transparent text-editorial-500 text-xs font-bold py-3 rounded hover:bg-editorial-800 transition-colors">Cancel</button>
             </div>
          </motion.div>
        </div>

        <div>
          <h2 className="font-mono text-[10px] tracking-widest uppercase font-semibold text-editorial-400 mb-4">Past</h2>
          <div className="flex flex-col gap-3">
            {[
              { date: '19 Aug', service: 'Skin Fade + Beard Sculpt', barber: 'Rohan', price: '₹530' },
              { date: '02 Aug', service: 'Classic Haircut', barber: 'Vikram', price: '₹400' },
              { date: '15 Jul', service: 'Scalp Detox Spa', barber: 'Imran', price: '₹1200' },
            ].map((b, i) => (
              <motion.div key={i} variants={item} className="flex justify-between items-center p-4 bg-editorial-800 border border-editorial-600 rounded-[1rem] shadow-bento">
                <div>
                  <h3 className="font-bold text-xs text-editorial-50 mb-0.5">{b.service}</h3>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-editorial-500">{b.date} &bull; {b.barber}</p>
                </div>
                <span className="font-mono text-[11px] font-bold text-editorial-300">{b.price}</span>
              </motion.div>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
