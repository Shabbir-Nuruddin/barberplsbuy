import { ArrowLeft } from 'lucide-react';
import { MOCK_DATA, getAvatar } from '../App';
import { motion } from 'framer-motion';

export default function ScheduleScreen({ 
  nav, back, barber, 
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

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden relative">
      
      <header className="px-6 py-5 flex items-center gap-4 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shrink-0 z-10">
        <button 
          onClick={back}
          className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-100 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-sans font-semibold text-lg tracking-tight text-white">Schedule</h2>
      </header>

      {/* Mini Profile */}
      <div className="px-6 py-4 flex items-center gap-4 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <img 
          src={getAvatar(barber.name.toLowerCase().replace(' ', '-'), barber.name[0], 80)} 
          alt={barber.name} 
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-sm text-white">{barber.name}</h3>
          <p className="text-xs text-brand-500">{barber.spec}</p>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar pb-28">
        
        {/* Date Rail */}
        <motion.div variants={item} className="mt-6 mb-8">
          <div className="px-6 mb-3">
            <h2 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">Pick a Date</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-6 pb-2 -mx-6">
            {MOCK_DATA.dates.map((d, i) => {
              const active = i === 0;
              return (
                <button 
                  key={i}
                  className={`flex-none w-[72px] h-[80px] rounded-[1.25rem] flex flex-col items-center justify-center gap-1 border transition-all ${
                    active 
                      ? 'bg-brand-500 border-brand-500 text-brand-950 shadow-[0_4px_12px_rgba(212,175,55,0.2)]' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 active:scale-95'
                  }`}
                >
                  <span className={`font-mono text-xs uppercase tracking-widest ${active ? 'opacity-80' : ''}`}>{d.day}</span>
                  <span className={`font-sans font-bold text-xl ${active ? '' : 'text-zinc-100'}`}>{d.num}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Time Slots */}
        <motion.div variants={item} className="px-6 mb-8">
          <div className="mb-3">
            <h2 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">Select Time Slot</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {MOCK_DATA.slots.map(t => {
              const booked = MOCK_DATA.bookedSlots.includes(t);
              const selected = selectedTime === t;
              return (
                <button
                  key={t}
                  disabled={booked}
                  onClick={() => setSelectedTime(t)}
                  className={`py-3 rounded-xl font-mono text-sm font-medium transition-all ${
                    booked 
                      ? 'opacity-40 bg-zinc-900 border border-zinc-800 line-through cursor-not-allowed'
                      : selected 
                        ? 'bg-brand-500/20 border border-brand-500/50 text-brand-500'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-200 active:scale-95'
                  }`}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Services */}
        <motion.div variants={item} className="px-6">
          <div className="mb-3">
            <h2 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">Select Services</h2>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_DATA.services.map(srv => {
              const selected = selectedServices.includes(srv.id);
              return (
                <button 
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
                  className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${
                    selected
                      ? 'bg-brand-500/10 border-brand-500/40'
                      : 'bg-zinc-900 border-zinc-800 active:scale-[0.98]'
                  }`}
                >
                  <span className="font-medium text-sm text-zinc-100">{srv.name}</span>
                  <span className="font-mono text-sm text-brand-500 font-medium">₹{srv.price}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

      </motion.div>

      {/* CTA Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-30 pointer-events-none">
        <button 
          onClick={() => nav('billing')}
          disabled={!isReady}
          className={`w-full font-semibold py-4 rounded-xl transition-all shadow-liquid pointer-events-auto flex items-center justify-center gap-2 ${
            isReady 
              ? 'bg-brand-500 text-brand-950 active:scale-[0.98] shadow-[0_4px_20px_rgba(212,175,55,0.3)]' 
              : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
          }`}
        >
          Confirm Time & Service
          <span className="font-mono text-[10px] tracking-widest uppercase bg-black/20 px-2 py-0.5 rounded ml-2">2/3</span>
        </button>
      </div>

    </div>
  );
}
