import { motion } from 'framer-motion';
import { useState } from 'react';

export default function WelcomeScreen({ nav }: { nav: any }) {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setTimeout(() => {
      nav('home');
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col bg-editorial-900 relative overflow-hidden h-full">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80" 
          alt="Luxury Salon Interior" 
          className="w-full h-full object-cover opacity-25 dark:opacity-20 mix-blend-luminosity grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-editorial-900 via-editorial-900/85 to-editorial-900/30"></div>
      </div>

      <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 relative z-10 overflow-y-auto no-scrollbar">
        <div className="pt-6">
          <div className="inline-block border border-editorial-600 rounded-full px-3 py-1 mb-4 bg-editorial-800/80 shadow-bento">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-editorial-400 font-bold">StinOra Grooming</p>
          </div>
          <h1 className="font-sans font-bold text-4xl sm:text-5xl leading-[1.05] tracking-tighter text-editorial-50 mb-3">
            Bespoke<br/><span className="font-serif italic font-normal text-editorial-200">Grooming.</span>
          </h1>
          <p className="text-editorial-400 text-xs sm:text-sm leading-relaxed max-w-[280px]">
            Master stylists, precision fades, and luxury treatments across Bangalore's premier salons.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
          className="pb-4"
        >
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex bg-editorial-800 border border-editorial-600 rounded-lg overflow-hidden focus-within:border-brand-400 focus-within:ring-1 focus-within:ring-brand-400 transition-colors shadow-bento">
                <span className="flex items-center justify-center px-4 bg-editorial-700/50 border-r border-editorial-600 text-editorial-300 font-mono text-xs font-bold">
                  +91
                </span>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter mobile number"
                  aria-label="Enter mobile number"
                  className="flex-1 px-4 py-3.5 bg-transparent outline-none text-editorial-50 font-medium placeholder:text-editorial-500 text-sm"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !phone}
              className="w-full bg-brand-500 text-white shadow-glow font-bold py-3.5 rounded-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex justify-center items-center h-[52px] hover:bg-brand-400 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Enter Studio"
              )}
            </button>

            <button
              type="button"
              onClick={() => nav('home')}
              className="text-xs font-mono font-bold text-editorial-400 hover:text-editorial-100 py-2 tracking-wider uppercase transition-colors"
            >
              Explore as Guest &rarr;
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
