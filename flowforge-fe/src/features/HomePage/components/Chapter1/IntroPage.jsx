import React, { useState, useEffect } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import "./IntroPage.css";

// ==========================================
// ANIMATION TIMING CONTROL CENTER
// Edit these values (in seconds) to fine-tune the intro experience
// ==========================================
const LOADING_DURATION    = 2.5; // (1) Circle progress 0-100%
const LIFT_UP_DURATION    = 0.8; // (2) Text lifts up + grows slightly
const HOLD_DURATION       = 0.8; // (3) <<< EDIT HERE: How long to pause before the dimension warp
const WARP_ZOOM_DURATION  = 1.7; // (4) Sci-Fi zoom into the text

// --- Auto-calculated timeline (do not edit) ---
const TOTAL_DUR = LOADING_DURATION + LIFT_UP_DURATION + HOLD_DURATION + WARP_ZOOM_DURATION;
const t1 = LOADING_DURATION / TOTAL_DUR;
const t2 = (LOADING_DURATION + LIFT_UP_DURATION) / TOTAL_DUR;
const t3 = (LOADING_DURATION + LIFT_UP_DURATION + HOLD_DURATION) / TOTAL_DUR;
const TIMELINE = [0, t1, t2, t3, 1];


export default function IntroPage({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  
  const count = useMotionValue(0);
  const pathLength = useTransform(count, [0, 100], [0, 1]);

  useEffect(() => {
    const animation = animate(count, 100, { duration: LOADING_DURATION, ease: "easeInOut" });
    return animation.stop;
  }, [count]);

  if (!isVisible) return null;

  return (
    <>
      {/* LAYER 1: Blend-mode text layer (shows video through the letters) */}
      <motion.div
        className="intro-overlay premium-mix-blend"
        animate={{ 
          opacity: [1, 1, 1, 1, 0],
          scale: [1, 1, 1.5, 1.5, 400],
          y: ["0vh", "0vh", "-10vh", "-10vh", "-10vh"],
          x: ["0vw", "0vw", "-2.75vw", "-2.75vw", "-2.75vw"]
        }}
        transition={{ 
          duration: TOTAL_DUR, 
          times: TIMELINE, 
          ease: ["linear", "easeOut", "linear", "circIn"] 
        }}
        onAnimationComplete={() => {
          setIsVisible(false);
          if (onComplete) onComplete();
        }}
      >
        <div className="intro-content">
          {/* Invisible spacer matching icon size */}
          <div className="intro-icon-wrapper" style={{ opacity: 0 }}></div>
          <h1 className="intro-zoomin-text">FLOWFORGE</h1>
        </div>
      </motion.div>

      {/* LAYER 2: Solid layer for the loading icon (no blend, stays opaque) */}
      <motion.div
        className="intro-overlay-solid"
        animate={{ 
          opacity: [1, 1, 1, 1, 0],
          scale: [1, 1, 1.5, 1.5, 400],
          y: ["0vh", "0vh", "-10vh", "-10vh", "-10vh"],
          x: ["0vw", "0vw", "-2.75vw", "-2.75vw", "-2.75vw"]
        }}
        transition={{ 
          duration: TOTAL_DUR, 
          times: TIMELINE, 
          ease: ["linear", "easeOut", "linear", "circIn"] 
        }}
      >
        <div className="intro-content">
          <motion.div 
            className="intro-icon-wrapper"
            initial={{ opacity: 1, filter: "blur(0px)" }}
            animate={{ opacity: 0, filter: "blur(10px)", scale: 0.8 }}
            transition={{ delay: LOADING_DURATION, duration: 1, ease: "easeOut" }}
          >
            <svg viewBox="0 0 100 100" className="intro-loading-svg">
              <circle cx="50" cy="50" r="48" stroke="rgba(0,0,0,0.15)" strokeWidth="4" fill="none" />
              <motion.circle 
                cx="50" cy="50" r="48" 
                stroke="#000" 
                strokeWidth="4" 
                fill="none" 
                style={{ pathLength }} 
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          {/* Invisible text spacer (real text is on Layer 1) */}
          <h1 className="intro-zoomin-text" style={{ opacity: 0 }}>FLOWFORGE</h1>
        </div>
      </motion.div>
    </>
  );
}