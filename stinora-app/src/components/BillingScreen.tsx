import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Smartphone, CreditCard, Store, Loader2, CheckCircle2, Calendar } from 'lucide-react';
import {
  SERVICES, priceFor, getService, addBooking, ticketId as newTicket, buildSlots,
  dateFromKey, getState, type Salon, type Barber,
} from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function BillingScreen({
  back, resetHome, nav, salon, barber, dateKey, time, services,
}: {
  back: () => void; resetHome: () => void; nav: (s: string) => void;
  salon: Salon; barber: Barber | null; dateKey: string; time: string | null; services: string[];
}) {
  const [payMethod, setPayMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const [error, setError] = useState('');

  const chosen = services.map((id) => getService(id)).filter(Boolean) as typeof SERVICES;
  const sNames = chosen.map((c) => c.name).join(', ') || 'Custom Grooming';
  // Prices are the stylist's, matching what the schedule screen quoted.
  const subtotal = chosen.reduce((acc, svc) => acc + priceFor(svc, barber), 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const dateObj = dateFromKey(dateKey);
  const dateLabel = dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });

  const handlePay = () => {
    if (!barber || !time) return;

    // Re-check the slot at the moment of payment. Between choosing a time and
    // paying, the same chair can be taken in another tab or on another visit.
    const slot = buildSlots(salon.id, barber.id, dateKey).find((s) => s.time === time);
    if (!slot || slot.status !== 'available') {
      setError('That chair was taken while you were checking out. Pick another time.');
      return;
    }

    setError('');
    setProcessing(true);
    timerRef.current = setTimeout(() => {
      const generatedTicket = newTicket();
      const customer = getState().customer;
      addBooking({
        id: generatedTicket,
        salonId: salon.id,
        salonName: salon.name,
        barberId: barber.id,
        barberName: barber.name,
        barberSpec: barber.spec,
        dateKey,
        time,
        serviceIds: chosen.map((c) => c.id),
        serviceNames: sNames,
        subtotal,
        tax,
        totalPrice: total,
        paymentMethod: payMethod,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        customerName: customer.name || 'Guest',
        customerPhone: customer.phone,
        isMine: true,
      });
      setTicketId(generatedTicket);
      setProcessing(false);
      setSuccess(true);
    }, 1400);
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
          aria-label="Back to schedule screen"
          className="w-10 h-10 rounded border border-editorial-600 flex items-center justify-center text-editorial-200 hover:bg-editorial-800 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-serif italic text-xl tracking-tight text-editorial-50">Checkout & Pay</h2>
          <p className="text-[10px] font-mono tracking-widest uppercase text-editorial-400">Step 3 of 3 &bull; Final Confirmation</p>
        </div>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar pb-36">
        
        <motion.div variants={item} className="p-6">
          <div className="bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] p-6 mb-8">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-editorial-700">
              <h3 className="font-sans font-bold text-lg text-editorial-50 tracking-tight">Booking Summary</h3>
              <span className="font-mono text-[9px] uppercase tracking-wider text-brand-300 font-bold bg-brand-950/60 border border-brand-800/60 px-2 py-0.5 rounded">
                Verified Studio
              </span>
            </div>
            
            <div className="flex justify-between items-start text-sm mb-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 w-20 pt-0.5 font-bold">Studio</span>
              <span className="font-bold text-editorial-100 text-right">{salon.name}</span>
            </div>
            <div className="flex justify-between items-start text-sm mb-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 w-20 pt-0.5 font-bold">Stylist</span>
              <span className="font-bold text-editorial-100 text-right">{barber?.name}</span>
            </div>
            <div className="flex justify-between items-start text-sm mb-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 w-20 pt-0.5 font-bold">Slot</span>
              <span className="font-bold text-editorial-100 text-right">{dateLabel}, {time}</span>
            </div>
            <div className="flex justify-between items-start text-sm">
              <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 w-20 pt-0.5 font-bold">Services</span>
              <span className="font-bold text-editorial-100 text-right max-w-[200px] leading-relaxed">{sNames}</span>
            </div>
          </div>

          <div className="mb-8 px-2">
            <div className="flex justify-between text-xs font-mono tracking-widest uppercase text-editorial-300 mb-4">
              <span>Service Cost</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-xs font-mono tracking-widest uppercase text-editorial-300 mb-5">
              <span>Taxes (GST 5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between items-center pt-5 border-t border-editorial-600">
              <span className="font-sans font-bold text-editorial-50 text-base">Total Payable</span>
              <span className="font-serif italic text-3xl text-editorial-50">₹{total}</span>
            </div>
          </div>

          <div>
            <h2 className="font-sans font-bold text-[1.15rem] tracking-tight text-editorial-50 mb-3">Payment Method</h2>
            <div className="flex flex-col gap-3">
              {[
                { id: 'upi', label: 'Instant UPI (GPay, PhonePe, Paytm)', icon: Smartphone },
                { id: 'card', label: 'Credit or Debit Card', icon: CreditCard },
                { id: 'store', label: 'Pay at Store (Cash / Card after service)', icon: Store }
              ].map(pm => {
                const active = payMethod === pm.id;
                const Icon = pm.icon;
                return (
                  <button
                    key={pm.id}
                    onClick={() => setPayMethod(pm.id)}
                    aria-label={`Select ${pm.label}`}
                    aria-selected={active}
                    className={`flex items-center gap-4 p-4 rounded-[1rem] border transition-all active:scale-[0.98] shadow-bento focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                      active
                        ? 'bg-brand-500 border-brand-500 shadow-glow'
                        : 'bg-editorial-800 border-editorial-600 hover:bg-editorial-700'
                    }`}
                  >
                    <Icon size={20} className={active ? 'text-white' : 'text-editorial-400'} />
                    <span className={`flex-1 text-left font-bold text-sm tracking-tight ${active ? 'text-white' : 'text-editorial-100'}`}>{pm.label}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? 'border-white bg-white' : 'border-editorial-500'}`}>
                      {active && <div className="w-2 h-2 rounded-full bg-brand-500"></div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 px-2 text-center">
            <p className="text-[10px] text-editorial-400 leading-normal">
              🔒 256-Bit Encrypted &bull; 100% Refund guaranteed on cancellations 2h before the slot.
            </p>
          </div>

        </motion.div>
      </motion.div>

      {/* CTA Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-editorial-900 via-editorial-900/95 to-transparent z-30 pointer-events-none pb-[calc(1.5rem+64px)]">
        {error && (
          <p role="alert" className="pointer-events-auto mb-3 text-[11px] font-bold text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
            {error}{' '}
            <button onClick={back} className="underline font-bold">Choose another slot</button>
          </p>
        )}
        <button 
          onClick={handlePay}
          disabled={processing || success}
          aria-label={payMethod === 'store' ? 'Confirm booking' : `Pay ₹${total}`}
          className="w-full bg-brand-500 text-white shadow-glow font-bold py-4 rounded-lg active:scale-[0.98] transition-all pointer-events-auto flex items-center justify-center gap-2 disabled:opacity-80 disabled:scale-100 hover:bg-brand-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer"
        >
          {processing ? (
            <><Loader2 className="animate-spin" size={18} /> Processing Reservation...</>
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
            role="dialog"
            aria-modal="true"
            aria-label="Booking Confirmation"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-20 h-20 mb-6 border border-brand-500/50 rounded-full flex items-center justify-center bg-brand-950/40 text-brand-400 shadow-glow" 
            >
              <CheckCircle2 size={40} className="text-brand-400" />
            </motion.div>
            
            <motion.h2 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="font-serif italic text-4xl text-editorial-50 mb-2"
            >
              Confirmed.
            </motion.h2>
            <motion.p 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-sm text-editorial-300 font-medium leading-relaxed mb-8 max-w-[280px]"
            >
              Your stylist has reserved your chair at <strong className="text-editorial-100">{dateLabel}, {time}</strong>.
            </motion.p>

            <motion.div 
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              className="bg-editorial-800 border border-editorial-600 rounded-[1rem] p-6 w-full max-w-[320px] mb-8 text-left shadow-bento"
            >
              <div className="flex justify-between text-sm mb-3 border-b border-editorial-700 pb-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 font-bold">Ticket ID</span>
                <span className="font-mono font-bold text-brand-400">#{ticketId || 'STN-8291'}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 font-bold">Studio</span>
                <span className="font-bold text-editorial-100 tracking-tight">{salon.name}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 font-bold">Stylist</span>
                <span className="font-bold text-editorial-100 tracking-tight">{barber?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 font-bold">Total Paid</span>
                <span className="font-mono font-bold text-editorial-100">₹{total}</span>
              </div>
            </motion.div>

            <div className="flex flex-col gap-3 w-full max-w-[320px]">
              <motion.button 
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                onClick={() => nav('bookings')}
                aria-label="View My Bookings"
                className="w-full py-4 rounded-lg bg-brand-500 text-white shadow-glow text-sm font-bold active:scale-[0.98] transition-all hover:bg-brand-400 flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                View in My Bookings
              </motion.button>
              
              <motion.button 
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
                onClick={resetHome}
                aria-label="Return Home"
                className="w-full py-3.5 rounded-lg border border-editorial-600 bg-transparent text-sm font-bold text-editorial-300 hover:text-editorial-100 hover:bg-editorial-800 active:scale-[0.98] transition-all"
              >
                Return Home
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
