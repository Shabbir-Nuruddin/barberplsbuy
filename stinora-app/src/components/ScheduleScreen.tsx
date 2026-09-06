import { ArrowLeft, Sun, Sunset, Moon } from 'lucide-react';
import {
  upcomingDays, buildSlots, SERVICES, priceFor, type Salon, type Barber, type Slot,
} from '../lib/store';
import { motion } from 'framer-motion';

export default function ScheduleScreen({
  nav, back, salon, barber,
  selectedDate, setSelectedDate,
  selectedTime, setSelectedTime,
  selectedServices, setSelectedServices,
}: {
  nav: (s: string) => void; back: () => void; salon: Salon; barber: Barber | null;
  selectedDate: string; setSelectedDate: (k: string) => void;
  selectedTime: string | null; setSelectedTime: (t: string | null) => void;
  selectedServices: string[]; setSelectedServices: (s: string[]) => void;
}) {

  const toggleService = (srvId: string) => {
    if (selectedServices.includes(srvId)) {
      setSelectedServices(selectedServices.filter((s) => s !== srvId));
    } else {
      setSelectedServices([...selectedServices, srvId]);
    }
  };

  const days = upcomingDays(7);
  if (!barber) return null;

  const isReady = selectedTime && selectedServices.length > 0;

  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // Availability comes from the salon's trading hours minus the bookings that
  // exist for this stylist on this date. The old build derived it from a hash of
  // string lengths, so it showed the same "booked" slots for every stylist on
  // every day and confirming a booking reserved nothing.
  const slots = buildSlots(salon.id, barber.id, selectedDate);
  const timeGroups: Array<{ id: string; label: string; icon: any; slots: Slot[] }> = [
    { id: 'morning', label: 'Morning', icon: Sun, slots: slots.filter((s) => s.period === 'morning') },
    { id: 'afternoon', label: 'Afternoon', icon: Sunset, slots: slots.filter((s) => s.period === 'afternoon') },
    { id: 'evening', label: 'Evening', icon: Moon, slots: slots.filter((s) => s.period === 'evening') },
  ].filter((g) => g.slots.length > 0);

  const allGone = slots.every((s) => s.status !== 'available');

  return (
    <div className="flex-1 flex flex-col bg-editorial-900 overflow-hidden relative">
      
      <header className="px-6 py-6 flex items-center gap-4 bg-editorial-900 shrink-0 z-10 border-b border-editorial-600/50">
        <button 
          onClick={back}
          aria-label="Back to previous screen"
          className="w-10 h-10 rounded border border-editorial-600 flex items-center justify-center text-editorial-200 hover:bg-editorial-800 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-serif italic text-xl tracking-tight text-editorial-50">Choose Timeslot</h2>
          <p className="text-[10px] font-mono tracking-widest uppercase text-editorial-400">Step 2 of 3 &bull; Scheduling</p>
        </div>
      </header>

      {/* Mini Profile */}
      <div className="px-6 py-5 flex items-center gap-5 bg-editorial-800 shrink-0 border-b border-editorial-600">
        <div className="w-12 h-12 rounded border border-editorial-600 flex items-center justify-center bg-editorial-900 text-editorial-200 font-serif italic text-xl">
          {barber.name[0]}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-editorial-50 tracking-tight">{barber.name}</h3>
          <p className="text-[10px] font-mono tracking-widest uppercase text-editorial-400">{barber.spec}</p>
        </div>
        <span className="text-[10px] font-mono font-bold text-editorial-200 bg-editorial-900 px-2.5 py-1 rounded border border-editorial-700">
          {barber.baseRating} ★
        </span>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* Date Rail */}
        <motion.div variants={item} className="mt-8 mb-8">
          <div className="px-6 mb-4 flex justify-between items-center">
            <h2 className="font-sans font-bold text-[1.15rem] tracking-tight text-editorial-50">Select Date</h2>
            <span className="font-mono text-[10px] uppercase tracking-wider text-editorial-400 font-semibold">{days[0].monthLabel}</span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-6 pb-2 -mx-6 snap-x snap-mandatory">
            {days.map((d) => {
              const active = selectedDate === d.key;
              return (
                <button 
                  key={d.key}
                  onClick={() => { setSelectedDate(d.key); setSelectedTime(null); }}
                  aria-label={`${d.day}, ${d.num} ${d.monthLabel}`}
                  aria-selected={active}
                  className={`snap-start flex-none w-[72px] h-[86px] rounded-lg flex flex-col items-center justify-center gap-1 border transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                    active 
                      ? 'bg-brand-500 border-brand-500 text-white shadow-glow' 
                      : 'bg-editorial-800 border-editorial-600 text-editorial-300 shadow-bento hover:bg-editorial-700'
                  }`}
                >
                  <span className={`font-mono text-[10px] uppercase tracking-widest font-bold ${active ? 'opacity-80' : ''}`}>{d.day}</span>
                  <span className={`font-serif italic text-2xl ${active ? '' : 'text-editorial-100'}`}>{d.num}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Time Slots (Segmented by period) */}
        <motion.div variants={item} className="px-6 mb-10">
          <div className="mb-4">
            <h2 className="font-sans font-bold text-[1.15rem] tracking-tight text-editorial-50">Select Time</h2>
            <p className="text-xs text-editorial-400">Times in IST (Bangalore)</p>
          </div>
          
          {allGone && (
            <div className="mb-4 rounded-[1rem] border border-editorial-700 bg-editorial-800/60 p-5 text-center">
              <p className="text-xs text-editorial-400">
                {barber.name.split(' ')[0]} has no chairs left on this day. Try another date.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {timeGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.id} className="bg-editorial-800/60 border border-editorial-700/80 rounded-[1rem] p-4">
                  <div className="flex items-center gap-2 mb-3 px-1 text-editorial-300 font-medium">
                    <Icon size={14} className="text-brand-400" />
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">{group.label}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2.5">
                    {group.slots.map((slot) => {
                      const unavailable = slot.status !== 'available';
                      const selected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          disabled={unavailable}
                          onClick={() => setSelectedTime(slot.time)}
                          aria-label={`${slot.time} ${slot.status === 'booked' ? 'already booked' : slot.status === 'past' ? 'no longer available' : 'available'}`}
                          className={`py-3 rounded-lg font-mono text-[11px] uppercase tracking-widest font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                            unavailable
                              ? 'opacity-30 bg-editorial-950 border border-editorial-700/50 line-through cursor-not-allowed text-editorial-600'
                              : selected
                                ? 'bg-brand-500 border border-brand-500 text-white shadow-glow'
                                : 'bg-editorial-800 border border-editorial-600 text-editorial-200 active:scale-95 shadow-bento hover:bg-editorial-700'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Services Selection */}
        <motion.div variants={item} className="px-6 mb-8">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="font-sans font-bold text-[1.15rem] tracking-tight text-editorial-50">Select Services</h2>
            <span className="text-xs text-editorial-400 font-mono">{selectedServices.length} selected</span>
          </div>
          <div className="flex flex-col gap-3">
            {SERVICES.map((srv) => {
              const selected = selectedServices.includes(srv.id);
              const price = priceFor(srv, barber);
              return (
                <button 
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
                  aria-label={`Service ${srv.name} for ₹${price}`}
                  aria-selected={selected}
                  className={`flex justify-between items-center p-4 rounded-[1rem] border transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                    selected
                      ? 'bg-brand-500 border-brand-500 shadow-glow text-white'
                      : 'bg-editorial-800 border-editorial-600 shadow-bento hover:bg-editorial-700'
                  }`}
                >
                  <div className="text-left">
                    <span className={`block font-bold text-sm tracking-tight ${selected ? 'text-white' : 'text-editorial-50'}`}>{srv.name}</span>
                    <span className={`text-[10px] font-mono tracking-wider uppercase ${selected ? 'text-white/80' : 'text-editorial-400'}`}>{srv.minutes} mins</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs tracking-widest font-bold ${selected ? 'text-white' : 'text-editorial-200'}`}>₹{price}</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selected ? 'bg-white border-white' : 'border-editorial-500'}`}>
                      {selected && <div className="w-2 h-2 rounded bg-brand-500"></div>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

      </motion.div>

      {/* CTA Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-editorial-900 via-editorial-900/95 to-transparent z-30 pointer-events-none pb-[calc(1.5rem+64px)]">
        <button 
          onClick={() => nav('billing')}
          disabled={!isReady}
          aria-label={isReady ? "Proceed to Checkout" : "Complete required selections to continue"}
          className={`w-full font-bold py-4 rounded-lg transition-all pointer-events-auto flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
            isReady 
              ? 'bg-brand-500 text-white shadow-glow active:scale-[0.98] hover:bg-brand-400 cursor-pointer' 
              : 'bg-editorial-800 text-editorial-500 cursor-not-allowed border border-editorial-700'
          }`}
        >
          {!selectedTime 
            ? 'Select a Time Slot' 
            : selectedServices.length === 0 
              ? 'Select at least 1 Service' 
              : 'Proceed to Checkout'}
          <span className={`font-mono text-[9px] font-bold tracking-widest px-2 py-0.5 rounded ml-2 uppercase ${isReady ? 'bg-white/20 text-white' : 'bg-editorial-700 text-editorial-500'}`}>
            2/3
          </span>
        </button>
      </div>

    </div>
  );
}
