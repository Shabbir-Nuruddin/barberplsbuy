import { motion } from 'framer-motion';
import { Calendar, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import {
  useStore, upcomingBookings, pastBookings, cancelBooking, dateFromKey,
  type Booking,
} from '../lib/store';

export default function BookingsScreen({
  nav, onReview,
}: {
  nav: (s: string) => void;
  onReview: (b: Booking) => void;
}) {
  const store = useStore();
  const container: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item: any = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  const upcoming = upcomingBookings();
  // The archive used to be three hardcoded rows that never changed. It is now the
  // real list of visits that have actually happened.
  const past = pastBookings();
  const rated = new Set(store.reviews.map((r) => r.bookingId));

  const dateLabel = (b: Booking) =>
    dateFromKey(b.dateKey).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

  return (
    <div className="flex-1 flex flex-col bg-editorial-900 overflow-hidden relative">

      <header className="px-6 pt-10 pb-6 shrink-0 z-10 border-b border-editorial-600/50 bg-editorial-900 flex justify-between items-end">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-editorial-400 font-bold mb-1">Reservation Archive</p>
          <h1 className="font-sans font-bold text-3xl tracking-tighter text-editorial-50">
            Your <span className="font-serif italic font-normal text-editorial-200">Appointments.</span>
          </h1>
        </div>
        <span className="font-mono text-xs font-bold text-brand-400 bg-brand-500/10 border border-brand-500/30 px-2.5 py-1 rounded-full shrink-0">
          {upcoming.length} Active
        </span>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-8 pb-28">

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-[10px] tracking-widest uppercase font-bold text-editorial-400">Upcoming reservations</h2>
          </div>

          {upcoming.length === 0 ? (
            <div className="bg-editorial-800/60 border border-editorial-700 rounded-[1rem] p-8 text-center">
              <Calendar size={32} className="mx-auto text-editorial-500 mb-3" />
              <h3 className="font-sans font-bold text-base text-editorial-200 mb-1">No active reservations</h3>
              <p className="text-xs text-editorial-400 max-w-[240px] mx-auto mb-6">You don't have any upcoming appointments scheduled right now.</p>
              <button
                onClick={() => nav('explore')}
                className="bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold py-3 px-6 rounded-lg transition-all shadow-glow active:scale-95 inline-flex items-center gap-2"
              >
                Find a studio <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {upcoming.map((b) => (
                <motion.div key={b.id} variants={item} className="bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] p-6 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-[4rem] pointer-events-none" />

                  <div className="flex justify-between items-start mb-4 border-b border-editorial-700/80 pb-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-400 font-bold">Ticket #{b.id}</span>
                      </div>
                      <h3 className="font-bold text-base text-editorial-50 mb-0.5 truncate">{b.barberName} &bull; {b.salonName}</h3>
                      <p className="text-[11px] text-editorial-300 font-medium">{b.serviceNames}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="block font-serif italic text-xl text-editorial-100">{dateLabel(b)}</span>
                      <span className="font-mono text-[11px] text-brand-400 font-bold">{b.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-xs font-bold text-editorial-200">
                      {b.paymentMethod === 'store' ? 'Pay at store' : 'Paid'} ₹{b.totalPrice.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Cancel your appointment for ${b.serviceNames} at ${b.time}?`)) cancelBooking(b.id);
                      }}
                      aria-label={`Cancel appointment ${b.id}`}
                      className="border border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-[11px] font-bold py-2 px-4 rounded transition-colors"
                    >
                      Cancel slot
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-mono text-[10px] tracking-widest uppercase font-bold text-editorial-400 mb-4">
            Past sessions {past.length > 0 && <span className="text-editorial-500">· {past.length}</span>}
          </h2>

          {past.length === 0 ? (
            <div className="py-8 text-center bg-editorial-800/40 border border-editorial-700 rounded-[1rem]">
              <p className="text-xs text-editorial-400">Your completed visits will collect here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {past.slice(0, 40).map((b) => (
                <motion.div key={b.id} variants={item} className="p-4 bg-editorial-800/80 border border-editorial-700/80 rounded-[1rem] shadow-bento">
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 shrink-0 rounded border border-editorial-600 bg-editorial-900 flex items-center justify-center text-editorial-400">
                        <CheckCircle2 size={14} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-xs text-editorial-100 mb-0.5 truncate">{b.serviceNames}</h3>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-editorial-400 truncate">
                          {dateLabel(b)} &bull; {b.barberName} ({b.salonName})
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-[11px] font-bold text-editorial-300 block">₹{b.totalPrice.toLocaleString('en-IN')}</span>
                      <span className="text-[9px] uppercase font-mono text-emerald-500 font-semibold">Completed</span>
                    </div>
                  </div>

                  {!rated.has(b.id) && (
                    <button
                      onClick={() => onReview(b)}
                      className="mt-3 w-full flex items-center justify-center gap-2 border border-editorial-600 bg-editorial-900 hover:bg-editorial-700 text-editorial-200 text-[11px] font-bold py-2.5 rounded-lg transition-colors active:scale-[0.98]"
                    >
                      <Star size={12} className="text-brand-400" />
                      Rate {b.barberName.split(' ')[0]}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}
