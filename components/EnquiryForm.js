'use client';

/**
 * EnquiryForm — glass enquiry form that posts to /api/enquiry.
 * Props:
 *   variant   'dark' (glass on navy) | 'light'
 *   title / subtitle  heading copy
 *   interest  pre-selected project name
 *   source    where the form lives (saved with the enquiry)
 *   floating  adds the gentle floating + glow animation (hero)
 * Success state: animated gold check + confetti burst + WhatsApp follow-up.
 */
import { useId, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects } from '@/lib/projects';
import { whatsappLink } from '@/lib/site';
import { WhatsApp } from '@/components/Icons';

const COLORS = ['#ffd467', '#f2a900', '#c98400', '#faf7f0', '#8fa3bf'];

function Confetti() {
  // deterministic pieces (no Math.random during render → stable on re-render)
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const a = (i / 30) * Math.PI * 2 + (i % 3) * 0.2;
        const d = 90 + ((i * 37) % 90);
        return {
          x: Math.cos(a) * d,
          y: Math.sin(a) * d - 40,
          r: ((i * 53) % 540) - 270,
          c: COLORS[i % COLORS.length],
          s: 0.7 + ((i * 7) % 6) / 10,
        };
      }),
    [],
  );
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <motion.i
          key={i}
          style={{ background: p.c, scale: p.s }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 120], opacity: [1, 1, 0], rotate: p.r }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 0.15 }}
        />
      ))}
    </div>
  );
}

export default function EnquiryForm({
  variant = 'dark',
  title = 'Get a Free Callback',
  subtitle = 'Tell us what you are looking for — we will get back to you shortly.',
  interest = '',
  source = 'website',
  floating = false,
  compact = false,
  className = '',
}) {
  const uid = useId();
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [sentName, setSentName] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    data.source = source;

    // light client-side validation (server validates again)
    const errs = {};
    if (!data.name || data.name.trim().length < 2) errs.name = 'Please enter your name.';
    if (!/^[+()\d\s-]{7,20}$/.test(data.phone || '')) errs.phone = 'Enter a valid phone number.';
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Enter a valid email.';
    setErrors(errs);
    setServerError('');
    if (Object.keys(errs).length) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setSentName(data.name.split(' ')[0]);
        setStatus('success');
        form.reset();
      } else {
        if (json.errors) setErrors(json.errors);
        setServerError(json.error || 'Something went wrong. Please try again or contact us on WhatsApp.');
        setStatus('error');
      }
    } catch {
      setServerError('Network error. Please try again or contact us on WhatsApp.');
      setStatus('error');
    }
  };

  const id = (n) => `${uid}-${n}`;
  const wrapper = (
    <div className={`glass ${variant === 'light' ? 'glass--light' : ''} enquiry ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div
            key="ok"
            className="success"
            role="status"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <Confetti />
            <svg viewBox="0 0 96 96" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id={id('g')} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffd467" />
                  <stop offset="1" stopColor="#c98400" />
                </linearGradient>
              </defs>
              <motion.circle
                cx="48"
                cy="48"
                r="42"
                stroke={`url(#${id('g')})`}
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
              <motion.path
                d="M28 50l14 14 27-30"
                stroke={`url(#${id('g')})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.55, ease: 'easeOut' }}
              />
            </svg>
            <h3>Thank you{sentName ? `, ${sentName}` : ''}!</h3>
            <p style={{ margin: 0, color: variant === 'light' ? 'var(--muted)' : '#b9c6d8' }}>
              Your enquiry has been received. Our team will contact you shortly.
            </p>
            <a
              className="btn btn--gold btn--sm"
              style={{ marginTop: 14 }}
              href={whatsappLink('Hello, I just sent an enquiry on your website.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsApp width={18} height={18} /> Continue on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              style={{ background: 'none', border: 0, color: 'inherit', opacity: 0.7, textDecoration: 'underline', marginTop: 6 }}
            >
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Enquiry form"
          >
            <h3>{title}</h3>
            <p className="enquiry__sub">{subtitle}</p>

            <div className="field">
              <label htmlFor={id('name')}>Full name</label>
              <input id={id('name')} name="name" autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? id('name-e') : undefined} />
              {errors.name && (
                <span id={id('name-e')} className="field__error">
                  {errors.name}
                </span>
              )}
            </div>

            <div className={compact ? undefined : 'field-row'}>
              <div className="field">
                <label htmlFor={id('phone')}>Phone</label>
                <input id={id('phone')} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 …" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? id('phone-e') : undefined} />
                {errors.phone && (
                  <span id={id('phone-e')} className="field__error">
                    {errors.phone}
                  </span>
                )}
              </div>
              {!compact && (
              <div className="field">
                <label htmlFor={id('email')}>Email (optional)</label>
                <input id={id('email')} name="email" type="email" autoComplete="email" placeholder="you@email.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? id('email-e') : undefined} />
                {errors.email && (
                  <span id={id('email-e')} className="field__error">
                    {errors.email}
                  </span>
                )}
              </div>
              )}
            </div>

            {!compact && (
            <div className="field">
              <label htmlFor={id('interest')}>Interested in</label>
              <select id={id('interest')} name="interest" defaultValue={interest}>
                <option value="">Any project</option>
                {projects.map((p) => (
                  <option key={p.slug} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            )}

            {!compact && (
            <div className="field">
              <label htmlFor={id('message')}>Message (optional)</label>
              <textarea id={id('message')} name="message" rows={3} placeholder="Plot size, budget, questions…" />
            </div>
            )}

            {/* honeypot — hidden from people, bots fill it in */}
            <div className="hp" aria-hidden="true">
              <label htmlFor={id('company')}>Company</label>
              <input id={id('company')} name="company" tabIndex={-1} autoComplete="off" />
            </div>

            <button type="submit" className="btn btn--gold" style={{ width: '100%' }} disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Request Callback'}
            </button>
            {serverError && (
              <div className="form-error" role="alert">
                {serverError}
              </div>
            )}
            <p className="enquiry__note">We respect your privacy. No spam, ever.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );

  if (!floating) return wrapper;
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      style={{ filter: 'drop-shadow(0 0 40px rgba(242,169,0,0.18))' }}
    >
      {wrapper}
    </motion.div>
  );
}
