import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { SALONS, salonRating, useStore } from '../lib/store';
import { useState, useDeferredValue } from 'react';

const CATEGORIES = ['All', 'Skin Fade', 'Luxury', 'Spa', 'Color', 'Classic'];

export default function ExploreScreen({ nav, setSalonId }: { nav: (s: string) => void; setSalonId: (id: string) => void }) {
  const store = useStore();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const deferredQuery = useDeferredValue(query);

  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

    // Studios in the customer's own area first — the point of asking for it.
  const home = store.customer.area;
  const filtered = SALONS.filter(s => {
    const matchesQuery = 
      s.name.toLowerCase().includes(deferredQuery.toLowerCase()) || 
      s.address.toLowerCase().includes(deferredQuery.toLowerCase()) ||
      s.tags.some((t: string) => t.toLowerCase().includes(deferredQuery.toLowerCase()));
      
    const matchesCat = activeCategory === 'All' || s.tags.includes(activeCategory);
    return matchesQuery && matchesCat;
  }).sort((a, b) => {
    if (home) {
      const an = a.area === home ? 0 : 1;
      const bn = b.area === home ? 0 : 1;
      if (an !== bn) return an - bn;
    }
    return parseFloat(a.dist) - parseFloat(b.dist);
  });

  return (
    <div className="flex-1 flex flex-col bg-editorial-900 overflow-hidden relative">
      
      <header className="px-6 pt-10 pb-4 shrink-0 z-10 border-b border-editorial-600/50 bg-editorial-900">
        <h1 className="font-sans font-bold text-3xl tracking-tighter text-editorial-50 mb-5">
          Explore <span className="font-serif italic font-normal text-editorial-200">Studios.</span>
        </h1>
        
        {/* Search Input */}
        <div className="flex bg-editorial-800 border border-editorial-600 rounded-lg overflow-hidden focus-within:border-brand-400 focus-within:ring-1 focus-within:ring-brand-400 transition-colors shadow-bento mb-4">
          <span className="flex items-center justify-center px-4 text-editorial-400">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by studio or service (Fade, Spa...)"
            aria-label="Search studios and grooming services"
            className="flex-1 py-3.5 pr-4 bg-transparent outline-none text-editorial-50 font-medium placeholder:text-editorial-500 text-sm"
          />
        </div>

        {/* Quick Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-selected={active}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase font-bold transition-all shrink-0 ${
                  active 
                    ? 'bg-brand-500 text-white shadow-glow' 
                    : 'bg-editorial-800 border border-editorial-700 text-editorial-300 hover:bg-editorial-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-4 pb-28">
        {filtered.length === 0 ? (
          <div className="text-center text-editorial-400 font-medium py-16 bg-editorial-800/40 rounded-[1rem] border border-editorial-700">
            <p className="font-serif italic text-xl text-editorial-200 mb-2">No studios found</p>
            <p className="text-xs text-editorial-500">Try adjusting your search query or selected category filter.</p>
          </div>
        ) : (
          filtered.map((salon) => (
            <motion.button 
              key={salon.id}
              variants={item}
              onClick={() => { setSalonId(salon.id); nav('salon'); }}
              aria-label={`View studio ${salon.name} in Indiranagar`}
              className="flex gap-4 p-4 bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] text-left hover:bg-editorial-700 hover:border-editorial-500 transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <div className="w-20 h-20 shrink-0 relative overflow-hidden rounded">
                <img src={salon.image} alt={salon.name} className="w-full h-full object-cover grayscale mix-blend-luminosity opacity-85" />
                <div className="absolute inset-0 bg-editorial-900/10"></div>
              </div>
              
              <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between">
                <div>
                  <h3 className="font-sans font-bold text-base text-editorial-50 mb-0.5 tracking-tight truncate">{salon.name}</h3>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-editorial-400 mb-2 truncate flex items-center gap-1">
                    <MapPin size={10} className="shrink-0 text-editorial-500" />
                    {salon.address}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-brand-300 font-bold">{salonRating(salon.id).average.toFixed(1)} ★</span>
                  <span className="text-editorial-600 text-xs">&bull;</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-editorial-300">{salon.dist}</span>
                  <div className="ml-auto flex gap-1">
                    {salon.tags.slice(0, 1).map((t: string) => (
                      <span key={t} className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-editorial-900 text-editorial-400 border border-editorial-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.button>
          ))
        )}
      </motion.div>
    </div>
  );
}
