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
    <div className="flex-1 flex flex-col bg-earth-50 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/salon-hero-3/800/800" 
          alt="Salon background" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-50 via-earth-50/80 to-transparent"></div>
      </div>

      <div className="flex-1 flex flex-col justify-end p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
        >
          <h1 className="font-sans font-bold text-4xl tracking-tighter text-earth-900 mb-2">StinOra</h1>
          <p className="text-earth-700 leading-relaxed mb-8">
            The premium booking experience for modern grooming.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] tracking-widest uppercase text-earth-600 font-medium ml-1">Mobile Number</label>
              <div className="flex bg-white border border-earth-200 rounded-2xl overflow-hidden shadow-sm focus-within:border-earth-400 focus-within:ring-2 focus-within:ring-earth-400/20 transition-all">
                <span className="flex items-center justify-center px-4 bg-earth-50 border-r border-earth-100 text-earth-600 font-medium text-sm">
                  +91
                </span>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="flex-1 px-4 py-4 bg-transparent outline-none text-earth-900 font-medium placeholder:text-earth-300"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !phone}
              className="w-full bg-earth-900 text-earth-50 font-semibold py-4 rounded-2xl shadow-diffusion active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex justify-center items-center h-[56px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-earth-50/30 border-t-earth-50 rounded-full animate-spin"></div>
              ) : (
                "Continue"
              )}
            </button>
          </form>
          
          <p className="text-center text-[11px] text-earth-500 mt-6">
            By continuing, you agree to our Terms of Service.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
