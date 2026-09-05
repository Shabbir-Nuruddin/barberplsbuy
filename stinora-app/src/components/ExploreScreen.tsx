import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { MOCK_DATA } from '../App';
import { useState } from 'react';

export default function ExploreScreen({ nav, onSelectSalon }: { nav: any, onSelectSalon: any }) {
  const [query, setQuery] = useState('');

  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const filtered = MOCK_DATA.salons.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase()) || 
    s.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col bg-editorial-900 overflow-hidden relative">
      
      <header className="px-6 pt-10 pb-6 shrink-0 z-10 border-b border-editorial-600/50 bg-editorial-900">
        <h1 className="font-sans font-bold text-3xl tracking-tighter text-editorial-50 mb-6">
          Explore <span className="font-serif italic font-normal text-editorial-200">Studios.</span>
        </h1>
        
        <div className="flex bg-editorial-800 border border-editorial-600 rounded-lg overflow-hidden focus-within:border-editorial-300 transition-colors shadow-bento">
          <span className="flex items-center justify-center px-4 text-editorial-400">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or service (e.g. Fade, Spa)"
            className="flex-1 py-4 pr-4 bg-transparent outline-none text-editorial-50 font-medium placeholder:text-editorial-600 text-sm"
          />
        </div>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-4 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center text-editorial-500 font-medium mt-10">
            No studios found matching "{query}"
          </div>
        ) : (
          filtered.map(salon => (
            <motion.button 
              key={salon.id}
              variants={item}
              onClick={() => { onSelectSalon(salon); nav('salon'); }}
              className="flex gap-4 p-4 bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] text-left hover:bg-editorial-700 transition-colors active:scale-[0.98]"
            >
              <div className="w-20 h-20 shrink-0">
                <img src={salon.image} alt={salon.name} className="w-full h-full object-cover rounded grayscale mix-blend-luminosity opacity-80" />
              </div>
              
              <div className="flex-1 min-w-0 py-1">
                <h3 className="font-sans font-bold text-base text-editorial-50 mb-1 tracking-tight truncate">{salon.name}</h3>
                <p className="text-[10px] font-mono tracking-widest uppercase text-editorial-400 mb-2 truncate">{salon.address}</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-editorial-200">{salon.rating} ★</span>
                  <span className="text-editorial-600 text-xs">&bull;</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-editorial-300">{salon.dist}</span>
                </div>
              </div>
            </motion.button>
          ))
        )}
      </motion.div>
    </div>
  );
}
