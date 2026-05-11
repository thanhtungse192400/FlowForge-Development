import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedText from '../AnimatedText';
import './Chapter2.css';

export default function Chapter2() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: container,
    offset: ["start end", "end start"]
  });

  // Marquee scroll effect
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  
  // Image parallax
  const img1Y = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);
  const img2Y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <div ref={container} className="fluid-chapter-2">
      <section className="manifesto-section">
        <div className="manifesto-left">
          <AnimatedText 
            className="manifesto-title" 
            text="CRAFTED FOR TEAMATES" 
            once={false}
          />
        </div>
        <div className="manifesto-right">
          <div className="img-block img-block-1 hover-target">
            <motion.div className="img-mask premium-shadow" style={{ y: img1Y }}>
              <img 
                src="https://res.cloudinary.com/dsbtbnme2/image/upload/v1775028411/samuelfjohanns-pen-4163403_1280_uhhvxh.jpg" 
                alt="Movement Mechanics"
              />
            </motion.div>
          </div>
          
          <div className="img-block img-block-2 hover-target">
            <motion.div className="img-mask premium-shadow" style={{ y: img2Y }}>
              <img 
                src="https://res.cloudinary.com/dsbtbnme2/image/upload/v1775028899/gosiak1980-flowers-9115519_1280_mjqr9z.jpg" 
                alt="Watch Dial"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Large Stroke Marquee typical of awwwards sites */}
      <section className="marquee-wrapper">
        <motion.div className="marquee-inner" style={{ x: marqueeX }}>
          <span>ETERNITY</span><span className="stroke-text">PRECISION</span><span>LUXURY</span><span className="stroke-text">HERITAGE</span>
          <span>ETERNITY</span><span className="stroke-text">PRECISION</span><span>LUXURY</span><span className="stroke-text">HERITAGE</span>
        </motion.div>
      </section>
    </div>
  );
}
