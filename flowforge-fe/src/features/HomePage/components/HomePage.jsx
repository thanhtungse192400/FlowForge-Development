import React from 'react';
import Chapter1 from './Chapter1/Chapter1';
import Chapter2 from './Chapter2/Chapter2';
import './HomePage.css';
import Header from '../../../shared/components/Header/Header';

export default function HomePage() {
  return (
    <div className="home-page-wrapper">
      <Header />
      <div className="home-page-container">
        {/* Chapter 1: Genesis — Hero with Parallax */}
        <Chapter1 />

        {/* Chapter 2: The Arsenal — Features Showcase */}
        <Chapter2 />

        {/* Chapter 3: To be implemented */}
      </div>
    </div>
  );
}