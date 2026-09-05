import { useState } from 'react';
import { ArrowLeft, Smartphone, CreditCard, Store, Loader2 } from 'lucide-react';
import { MOCK_DATA } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

export default function BillingScreen({ back, resetHome, barber, date, time, services }: any) {
  const [payMethod, setPayMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const sNames = services.map((id: string) => MOCK_DATA.services.find(s => s.id === id)?.name).join(', ');
  const subtotal = services.reduce((acc: number, id: string) => {
    return acc + (MOCK_DATA.services.find(s => s.id === id)?.price || 0);
  }, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 1500);
  };

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
      
      <header className="px-6 py-6 flex items-center gap-4 bg-editorial-900 shrink-0 z-10 border-b border-editorial-600/50">
        <button 
          onClick={back}
          className="w-10 h-10 rounded border border-editorial-600 flex items-center justify-center text-editorial-200 hover:bg-editorial-800 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-serif italic text-xl tracking-tight text-editorial-50">Checkout</h2>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        <motion.div variants={item} className="p-6">
          <div className="bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] p-6 mb-8">
            <h3 className="font-sans font-bold text-lg text-editorial-50 mb-4 pb-4 border-b border-editorial-700 tracking-tight">Booking Summary</h3>
            <div className="flex justify-between items-start text-sm mb-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 w-16 pt-0.5 font-bold">Stylist</span>
              <span className="font-bold text-editorial-100 text-right">{barber?.name}</span>
            </div>
            <div className="flex justify-between items-start text-sm mb-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 w-16 pt-0.5 font-bold">Slot</span>
              <span className="font-bold text-editorial-100 text-right">{date?.day}, {time}</span>
            </div>
            <div className="flex justify-between items-start text-sm">
              <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 w-16 pt-0.5 font-bold">Service</span>
              <span className="font-bold text-editorial-100 text-right max-w-[200px] leading-relaxed">{sNames}</span>
            </div>
          </div>

          <div className="mb-10 px-2">
            <div className="flex justify-between text-xs font-mono tracking-widest uppercase text-editorial-300 mb-4">
              <span>Service Cost</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs font-mono tracking-widest uppercase text-editorial-300 mb-5">
              <span>Taxes (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between items-center pt-5 border-t border-editorial-600">
              <span className="font-sans font-bold text-editorial-50 text-base">Total Payable</span>
              <span className="font-serif italic text-3xl text-editorial-50">₹{total}</span>
            </div>
          </div>

          <div>
            <h2 className="font-sans font-bold text-[1.25rem] tracking-tight text-editorial-50 mb-4">Pay With</h2>
            <div className="flex flex-col gap-3">
              {[
                { id: 'upi', label: 'UPI (GPay, PhonePe)', icon: Smartphone },
                { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                { id: 'store', label: 'Pay at Store', icon: Store }
              ].map(pm => {
                const active = payMethod === pm.id;
                const Icon = pm.icon;
                return (
                  <button
                    key={pm.id}
                    onClick={() => setPayMethod(pm.id)}
                    className={`flex items-center gap-4 p-5 rounded-[1rem] border transition-all active:scale-[0.98] shadow-bento ${
                      active
                        ? 'bg-brand-500 border-brand-500 shadow-glow'
                        : 'bg-editorial-800 border-editorial-600 hover:bg-editorial-700'
                    }`}
                  >
                    <Icon size={20} className={active ? 'text-white' : 'text-editorial-400'} />
                    <span className={`flex-1 text-left font-bold text-sm tracking-tight ${active ? 'text-white' : 'text-editorial-100'}`}>{pm.label}</span>
                    <div className={`w-4 h-4 rounded border ${active ? 'border-white bg-white shadow-[inset_0_0_0_2px_#5452FF]' : 'border-editorial-500'}`}></div>
                  </button>
                )
              })}
            </div>
          </div>

        </motion.div>
      </motion.div>

      {/* CTA Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-editorial-900 via-editorial-900/95 to-transparent z-30 pointer-events-none pb-[calc(1.5rem+64px)]">
        <button 
          onClick={handlePay}
          disabled={processing || success}
          className="w-full bg-brand-500 text-white shadow-glow font-bold py-4 rounded-lg active:scale-[0.98] transition-all pointer-events-auto flex items-center justify-center gap-2 disabled:opacity-80 disabled:scale-100 hover:bg-brand-400"
        >
          {processing ? (
            <><Loader2 className="animate-spin" size={18} /> Processing...</>
          ) : (
            <>{payMethod === 'store' ? 'Confirm Booking' : `Pay ₹${total}`} <span className="font-mono text-[9px] font-bold tracking-widest uppercase bg-white/20 text-white px-2 py-0.5 rounded ml-2">3/3</span></>
          )}
        </button>
      </div>

      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-editorial-900 z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-20 h-20 mb-8 border border-editorial-600 rounded-full flex items-center justify-center bg-editorial-800" 
            >
              <svg viewBox="0 0 52 52" className="w-10 h-10">
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  d="M15 27l7.5 7.5L37.5 19" 
                  fill="none" 
                  stroke="#F5EBE1" 
                  strokeWidth="2" 
                  strokeLinecap="square" 
                  strokeLinejoin="miter" 
                />
              </svg>
            </motion.div>
            
            <motion.h2 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-serif italic text-4xl text-editorial-50 mb-4"
            >
              Confirmed.
            </motion.h2>
            <motion.p 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-sm text-editorial-400 font-medium leading-relaxed mb-10 max-w-[250px]"
            >
              Your stylist has been notified. See you at <strong className="text-editorial-100">{date?.day}, {time}</strong>.
            </motion.p>

            <motion.div 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              className="bg-editorial-800 border border-editorial-600 rounded-[1rem] p-6 w-full max-w-[300px] mb-12 text-left shadow-bento"
            >
              <div className="flex justify-between text-sm mb-4 border-b border-editorial-700 pb-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 mt-0.5 font-bold">Ticket</span>
                <span className="font-mono font-bold text-editorial-100">#STN829</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 mt-0.5 font-bold">Stylist</span>
                <span className="font-bold text-editorial-100 tracking-tight">{barber?.name}</span>
              </div>
            </motion.div>

            <motion.button 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
              onClick={resetHome}
              className="px-10 py-4 rounded-lg border border-editorial-600 bg-transparent text-sm font-bold text-editorial-200 hover:bg-editorial-800 active:scale-[0.98] transition-all"
            >
              Return Home
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
