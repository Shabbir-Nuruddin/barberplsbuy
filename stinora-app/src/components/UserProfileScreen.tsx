import { ArrowLeft, CreditCard, Clock, Settings, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserProfileScreen({ back, resetHome }: { back: any, resetHome: any }) {
  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 flex flex-col bg-editorial-900 relative overflow-hidden">
      
      <header className="px-6 py-6 flex items-center gap-4 bg-editorial-900 shrink-0 z-10 border-b border-editorial-600/50">
        <button 
          onClick={back}
          className="w-10 h-10 rounded border border-editorial-600 flex items-center justify-center text-editorial-200 hover:bg-editorial-800 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-serif italic text-xl tracking-tight text-editorial-50">Profile</h2>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar pb-24">
        
        <motion.div variants={item} className="px-6 pt-10 pb-8 text-center flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full border border-editorial-600 flex items-center justify-center bg-editorial-800 text-editorial-300 font-serif italic text-4xl">
              A
            </div>
          </div>
          <h1 className="font-sans font-bold text-3xl tracking-tight text-editorial-50 mb-1">Aarav</h1>
          <p className="text-editorial-400 text-xs font-mono tracking-[0.15em] uppercase">Member since 2026</p>
        </motion.div>

        <motion.div variants={item} className="px-6 pb-8">
          <div className="bg-editorial-800 border border-editorial-600 rounded-[1rem] overflow-hidden divide-y divide-editorial-700 shadow-bento">
            
            <button className="w-full flex items-center justify-between p-5 hover:bg-editorial-700 transition-colors">
              <div className="flex items-center gap-4 text-editorial-100">
                <Clock size={18} className="text-editorial-300" />
                <span className="font-medium text-sm">Past Bookings</span>
              </div>
              <ChevronRight size={16} className="text-editorial-500" />
            </button>

            <button className="w-full flex items-center justify-between p-5 hover:bg-editorial-700 transition-colors">
              <div className="flex items-center gap-4 text-editorial-100">
                <CreditCard size={18} className="text-editorial-300" />
                <span className="font-medium text-sm">Payment Methods</span>
              </div>
              <ChevronRight size={16} className="text-editorial-500" />
            </button>

            <button className="w-full flex items-center justify-between p-5 hover:bg-editorial-700 transition-colors">
              <div className="flex items-center gap-4 text-editorial-100">
                <Settings size={18} className="text-editorial-300" />
                <span className="font-medium text-sm">Account Settings</span>
              </div>
              <ChevronRight size={16} className="text-editorial-500" />
            </button>

          </div>

          <button 
            onClick={resetHome}
            className="w-full mt-8 bg-transparent border border-editorial-600 text-editorial-400 hover:text-editorial-200 font-bold py-4 rounded-[1rem] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            <LogOut size={16} />
            <span className="text-sm">Sign Out</span>
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
