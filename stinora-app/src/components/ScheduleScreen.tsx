import { ArrowLeft, Sun, Sunset, Moon } from 'lucide-react';
import { MOCK_DATA } from '../App';
import { motion } from 'framer-motion';

export default function ScheduleScreen({ 
  nav, back, barber, 
  selectedDate, setSelectedDate,
  selectedTime, setSelectedTime,
  selectedServices, setSelectedServices 
}: any) {

  const toggleService = (srvId: string) => {
    if (selectedServices.includes(srvId)) {
      setSelectedServices(selectedServices.filter((s: string) => s !== srvId));
    } else {
      setSelectedServices([...selectedServices, srvId]);
    }
  };

  const isReady = selectedTime && selectedServices.length > 0;

  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (!barber) return null;

  // Segment slots for cognitive ease
  const timeGroups = [
    {
      id: 'morning',
      label: 'Morning',
      icon: Sun,
      slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM']
    },
    {
      id: 'afternoon',
      label: 'Afternoon',
      icon: Sunset,
      slots: ['12:00 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:30 PM']
    },
    {
      id: 'evening',
      label: 'Evening',
      icon: Moon,
      slots: ['04:00 PM', '05:30 PM', '06:00 PM']
    }
  ];

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
          {barber.rating} ★
        </span>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* Date Rail */}
        <motion.div variants={item} className="mt-8 mb-8">
          <div className="px-6 mb-4 flex justify-between items-center">
            <h2 className="font-sans font-bold text-[1.15rem] tracking-tight text-editorial-50">Select Date</h2>
            <span className="font-mono text-[10px] uppercase tracking-wider text-editorial-400 font-semibold">September 2026</span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-6 pb-2 -mx-6 snap-x snap-mandatory">
            {MOCK_DATA.dates.map((d) => {
              const active = selectedDate === d.id;
              return (
                <button 
                  key={d.id}
                  onClick={() => { setSelectedDate(d.id); setSelectedTime(null); }}
                  aria-label={`${d.day}, September ${d.num}`}
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
          
          <div className="flex flex-col gap-6">
            {timeGroups.map(group => {
              const Icon = group.icon;
              return (
                <div key={group.id} className="bg-editorial-800/60 border border-editorial-700/80 rounded-[1rem] p-4">
                  <div className="flex items-center gap-2 mb-3 px-1 text-editorial-300 font-medium">
                    <Icon size={14} className="text-brand-400" />
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">{group.label}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2.5">
                    {group.slots.map(t => {
                      const isBooked = (t.length + selectedDate.length + (MOCK_DATA.bookedSlots.indexOf(t) * 3)) % 5 === 0;
                      const booked = MOCK_DATA.bookedSlots.includes(t) || isBooked; 
                      const selected = selectedTime === t;
                      return (
                        <button
                          key={t}
                          disabled={booked}
                          onClick={() => setSelectedTime(t)}
                          aria-label={`Time slot ${t} ${booked ? 'booked' : 'available'}`}
                          className={`py-3 rounded-lg font-mono text-[11px] uppercase tracking-widest font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                            booked 
                              ? 'opacity-30 bg-editorial-950 border border-editorial-700/50 line-through cursor-not-allowed text-editorial-600'
                              : selected 
                                ? 'bg-brand-500 border border-brand-500 text-white shadow-glow'
                                : 'bg-editorial-800 border border-editorial-600 text-editorial-200 active:scale-95 shadow-bento hover:bg-editorial-700'
                          }`}
                        >
                          {t}
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
            {MOCK_DATA.services.map(srv => {
              const selected = selectedServices.includes(srv.id);
              return (
                <button 
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
                  aria-label={`Service ${srv.name} for ₹${srv.price}`}
                  aria-selected={selected}
                  className={`flex justify-between items-center p-4 rounded-[1rem] border transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                    selected
                      ? 'bg-brand-500 border-brand-500 shadow-glow text-white'
                      : 'bg-editorial-800 border-editorial-600 shadow-bento hover:bg-editorial-700'
                  }`}
                >
                  <div className="text-left">
                    <span className={`block font-bold text-sm tracking-tight ${selected ? 'text-white' : 'text-editorial-50'}`}>{srv.name}</span>
                    <span className={`text-[10px] font-mono tracking-wider uppercase ${selected ? 'text-white/80' : 'text-editorial-400'}`}>30-45 mins</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs tracking-widest font-bold ${selected ? 'text-white' : 'text-editorial-200'}`}>₹{srv.price}</span>
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
