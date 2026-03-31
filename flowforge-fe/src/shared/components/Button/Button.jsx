import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

function Button({ children, variant = 'primary', size = 'md', className = '', icon, ...props }) {
  const btnClass = `global-btn btn-${variant} btn-${size} ${className}`;
  return (
    <motion.button
      className={btnClass}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </motion.button>
  );
}

export default Button;
