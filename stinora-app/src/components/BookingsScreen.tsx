import { motion } from 'framer-motion';
import { Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { BookingRecord } from '../App';

export default function BookingsScreen({ 
  bookings = [], 
  onCancelBooking, 
  nav 
}: { 
  bookings?: BookingRecord[], 
  onCancelBooking?: (id: string) => void, 
  nav?: any 
}) {
  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const pastBookings = [
    { id: 'pst-1', date: '19 Aug', service: 'Skin Fade + Beard Sculpt', barber: 'Rohan Mehra', salon: 'Lakme Salon', price: '₹1,050', status: 'completed' },
    { id: 'pst-2', date: '02 Aug', service: 'Classic Haircut', barber: 'Vikram Singh', salon: 'Toni & Guy', price: '₹400', status: 'completed' },
    { id: 'pst-3', date: '15 Jul', service: 'Scalp Detox Spa', barber: 'Imran Ali', salon: 'Bellance Salon', price: '₹1,200', status: 'completed' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-editorial-900 overflow-hidden relative">
      
      <header className="px-6 pt-10 pb-6 shrink-0 z-10 border-b border-editorial-600/50 bg-editorial-900 flex justify-between items-end">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-editorial-400 font-bold mb-1">Reservation Archive</p>
          <h1 className="font-sans font-bold text-3xl tracking-tighter text-editorial-50">
            Your <span className="font-serif italic font-normal text-editorial-200">Appointments.</span>
          </h1>
        </div>
        <span className="font-mono text-xs font-bold text-brand-400 bg-brand-950/60 border border-brand-800/60 px-2.5 py-1 rounded-full">
          {upcomingBookings.length} Active
        </span>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-8 pb-28">
        
        {/* UPCOMING RESERVATIONS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-[10px] tracking-widest uppercase font-bold text-editorial-400">Upcoming Reservations</h2>
            <span className="text-[10px] text-editorial-500 font-mono">Live Synced</span>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="bg-editorial-800/60 border border-editorial-700 rounded-[1rem] p-8 text-center">
              <Calendar size={32} className="mx-auto text-editorial-500 mb-3" />
              <h3 className="font-sans font-bold text-base text-editorial-200 mb-1">No Active Reservations</h3>
              <p className="text-xs text-editorial-400 max-w-[240px] mx-auto mb-6">You don't have any upcoming appointments scheduled right now.</p>
              <button 
                onClick={() => nav && nav('explore')}
                className="bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold py-3 px-6 rounded-lg transition-all shadow-glow active:scale-95 inline-flex items-center gap-2"
              >
                Find a Salon <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {upcomingBookings.map((b) => (
                <motion.div key={b.id} variants={item} className="bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] p-6 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-[4rem] pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-4 border-b border-editorial-700/80 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-300 font-bold">Ticket #{b.id}</span>
                      </div>
                      <h3 className="font-bold text-base text-editorial-50 mb-0.5">{b.barberName} &bull; {b.salonName}</h3>
                      <p className="text-[11px] text-editorial-300 font-medium">{b.serviceNames}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block font-serif italic text-xl text-editorial-100">{b.dateNum}</span>
                      <span className="font-mono text-[11px] text-brand-300 font-bold">{b.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-xs font-bold text-editorial-200">Paid ₹{b.totalPrice}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          if (confirm(`Cancel your appointment for ${b.serviceNames} at ${b.time}?`)) {
                            onCancelBooking && onCancelBooking(b.id);
                          }
                        }}
                        aria-label={`Cancel appointment ${b.id}`}
                        className="border border-red-900/60 bg-red-950/30 text-red-400 hover:bg-red-900/40 text-[11px] font-bold py-2 px-4 rounded transition-colors"
                      >
                        Cancel Slot
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* PAST ARCHIVE */}
        <div>
          <h2 className="font-mono text-[10px] tracking-widest uppercase font-bold text-editorial-400 mb-4">Past Sessions</h2>
          <div className="flex flex-col gap-3">
            {pastBookings.map((b) => (
              <motion.div key={b.id} variants={item} className="flex justify-between items-center p-4 bg-editorial-800/80 border border-editorial-700/80 rounded-[1rem] shadow-bento">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded border border-editorial-600 bg-editorial-900 flex items-center justify-center text-editorial-400">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-editorial-100 mb-0.5">{b.service}</h3>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-editorial-400">{b.date} &bull; {b.barber} ({b.salon})</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[11px] font-bold text-editorial-300 block">{b.price}</span>
                  <span className="text-[9px] uppercase font-mono text-emerald-400/80 font-semibold">Completed</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
