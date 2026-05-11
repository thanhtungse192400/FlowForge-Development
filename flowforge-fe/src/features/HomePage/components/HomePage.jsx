import React, { useState } from 'react';
import Chapter1 from './Chapter1/Chapter1';
import Chapter2 from './Chapter2/Chapter2';
import Chapter3 from './Chapter3/Chapter3';
import './HomePage.css';
import useSmoothScoll from '../../../shared/hooks/useSmoothScoll';
import CustomCursor from './CustomCursor';
import IntroPage from './Chapter1/IntroPage';

export default function HomePage() {
  // Only show intro on first visit per browser session
  const hasSeenIntro = sessionStorage.getItem('intro_done') === 'true';
  const [isIntroDone, setIsIntroDone] = useState(hasSeenIntro);

  const handleIntroComplete = () => {
    sessionStorage.setItem('intro_done', 'true');
    setIsIntroDone(true);
  };
  
  useSmoothScoll();

  return (
    <div className="fluid-wrapper">
      {!isIntroDone && <IntroPage onComplete={handleIntroComplete} />}
      <CustomCursor />
      <main className="fluid-main">
        <Chapter1 />
        <Chapter2 />
        <Chapter3 />
      </main>

      {/* Floating Header Navigation (fluid.glass style minimal nav) */}
      <nav className="fluid-header">
        <div className="fluid-header-left">
          <a href="#" className="brand-logo">CHRONOS</a>
        </div>
        <div className="fluid-header-right">
          <a href="#">Collection</a>
          <a href="#">Philosophy</a>
          <a href="#">Boutiques</a>
          <a href="#">Cart (0)</a>
        </div>
      </nav>

    </div>
  );
}