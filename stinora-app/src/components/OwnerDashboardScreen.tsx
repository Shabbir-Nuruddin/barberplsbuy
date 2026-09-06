import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Scissors, Wallet, Star, Users } from 'lucide-react';
import {
  useStore, getSalon, barbersOf, SALONS, setOwnedSalon,
  dayKey, dateFromKey, salonRating,
  type Booking,
} from '../lib/store';

type Range = 7 | 30 | 90;

const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

/**
 * Salon OS — the owner's side of the product.
 *
 * Everything here is derived from the same booking and review records the
 * customer app writes. There is no separate "business" store to fall out of sync,
 * which is why a booking taken on the customer side shows up in revenue here.
 */
export default function OwnerDashboardScreen({ back }: { back: () => void }) {
  const store = useStore();
  const [range, setRange] = useState<Range>(7);
  const [tab, setTab] = useState<'sales' | 'barbers' | 'reviews'>('sales');

  const salon = getSalon(store.ownedSalonId) || SALONS[0];
  const staff = barbersOf(salon.id);

  const stats = useMemo(() => {
    const completed = store.bookings.filter((b) => b.salonId === salon.id && b.status === 'completed');

    const inWindow = (b: Booking, from: number, to: number) => {
      const t = dateFromKey(b.dateKey).getTime();
      return t >= from && t < to;
    };

    const dayMs = 86400000;
    const todayStart = dateFromKey(dayKey()).getTime();
    const endExclusive = todayStart + dayMs;
    const currentFrom = endExclusive - range * dayMs;
    const priorFrom = currentFrom - range * dayMs;

    const current = completed.filter((b) => inWindow(b, currentFrom, endExclusive));
    const prior = completed.filter((b) => inWindow(b, priorFrom, currentFrom));

    const sum = (list: Booking[]) => list.reduce((acc, b) => acc + b.totalPrice, 0);
    const revenue = sum(current);
    const priorRevenue = sum(prior);
    const delta = priorRevenue > 0 ? Math.round(((revenue - priorRevenue) / priorRevenue) * 100) : null;

    // Daily revenue series for the chart.
    const series: Array<{ key: string; label: string; value: number }> = [];
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(endExclusive - (i + 1) * dayMs);
      const key = dayKey(d);
      series.push({
        key,
        label: d.toLocaleDateString('en-GB', { day: '2-digit' }),
        value: current.filter((b) => b.dateKey === key).reduce((a, b) => a + b.totalPrice, 0),
      });
    }

    const perBarber = staff
      .map((b) => {
        const mine = current.filter((x) => x.barberId === b.id);
        const revenueB = sum(mine);
        const reviews = store.reviews.filter((r) => r.salonId === salon.id && r.barberId === b.id);
        const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : null;
        return { barber: b, visits: mine.length, revenue: revenueB, reviews: reviews.length, avg };
      })
      .sort((a, b) => b.revenue - a.revenue);

    return {
      revenue,
      delta,
      visits: current.length,
      avgTicket: current.length ? revenue / current.length : 0,
      perDay: current.length / range,
      series,
      perBarber,
      peak: Math.max(1, ...series.map((s) => s.value)),
    };
  }, [store, salon.id, staff, range]);

  const rating = salonRating(salon.id);
  const salonReviews = store.reviews
    .filter((r) => r.salonId === salon.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const distribution = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: salonReviews.filter((r) => r.rating === n).length,
  }));

  const item: any = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };
  const container: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };

  return (
    <div className="flex-1 flex flex-col bg-editorial-900 overflow-hidden">

      <header className="px-6 pt-10 pb-5 shrink-0 border-b border-editorial-600/60 bg-editorial-900">
        <div className="flex items-center gap-4 mb-5">
          <button
            onClick={back}
            aria-label="Back"
            className="w-10 h-10 shrink-0 rounded border border-editorial-600 flex items-center justify-center text-editorial-200 hover:bg-editorial-800 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-editorial-400 font-bold mb-0.5">Salon OS</p>
            <h1 className="font-sans font-bold text-xl tracking-tighter text-editorial-50 truncate">
              Your <span className="font-serif italic font-normal text-editorial-200">Studio.</span>
            </h1>
          </div>
        </div>

        <label className="sr-only" htmlFor="owner-salon">Studio you manage</label>
        <select
          id="owner-salon"
          value={salon.id}
          onChange={(e) => setOwnedSalon(e.target.value)}
          className="w-full bg-editorial-800 border border-editorial-600 rounded-lg px-4 py-3 text-sm font-bold text-editorial-50 outline-none focus:border-brand-400 mb-4"
        >
          {SALONS.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <div className="flex gap-2">
          {(['sales', 'barbers', 'reviews'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-current={tab === t ? 'true' : undefined}
              className={`flex-1 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold transition-all ${
                tab === t ? 'bg-brand-500 text-white shadow-glow' : 'bg-editorial-800 border border-editorial-600 text-editorial-300 hover:bg-editorial-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" key={tab} className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 flex flex-col gap-5 pb-12">

        {tab !== 'reviews' && (
          <motion.div variants={item} className="flex gap-2">
            {([7, 30, 90] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                aria-current={range === r ? 'true' : undefined}
                className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold transition-all ${
                  range === r ? 'bg-editorial-50 text-editorial-900' : 'bg-editorial-800 border border-editorial-600 text-editorial-400'
                }`}
              >
                {r} days
              </button>
            ))}
          </motion.div>
        )}

        {/* ---------------------------------------------------------- SALES */}
        {tab === 'sales' && (
          <>
            <motion.div variants={item} className="grid grid-cols-2 gap-3">
              <Kpi label="Revenue" value={money(stats.revenue)} sub={`Last ${range} days`} delta={stats.delta} icon={Wallet} accent />
              <Kpi label="Appointments" value={String(stats.visits)} sub={`${stats.perDay.toFixed(1)} per day`} icon={Scissors} />
              <Kpi label="Average ticket" value={money(stats.avgTicket)} sub="Per completed visit" icon={TrendingUp} />
              <Kpi label="Rating" value={rating.average.toFixed(2)} sub={`${rating.ownCount} in-app review${rating.ownCount === 1 ? '' : 's'}`} icon={Star} />
            </motion.div>

            <motion.div variants={item} className="bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] p-5">
              <div className="flex justify-between items-baseline mb-5">
                <h2 className="font-mono text-[10px] uppercase tracking-widest font-bold text-editorial-400">Daily revenue</h2>
                <span className="font-mono text-[10px] text-editorial-500">peak {money(stats.peak)}</span>
              </div>
              {stats.revenue === 0 ? (
                <Empty text="No completed appointments in this window yet." />
              ) : (
                <div className="flex items-end gap-[3px] h-32" role="img" aria-label={`Daily revenue over the last ${range} days`}>
                  {stats.series.map((d) => (
                    <div key={d.key} className="flex-1 flex flex-col justify-end h-full group relative" title={`${d.label}: ${money(d.value)}`}>
                      <div
                        className="w-full rounded-t bg-brand-500/85 group-hover:bg-brand-400 transition-colors min-h-[2px]"
                        style={{ height: `${Math.max(2, (d.value / stats.peak) * 100)}%` }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between mt-2 font-mono text-[9px] text-editorial-500">
                <span>{stats.series[0]?.label}</span>
                <span>{stats.series[stats.series.length - 1]?.label}</span>
              </div>
            </motion.div>
          </>
        )}

        {/* -------------------------------------------------------- BARBERS */}
        {tab === 'barbers' && (
          <motion.div variants={item} className="bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] overflow-hidden">
            <div className="px-5 py-4 border-b border-editorial-700 flex items-center gap-2">
              <Users size={14} className="text-brand-400" />
              <h2 className="font-mono text-[10px] uppercase tracking-widest font-bold text-editorial-400">
                {staff.length} stylists · last {range} days
              </h2>
            </div>
            <div className="divide-y divide-editorial-700">
              {stats.perBarber.map((row, i) => (
                <div key={row.barber.id} className="px-5 py-4 flex items-center gap-4">
                  <span className="font-serif italic text-lg text-editorial-400 w-5 shrink-0">{i + 1}</span>
                  <div className="w-10 h-10 shrink-0 rounded border border-editorial-600 bg-editorial-900 flex items-center justify-center font-serif italic text-lg text-editorial-200">
                    {row.barber.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-editorial-50 tracking-tight truncate">{row.barber.name}</h3>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-editorial-400 truncate">
                      {row.barber.chair} · {row.visits} visit{row.visits === 1 ? '' : 's'}
                      {row.avg !== null && ` · ${row.avg.toFixed(1)}★ (${row.reviews})`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block font-mono text-sm font-bold text-editorial-100">{money(row.revenue)}</span>
                    <span className="font-mono text-[9px] text-editorial-500">
                      {stats.revenue ? Math.round((row.revenue / stats.revenue) * 100) : 0}% of takings
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* -------------------------------------------------------- REVIEWS */}
        {tab === 'reviews' && (
          <>
            <motion.div variants={item} className="bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] p-5 flex gap-6 items-center">
              <div className="text-center shrink-0">
                <span className="block font-serif italic text-4xl text-editorial-50 leading-none mb-1">{rating.average.toFixed(1)}</span>
                <div className="flex gap-0.5 justify-center mb-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={11} className={n <= Math.round(rating.average) ? 'text-brand-500' : 'text-editorial-600'} fill={n <= Math.round(rating.average) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-editorial-500">{rating.count} total</span>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                {distribution.map((d) => (
                  <div key={d.n} className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-editorial-400 w-3">{d.n}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-editorial-700 overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${salonReviews.length ? (d.count / salonReviews.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-editorial-500 w-6 text-right">{d.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {salonReviews.length === 0 ? (
              <motion.div variants={item}><Empty text="No reviews left in the app yet." /></motion.div>
            ) : (
              salonReviews.slice(0, 25).map((r) => (
                <motion.div key={r.id} variants={item} className="bg-editorial-800 border border-editorial-600 shadow-bento rounded-[1rem] p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-editorial-50 truncate">{r.authorName}</h3>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-editorial-400">
                        {r.barberName} · {new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={11} className={n <= r.rating ? 'text-brand-500' : 'text-editorial-600'} fill={n <= r.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                  {r.text && <p className="text-[13px] text-editorial-300 leading-relaxed mt-2">{r.text}</p>}
                </motion.div>
              ))
            )}
          </>
        )}

      </motion.div>
    </div>
  );
}

function Kpi({ label, value, sub, delta, icon: Icon, accent }: {
  label: string; value: string; sub: string; delta?: number | null; icon: any; accent?: boolean;
}) {
  return (
    <div className={`rounded-[1rem] p-4 border shadow-bento ${accent ? 'bg-brand-500 border-brand-500 text-white' : 'bg-editorial-800 border-editorial-600'}`}>
      <div className="flex items-center justify-between mb-3">
        <Icon size={14} className={accent ? 'text-white/70' : 'text-brand-400'} />
        {typeof delta === 'number' && (
          <span className={`flex items-center gap-0.5 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${
            accent ? 'bg-white/20 text-white' : delta >= 0 ? 'bg-emerald-500/15 text-emerald-500' : 'bg-red-500/15 text-red-500'
          }`}>
            {delta >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <span className={`block font-mono text-[9px] uppercase tracking-[0.2em] font-bold mb-1 ${accent ? 'text-white/70' : 'text-editorial-400'}`}>{label}</span>
      <span className={`block font-sans font-bold text-xl tracking-tight leading-none mb-1.5 ${accent ? 'text-white' : 'text-editorial-50'}`}>{value}</span>
      <span className={`block text-[10px] ${accent ? 'text-white/70' : 'text-editorial-400'}`}>{sub}</span>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="py-10 text-center bg-editorial-900/60 border border-editorial-700 rounded-[1rem]">
      <p className="text-xs text-editorial-400">{text}</p>
    </div>
  );
}
