import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Antigravity from '../styles/AntiGravity';
import './Chapter1.css';

export default function Chapter1() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms — each layer moves at a different speed
  const nebulaY = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.92]);
  const float1Y = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const float2Y = useTransform(scrollYProgress, [0, 1], [0, -320]);
  const float3Y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const float4Y = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const float5Y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  const metrics = [
    { value: '10K+', label: 'Workflows', icon: '⚡' },
    { value: '99.9%', label: 'Uptime', icon: '🟢' },
    { value: '500+', label: 'Integrations', icon: '🔗' },
    { value: '<50ms', label: 'Latency', icon: '🚀' },
  ];

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section ref={sectionRef} className="ch1-hero" id="hero">
      {/* === PARALLAX BACKGROUND LAYERS === */}

      {/* Layer 0: Nebula glow blobs (slowest) */}
      <motion.div className="ch1-bg-layer ch1-nebula" style={{ y: nebulaY }} />

      {/* Layer 1: Extra glow orbs */}
      <div className="ch1-glow-orb ch1-glow-orb-1" />
      <div className="ch1-glow-orb ch1-glow-orb-2" />

      {/* Layer 2: Dot grid overlay */}
      <motion.div className="ch1-grid-overlay" style={{ opacity: gridOpacity }} />

      {/* Layer 3: Scanning light */}
      <div className="ch1-scan-line" />

      {/* Layer 4: AntiGravity Particles */}
      <div className="ch1-particles-layer">
        <Antigravity
          count={250}
          color="#8b5cf6"
          particleSize={1.2}
          autoAnimate
          magnetRadius={18}
          ringRadius={14}
          waveSpeed={0.25}
          waveAmplitude={1.8}
          particleShape="capsule"
          depthFactor={0.8}
          lerpSpeed={0.06}
          rotationSpeed={0.15}
        />
      </div>

      {/* === FLOATING DECORATIVE SHAPES === */}
      <motion.div className="ch1-float ch1-float-1" style={{ y: float1Y }}>
        <div className="ch1-glass-shape ch1-hexagon" />
      </motion.div>
      <motion.div className="ch1-float ch1-float-2" style={{ y: float2Y }}>
        <div className="ch1-glass-shape ch1-circle" />
      </motion.div>
      <motion.div className="ch1-float ch1-float-3" style={{ y: float3Y }}>
        <div className="ch1-glass-shape ch1-diamond" />
      </motion.div>
      <motion.div className="ch1-float ch1-float-4" style={{ y: float4Y }}>
        <div className="ch1-glass-shape ch1-ring" />
      </motion.div>
      <motion.div className="ch1-float ch1-float-5" style={{ y: float5Y }}>
        <div className="ch1-glass-shape ch1-dot-cluster" />
      </motion.div>

      {/* === MAIN CONTENT (parallax foreground) === */}
      <motion.div
        className="ch1-content"
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
      >
        {/* Badge */}
        <motion.div
          className="ch1-badge"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          <span className="ch1-badge-dot" />
          <span>Next-Gen Workflow Platform</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="ch1-title"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
        >
          <span className="ch1-title-line">Build the</span>
          <span className="ch1-title-gradient">Impossible</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="ch1-subtitle"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
        >
          Orchestrate complex workflows, automate decisions with intelligent
          rules, and connect everything — all from one powerful platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="ch1-cta-group"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.8}
        >
          <button className="ch1-btn ch1-btn-primary" id="cta-get-started">
            <span>Get Started Free</span>
            <span className="ch1-btn-glow" />
          </button>
          <button className="ch1-btn ch1-btn-secondary" id="cta-watch-demo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Watch Demo</span>
          </button>
        </motion.div>

        {/* Metrics Bar */}
        <motion.div
          className="ch1-metrics"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.0}
        >
          {metrics.map((m, i) => (
            <div key={i} className="ch1-metric-item">
              <span className="ch1-metric-icon">{m.icon}</span>
              <span className="ch1-metric-value">{m.value}</span>
              <span className="ch1-metric-label">{m.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* === SCROLL INDICATOR === */}
      <motion.div
        className="ch1-scroll-indicator"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
      >
        <div className="ch1-scroll-mouse">
          <div className="ch1-scroll-wheel" />
        </div>
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  );
}
