import { motion } from 'framer-motion';
import { MapPin, Star, ChevronRight } from 'lucide-react';
import {
  useStore, SALONS, barbersOf, getSalon, barberRating, salonRating,
  pastBookings, upcomingBookings, awaitingReview, openSlotCount, dayKey,
  type Booking,
} from '../lib/store';

export default function HomeScreen({
  nav, setSalonId, startBooking, onReview,
}: {
  nav: (s: string) => void;
  setSalonId: (id: string) => void;
  startBooking: (salonId: string, barberId: string, services?: string[]) => void;
  onReview: (b: Booking) => void;
}) {
  const store = useStore();
  const container: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item: any = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  const firstName = (store.customer.name || 'there').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  const area = store.customer.area || 'Indiranagar, Bangalore';
  const initial = (store.customer.name || 'G').trim()[0].toUpperCase();

  const pending = awaitingReview();
  const upcoming = upcomingBookings();
  const past = pastBookings();

  // "The usual" is the most recent completed visit, not a hardcoded card.
  const usual = past[0] || null;
  const daysSince = usual
    ? Math.round((Date.now() - new Date(usual.dateKey + 'T12:00:00').getTime()) / 86400000)
    : null;
  const nextFree = usual
    ? openSlotCount(usual.salonId, usual.barberId, dayKey()) > 0
      ? 'today'
      : 'tomorrow'
    : null;

  const featured = SALONS.slice(0, 4)
    .map((s) => ({ salon: s, barber: barbersOf(s.id)[0] }))
    .filter((x) => x.barber);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8 relative bg-editorial-900">

      <header className="px-6 pt-10 pb-8 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-block border border-editorial-600 rounded-full px-3 py-1 mb-4">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-editorial-200 font-semibold">Bespoke Grooming</p>
          </div>
          <h1 className="font-sans font-bold text-[2.5rem] leading-[1.1] tracking-tighter text-editorial-50 mb-1">
            {greeting}, <span className="font-serif italic font-normal text-editorial-200">{firstName}.</span>
          </h1>
          <button
            onClick={() => nav('profile')}
            aria-label="Change your area"
            className="flex items-center gap-1.5 text-xs text-editorial-400 font-medium mt-3 hover:text-editorial-200 transition-colors"
          >
            <MapPin size={12} className="text-editorial-500" />
            {area}
          </button>
        </div>
        <button
          onClick={() => nav('profile')}
          aria-label="Open your profile"
          className="w-10 h-10 shrink-0 rounded-full bg-brand-500 text-white shadow-glow font-bold text-sm flex items-center justify-center overflow-hidden active:scale-95 transition-all hover:bg-brand-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          {store.customer.photo
            ? <img src={store.customer.photo} alt="" className="w-full h-full object-cover" />
            : initial}
        </button>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="px-6 flex flex-col gap-6">

        {/* Rate a recent visit — only appears when there is one to rate */}
        {pending.length > 0 && (
          <motion.div variants={item} className="bg-editorial-800 border border-editorial-600 rounded-[1rem] p-5 shadow-bento">
            <div className="flex items-center gap-2 mb-4">
              <Star size={13} className="text-brand-400" fill="currentColor" />
              <h2 className="font-mono text-[10px] uppercase tracking-widest font-bold text-editorial-400">Rate your last visit</h2>
            </div>
            <div className="flex flex-col gap-2">
              {pending.map((b) => (
                <button
                  key={b.id}
                  onClick={() => onReview(b)}
                  aria-label={`Rate ${b.barberName} for ${b.serviceNames}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-editorial-600 bg-editorial-900 text-left hover:bg-editorial-700 active:scale-[0.98] transition-all"
                >
                  <span className="w-9 h-9 shrink-0 rounded border border-editorial-600 bg-editorial-800 flex items-center justify-center font-serif italic text-base text-editorial-200">
                    {b.barberName[0]}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-[13px] text-editorial-50 truncate">{b.barberName}</span>
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-editorial-400 truncate">{b.serviceNames}</span>
                  </span>
                  <span className="flex gap-0.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={12} className="text-editorial-600" />)}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next appointment */}
        {upcoming.length > 0 && (
          <motion.div variants={item} className="bg-brand-500 rounded-[1rem] p-6 shadow-glow text-white">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold text-white/70 mb-3">Next appointment</p>
            <h3 className="font-bold text-lg tracking-tight mb-1">{upcoming[0].serviceNames}</h3>
            <p className="text-xs text-white/80 mb-5">
              {upcoming[0].time} · {upcoming[0].barberName} · {upcoming[0].salonName}
            </p>
            <button
              onClick={() => nav('bookings')}
              className="w-full bg-white/15 hover:bg-white/25 border border-white/25 font-bold py-3 rounded-lg active:scale-[0.98] transition-all flex justify-between items-center px-5"
            >
              <span className="text-sm">View ticket</span>
              <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {/* Rebook the usual, from real history */}
        {usual ? (
          <motion.div variants={item} className="bg-editorial-800 border border-editorial-600 rounded-[1rem] p-6 shadow-bento">
            <div className="flex justify-between items-start mb-12">
              <div>
                <div className="border border-editorial-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-editorial-50 font-serif italic text-lg bg-editorial-900">
                  {usual.barberName[0]}
                </div>
                <h3 className="font-bold text-editorial-50 text-lg tracking-tight mb-1">{usual.serviceNames}</h3>
                <p className="text-xs text-editorial-400 font-medium">{usual.barberName} &bull; {usual.salonName}</p>
              </div>
              <div className="font-mono text-base font-bold text-editorial-100">₹{usual.totalPrice.toLocaleString('en-IN')}</div>
            </div>

            <div className="border-t border-editorial-700 pt-5 mb-6 flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0 animate-pulse" />
              <p className="text-xs text-editorial-300 leading-relaxed max-w-[240px]">
                Next free chair is <strong className="text-editorial-50 font-bold">{nextFree}</strong>.
                {daysSince !== null && ` It has been ${daysSince} day${daysSince === 1 ? '' : 's'} since your last visit.`}
              </p>
            </div>

            <button
              onClick={() => startBooking(usual.salonId, usual.barberId, usual.serviceIds)}
              aria-label={`Rebook ${usual.serviceNames} with ${usual.barberName}`}
              className="w-full bg-brand-500 text-white shadow-glow font-bold py-3.5 rounded-lg active:scale-[0.98] transition-all flex justify-between items-center px-5 hover:bg-brand-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <span>Rebook now</span>
              <span className="font-mono text-[9px] font-bold tracking-widest text-white/90 bg-white/20 px-2.5 py-1 rounded uppercase">2 Taps</span>
            </button>
          </motion.div>
        ) : (
          <motion.div variants={item} className="bg-editorial-800 border border-editorial-600 rounded-[1rem] p-6 shadow-bento text-center">
            <h3 className="font-serif italic text-xl text-editorial-100 mb-2">Your first cut.</h3>
            <p className="text-xs text-editorial-400 mb-5 max-w-[260px] mx-auto">
              Pick a studio and a stylist — we will keep your usual on file for one-tap rebooking after that.
            </p>
            <button
              onClick={() => nav('explore')}
              className="w-full bg-brand-500 text-white shadow-glow font-bold py-3.5 rounded-lg active:scale-[0.98] transition-all hover:bg-brand-400"
            >
              Browse studios
            </button>
          </motion.div>
        )}

        {/* Featured stylists */}
        <motion.div variants={item}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-mono text-[10px] tracking-widest uppercase font-bold text-editorial-400">Featured master stylists</h2>
            <button onClick={() => nav('explore')} className="font-mono text-[10px] tracking-widest uppercase font-bold text-brand-400 hover:text-brand-300 transition-colors">
              See all studios
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {featured.map(({ salon, barber }) => {
              const r = barberRating(barber.id);
              const free = openSlotCount(salon.id, barber.id, dayKey());
              return (
                <button
                  key={salon.id}
                  onClick={() => { setSalonId(salon.id); nav('salon'); }}
                  aria-label={`View ${salon.name} and stylist ${barber.name}`}
                  className="bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] p-4 text-left hover:bg-editorial-700 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                >
                  <div className="border border-editorial-600 w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-editorial-100 font-serif italic bg-editorial-900">
                    {barber.name[0]}
                  </div>
                  <h3 className="font-bold text-sm text-editorial-50 tracking-tight truncate">{barber.name.split(' ')[0]}</h3>
                  <p className="text-[10px] text-editorial-400 font-medium mb-3 truncate">{barber.spec}</p>
                  <div className="flex items-center justify-between border-t border-editorial-700 pt-2.5">
                    <span className="font-mono text-[11px] font-bold text-editorial-200">{r.average.toFixed(1)} ★</span>
                    <span className={`font-mono text-[8px] uppercase tracking-wider font-bold ${free > 0 ? 'text-brand-400' : 'text-editorial-500'}`}>
                      {free > 0 ? `${free} free` : 'Busy'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Top-rated studios near you */}
        <motion.div variants={item}>
          <h2 className="font-mono text-[10px] tracking-widest uppercase font-bold text-editorial-400 mb-4">Top rated near you</h2>
          <div className="flex flex-col gap-2.5">
            {[...SALONS].sort((a, b) => salonRating(b.id).average - salonRating(a.id).average).slice(0, 3).map((s) => {
              const r = salonRating(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => { setSalonId(s.id); nav('salon'); }}
                  className="flex items-center gap-3 p-3 bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] text-left hover:bg-editorial-700 active:scale-[0.98] transition-all"
                >
                  <img src={getSalon(s.id)!.image} alt="" className="w-12 h-12 rounded object-cover grayscale mix-blend-luminosity opacity-85 shrink-0" />
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-sm text-editorial-50 truncate">{s.name}</span>
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-editorial-400 truncate">{s.area} · {s.dist}</span>
                  </span>
                  <span className="font-mono text-[11px] font-bold text-brand-400 shrink-0">{r.average.toFixed(1)} ★</span>
                </button>
              );
            })}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
