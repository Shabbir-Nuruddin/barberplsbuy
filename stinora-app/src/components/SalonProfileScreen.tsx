import { ArrowLeft } from 'lucide-react';
import { Star } from '@phosphor-icons/react';

export default function SalonProfileScreen({ nav, back, salon }: { nav: any, back: any, salon: any }) {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-earth-50">
      
      {/* Hero Image */}
      <div className="relative h-[320px] w-full shrink-0">
        <button 
          onClick={back}
          className="absolute top-6 left-6 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-earth-200 flex items-center justify-center text-earth-900 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <img src={salon.image} alt={salon.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-earth-50"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 relative z-10 -mt-16">
        
        <div className="bg-white rounded-[2rem] p-6 shadow-diffusion border border-earth-200 mb-8">
          <h1 className="font-sans font-bold text-3xl leading-tight mb-2 text-earth-900">{salon.name}</h1>
          <div className="flex items-center gap-1.5 text-sm font-bold text-earth-900 mb-2">
            <Star weight="fill" className="text-earth-400" />
            <span>{salon.rating}</span>
            <span className="text-earth-500 font-medium ml-1">(428 reviews)</span>
          </div>
          <div className="flex gap-2 mt-4">
             {salon.tags?.map((t: string) => (
                <span key={t} className="text-xs font-semibold bg-earth-50 border border-earth-200 text-earth-700 px-3 py-1 rounded-lg">
                  {t}
                </span>
              ))}
          </div>
        </div>

        <div className="mb-8 px-2">
          <h2 className="font-sans font-bold text-lg text-earth-900 mb-3">Our Story</h2>
          <p className="text-sm text-earth-600 leading-relaxed font-medium">
            Luxury grooming for the modern gentleman. We specialize in precision fades, hot towel shaves, and a premium atmosphere built to refresh and re-energize.
          </p>
        </div>

        <div className="px-2">
          <h2 className="font-sans font-bold text-lg text-earth-900 mb-4">Average Pricing</h2>
          <div className="bg-white border border-earth-200 shadow-diffusion-sm rounded-[1.5rem] overflow-hidden divide-y divide-earth-100">
            <div className="flex justify-between items-center p-5 text-sm">
              <span className="text-earth-800 font-medium">Haircut</span>
              <span className="font-mono text-earth-600 font-bold">₹300 - ₹500</span>
            </div>
            <div className="flex justify-between items-center p-5 text-sm">
              <span className="text-earth-800 font-medium">Beard Trim</span>
              <span className="font-mono text-earth-600 font-bold">₹150 - ₹250</span>
            </div>
            <div className="flex justify-between items-center p-5 text-sm">
              <span className="text-earth-800 font-medium">Scalp Spa</span>
              <span className="font-mono text-earth-600 font-bold">₹800+</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-earth-50 via-earth-50/90 to-transparent z-30 pointer-events-none">
        <button 
          onClick={() => nav('barbers')}
          className="w-full bg-earth-900 text-earth-50 font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform shadow-diffusion pointer-events-auto flex items-center justify-center gap-2"
        >
          Book Your Barber
          <span className="font-mono text-[10px] tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded ml-2">1/3</span>
        </button>
      </div>

    </div>
  );
}
