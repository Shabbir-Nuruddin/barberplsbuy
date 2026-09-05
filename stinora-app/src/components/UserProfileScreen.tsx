import { ArrowLeft, CreditCard, Clock, Settings, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAvatar } from '../App';

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
    <div className="flex-1 flex flex-col bg-dark-900 relative overflow-hidden">
      
      <header className="px-6 py-5 flex items-center gap-4 bg-dark-900 shrink-0 z-10 border-b border-dark-600/50">
        <button 
          onClick={back}
          className="w-10 h-10 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center text-dark-100 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-sans font-bold text-lg tracking-tight text-dark-50">Profile</h2>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar pb-24">
        
        <motion.div variants={item} className="px-6 pt-8 pb-6 text-center flex flex-col items-center">
          <div className="relative mb-4">
            <img 
              src={getAvatar('guest-user', 'A', 120, ['#93C5FD', '#3B82F6'])} 
              alt="User" 
              className="w-24 h-24 rounded-full shadow-diffusion-dark border-4 border-dark-900"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-accent-blue text-dark-950 rounded-full flex items-center justify-center border-2 border-dark-900 font-bold">
              <span className="text-lg leading-none mb-1">+</span>
            </button>
          </div>
          <h1 className="font-sans font-bold text-2xl text-dark-50 mb-1">Aarav</h1>
          <p className="text-dark-400 text-sm font-mono tracking-widest font-semibold">+91 98765 43210</p>
        </motion.div>

        <motion.div variants={item} className="px-6 pb-8">
          <div className="bg-dark-800 border border-dark-600 rounded-[1.5rem] shadow-diffusion-sm overflow-hidden divide-y divide-dark-700">
            
            <button className="w-full flex items-center justify-between p-5 active:bg-dark-700 transition-colors">
              <div className="flex items-center gap-4 text-dark-100">
                <Clock size={20} className="text-accent-blue" />
                <span className="font-bold text-sm">Past Bookings</span>
              </div>
              <ChevronRight size={16} className="text-dark-400" />
            </button>

            <button className="w-full flex items-center justify-between p-5 active:bg-dark-700 transition-colors">
              <div className="flex items-center gap-4 text-dark-100">
                <CreditCard size={20} className="text-accent-teal" />
                <span className="font-bold text-sm">Payment Methods</span>
              </div>
              <ChevronRight size={16} className="text-dark-400" />
            </button>

            <button className="w-full flex items-center justify-between p-5 active:bg-dark-700 transition-colors">
              <div className="flex items-center gap-4 text-dark-100">
                <Settings size={20} className="text-dark-300" />
                <span className="font-bold text-sm">Account Settings</span>
              </div>
              <ChevronRight size={16} className="text-dark-400" />
            </button>

          </div>

          <button 
            onClick={resetHome}
            className="w-full mt-8 bg-dark-800 border border-dark-600 text-[#FF6B6B] font-bold py-4 rounded-[1.25rem] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
