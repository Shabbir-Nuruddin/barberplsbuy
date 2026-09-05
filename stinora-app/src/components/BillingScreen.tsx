import { useState, useEffect } from 'react';
import { ArrowLeft, Smartphone, CreditCard, Store, Loader2 } from 'lucide-react';
import { MOCK_DATA } from '../App';
import { motion, AnimatePresence } from 'framer-motion';

export default function BillingScreen({ back, resetHome, barber, time, services }: any) {
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
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden relative">
      
      <header className="px-6 py-5 flex items-center gap-4 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shrink-0 z-10">
        <button 
          onClick={back}
          className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-100 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-sans font-semibold text-lg tracking-tight text-white">Checkout & Pay</h2>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar pb-28">
        
        <motion.div variants={item} className="p-6">
          <div className="bg-zinc-900 border border-zinc-800 shadow-liquid rounded-[1.25rem] p-5 mb-6">
            <h3 className="font-sans font-semibold text-lg text-brand-500 mb-3 pb-3 border-b border-zinc-800">The Crown Salon</h3>
            <div className="flex justify-between items-start text-sm mb-2.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 w-16">Barber</span>
              <span className="font-medium text-zinc-100 text-right">{barber?.name}</span>
            </div>
            <div className="flex justify-between items-start text-sm mb-2.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 w-16">Slot</span>
              <span className="font-medium text-zinc-100 text-right">Today, {time}</span>
            </div>
            <div className="flex justify-between items-start text-sm">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 w-16">Service</span>
              <span className="font-medium text-zinc-100 text-right">{sNames}</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-zinc-400 mb-2.5">
              <span>Service Cost</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-400 mb-3">
              <span>Taxes & Fees (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-dashed border-zinc-700">
              <span className="font-medium text-zinc-100">Total Payable</span>
              <span className="font-mono text-xl font-medium text-brand-500">₹{total}</span>
            </div>
          </div>

          <div>
            <h2 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">Pay With</h2>
            <div className="flex flex-col gap-2.5">
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
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all active:scale-[0.98] ${
                      active
                        ? 'bg-brand-500/10 border-brand-500/40'
                        : 'bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    <Icon size={20} className={active ? 'text-brand-500' : 'text-zinc-500'} />
                    <span className="flex-1 text-left font-medium text-sm text-zinc-100">{pm.label}</span>
                    <div className={`w-4 h-4 rounded-full border-2 ${active ? 'border-brand-500 bg-brand-500 shadow-[inset_0_0_0_3px_rgba(212,175,55,0.2)]' : 'border-zinc-700'}`}></div>
                  </button>
                )
              })}
            </div>
          </div>

        </motion.div>
      </motion.div>

      {/* CTA Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-30 pointer-events-none">
        <button 
          onClick={handlePay}
          disabled={processing || success}
          className="w-full bg-brand-500 text-brand-950 font-semibold py-4 rounded-xl active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] pointer-events-auto flex items-center justify-center gap-2 disabled:opacity-80 disabled:scale-100"
        >
          {processing ? (
            <><Loader2 className="animate-spin" size={18} /> Processing...</>
          ) : (
            <>{payMethod === 'store' ? 'Confirm & Pay at Store' : `Pay ₹${total} & Confirm`} <span className="font-mono text-[10px] tracking-widest uppercase bg-black/20 px-2 py-0.5 rounded ml-2">3/3</span></>
          )}
        </button>
      </div>

      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-zinc-950 z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.svg 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-16 h-16 mb-6" 
              viewBox="0 0 52 52"
            >
              <circle cx="26" cy="26" r="24" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" strokeWidth="1.5" />
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                d="M15 27l7.5 7.5L37.5 19" 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </motion.svg>
            
            <motion.h2 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-sans font-bold text-2xl tracking-tight text-white mb-2"
            >
              Booking Confirmed!
            </motion.h2>
            <motion.p 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-sm text-zinc-400 leading-relaxed mb-8"
            >
              Your barber has been notified. See you at <strong className="text-zinc-100">Today, {time}</strong>!
            </motion.p>

            <motion.div 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 w-full max-w-[300px] mb-8 text-left"
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Ticket</span>
                <span className="font-mono font-medium text-brand-500">#STN829</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Barber</span>
                <span className="font-medium text-zinc-100">{barber?.name}</span>
              </div>
            </motion.div>

            <motion.button 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
              onClick={resetHome}
              className="px-8 py-3 rounded-xl border border-zinc-700 bg-zinc-900 text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              Back to Home
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
