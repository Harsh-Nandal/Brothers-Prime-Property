'use client';

/**
 * PlotLayout3D — drag-to-rotate 3D plot layout with a details side panel.
 * WebGL on capable devices (lazy-loaded when scrolled near); otherwise an
 * isometric CSS-3D grid that is just as clickable. Selecting a plot shows its
 * status and a WhatsApp link pre-filled with the plot number.
 */
import { useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useCapabilities, useInView } from '@/lib/useCapabilities';
import { whatsappLink } from '@/lib/site';
import { WhatsApp } from '@/components/Icons';

const PlotScene = dynamic(() => import('@/components/three/PlotScene'), { ssr: false });

const STATUS = {
  available: { color: '#f2a900', label: 'Available' },
  hold: { color: '#8fa3bf', label: 'On Hold' },
  sold: { color: '#1b3a5e', label: 'Sold' },
};

export default function PlotLayout3D({ layout, projectName }) {
  const caps = useCapabilities();
  const stage = useRef(null);
  const near = useInView(stage, '300px');
  const [selectedId, setSelectedId] = useState(null);

  const counts = useMemo(() => {
    const c = { available: 0, hold: 0, sold: 0 };
    layout.plots.forEach((p) => (c[p.status] += 1));
    return c;
  }, [layout]);

  const selected = layout.plots.find((p) => p.id === selectedId);
  // WebGL on high + low tiers (it is a light scene); CSS isometric fallback otherwise
  const webgl = caps.ready && caps.tier !== 'off';

  return (
    <div className="layout3d">
      <div ref={stage} className="layout3d__stage" aria-label={`Interactive plot layout for ${projectName}`}>
        {webgl ? (
          near && <PlotScene layout={layout} selectedId={selectedId} onSelect={setSelectedId} active={near} />
        ) : (
          <div className="iso">
            <div className="iso__grid" style={{ gridTemplateColumns: `repeat(${layout.cols}, auto)` }}>
              {layout.plots.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="iso__plot"
                  style={{ background: STATUS[p.status].color, opacity: p.status === 'sold' ? 0.75 : 1, color: p.status === 'sold' ? '#c9d3e1' : undefined }}
                  aria-pressed={selectedId === p.id}
                  aria-label={`Plot ${p.id}, ${STATUS[p.status].label}`}
                  onClick={() => setSelectedId(p.id)}
                >
                  {p.id}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="layout3d__hint">{webgl ? 'Drag to rotate · Tap a plot' : 'Tap a plot for details'}</div>
      </div>

      <div className="glass glass--light layout3d__side">
        <div>
          <span className="eyebrow" style={{ marginBottom: 8 }}>
            Plot availability
          </span>
          <h3 className="h-md" style={{ marginBottom: 0 }}>
            Layout Plan
          </h3>
        </div>

        <div className="legend" aria-label="Legend">
          {Object.entries(STATUS).map(([k, v]) => (
            <span key={k}>
              <i style={{ background: v.color }} /> {v.label} <b>({counts[k]})</b>
            </span>
          ))}
        </div>

        <div className="plot-card" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div style={{ fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold-700)' }}>Selected plot</div>
                <b>{selected.id}</b>
                <div style={{ margin: '4px 0 12px', color: 'var(--muted)' }}>
                  Status: <strong style={{ color: 'var(--ink)' }}>{STATUS[selected.status].label}</strong>
                </div>
                {selected.status !== 'sold' ? (
                  <a
                    className="btn btn--gold btn--sm"
                    href={whatsappLink(`Hello, I am interested in Plot ${selected.id} at ${projectName}. Please share size, price and availability.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsApp width={18} height={18} /> Enquire about {selected.id}
                  </a>
                ) : (
                  <span style={{ color: 'var(--muted)' }}>This plot has been sold. Ask us about similar plots.</span>
                )}
              </motion.div>
            ) : (
              <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ margin: 0, color: 'var(--muted)' }}>
                Select a plot on the diagram to see its status and enquire about it directly.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <p style={{ margin: 0, fontSize: '.8rem', color: 'var(--muted)' }}>
          Diagram is illustrative and not to scale. Plot sizes, prices and availability are confirmed by our team.
        </p>
      </div>
    </div>
  );
}
