import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { AREAS, SERVICES, saveCustomer, getState } from '../lib/store';
import { heroImage } from '../lib/images';

const HERO = heroImage();

type StepId = 'intro' | 'identity' | 'area' | 'taste' | 'done';
const STEPS: StepId[] = ['intro', 'identity', 'area', 'taste', 'done'];

/**
 * Onboarding.
 *
 * The previous screen took a phone number, waited 800ms and threw it away — the
 * home screen then greeted every user as "Aarav" because the name was hardcoded.
 * This collects and keeps the details the rest of the app actually reads.
 */
export default function WelcomeScreen({ onDone }: { onDone: () => void }) {
  const existing = getState().customer;
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({
    name: existing.name,
    phone: existing.phone,
    area: existing.area || AREAS[0],
    favouriteServices: existing.favouriteServices.length ? existing.favouriteServices : ['srv2'],
  });

  const id = STEPS[step];

  const commit = (): boolean => {
    if (id === 'identity') {
      if (draft.name.trim().length < 2) {
        setError('Tell us the name your stylist should greet you by.');
        return false;
      }
      if (draft.phone.replace(/\D/g, '').length < 10) {
        setError('Enter a 10-digit mobile number so the studio can reach you.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const next = () => {
    if (!commit()) return;
    if (id === 'done') {
      finish();
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const finish = () => {
    saveCustomer({
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      area: draft.area,
      favouriteServices: draft.favouriteServices,
      onboarded: true,
    });
    onDone();
  };

  const skip = () => {
    saveCustomer({ onboarded: true, name: draft.name.trim() || 'Guest', area: draft.area });
    onDone();
  };

  const toggleService = (sid: string) =>
    setDraft((d) => ({
      ...d,
      favouriteServices: d.favouriteServices.includes(sid)
        ? d.favouriteServices.filter((x) => x !== sid)
        : [...d.favouriteServices, sid],
    }));

  const field =
    'w-full px-4 py-3.5 bg-editorial-800 border border-editorial-600 rounded-lg outline-none text-editorial-50 font-medium placeholder:text-editorial-500 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors shadow-bento';

  return (
    <div className="flex-1 flex flex-col bg-editorial-900 relative overflow-hidden h-full">
      <div className="absolute inset-0 z-0">
        <img src={HERO} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-25 dark:opacity-20 mix-blend-luminosity grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-editorial-900 via-editorial-900/85 to-editorial-900/30" />
      </div>

      <div className="flex-1 flex flex-col relative z-10 overflow-y-auto no-scrollbar p-6 sm:p-8">

        <div className="flex items-center gap-3 pt-4 mb-8">
          {step > 0 && id !== 'done' && (
            <button
              onClick={() => { setError(''); setStep((s) => s - 1); }}
              aria-label="Back"
              className="w-9 h-9 rounded border border-editorial-600 bg-editorial-800/70 flex items-center justify-center text-editorial-200 active:scale-95 transition-all"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div className="flex-1 flex gap-1.5" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length}>
            {STEPS.map((s, i) => (
              <span key={s} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand-500' : 'bg-editorial-700'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="flex-1 flex flex-col"
          >
            {id === 'intro' && (
              <div className="flex-1 flex flex-col justify-center">
                <div className="inline-block self-start border border-editorial-600 rounded-full px-3 py-1 mb-5 bg-editorial-800/80 shadow-bento">
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-editorial-400 font-bold">StinOra Grooming</p>
                </div>
                <h1 className="font-sans font-bold text-4xl sm:text-5xl leading-[1.05] tracking-tighter text-editorial-50 mb-4">
                  Bespoke<br /><span className="font-serif italic font-normal text-editorial-200">Grooming.</span>
                </h1>
                <p className="text-editorial-400 text-sm leading-relaxed max-w-[300px]">
                  Master stylists, precision fades and luxury treatments across Bangalore's premier studios. Three questions and you are in.
                </p>
              </div>
            )}

            {id === 'identity' && (
              <div className="flex-1 flex flex-col justify-center gap-5">
                <div>
                  <h1 className="font-sans font-bold text-3xl tracking-tighter text-editorial-50 mb-1.5">
                    Who are <span className="font-serif italic font-normal text-editorial-200">you?</span>
                  </h1>
                  <p className="text-xs text-editorial-400">Your stylist sees this on the chair ticket.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <label htmlFor="ob-name" className="font-mono text-[10px] uppercase tracking-widest font-bold text-editorial-400 block mb-2">Full name</label>
                    <input id="ob-name" className={field} value={draft.name} autoComplete="name"
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Arjun Mehta" />
                  </div>
                  <div>
                    <label htmlFor="ob-phone" className="font-mono text-[10px] uppercase tracking-widest font-bold text-editorial-400 block mb-2">Mobile number</label>
                    <div className="flex bg-editorial-800 border border-editorial-600 rounded-lg overflow-hidden focus-within:border-brand-400 focus-within:ring-1 focus-within:ring-brand-400 transition-colors shadow-bento">
                      <span className="flex items-center px-4 bg-editorial-700/50 border-r border-editorial-600 text-editorial-300 font-mono text-xs font-bold">+91</span>
                      <input id="ob-phone" type="tel" inputMode="numeric" autoComplete="tel" value={draft.phone}
                        onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                        placeholder="98201 98765"
                        className="flex-1 px-4 py-3.5 bg-transparent outline-none text-editorial-50 font-medium placeholder:text-editorial-500 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {id === 'area' && (
              <div className="flex-1 flex flex-col justify-center gap-5">
                <div>
                  <h1 className="font-sans font-bold text-3xl tracking-tighter text-editorial-50 mb-1.5">
                    Where are <span className="font-serif italic font-normal text-editorial-200">you?</span>
                  </h1>
                  <p className="text-xs text-editorial-400">We sort studios by how close they are to you.</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {AREAS.map((a) => {
                    const active = draft.area === a;
                    return (
                      <button key={a} onClick={() => setDraft({ ...draft, area: a })} aria-pressed={active}
                        className={`py-3.5 px-3 rounded-lg text-xs font-bold border transition-all active:scale-[0.98] ${
                          active ? 'bg-brand-500 border-brand-500 text-white shadow-glow' : 'bg-editorial-800 border-editorial-600 text-editorial-200 shadow-bento hover:bg-editorial-700'
                        }`}>
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {id === 'taste' && (
              <div className="flex-1 flex flex-col justify-center gap-5">
                <div>
                  <h1 className="font-sans font-bold text-3xl tracking-tighter text-editorial-50 mb-1.5">
                    What do you <span className="font-serif italic font-normal text-editorial-200">book?</span>
                  </h1>
                  <p className="text-xs text-editorial-400">Pre-selected next time you reserve a chair. Optional.</p>
                </div>
                <div className="flex flex-col gap-2">
                  {SERVICES.map((s) => {
                    const active = draft.favouriteServices.includes(s.id);
                    return (
                      <button key={s.id} onClick={() => toggleService(s.id)} aria-pressed={active}
                        className={`flex justify-between items-center px-4 py-3.5 rounded-lg border text-left transition-all active:scale-[0.98] ${
                          active ? 'bg-brand-500 border-brand-500 text-white shadow-glow' : 'bg-editorial-800 border-editorial-600 shadow-bento hover:bg-editorial-700'
                        }`}>
                        <span className={`text-sm font-bold tracking-tight ${active ? 'text-white' : 'text-editorial-50'}`}>{s.name}</span>
                        <span className="flex items-center gap-3">
                          <span className={`font-mono text-xs font-bold ${active ? 'text-white/85' : 'text-editorial-300'}`}>₹{s.price}</span>
                          <span className={`w-4 h-4 rounded border flex items-center justify-center ${active ? 'bg-white border-white' : 'border-editorial-500'}`}>
                            {active && <Check size={11} className="text-brand-500" strokeWidth={3} />}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {id === 'done' && (
              <div className="flex-1 flex flex-col justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <Check size={28} strokeWidth={2.5} />
                </div>
                <h1 className="font-sans font-bold text-3xl tracking-tighter text-editorial-50 mb-2">
                  You're <span className="font-serif italic font-normal text-editorial-200">in.</span>
                </h1>
                <p className="text-sm text-editorial-400 max-w-[280px] mx-auto">
                  {draft.name.trim().split(' ')[0] || 'Welcome'} — {draft.area} studios are ready. Your usual is pre-selected at checkout.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="pt-6 pb-2 flex flex-col gap-3">
          {error && (
            <p role="alert" className="text-[11px] font-bold text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">{error}</p>
          )}
          <button
            onClick={next}
            className="w-full bg-brand-500 text-white shadow-glow font-bold py-3.5 rounded-lg active:scale-[0.98] transition-all hover:bg-brand-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            {id === 'intro' ? 'Get started' : id === 'done' ? 'Enter studio' : 'Continue'}
          </button>
          {id !== 'done' && (
            <button onClick={skip} className="text-[10px] font-mono font-bold text-editorial-400 hover:text-editorial-100 py-1.5 tracking-widest uppercase transition-colors">
              Explore as guest &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
