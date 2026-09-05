import { ArrowLeft } from 'lucide-react';
import { Star } from '@phosphor-icons/react';

export default function SalonProfileScreen({ nav, back, salon }: { nav: any, back: any, salon: any }) {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-zinc-950">
      
      {/* Hero Image */}
      <div className="relative h-[280px] w-full shrink-0">
        <button 
          onClick={back}
          className="absolute top-6 left-6 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <img src={salon.image} alt={salon.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-zinc-950"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-28 px-6 relative z-10 -mt-12">
        <h1 className="font-sans font-bold text-3xl leading-tight mb-2 text-white">{salon.name}</h1>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-500 mb-8">
          <Star weight="fill" />
          <span>{salon.rating}</span>
          <span className="text-zinc-500 font-normal ml-1">(428 reviews)</span>
        </div>

        <div className="mb-8">
          <h2 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">Our Story</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Luxury grooming for the modern gentleman. We specialize in precision fades, hot towel shaves, and a premium atmosphere built to refresh and re-energize.
          </p>
        </div>

        <div>
          <h2 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">Average Pricing</h2>
          <div className="bg-zinc-900 border border-zinc-800 shadow-liquid rounded-2xl overflow-hidden divide-y divide-zinc-800/50">
            <div className="flex justify-between items-center p-4 text-sm">
              <span className="text-zinc-300">Haircut</span>
              <span className="font-mono text-brand-500 font-medium">₹300 - ₹500</span>
            </div>
            <div className="flex justify-between items-center p-4 text-sm">
              <span className="text-zinc-300">Beard Trim</span>
              <span className="font-mono text-brand-500 font-medium">₹150 - ₹250</span>
            </div>
            <div className="flex justify-between items-center p-4 text-sm">
              <span className="text-zinc-300">Scalp Spa</span>
              <span className="font-mono text-brand-500 font-medium">₹800+</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-30 pointer-events-none">
        <button 
          onClick={() => nav('barbers')}
          className="w-full bg-brand-500 text-brand-950 font-semibold py-4 rounded-xl active:scale-[0.98] transition-transform shadow-[0_4px_20px_rgba(212,175,55,0.3)] pointer-events-auto flex items-center justify-center gap-2"
        >
          Book Your Barber
          <span className="font-mono text-[10px] tracking-widest uppercase bg-black/20 px-2 py-0.5 rounded ml-2">1/3</span>
        </button>
      </div>

    </div>
  );
}
