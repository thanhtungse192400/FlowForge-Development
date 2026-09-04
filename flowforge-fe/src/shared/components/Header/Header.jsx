import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../features/auth';
import authService from '../../../features/auth/services/authService';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  console.log(user);
  

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout failed:', e);
    } finally {
      logout();
      setIsMenuOpen(false);
      navigate('/');
    }
  };

  return (
    <nav className="fluid-header">
      <div className="fluid-header-left">
        <Link to="/" className="brand-logo">
          CHRONOS
        </Link>
      </div>

      <div className="fluid-header-right">
        <div className="nav-container-wrapper">
          <AnimatePresence>
            {!isMenuOpen && (
              <motion.div
                key="header-nav"
                className="nav-links-container"
                initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 50, filter: 'blur(4px)', width: 0, overflow: 'hidden' }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                {!user ? (
                  <>
                    <Link to="/Workspace">Workspace</Link>
                    
                  </>
                ) : (
                  <>
                  <span className="welcome-text"></span>
                    <Link to="/Workspace">Workspace</Link>
                    <Link to="/#">Donate Money pls </Link>
                    <Link to="/profile">Profile</Link>
                    <button className="nav-logout-btn" onClick={handleLogout}>Sign Out</button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {!user ? (
            <Link to="/login" className="nav-auth-link">Login</Link>
          ) : (
            <div className="user-menu-container">
              <button 
                className={`user-avatar-header ${isMenuOpen ? 'avatar-active' : ''}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title={user.name || user.email}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}