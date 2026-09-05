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
    <div className="flex-1 flex flex-col bg-dark-900 overflow-hidden relative">
      
      <header className="px-6 py-5 flex items-center gap-4 bg-dark-900 shrink-0 z-10 border-b border-dark-600/50">
        <button 
          onClick={back}
          className="w-10 h-10 rounded-full bg-dark-800 shadow-sm border border-dark-600 flex items-center justify-center text-dark-100 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-sans font-bold text-lg tracking-tight text-dark-50">Checkout</h2>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        <motion.div variants={item} className="p-6">
          <div className="bg-dark-800 border border-dark-600 shadow-diffusion-dark rounded-[1.5rem] p-6 mb-8">
            <h3 className="font-sans font-bold text-xl text-dark-50 mb-4 pb-4 border-b border-dark-700">Booking Summary</h3>
            <div className="flex justify-between items-start text-sm mb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-dark-400 w-16 pt-0.5 font-bold">Barber</span>
              <span className="font-bold text-dark-100 text-right">{barber?.name}</span>
            </div>
            <div className="flex justify-between items-start text-sm mb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-dark-400 w-16 pt-0.5 font-bold">Slot</span>
              <span className="font-bold text-dark-100 text-right">{date?.day}, {time}</span>
            </div>
            <div className="flex justify-between items-start text-sm">
              <span className="font-mono text-[10px] uppercase tracking-widest text-dark-400 w-16 pt-0.5 font-bold">Service</span>
              <span className="font-bold text-dark-100 text-right max-w-[200px]">{sNames}</span>
            </div>
          </div>

          <div className="mb-10 px-2">
            <div className="flex justify-between text-sm text-dark-300 mb-3 font-medium">
              <span>Service Cost</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-dark-300 mb-4 font-medium">
              <span>Taxes & Fees (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-dashed border-dark-600">
              <span className="font-bold text-dark-50 text-base">Total Payable</span>
              <span className="font-mono text-2xl font-bold text-dark-50">₹{total}</span>
            </div>
          </div>

          <div>
            <h2 className="font-sans font-bold text-lg text-dark-50 mb-4">Pay With</h2>
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
                    className={`flex items-center gap-4 p-5 rounded-[1.25rem] border transition-all active:scale-[0.98] shadow-sm ${
                      active
                        ? 'bg-accent-blue border-accent-blue shadow-diffusion-dark'
                        : 'bg-dark-800 border-dark-600 hover:border-dark-500 hover:bg-dark-700'
                    }`}
                  >
                    <Icon size={20} className={active ? 'text-dark-950' : 'text-dark-400'} />
                    <span className={`flex-1 text-left font-bold text-sm ${active ? 'text-dark-950' : 'text-dark-100'}`}>{pm.label}</span>
                    <div className={`w-5 h-5 rounded-full border-2 ${active ? 'border-dark-950 bg-dark-950 shadow-[inset_0_0_0_4px_#7E93FF]' : 'border-dark-600'}`}></div>
                  </button>
                )
              })}
            </div>
          </div>

        </motion.div>
      </motion.div>

      {/* CTA Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-900 via-dark-900/90 to-transparent z-30 pointer-events-none pb-[calc(1.5rem+64px)]">
        <button 
          onClick={handlePay}
          disabled={processing || success}
          className="w-full bg-accent-blue text-dark-950 font-bold py-4 rounded-2xl active:scale-[0.98] transition-all shadow-diffusion-dark pointer-events-auto flex items-center justify-center gap-2 disabled:opacity-80 disabled:scale-100"
        >
          {processing ? (
            <><Loader2 className="animate-spin" size={18} /> Processing...</>
          ) : (
            <>{payMethod === 'store' ? 'Confirm Booking' : `Pay ₹${total}`} <span className="font-mono text-[9px] font-bold tracking-widest uppercase bg-black/10 px-2 py-0.5 rounded ml-2">3/3</span></>
          )}
        </button>
      </div>

      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-dark-900 z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.svg 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-20 h-20 mb-8" 
              viewBox="0 0 52 52"
            >
              <circle cx="26" cy="26" r="24" fill="#7E93FF" stroke="#11100E" strokeWidth="2" />
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                d="M15 27l7.5 7.5L37.5 19" 
                fill="none" 
                stroke="#11100E" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </motion.svg>
            
            <motion.h2 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-sans font-bold text-3xl tracking-tight text-dark-50 mb-3"
            >
              Booking Confirmed
            </motion.h2>
            <motion.p 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-sm text-dark-300 font-medium leading-relaxed mb-10"
            >
              Your barber has been notified. See you at <strong className="text-dark-50">{date?.day}, {time}</strong>!
            </motion.p>

            <motion.div 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              className="bg-dark-800 shadow-diffusion-dark border border-dark-600 rounded-[1.5rem] p-6 w-full max-w-[300px] mb-10 text-left"
            >
              <div className="flex justify-between text-sm mb-3 border-b border-dark-700 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-dark-400 mt-0.5 font-bold">Ticket</span>
                <span className="font-mono font-bold text-dark-50">#STN829</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-mono text-[10px] uppercase tracking-widest text-dark-400 mt-0.5 font-bold">Barber</span>
                <span className="font-bold text-dark-50">{barber?.name}</span>
              </div>
            </motion.div>

            <motion.button 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
              onClick={resetHome}
              className="px-8 py-4 rounded-2xl border border-dark-600 bg-dark-800 text-sm font-bold text-dark-50 shadow-sm active:scale-[0.98] transition-transform"
            >
              Back to Home
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
