import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedText from '../AnimatedText';
import './Chapter1.css';

export default function Chapter1() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"]
  });
  
  // Hero Typography
  const heroY = useTransform(scrollYProgress, [0, 1], ["0vh", "60vh"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Background Parallax for ambient video behind CHRONOS
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Image mask reveal and parallax
  const imageClip = useTransform(scrollYProgress, [0, 0.6], ["inset(60% 40% 40% 40%)", "inset(0% 0% 0% 0%)"]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["30%", "-10%"]);

  return (
    <div ref={container} className="fluid-chapter-1 relative-z-index">
      
      {/* 1. Hero Title Fixed relative to container scroll */}
      <motion.div 
        className="hero-title-container flex-center"
      >
        {/* =========================================================
            Sử dụng URL trực tiếp từ Cloudinary để background video chạy trơn tru
            Mã cloudName: dsbtbnme2 | publicId: 268528_small_k9wjjb
            ========================================================= */}
        <motion.video 
          className="hero-ambient-video"
          src="https://res.cloudinary.com/dsbtbnme2/video/upload/q_auto,f_auto/268528_small_k9wjjb.mp4"
          autoPlay loop muted playsInline
          style={{ y: bgY, opacity: heroOpacity }}
        />
        <div className="hero-ambient-overlay"></div>

        <motion.h1 
          className="hero-massive-text"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >
          CHRONOS
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="scroll-indicator"
          style={{ opacity: heroOpacity }}
        >
          <span className="scroll-line"></span>
          <span>SCROLL</span>
        </motion.div>
      </motion.div>

      {/* 2. Fluid Image Zoom Mask */}
      

      {/* 3. Statement / Introduction Typography */}
      <section className="fluid-section text-statement-section flex-center">
        <div className="statement-wrapper">
          <p className="statement-sub">EST. 1958</p>
          <AnimatedText 
            className="statement-main"
            text="Crafted for teams. Guided by clarity.An intersection of structured workflows and fluid collaboration, designed to turn complexity into seamless execution."
          />
        </div>
      </section>

    </div>
  );
}
