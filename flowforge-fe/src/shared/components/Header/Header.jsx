import React, { useState, useEffect } from 'react';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  // Thêm background/shadow khi scroll xuống
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`global-header ${scrolled ? 'scrolled' : ''}`}>
      {/* Brand / Logo */}
      <a href="/" className="header-logo">
        <div className="logo-icon">
          <div className="logo-inner"></div>
        </div>
        <div className="logo-text">
          Flow<span className="logo-text-accent">Forge</span>
        </div>
      </a>

      {/* Navigation */}
      <nav className="header-nav">
        <a href="#features" className="nav-link">Features</a>
        <a href="#solutions" className="nav-link">Solutions</a>
        <a href="#developers" className="nav-link">Developers</a>
        <a href="#pricing" className="nav-link">Pricing</a>
      </nav>

      {/* Actions */}
      <div className="header-actions">
        <button className="btn-login">Log In</button>
        <button className="btn-get-started">
          <span>Get Started Free</span>
        </button>
      </div>

      {/* Mobile Toggle */}
      <button className="mobile-menu-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </header>
  );
}
