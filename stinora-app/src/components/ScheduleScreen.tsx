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
    <div className="flex-1 flex flex-col bg-earth-50 overflow-hidden relative">
      
      <header className="px-6 py-5 flex items-center gap-4 bg-earth-50 shrink-0 z-10 border-b border-earth-200/50">
        <button 
          onClick={back}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-earth-200 flex items-center justify-center text-earth-800 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-sans font-bold text-lg tracking-tight text-earth-900">Schedule</h2>
      </header>

      {/* Mini Profile */}
      <div className="px-6 py-4 flex items-center gap-4 bg-white shadow-sm shrink-0">
        <img 
          src={getAvatar(barber.name.toLowerCase().replace(' ', '-'), barber.name[0], 80)} 
          alt={barber.name} 
          className="w-12 h-12 rounded-full border border-earth-100"
        />
        <div>
          <h3 className="font-bold text-sm text-earth-900">{barber.name}</h3>
          <p className="text-xs font-semibold text-earth-500">{barber.spec}</p>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar pb-28">
        
        {/* Date Rail */}
        <motion.div variants={item} className="mt-8 mb-8">
          <div className="px-6 mb-4">
            <h2 className="font-sans font-bold text-lg text-earth-900">Pick a Date</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-6 pb-2 -mx-6 snap-x snap-mandatory">
            {MOCK_DATA.dates.map((d, i) => {
              const active = i === 0;
              return (
                <button 
                  key={i}
                  className={`snap-start flex-none w-[76px] h-[86px] rounded-[1.25rem] flex flex-col items-center justify-center gap-1 border transition-all active:scale-[0.98] ${
                    active 
                      ? 'bg-earth-900 border-earth-900 text-white shadow-diffusion' 
                      : 'bg-white border-earth-200 text-earth-600 shadow-sm'
                  }`}
                >
                  <span className={`font-mono text-[11px] uppercase tracking-widest font-semibold ${active ? 'opacity-80' : ''}`}>{d.day}</span>
                  <span className={`font-sans font-bold text-2xl ${active ? '' : 'text-earth-900'}`}>{d.num}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Time Slots */}
        <motion.div variants={item} className="px-6 mb-10">
          <div className="mb-4">
            <h2 className="font-sans font-bold text-lg text-earth-900">Select Time Slot</h2>
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
                  className={`py-3.5 rounded-xl font-mono text-sm font-semibold transition-all shadow-sm ${
                    booked 
                      ? 'opacity-40 bg-earth-100 border-earth-200 line-through cursor-not-allowed text-earth-400'
                      : selected 
                        ? 'bg-earth-900 border-earth-900 text-white shadow-diffusion'
                        : 'bg-white border border-earth-200 text-earth-800 active:scale-95 hover:border-earth-300'
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
            <h2 className="font-sans font-bold text-lg text-earth-900">Select Services</h2>
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
                      ? 'bg-earth-900 border-earth-900 shadow-diffusion'
                      : 'bg-white border-earth-200 shadow-sm hover:border-earth-300'
                  }`}
                >
                  <span className={`font-bold text-sm ${selected ? 'text-white' : 'text-earth-900'}`}>{srv.name}</span>
                  <span className={`font-mono text-sm font-bold ${selected ? 'text-earth-200' : 'text-earth-600'}`}>₹{srv.price}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

      </motion.div>

      {/* CTA Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-earth-50 via-earth-50/90 to-transparent z-30 pointer-events-none">
        <button 
          onClick={() => nav('billing')}
          disabled={!isReady}
          className={`w-full font-bold py-4 rounded-2xl transition-all pointer-events-auto flex items-center justify-center gap-2 ${
            isReady 
              ? 'bg-earth-900 text-white active:scale-[0.98] shadow-diffusion' 
              : 'bg-earth-200 text-earth-400 cursor-not-allowed'
          }`}
        >
          Confirm Details
          <span className="font-mono text-[10px] tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded ml-2">2/3</span>
        </button>
      </div>

    </div>
  );
}
