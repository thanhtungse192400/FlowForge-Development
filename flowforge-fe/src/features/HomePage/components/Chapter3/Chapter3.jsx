import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedText from '../AnimatedText';
import './Chapter3.css';

export default function Chapter3() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  
  return (
    <div ref={container} className="fluid-chapter-3">
      {/* Immersive Parallax View */}
      <section className="immersive-section">
        <motion.div className="immersive-mask" style={{ y: imgY }}>
          <img 
            src="https://images.unsplash.com/photo-1548171915-e7af5eb0bcda?auto=format&fit=crop&w=1920&q=80" 
            alt="Intricate Mechanics" 
            className="hover-target" 
          />
        </motion.div>
        
        <div className="immersive-overlay">
          <AnimatedText 
            className="immersive-text"
            text="TIMELESS ELEGANCE" 
          />
        </div>
      </section>

      {/* Grid Specs */}
      <section className="specs-section">
        <div className="specs-grid">
          {[
            { tag: "Sapphire Crystal", d: "Absolute scratch resistance with triple-layer AR coating." },
            { tag: "Titanium Grade 5", d: "Aerospace-grade ultra-lightweight and durable casing." },
            { tag: "Tourbillon", d: "Defying gravity to maintain the heart's ultimate precision." },
            { tag: "200 BAR Water", d: "Enduring extreme pressure for the deepest explorations." }
          ].map((item, id) => (
             <div className="spec-item" key={id}>
               <motion.div 
                 className="spec-line" 
                 initial={{ width: 0 }} 
                 whileInView={{ width: "100%" }} 
                 transition={{ duration: 1, ease: "easeOut", delay: id * 0.1 }}
                 viewport={{ once: false, margin: "-10%" }}
               />
               <div className="spec-content">
                 <motion.h3 
                   initial={{ opacity: 0, y: 30 }} 
                   whileInView={{ opacity: 1, y: 0 }} 
                   transition={{ duration: 0.8, delay: id * 0.1 }}
                   viewport={{ once: false }}
                 >
                   {item.tag}
                 </motion.h3>
                 <motion.p
                   initial={{ opacity: 0 }} 
                   whileInView={{ opacity: 1 }} 
                   transition={{ duration: 0.8, delay: (id * 0.1) + 0.3 }}
                   viewport={{ once: false }}
                 >
                   {item.d}
                 </motion.p>
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* Huge Footer Area */}
      <footer className="fluid-footer">
        <div className="footer-content">
          <motion.div 
            initial={{ opacity: 0, y: 100 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            viewport={{ once: false }}
          >
            <h2 className="footer-contact hover-target">FLOWFORGE</h2>
          </motion.div>
          <div className="footer-links">
            <a href="#" className="hover-target">Boutique</a>
            <a href="#" className="hover-target">Concierge</a>
            <a href="#" className="hover-target">Instagram</a>
            <Link to="https://www.facebook.com/tung.tran.327263" className="hover-target">Facebook</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
