import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Chapter1 from './Chapter1/Chapter1';
import Chapter2 from './Chapter2/Chapter2';
import Chapter3 from './Chapter3/Chapter3';

import './HomePage.css';

import IntroPage from './Chapter1/IntroPage';

export default function HomePage() {

  // Only show intro on first visit per browser session
  const hasSeenIntro =
    sessionStorage.getItem('intro_done') === 'true';

  const [isIntroDone, setIsIntroDone] =
    useState(hasSeenIntro);

  const handleIntroComplete = () => {
    sessionStorage.setItem('intro_done', 'true');
    setIsIntroDone(true);
  };

  return (
    <div className="fluid-wrapper">

      {!isIntroDone &&
        <IntroPage onComplete={handleIntroComplete} />
      }

      <main className="fluid-main">
        <Chapter1 />
        <Chapter2 />
        <Chapter3 />
      </main>

    </div>
  );
}