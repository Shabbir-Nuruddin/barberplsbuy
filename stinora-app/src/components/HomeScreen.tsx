import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { Star } from '@phosphor-icons/react';
import { MOCK_DATA, getAvatar } from '../App';

export default function HomeScreen({ nav, onSelectSalon, searchQuery, setSearchQuery }: { nav: any, onSelectSalon: any, searchQuery: string, setSearchQuery: any }) {
  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const filteredSalons = MOCK_DATA.salons.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative bg-earth-50">
      
      {/* Header */}
      <header className="px-6 pt-10 pb-6 flex items-start justify-between sticky top-0 bg-earth-50/80 backdrop-blur-xl z-20">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-earth-500 mb-1">Welcome Back</p>
          <h1 className="font-sans font-bold text-3xl tracking-tight text-earth-900 mb-1">StinOra</h1>
          <p className="flex items-center gap-1.5 text-xs text-earth-600 font-medium">
            <MapPin size={14} className="text-earth-400" />
            Indiranagar, BLR
          </p>
        </div>
        <button 
          onClick={() => nav('profile')}
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-diffusion active:scale-95 transition-transform"
        >
          <img src={getAvatar('guest-user', 'G', 80)} alt="Profile" className="w-full h-full object-cover" />
        </button>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="px-6 flex flex-col gap-10">
        
        {/* Search */}
        <motion.div variants={item}>
          <div className="flex items-center gap-3 bg-white border border-earth-200 shadow-diffusion-sm rounded-2xl p-4 focus-within:border-earth-400 focus-within:ring-2 focus-within:ring-earth-400/20 transition-all">
            <Search size={18} className="text-earth-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search salons, services..." 
              className="bg-transparent border-none outline-none text-sm text-earth-900 flex-1 placeholder:text-earth-400 font-medium"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-5 -mx-6 px-6">
            {['Skin Fade', 'Classic', 'Spa', 'Luxury'].map((chip, i) => (
              <button 
                key={i} 
                onClick={() => setSearchQuery(chip)}
                className="flex-none px-5 py-2.5 rounded-full border border-earth-200 bg-white text-xs font-semibold text-earth-700 shadow-sm active:scale-95 transition-transform"
              >
                {chip}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Previous Bookings (hide if searching) */}
        {!searchQuery && (
          <motion.div variants={item}>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-sans font-bold text-lg text-earth-900">Your Usual</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 snap-x snap-mandatory">
              <button 
                className="snap-start flex-none w-[280px] bg-white border border-earth-200 shadow-diffusion rounded-[1.5rem] p-5 text-left active:scale-[0.98] transition-transform"
                onClick={() => { onSelectSalon(MOCK_DATA.salons[0]); nav('salon'); }}
              >
                <h3 className="font-sans font-bold text-lg leading-tight mb-1 text-earth-900">The Crown Salon</h3>
                <p className="text-xs text-earth-500 font-medium mb-5">19 Aug &bull; Rohan Mehra</p>
                <div className="flex items-center justify-between border-t border-earth-100 pt-4">
                  <span className="text-xs font-medium text-earth-700">Skin Fade + Sculpt</span>
                  <span className="text-xs font-bold text-earth-50 bg-earth-900 px-3 py-1.5 rounded-lg shadow-sm">Rebook</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* Top Rated / Search Results */}
        <motion.div variants={item}>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-sans font-bold text-lg text-earth-900">
              {searchQuery ? 'Search Results' : 'Top Rated Near You'}
            </h2>
          </div>
          
          {filteredSalons.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-earth-500 text-sm font-medium">No salons found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredSalons.map((salon) => (
                <button 
                  key={salon.id}
                  className="flex items-center gap-4 p-4 bg-white border border-earth-200 shadow-diffusion-sm rounded-[1.25rem] active:scale-[0.98] transition-transform text-left"
                  onClick={() => { onSelectSalon(salon); nav('salon'); }}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-none shadow-sm">
                    <img src={salon.image} alt={salon.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="font-sans font-bold text-base text-earth-900 mb-1">{salon.name}</h3>
                    <p className="text-xs text-earth-500 font-medium mb-2">{salon.dist}</p>
                    <div className="flex gap-1">
                      {salon.tags.map((t: string) => (
                        <span key={t} className="text-[10px] font-medium bg-earth-100 text-earth-700 px-2 py-0.5 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-none self-start mt-2">
                    <span className="flex items-center gap-1 font-bold text-sm text-earth-900">
                      {salon.rating}
                      <Star weight="fill" className="text-earth-400" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}
