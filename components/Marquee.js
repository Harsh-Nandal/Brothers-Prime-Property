/**
 * Marquee — infinite gold-on-navy strip. Pure CSS animation (transform only),
 * pauses on hover. The list is duplicated so the loop is seamless.
 */
import { Diamond } from '@/components/Icons';
import { marqueeWords } from '@/lib/site';

export default function Marquee({ words = marqueeWords, reverse = false }) {
  const row = (key, hidden) => (
    <div className="marquee__item" key={key} aria-hidden={hidden || undefined}>
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 34 }}>
          {w}
          <Diamond />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee${reverse ? ' marquee--reverse' : ''}`} role="marquee" aria-label={words.join(', ')}>
      <div className="marquee__track">
        {row('a', false)}
        {row('b', true)}
        {row('c', true)}
        {row('d', true)}
      </div>
    </div>
  );
}
