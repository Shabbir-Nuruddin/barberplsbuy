import { ArrowLeft, Star } from 'lucide-react';

export default function SalonProfileScreen({ nav, back, salon }: { nav: any, back: any, salon: any }) {
  if (!salon) return null;

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-dark-900">
      
      <div className="relative h-[320px] w-full shrink-0">
        <button 
          onClick={back}
          className="absolute top-6 left-6 z-20 w-10 h-10 rounded-full bg-dark-900/50 backdrop-blur-md shadow-sm border border-dark-600/50 flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <img src={salon.image} alt={salon.name} className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-dark-900"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 relative z-10 -mt-16">
        
        <div className="bg-dark-800 rounded-[2rem] p-6 shadow-diffusion-dark border border-dark-600 mb-8">
          <h1 className="font-sans font-bold text-3xl leading-tight mb-2 text-dark-50">{salon.name}</h1>
          <div className="flex items-center gap-1.5 text-sm font-bold text-dark-100 mb-2">
            <Star size={14} fill="#FFB020" color="#FFB020" />
            <span>{salon.rating}</span>
            <span className="text-dark-400 font-medium ml-1">(428 reviews)</span>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
             {salon.tags?.map((t: string) => (
                <span key={t} className="text-[10px] font-bold tracking-wider uppercase bg-dark-700 border border-dark-600 text-dark-200 px-3 py-1.5 rounded-lg">
                  {t}
                </span>
              ))}
          </div>
        </div>

        <div className="mb-8 px-2">
          <h2 className="font-sans font-bold text-lg text-dark-50 mb-3">Our Story</h2>
          <p className="text-sm text-dark-300 leading-relaxed font-medium">
            Luxury grooming for the modern gentleman. We specialize in precision fades, hot towel shaves, and a premium atmosphere built to refresh and re-energize.
          </p>
        </div>

        <div className="px-2">
          <h2 className="font-sans font-bold text-lg text-dark-50 mb-4">Average Pricing</h2>
          <div className="bg-dark-800 border border-dark-600 shadow-diffusion-sm rounded-[1.5rem] overflow-hidden divide-y divide-dark-700">
            <div className="flex justify-between items-center p-5 text-sm">
              <span className="text-dark-200 font-bold">Haircut</span>
              <span className="font-mono text-dark-100 font-bold">₹300 - ₹500</span>
            </div>
            <div className="flex justify-between items-center p-5 text-sm">
              <span className="text-dark-200 font-bold">Beard Trim</span>
              <span className="font-mono text-dark-100 font-bold">₹150 - ₹250</span>
            </div>
            <div className="flex justify-between items-center p-5 text-sm">
              <span className="text-dark-200 font-bold">Scalp Spa</span>
              <span className="font-mono text-dark-100 font-bold">₹800+</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-900 via-dark-900/90 to-transparent z-30 pointer-events-none pb-[calc(1.5rem+64px)]">
        <button 
          onClick={() => nav('barbers')}
          className="w-full bg-accent-blue text-dark-950 font-bold py-4 rounded-[1.25rem] active:scale-[0.98] transition-transform shadow-diffusion-dark pointer-events-auto flex items-center justify-center gap-2"
        >
          Book Your Barber
          <span className="font-mono text-[9px] font-bold tracking-widest text-dark-900 bg-black/10 px-2 py-0.5 rounded ml-2 uppercase">1/3</span>
        </button>
      </div>

    </div>
  );
}
