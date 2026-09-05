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
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/salon-hero-dark/800/800" 
          alt="Salon background" 
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent"></div>
      </div>

      <div className="flex-1 flex flex-col justify-end p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
        >
          <h1 className="font-sans font-bold text-4xl tracking-tighter text-dark-50 mb-2">StinOra</h1>
          <p className="text-dark-300 leading-relaxed mb-8 font-medium">
            The premium booking experience for modern grooming.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] tracking-widest uppercase text-dark-400 font-bold ml-1">Mobile Number</label>
              <div className="flex bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden shadow-sm focus-within:border-accent-blue focus-within:ring-2 focus-within:ring-accent-blue/20 transition-all">
                <span className="flex items-center justify-center px-4 bg-dark-900 border-r border-dark-600 text-dark-300 font-bold text-sm">
                  +91
                </span>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="flex-1 px-4 py-4 bg-transparent outline-none text-dark-50 font-bold placeholder:text-dark-600"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !phone}
              className="w-full bg-accent-blue text-dark-950 font-bold py-4 rounded-2xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex justify-center items-center h-[56px] shadow-diffusion-dark mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin"></div>
              ) : (
                "Continue"
              )}
            </button>
          </form>
          
          <p className="text-center text-[11px] text-dark-500 mt-6 font-medium">
            By continuing, you agree to our Terms of Service.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
