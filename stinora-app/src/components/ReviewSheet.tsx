import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { addReview, getState, type Booking } from '../lib/store';

/**
 * Rate the stylist after a visit. A star rating is required; the written note is
 * optional, which is the point — most people will tap a star and nothing else,
 * and the app should still capture that.
 */
export default function ReviewSheet({ booking, onClose }: { booking: Booking | null; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (booking) {
      setRating(0);
      setHover(0);
      setText('');
      setError('');
      setDone(false);
    }
  }, [booking]);

  // Escape closes the sheet — otherwise the only way out is the small × button.
  useEffect(() => {
    if (!booking) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [booking, onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    if (rating < 1) {
      setError('Tap a star to rate your stylist.');
      return;
    }
    addReview({
      bookingId: booking.id,
      salonId: booking.salonId,
      barberId: booking.barberId,
      barberName: booking.barberName,
      authorName: getState().customer.name || booking.customerName || 'Guest',
      rating,
      text: text.trim(),
    });
    setDone(true);
    setTimeout(onClose, 1100);
  };

  const labels = ['', 'Poor', 'Below par', 'Solid', 'Great', 'Exceptional'];
  const shown = hover || rating;

  return (
    <AnimatePresence>
      {booking && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 z-[60] flex items-end justify-center bg-editorial-950/70 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Rate ${booking.barberName}`}
        >
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-editorial-800 border-t border-editorial-600 rounded-t-[1.75rem] p-6 pb-8 max-h-[92%] overflow-y-auto no-scrollbar"
          >
            <div className="w-10 h-1 rounded-full bg-editorial-600 mx-auto mb-6" />

            {done ? (
              <div className="py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-brand-500 text-white flex items-center justify-center mx-auto mb-5 shadow-glow">
                  <Star size={24} fill="currentColor" />
                </div>
                <h2 className="font-sans font-bold text-xl tracking-tight text-editorial-50 mb-1">Thank you.</h2>
                <p className="text-xs text-editorial-400">Your rating is now on {booking.barberName}'s profile.</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-editorial-400 font-bold mb-1.5">How was it?</p>
                    <h2 className="font-sans font-bold text-2xl tracking-tighter text-editorial-50">
                      Rate <span className="font-serif italic font-normal text-editorial-200">{booking.barberName}.</span>
                    </h2>
                    <p className="text-[11px] text-editorial-400 mt-1.5">{booking.serviceNames} · {booking.salonName}</p>
                  </div>
                  <button onClick={onClose} aria-label="Close" className="w-9 h-9 shrink-0 rounded border border-editorial-600 flex items-center justify-center text-editorial-300 hover:bg-editorial-700 transition-colors">
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-5">
                  <div className="bg-editorial-900 border border-editorial-600 rounded-[1rem] py-6 flex flex-col items-center gap-3">
                    <div className="flex gap-2" onMouseLeave={() => setHover(0)}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => { setRating(n); setError(''); }}
                          onMouseEnter={() => setHover(n)}
                          aria-label={`${n} star${n === 1 ? '' : 's'}`}
                          aria-pressed={rating === n}
                          className="p-1 active:scale-90 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded"
                        >
                          <Star
                            size={34}
                            className={n <= shown ? 'text-brand-500' : 'text-editorial-600'}
                            fill={n <= shown ? 'currentColor' : 'none'}
                            strokeWidth={1.5}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-editorial-400 h-4">
                      {labels[shown] || 'Tap to rate'}
                    </span>
                  </div>

                  <div>
                    <label htmlFor="review-text" className="font-mono text-[10px] uppercase tracking-widest font-bold text-editorial-400 block mb-2">
                      Add a note <span className="text-editorial-500 normal-case tracking-normal font-medium">(optional)</span>
                    </label>
                    <textarea
                      id="review-text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      maxLength={400}
                      rows={3}
                      placeholder="What should the next person know?"
                      className="w-full bg-editorial-900 border border-editorial-600 rounded-lg p-4 text-sm text-editorial-50 placeholder:text-editorial-500 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-colors resize-none"
                    />
                    <span className="block text-right font-mono text-[10px] text-editorial-500 mt-1">{text.length}/400</span>
                  </div>

                  {error && (
                    <p role="alert" className="text-[11px] font-bold text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-brand-500 text-white shadow-glow font-bold py-3.5 rounded-lg active:scale-[0.98] transition-all hover:bg-brand-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                  >
                    Post rating
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
