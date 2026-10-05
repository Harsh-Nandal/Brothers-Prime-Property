/**
 * POST /api/enquiry
 *
 * Validates an enquiry from the contact / hero form and stores it:
 *   1. Appends it to data/enquiries.jsonl (best-effort — works on any Node host
 *      with a writable disk, such as Hostinger Node.js hosting)
 *   2. Optionally forwards it to ENQUIRY_WEBHOOK_URL (Zapier, Make, Slack, Google
 *      Apps Script, your CRM...) if that env var is set
 *   3. Always logs it to the server console
 *
 * Includes a honeypot field and a small in-memory rate limiter.
 */
import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// --- tiny in-memory rate limit: 5 requests / 10 minutes / IP -----------------
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field. Pretend success to bots.
  if (body.company) return NextResponse.json({ ok: true });

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429 },
    );
  }

  const enquiry = {
    name: clean(body.name, 80),
    phone: clean(body.phone, 20),
    email: clean(body.email, 120),
    interest: clean(body.interest, 120),
    message: clean(body.message, 1000),
    source: clean(body.source, 60),
    createdAt: new Date().toISOString(),
  };

  // --- validation ------------------------------------------------------------
  const errors = {};
  if (enquiry.name.length < 2) errors.name = 'Please enter your name.';
  if (!/^[+()\d\s-]{7,20}$/.test(enquiry.phone)) errors.phone = 'Please enter a valid phone number.';
  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) errors.email = 'Please enter a valid email.';
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  console.log('[enquiry]', JSON.stringify(enquiry));

  // --- store (best effort) ---------------------------------------------------
  try {
    const dir = path.join(process.cwd(), 'data');
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(path.join(dir, 'enquiries.jsonl'), JSON.stringify(enquiry) + '\n', 'utf8');
  } catch (err) {
    console.warn('[enquiry] could not write to disk:', err?.message);
  }

  // --- forward to webhook (optional) ----------------------------------------
  const hook = process.env.ENQUIRY_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry),
      });
    } catch (err) {
      console.warn('[enquiry] webhook failed:', err?.message);
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}
