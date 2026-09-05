import { ArrowLeft } from 'lucide-react';
import { MOCK_DATA, getAvatar } from '../App';
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
    <div className="flex-1 flex flex-col bg-dark-900 overflow-hidden relative">
      
      <header className="px-6 py-5 flex items-center gap-4 bg-dark-900 shrink-0 z-10 border-b border-dark-600/50">
        <button 
          onClick={back}
          className="w-10 h-10 rounded-full bg-dark-800 shadow-sm border border-dark-600 flex items-center justify-center text-dark-100 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-sans font-bold text-lg tracking-tight text-dark-50">Schedule</h2>
      </header>

      {/* Mini Profile */}
      <div className="px-6 py-4 flex items-center gap-4 bg-dark-800 shadow-sm shrink-0 border-b border-dark-600">
        <img 
          src={getAvatar(barber.name.toLowerCase().replace(' ', '-'), barber.name[0], 80, ['#6EE7B7', '#3B82F6'])} 
          alt={barber.name} 
          className="w-12 h-12 rounded-full border border-dark-600"
        />
        <div>
          <h3 className="font-bold text-sm text-dark-50">{barber.name}</h3>
          <p className="text-xs font-semibold text-dark-400">{barber.spec}</p>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar pb-28">
        
        {/* Date Rail */}
        <motion.div variants={item} className="mt-8 mb-8">
          <div className="px-6 mb-4">
            <h2 className="font-sans font-bold text-lg text-dark-50">Pick a Date</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-6 pb-2 -mx-6 snap-x snap-mandatory">
            {MOCK_DATA.dates.map((d) => {
              const active = selectedDate === d.id;
              return (
                <button 
                  key={d.id}
                  onClick={() => { setSelectedDate(d.id); setSelectedTime(null); }}
                  className={`snap-start flex-none w-[76px] h-[86px] rounded-[1.25rem] flex flex-col items-center justify-center gap-1 border transition-all active:scale-[0.98] ${
                    active 
                      ? 'bg-accent-blue border-accent-blue text-dark-950 shadow-diffusion-dark' 
                      : 'bg-dark-800 border-dark-600 text-dark-300 shadow-sm hover:bg-dark-700'
                  }`}
                >
                  <span className={`font-mono text-[11px] uppercase tracking-widest font-bold ${active ? 'opacity-80' : ''}`}>{d.day}</span>
                  <span className={`font-sans font-bold text-2xl ${active ? '' : 'text-dark-50'}`}>{d.num}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Time Slots */}
        <motion.div variants={item} className="px-6 mb-10">
          <div className="mb-4">
            <h2 className="font-sans font-bold text-lg text-dark-50">Select Time Slot</h2>
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
                  className={`py-3.5 rounded-xl font-mono text-sm font-semibold transition-all shadow-sm ${
                    booked 
                      ? 'opacity-30 bg-dark-950 border-dark-600 line-through cursor-not-allowed text-dark-500'
                      : selected 
                        ? 'bg-accent-blue border-accent-blue text-dark-950 shadow-diffusion-dark'
                        : 'bg-dark-800 border border-dark-600 text-dark-100 active:scale-95 hover:border-dark-500 hover:bg-dark-700'
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
          <div className="mb-4">
            <h2 className="font-sans font-bold text-lg text-dark-50">Select Services</h2>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_DATA.services.map(srv => {
              const selected = selectedServices.includes(srv.id);
              return (
                <button 
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
                  className={`flex justify-between items-center p-5 rounded-2xl border transition-all active:scale-[0.98] ${
                    selected
                      ? 'bg-accent-blue border-accent-blue shadow-diffusion-dark'
                      : 'bg-dark-800 border-dark-600 shadow-sm hover:border-dark-500 hover:bg-dark-700'
                  }`}
                >
                  <span className={`font-bold text-sm ${selected ? 'text-dark-950' : 'text-dark-50'}`}>{srv.name}</span>
                  <span className={`font-mono text-sm font-bold ${selected ? 'text-dark-900/80' : 'text-dark-300'}`}>₹{srv.price}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

      </motion.div>

      {/* CTA Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-900 via-dark-900/90 to-transparent z-30 pointer-events-none pb-[calc(1.5rem+64px)]">
        <button 
          onClick={() => nav('billing')}
          disabled={!isReady}
          className={`w-full font-bold py-4 rounded-2xl transition-all pointer-events-auto flex items-center justify-center gap-2 ${
            isReady 
              ? 'bg-accent-blue text-dark-950 active:scale-[0.98] shadow-diffusion-dark' 
              : 'bg-dark-600 text-dark-400 cursor-not-allowed'
          }`}
        >
          Confirm Details
          <span className="font-mono text-[9px] font-bold tracking-widest text-dark-900 bg-black/10 px-2 py-0.5 rounded ml-2 uppercase">2/3</span>
        </button>
      </div>

    </div>
  );
}
