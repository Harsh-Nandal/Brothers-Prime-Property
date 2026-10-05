'use client';

/** Floating WhatsApp button with a pulse ring (CSS) and an entrance spring. */
import { motion } from 'framer-motion';
import { whatsappLink } from '@/lib/site';
import { WhatsApp } from '@/components/Icons';

export default function WhatsAppButton() {
  return (
    <motion.a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="wa"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, rotate: -90, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 3.4 }}
      whileHover={{ scale: 1.1, rotate: 6 }}
      whileTap={{ scale: 0.92 }}
    >
      <WhatsApp />
      <span className="wa__tip">Chat on WhatsApp</span>
    </motion.a>
  );
}
