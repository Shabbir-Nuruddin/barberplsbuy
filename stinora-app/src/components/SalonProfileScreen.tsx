import { ArrowLeft, Star } from 'lucide-react';
import { salonRating, reviewsForSalon, barbersOf, SERVICES, priceFor, type Salon } from '../lib/store';

export default function SalonProfileScreen({ nav, back, salon }: {
  nav: (s: string) => void; back: () => void; salon: Salon | null;
}) {
  if (!salon) return null;

  const rating = salonRating(salon.id);
  const reviews = reviewsForSalon(salon.id)
    .filter((r) => r.text)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4);
  const staff = barbersOf(salon.id);

  // The price list was three hardcoded ranges identical for all twenty studios.
  // It is now the real menu, priced across the stylists this studio actually has.
  const priceRows = SERVICES.slice(0, 5).map((svc) => {
    const prices = staff.map((b) => priceFor(svc, b));
    const lo = Math.min(...prices);
    const hi = Math.max(...prices);
    return { name: svc.name, label: lo === hi ? `₹${lo}` : `₹${lo} - ₹${hi}` };
  });

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-editorial-900">
      
      <div className="relative h-[320px] w-full shrink-0">
        <button 
          onClick={back}
          className="absolute top-6 left-6 z-20 w-10 h-10 rounded border border-editorial-600 bg-editorial-900/50 backdrop-blur-md flex items-center justify-center text-editorial-200 hover:bg-editorial-800 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <img src={salon.image} alt={salon.name} className="w-full h-full object-cover mix-blend-luminosity opacity-40 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-editorial-900/50 via-transparent to-editorial-900"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 relative z-10 -mt-16">
        
        <div className="bg-editorial-800 rounded-[1rem] p-8 shadow-bento border border-editorial-600 mb-8">
          <h1 className="font-sans font-bold text-3xl leading-tight mb-2 text-editorial-50 tracking-tighter">
            {salon.name.split(' ')[0]} <span className="font-serif italic font-normal text-editorial-200">{salon.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-mono text-editorial-200 mb-4 tracking-widest uppercase">
            <span>{rating.average.toFixed(1)} Rating</span>
            <span className="text-editorial-600">&bull;</span>
            <span>{rating.count.toLocaleString('en-IN')} Reviews</span>
          </div>
          <div className="flex gap-2 flex-wrap">
             {salon.tags.map((t: string) => (
                <span key={t} className="text-[9px] font-bold tracking-widest uppercase border border-editorial-600 text-editorial-300 px-2 py-1 rounded">
                  {t}
                </span>
              ))}
          </div>
        </div>

        <div className="mb-10 px-2">
          <h2 className="font-serif italic text-xl text-editorial-200 mb-4">Our Manifesto.</h2>
          <p className="text-sm text-editorial-400 leading-relaxed font-medium">
            Luxury grooming for the modern gentleman. We specialize in precision fades, hot towel shaves, and a premium atmosphere built to refresh and re-energize. Rejecting the generic salon experience.
          </p>
        </div>

        <div className="px-2">
          <h2 className="font-mono text-[10px] tracking-widest uppercase font-semibold text-editorial-400 mb-4">Investment</h2>
          <div className="bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] overflow-hidden divide-y divide-editorial-700">
            {priceRows.map((row) => (
              <div key={row.name} className="flex justify-between items-center p-5 text-sm gap-4">
                <span className="text-editorial-200 font-medium min-w-0 truncate">{row.name}</span>
                <span className="font-mono text-editorial-100 shrink-0">{row.label}</span>
              </div>
            ))}
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="px-2 mt-10">
            <h2 className="font-mono text-[10px] tracking-widest uppercase font-semibold text-editorial-400 mb-4">What guests said</h2>
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] p-5">
                  <div className="flex justify-between items-start mb-2 gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-editorial-50 truncate">{r.authorName}</h3>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 truncate">{r.barberName}</p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={10} className={n <= r.rating ? 'text-brand-500' : 'text-editorial-600'} fill={n <= r.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[13px] text-editorial-300 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-editorial-900 via-editorial-900/90 to-transparent z-30 pointer-events-none pb-[calc(1.5rem+64px)]">
        <button 
          onClick={() => nav('barbers')}
          className="w-full bg-brand-500 text-white shadow-glow font-bold py-4 rounded-lg hover:bg-brand-400 transition-colors pointer-events-auto flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          View {staff.length} stylists
          <span className="font-mono text-[9px] font-bold tracking-widest text-editorial-500 bg-black/5 px-2 py-0.5 rounded ml-2 uppercase">1/3</span>
        </button>
      </div>

    </div>
  );
}
