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
    <div className="flex-1 flex flex-col bg-earth-50 relative overflow-hidden">
      
      <header className="px-6 py-5 flex items-center gap-4 bg-earth-50 shrink-0 z-10 border-b border-earth-200/50">
        <button 
          onClick={back}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-earth-200 flex items-center justify-center text-earth-800 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-sans font-semibold text-lg tracking-tight text-earth-900">Profile</h2>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar">
        
        {/* Profile Card */}
        <motion.div variants={item} className="px-6 pt-8 pb-6 text-center flex flex-col items-center">
          <div className="relative mb-4">
            <img 
              src={getAvatar('guest-user', 'G', 120)} 
              alt="User" 
              className="w-24 h-24 rounded-full shadow-diffusion border-4 border-white"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-earth-900 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-lg leading-none mb-1">+</span>
            </button>
          </div>
          <h1 className="font-sans font-bold text-2xl text-earth-900 mb-1">Guest User</h1>
          <p className="text-earth-500 text-sm font-mono tracking-widest">+91 98765 43210</p>
        </motion.div>

        {/* Menu Items */}
        <motion.div variants={item} className="px-6 pb-8">
          <div className="bg-white border border-earth-200 rounded-[1.5rem] shadow-diffusion-sm overflow-hidden divide-y divide-earth-100">
            
            <button className="w-full flex items-center justify-between p-5 active:bg-earth-50 transition-colors">
              <div className="flex items-center gap-4 text-earth-800">
                <Clock size={20} className="text-earth-400" />
                <span className="font-medium text-sm">Past Bookings</span>
              </div>
              <ChevronRight size={16} className="text-earth-300" />
            </button>

            <button className="w-full flex items-center justify-between p-5 active:bg-earth-50 transition-colors">
              <div className="flex items-center gap-4 text-earth-800">
                <CreditCard size={20} className="text-earth-400" />
                <span className="font-medium text-sm">Payment Methods</span>
              </div>
              <ChevronRight size={16} className="text-earth-300" />
            </button>

            <button className="w-full flex items-center justify-between p-5 active:bg-earth-50 transition-colors">
              <div className="flex items-center gap-4 text-earth-800">
                <Settings size={20} className="text-earth-400" />
                <span className="font-medium text-sm">Account Settings</span>
              </div>
              <ChevronRight size={16} className="text-earth-300" />
            </button>

          </div>

          <button 
            onClick={resetHome}
            className="w-full mt-8 bg-white border border-earth-200 text-red-500 font-semibold py-4 rounded-2xl shadow-diffusion-sm active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
