// src/components/Shared/Popup.jsx
import React, { useEffect } from 'react';
import './Popup.css';

export default function Popup({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`popup-overlay ${type}`}>
      <div className="popup-content">
        <p>{message}</p>
      </div>
    </div>
  );
}