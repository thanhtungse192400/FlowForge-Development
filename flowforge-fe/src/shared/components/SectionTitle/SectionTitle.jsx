import React from 'react';
import { motion } from 'framer-motion';
import './SectionTitle.css';

function SectionTitle({ badge, title, subtitle, align = 'center' }) {
  return (
    <motion.div
      className={`section-title-wrapper align-${align}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {badge && (
        <span className="section-badge">{badge}</span>
      )}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </motion.div>
  );
}

export default SectionTitle;
