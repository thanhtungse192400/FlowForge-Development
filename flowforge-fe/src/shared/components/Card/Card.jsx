import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

function Card({ children, variant = 'default', glow = false, className = '', delay = 0, ...props }) {
  const cardClass = `global-card card-${variant} ${glow ? 'card-glow' : ''} ${className}`;
  return (
    <motion.div
      className={cardClass}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      {...props}
    >
      {/* Glass border glow layer */}
      <div className="card-glow-border" />
      {children}
    </motion.div>
  );
}

export default Card;
