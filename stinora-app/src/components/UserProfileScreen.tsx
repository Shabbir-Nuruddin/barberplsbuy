import { useRef, useState } from 'react';
import { AREAS, useStore, saveCustomer, pastBookings, resetAll, reseedDemo } from '../lib/store';
import { readImageResized } from '../lib/photo';
import type { ThemeMode } from '../App';
import { ArrowLeft, CreditCard, Clock, LogOut, ChevronRight, ShieldCheck, X, Sun, Moon, Laptop, Camera, LayoutDashboard, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserProfileScreen({
  back,
  nav,
  themeMode = 'light',
  setThemeMode,
  onSignOut,
}: {
  back: () => void;
  nav: (s: string) => void;
  themeMode?: ThemeMode;
  setThemeMode?: (m: ThemeMode) => void;
  onSignOut: () => void;
}) {
  const store = useStore();
  const customer = store.customer;
  const photoInput = useRef<HTMLInputElement>(null);
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState({ name: customer.name, phone: customer.phone, area: customer.area || AREAS[0] });
  const [formError, setFormError] = useState('');

  const spend = pastBookings().reduce((a, b) => a + b.totalPrice, 0);
  const visits = pastBookings().length;
  const myReviews = store.reviews.filter((r) => r.authorName === customer.name).length;

  const openPhotoPicker = () => photoInput.current?.click();

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      saveCustomer({ photo: await readImageResized(file) });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'That image could not be used.');
    }
    e.target.value = '';
  };

  const saveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.name.trim().length < 2) return setFormError('Enter the name your stylist should see.');
    if (draft.phone.replace(/\D/g, '').length < 10) return setFormError('Enter a 10-digit mobile number.');
    setFormError('');
    saveCustomer({ name: draft.name.trim(), phone: draft.phone.trim(), area: draft.area, onboarded: true });
    setEdit(false);
  };

  const [activeModal, setActiveModal] = useState<'payments' | 'settings' | 'terms' | null>(null);

  const container: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 flex flex-col bg-editorial-900 relative overflow-hidden">
      
      <header className="px-6 py-6 flex items-center gap-4 bg-editorial-900 shrink-0 z-10 border-b border-editorial-600/50">
        <button 
          onClick={back}
          aria-label="Back to home"
          className="w-10 h-10 rounded border border-editorial-600 flex items-center justify-center text-editorial-200 hover:bg-editorial-800 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-serif italic text-xl tracking-tight text-editorial-50">Member Account</h2>
          <p className="text-[10px] font-mono tracking-widest uppercase text-editorial-400">StinOra Black Tier</p>
        </div>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 overflow-y-auto no-scrollbar pb-28">
        
        <motion.div variants={item} className="px-6 pt-8 pb-5 text-center flex flex-col items-center">
          <div className="relative mb-4">
            <button
              onClick={openPhotoPicker}
              aria-label="Change your profile picture"
              className="w-24 h-24 rounded-full border-2 border-brand-500 overflow-hidden flex items-center justify-center bg-editorial-800 text-brand-400 font-serif italic text-4xl shadow-glow active:scale-95 transition-transform"
            >
              {customer.photo
                ? <img src={customer.photo} alt="" className="w-full h-full object-cover" />
                : (customer.name || 'G').trim()[0].toUpperCase()}
            </button>
            <input ref={photoInput} type="file" accept="image/*" onChange={onPhoto} className="hidden" />
            <span className="absolute bottom-0 right-0 bg-brand-500 rounded-full p-1.5 text-white border-2 border-editorial-900 pointer-events-none">
              <Camera size={12} strokeWidth={2.5} />
            </span>
          </div>

          <h1 className="font-sans font-bold text-2xl tracking-tight text-editorial-50 mb-0.5">{customer.name || 'Guest'}</h1>
          <p className="text-editorial-400 text-xs font-mono tracking-wider uppercase mb-3">
            {[customer.phone && `+91 ${customer.phone}`, customer.area].filter(Boolean).join(' · ') || 'No details saved yet'}
          </p>
          <button
            onClick={() => { setDraft({ name: customer.name, phone: customer.phone, area: customer.area || AREAS[0] }); setEdit((v) => !v); }}
            className="text-[9px] font-mono uppercase tracking-widest text-brand-400 border border-brand-500/40 bg-brand-500/10 px-3 py-1 rounded-full font-bold hover:bg-brand-500/20 transition-colors"
          >
            {edit ? 'Close' : 'Edit details'}
          </button>
        </motion.div>

        {/* Editable details */}
        <AnimatePresence>
          {edit && (
            <motion.form
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              onSubmit={saveDetails}
              className="px-6 mb-6 overflow-hidden"
            >
              <div className="bg-editorial-800 border border-editorial-600 rounded-[1rem] p-5 shadow-bento flex flex-col gap-4">
                <div>
                  <label htmlFor="pf-name" className="font-mono text-[10px] uppercase tracking-widest font-bold text-editorial-400 block mb-2">Full name</label>
                  <input id="pf-name" value={draft.name} autoComplete="name" onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="w-full px-4 py-3 bg-editorial-900 border border-editorial-600 rounded-lg outline-none text-editorial-50 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors" />
                </div>
                <div>
                  <label htmlFor="pf-phone" className="font-mono text-[10px] uppercase tracking-widest font-bold text-editorial-400 block mb-2">Mobile number</label>
                  <input id="pf-phone" type="tel" inputMode="numeric" autoComplete="tel" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-editorial-900 border border-editorial-600 rounded-lg outline-none text-editorial-50 text-sm focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors" />
                </div>
                <div>
                  <label htmlFor="pf-area" className="font-mono text-[10px] uppercase tracking-widest font-bold text-editorial-400 block mb-2">Your area</label>
                  <select id="pf-area" value={draft.area} onChange={(e) => setDraft({ ...draft, area: e.target.value })}
                    className="w-full px-4 py-3 bg-editorial-900 border border-editorial-600 rounded-lg outline-none text-editorial-50 text-sm focus:border-brand-400">
                    {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                {formError && (
                  <p role="alert" className="text-[11px] font-bold text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">{formError}</p>
                )}
                <button type="submit" className="w-full bg-brand-500 text-white shadow-glow font-bold py-3 rounded-lg active:scale-[0.98] transition-all hover:bg-brand-400">
                  Save details
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Lifetime stats, derived from real visits */}
        <motion.div variants={item} className="px-6 mb-6 grid grid-cols-3 gap-2.5">
          {[
            { label: 'Visits', value: String(visits) },
            { label: 'Spend', value: `₹${spend.toLocaleString('en-IN')}` },
            { label: 'Reviews', value: String(myReviews) },
          ].map((st) => (
            <div key={st.label} className="bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] p-4 text-center">
              <span className="block font-sans font-bold text-lg text-editorial-50 leading-none mb-1.5">{st.value}</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 font-bold">{st.label}</span>
            </div>
          ))}
        </motion.div>

        {/* APPEARANCE / THEME TOGGLE CARD */}
        <motion.div variants={item} className="px-6 mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-editorial-400">
              Theme & Palette
            </span>
            <span className="text-[10px] font-mono text-brand-400 font-bold uppercase bg-brand-950/40 border border-brand-800/40 px-2 py-0.5 rounded">
              {themeMode === 'light' ? 'Urban Light' : themeMode === 'dark' ? 'Dark Noir' : 'Device Auto'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-editorial-800 p-2 rounded-[1rem] border border-editorial-600 shadow-bento">
            <button
              type="button"
              onClick={() => setThemeMode?.('light')}
              aria-label="Switch to Urban Light mode"
              className={`py-3 px-2 rounded-lg flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                themeMode === 'light'
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-editorial-400 hover:text-editorial-200 hover:bg-editorial-700/50'
              }`}
            >
              <Sun size={18} />
              <span className="text-[10px] font-semibold">Urban Light</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeMode?.('dark')}
              aria-label="Switch to Dark Noir mode"
              className={`py-3 px-2 rounded-lg flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                themeMode === 'dark'
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-editorial-400 hover:text-editorial-200 hover:bg-editorial-700/50'
              }`}
            >
              <Moon size={18} />
              <span className="text-[10px] font-semibold">Dark Noir</span>
            </button>

            <button
              type="button"
              onClick={() => setThemeMode?.('system')}
              aria-label="Switch to device default theme"
              className={`py-3 px-2 rounded-lg flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                themeMode === 'system'
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'text-editorial-400 hover:text-editorial-200 hover:bg-editorial-700/50'
              }`}
            >
              <Laptop size={18} />
              <span className="text-[10px] font-semibold">Device Match</span>
            </button>
          </div>
        </motion.div>

        <motion.div variants={item} className="px-6 pb-8">
          <div className="bg-editorial-800 border border-editorial-600 rounded-[1rem] overflow-hidden divide-y divide-editorial-700 shadow-bento">
            
            <button 
              onClick={() => nav && nav('bookings')}
              aria-label="View Appointments and History"
              className="w-full flex items-center justify-between p-5 hover:bg-editorial-700 transition-colors text-left focus:outline-none"
            >
              <div className="flex items-center gap-4 text-editorial-100">
                <Clock size={18} className="text-brand-400" />
                <div>
                  <span className="font-bold text-sm block">My Bookings</span>
                  <span className="text-[10px] text-editorial-400 font-mono">View upcoming & archive</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-editorial-500" />
            </button>

            <button 
              onClick={() => setActiveModal('payments')}
              aria-label="View Saved Payment Methods"
              className="w-full flex items-center justify-between p-5 hover:bg-editorial-700 transition-colors text-left focus:outline-none"
            >
              <div className="flex items-center gap-4 text-editorial-100">
                <CreditCard size={18} className="text-brand-400" />
                <div>
                  <span className="font-bold text-sm block">Payment Methods</span>
                  <span className="text-[10px] text-editorial-400 font-mono">UPI & linked cards</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-editorial-500" />
            </button>

            <button
              onClick={() => nav('owner')}
              aria-label="Open Salon OS, the owner dashboard"
              className="w-full flex items-center justify-between p-5 hover:bg-editorial-700 transition-colors text-left focus:outline-none"
            >
              <div className="flex items-center gap-4 text-editorial-100">
                <LayoutDashboard size={18} className="text-brand-400" />
                <div>
                  <span className="font-bold text-sm block">Salon OS</span>
                  <span className="text-[10px] text-editorial-400 font-mono">Sales, stylists &amp; reviews</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-editorial-500" />
            </button>

            <button 
              onClick={() => setActiveModal('terms')}
              aria-label="Terms of Service and Privacy Policy"
              className="w-full flex items-center justify-between p-5 hover:bg-editorial-700 transition-colors text-left focus:outline-none"
            >
              <div className="flex items-center gap-4 text-editorial-100">
                <ShieldCheck size={18} className="text-brand-400" />
                <div>
                  <span className="font-bold text-sm block">Legal & Privacy</span>
                  <span className="text-[10px] text-editorial-400 font-mono">Cancellation & studio terms</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-editorial-500" />
            </button>

          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => { if (confirm('Reload the demo studio? This replaces the current trading history and reviews.')) reseedDemo(); }}
              className="w-full bg-transparent border border-editorial-700 hover:border-editorial-500 text-editorial-400 hover:text-editorial-100 font-bold py-3.5 rounded-[1rem] active:scale-[0.98] transition-all flex justify-center items-center gap-2"
            >
              <RefreshCw size={15} />
              <span className="text-sm">Reload demo data</span>
            </button>

            <button
              onClick={() => {
                if (!confirm('Erase your profile, bookings and reviews and start over?')) return;
                resetAll();
                onSignOut();
              }}
              aria-label="Sign out and erase local data"
              className="w-full bg-transparent border border-editorial-700 hover:border-red-500/60 text-editorial-400 hover:text-red-500 font-bold py-3.5 rounded-[1rem] active:scale-[0.98] transition-all flex justify-center items-center gap-2 focus:outline-none"
            >
              <LogOut size={16} />
              <span className="text-sm">Sign out &amp; erase data</span>
            </button>
          </div>
        </motion.div>

      </motion.div>

      {/* POPUP MODAL (Payments / Settings / Legal) */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-editorial-950/80 backdrop-blur-sm z-50 flex items-end justify-center"
            role="dialog"
            aria-modal="true"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="bg-editorial-900 border-t border-editorial-600 rounded-t-[2rem] w-full p-6 pb-12 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-editorial-700">
                <h3 className="font-serif italic text-xl text-editorial-50">
                  {activeModal === 'payments' && 'Payment Instruments'}
                  {activeModal === 'settings' && 'Account Settings'}
                  {activeModal === 'terms' && 'Studio Policies & Terms'}
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full border border-editorial-600 flex items-center justify-center text-editorial-400 hover:text-editorial-100"
                >
                  <X size={16} />
                </button>
              </div>

              {activeModal === 'payments' && (
                <div className="flex flex-col gap-3">
                  <div className="p-4 bg-editorial-800 border border-editorial-600 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-editorial-100">Google Pay / PhonePe UPI</p>
                      <p className="text-[11px] font-mono text-editorial-400">aarav.sharma@okaxis</p>
                    </div>
                    <span className="text-[9px] font-mono text-brand-300 font-bold uppercase bg-brand-950 px-2 py-0.5 rounded border border-brand-800/40">Primary</span>
                  </div>
                  <div className="p-4 bg-editorial-800 border border-editorial-600 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-editorial-100">HDFC Millennia Credit Card</p>
                      <p className="text-[11px] font-mono text-editorial-400">•••• •••• •••• 4242</p>
                    </div>
                    <span className="text-[9px] font-mono text-editorial-400 uppercase">Expires 08/29</span>
                  </div>
                </div>
              )}

              {activeModal === 'settings' && (
                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-editorial-800">
                    <span className="text-editorial-400 font-mono text-xs">Full Name</span>
                    <span className="text-editorial-100 font-bold">Aarav Sharma</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-editorial-800">
                    <span className="text-editorial-400 font-mono text-xs">Mobile Number</span>
                    <span className="text-editorial-100 font-bold">+91 98765 43210</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-editorial-800">
                    <span className="text-editorial-400 font-mono text-xs">Primary Studio City</span>
                    <span className="text-editorial-100 font-bold">Indiranagar, Bangalore</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-editorial-400 font-mono text-xs">SMS Reminders</span>
                    <span className="text-brand-300 font-mono text-xs font-bold">Enabled</span>
                  </div>
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="text-xs text-editorial-300 leading-relaxed max-h-[300px] overflow-y-auto no-scrollbar space-y-3">
                  <p><strong>1. Cancellation & Rescheduling:</strong> Appointments may be cancelled or rescheduled up to 2 hours prior to the booked timeslot with a 100% full refund to the original payment method.</p>
                  <p><strong>2. Studio Hygiene Standard:</strong> All partner salons in the StinOra network guarantee sterile tools, single-use neck strips, and sanitized styling stations.</p>
                  <p><strong>3. Late Arrivals:</strong> If you arrive more than 15 minutes past your slot, the studio reserves the right to reallocate chair capacity to walk-ins.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
