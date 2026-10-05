'use client';

/**
 * FeatureFlipCard — 3D flip on hover / keyboard focus / tap (touch).
 * Front: icon + title. Back: navy glass with the description.
 */
import { useState } from 'react';
import { iconMap } from '@/components/Icons';

export default function FeatureFlipCard({ feature }) {
  const [flipped, setFlipped] = useState(false);
  const Icon = iconMap[feature.icon];
  return (
    <div
      className={`flip${flipped ? ' is-flipped' : ''}`}
      tabIndex={0}
      role="group"
      aria-label={`${feature.title}: ${feature.back}`}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setFlipped((f) => !f))}
    >
      <div className="flip__inner">
        <div className="flip__face flip__front">
          <div className="flip__icon">{Icon && <Icon />}</div>
          <div>
            <h3>{feature.title}</h3>
            <p style={{ margin: 0, color: 'var(--muted)' }}>{feature.front}</p>
            <p className="flip__hint" style={{ margin: '14px 0 0' }}>
              Hover to flip ↻
            </p>
          </div>
        </div>
        <div className="flip__face flip__back">
          <div className="flip__icon" style={{ background: 'rgba(255,212,103,0.12)' }}>
            {Icon && <Icon />}
          </div>
          <div>
            <h3 style={{ color: 'var(--gold-300)' }}>{feature.title}</h3>
            <p>{feature.back}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
