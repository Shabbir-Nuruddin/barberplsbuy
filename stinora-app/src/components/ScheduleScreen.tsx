import { ArrowLeft } from 'lucide-react';
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

  return (
    <div className="flex-1 flex flex-col bg-editorial-900 overflow-hidden relative">
      
      <header className="px-6 py-6 flex items-center gap-4 bg-editorial-900 shrink-0 z-10 border-b border-editorial-600/50">
        <button 
          onClick={back}
          className="w-10 h-10 rounded border border-editorial-600 flex items-center justify-center text-editorial-200 hover:bg-editorial-800 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-serif italic text-xl tracking-tight text-editorial-50">Schedule</h2>
      </header>

      {/* Mini Profile */}
      <div className="px-6 py-5 flex items-center gap-5 bg-editorial-800 shrink-0 border-b border-editorial-600">
        <div className="w-12 h-12 rounded border border-editorial-600 flex items-center justify-center bg-editorial-900 text-editorial-200 font-serif italic text-xl">
          {barber.name[0]}
        </div>
        <div>
          <h3 className="font-bold text-sm text-editorial-50 tracking-tight">{barber.name}</h3>
          <p className="text-[10px] font-mono tracking-widest uppercase text-editorial-400">{barber.spec}</p>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar pb-28">
        
        {/* Date Rail */}
        <motion.div variants={item} className="mt-8 mb-8">
          <div className="px-6 mb-5">
            <h2 className="font-sans font-bold text-[1.25rem] tracking-tight text-editorial-50">Select Date</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-6 pb-2 -mx-6 snap-x snap-mandatory">
            {MOCK_DATA.dates.map((d) => {
              const active = selectedDate === d.id;
              return (
                <button 
                  key={d.id}
                  onClick={() => { setSelectedDate(d.id); setSelectedTime(null); }}
                  className={`snap-start flex-none w-[72px] h-[86px] rounded-lg flex flex-col items-center justify-center gap-1 border transition-all active:scale-[0.98] ${
                    active 
                      ? 'bg-editorial-50 border-editorial-50 text-editorial-950 shadow-sm' 
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

        {/* Time Slots */}
        <motion.div variants={item} className="px-6 mb-10">
          <div className="mb-5">
            <h2 className="font-sans font-bold text-[1.25rem] tracking-tight text-editorial-50">Select Time</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {MOCK_DATA.slots.map(t => {
              const isBooked = (t.length + selectedDate.length + (MOCK_DATA.bookedSlots.indexOf(t) * 3)) % 5 === 0;
              const booked = MOCK_DATA.bookedSlots.includes(t) || isBooked; 
              const selected = selectedTime === t;
              return (
                <button
                  key={t}
                  disabled={booked}
                  onClick={() => setSelectedTime(t)}
                  className={`py-3.5 rounded-lg font-mono text-[11px] uppercase tracking-widest font-bold transition-all ${
                    booked 
                      ? 'opacity-30 bg-editorial-950 border border-editorial-600 line-through cursor-not-allowed text-editorial-500'
                      : selected 
                        ? 'bg-editorial-50 border border-editorial-50 text-editorial-950 shadow-sm'
                        : 'bg-editorial-800 border border-editorial-600 text-editorial-200 active:scale-95 shadow-bento hover:bg-editorial-700'
                  }`}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Services */}
        <motion.div variants={item} className="px-6 mb-8">
          <div className="mb-5">
            <h2 className="font-sans font-bold text-[1.25rem] tracking-tight text-editorial-50">Select Services</h2>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_DATA.services.map(srv => {
              const selected = selectedServices.includes(srv.id);
              return (
                <button 
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
                  className={`flex justify-between items-center p-5 rounded-[1rem] border transition-all active:scale-[0.98] ${
                    selected
                      ? 'bg-editorial-50 border-editorial-50 shadow-sm'
                      : 'bg-editorial-800 border-editorial-600 shadow-bento hover:bg-editorial-700'
                  }`}
                >
                  <span className={`font-bold text-sm tracking-tight ${selected ? 'text-editorial-950' : 'text-editorial-50'}`}>{srv.name}</span>
                  <span className={`font-mono text-[11px] tracking-widest font-bold ${selected ? 'text-editorial-900/80' : 'text-editorial-300'}`}>₹{srv.price}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

      </motion.div>

      {/* CTA Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-editorial-900 via-editorial-900/95 to-transparent z-30 pointer-events-none pb-[calc(1.5rem+64px)]">
        <button 
          onClick={() => nav('billing')}
          disabled={!isReady}
          className={`w-full font-bold py-4 rounded-lg transition-all pointer-events-auto flex items-center justify-center gap-2 ${
            isReady 
              ? 'bg-editorial-50 text-editorial-950 active:scale-[0.98] shadow-sm hover:bg-white' 
              : 'bg-editorial-800 text-editorial-600 cursor-not-allowed border border-editorial-700'
          }`}
        >
          Confirm Details
          <span className={`font-mono text-[9px] font-bold tracking-widest px-2 py-0.5 rounded ml-2 uppercase ${isReady ? 'bg-black/10 text-editorial-700' : 'bg-editorial-700 text-editorial-500'}`}>2/3</span>
        </button>
      </div>

    </div>
  );
}
