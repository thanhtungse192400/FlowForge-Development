import { useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Chapter2.css';

// Images
import cardWorkflow from '../../../../assets/card_workflow.png';
import cardRules from '../../../../assets/card_rules.png';
import cardIntegrations from '../../../../assets/card_integrations.png';
import cardAnalytics from '../../../../assets/card_analytics.png';

// ────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────

const FEATURES = [
  {
    id: 'workflow',
    title: 'Workflow Engine',
    desc: 'Design, execute, and monitor complex business processes with our visual drag-and-drop workflow builder. Supports conditional branching, parallel execution, and real-time state tracking.',
    image: cardWorkflow,
    icon: '⚙️',
    iconClass: '',
    size: 'large',
    tags: [
      { text: 'Visual Builder', cls: '' },
      { text: 'BPMN 2.0', cls: 'ch2-tag-cyan' },
      { text: 'Real-time', cls: 'ch2-tag-emerald' },
    ],
  },
  {
    id: 'rules',
    title: 'Rule Engine',
    desc: 'Create intelligent decision logic using intuitive condition trees. Auto-evaluate thousands of rules per second with zero downtime deployments.',
    image: cardRules,
    icon: '🧠',
    iconClass: 'ch2-card-icon-amber',
    size: 'medium',
    tags: [
      { text: 'Decision Trees', cls: 'ch2-tag-amber' },
      { text: 'Auto-scale', cls: '' },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations Hub',
    desc: 'Connect to any service with pre-built connectors, webhooks, and a powerful API gateway. Supports REST, GraphQL, gRPC, and event-driven architectures.',
    image: cardIntegrations,
    icon: '🔗',
    iconClass: 'ch2-card-icon-cyan',
    size: 'medium',
    tags: [
      { text: 'REST & GraphQL', cls: 'ch2-tag-cyan' },
      { text: '500+ Connectors', cls: '' },
    ],
  },
  {
    id: 'analytics',
    title: 'Traceability & Logs',
    desc: 'Full audit trail with end-to-end traceability. Monitor every execution step, inspect payloads, and debug issues with powerful search and replay capabilities.',
    image: cardAnalytics,
    icon: '📊',
    iconClass: 'ch2-card-icon-emerald',
    size: 'large',
    tags: [
      { text: 'Audit Trail', cls: 'ch2-tag-emerald' },
      { text: 'Replay', cls: 'ch2-tag-amber' },
      { text: 'Search', cls: '' },
    ],
  },
];

const CAPABILITIES = [
  { icon: '🎨', name: 'Visual Designer', desc: 'Drag-and-drop workflow canvas with 100+ node types' },
  { icon: '🤖', name: 'AI Copilot', desc: 'AI-assisted rule generation and workflow suggestions' },
  { icon: '🛡️', name: 'Enterprise Security', desc: 'SOC2, HIPAA, GDPR compliance out of the box' },
  { icon: '📱', name: 'Mobile Ready', desc: 'Responsive dashboards and native mobile SDKs' },
  { icon: '⚡', name: 'Edge Computing', desc: 'Deploy workflows to edge nodes for ultra-low latency' },
  { icon: '🔄', name: 'Version Control', desc: 'Git-native versioning with branch, merge, rollback' },
  { icon: '🌐', name: 'Multi-Region', desc: 'Deploy across global regions with automatic failover' },
  { icon: '📈', name: 'Auto Scaling', desc: 'Scale from 0 to millions of executions automatically' },
];

const STATS = [
  { value: '25M+', label: 'Events / Day' },
  { value: '150+', label: 'Enterprise Clients' },
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '<10ms', label: 'P99 Latency' },
];

// ────────────────────────────────────────────
// CARD COMPONENT
// ────────────────────────────────────────────

function FeatureCard({ feature, index }) {
  const ref = useRef(null);

  // Mouse-tracking glow effect
  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
  }, []);

  const sizeClass =
    feature.size === 'large' ? 'ch2-card-large'
    : feature.size === 'medium' ? 'ch2-card-medium'
    : 'ch2-card-wide';

  return (
    <motion.div
      ref={ref}
      className={`ch2-card ${sizeClass}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="ch2-card-glow" />

      <div className="ch2-card-image-wrapper">
        <img
          src={feature.image}
          alt={feature.title}
          className="ch2-card-image"
          loading="lazy"
        />
      </div>

      <div className="ch2-card-body">
        <div className={`ch2-card-icon ${feature.iconClass}`}>
          {feature.icon}
        </div>
        <h3 className="ch2-card-name">{feature.title}</h3>
        <p className="ch2-card-desc">{feature.desc}</p>
        <div className="ch2-card-tags">
          {feature.tags.map((tag, i) => (
            <span key={i} className={`ch2-tag ${tag.cls}`}>
              {tag.text}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────
// CAPABILITY CARD COMPONENT
// ────────────────────────────────────────────

function CapabilityCard({ cap, index }) {
  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      '--mouse-x',
      `${((e.clientX - rect.left) / rect.width) * 100}%`
    );
    e.currentTarget.style.setProperty(
      '--mouse-y',
      `${((e.clientY - rect.top) / rect.height) * 100}%`
    );
  }, []);

  return (
    <motion.div
      className="ch2-cap-card"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <span className="ch2-cap-icon">{cap.icon}</span>
      <h4 className="ch2-cap-name">{cap.name}</h4>
      <p className="ch2-cap-desc">{cap.desc}</p>
    </motion.div>
  );
}

// ────────────────────────────────────────────
// MAIN CHAPTER 2 COMPONENT
// ────────────────────────────────────────────

export default function Chapter2() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax transforms for background aurora
  const auroraY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const auroraOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);

  return (
    <section ref={sectionRef} className="ch2-section" id="features">
      {/* Background aurora with parallax */}
      <motion.div
        className="ch2-aurora"
        style={{ y: auroraY, opacity: auroraOpacity }}
      />

      {/* --- Section Header --- */}
      <motion.div
        className="ch2-header"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="ch2-label">The Arsenal</div>
        <h2 className="ch2-title">
          Everything You Need,{' '}
          <span className="ch2-title-accent">Nothing You Don't</span>
        </h2>
        <p className="ch2-description">
          A comprehensive suite of tools designed to handle the most complex
          enterprise workflows — from visual design to production monitoring.
        </p>
      </motion.div>

      {/* --- Bento Feature Cards --- */}
      <div className="ch2-bento-grid">
        {FEATURES.map((feature, i) => (
          <FeatureCard key={feature.id} feature={feature} index={i} />
        ))}
      </div>

      {/* --- Divider --- */}
      <motion.div
        className="ch2-divider"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />

      {/* --- Capabilities Grid --- */}
      <div className="ch2-capabilities">
        <motion.div
          className="ch2-cap-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="ch2-cap-title">More Capabilities</h3>
          <p className="ch2-cap-subtitle">
            Built for scale, designed for developers
          </p>
        </motion.div>

        <div className="ch2-cap-grid">
          {CAPABILITIES.map((cap, i) => (
            <CapabilityCard key={cap.name} cap={cap} index={i} />
          ))}
        </div>
      </div>

      {/* --- Divider --- */}
      <motion.div
        className="ch2-divider"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />

      {/* --- Stats Section --- */}
      <div className="ch2-stats">
        <motion.div
          className="ch2-stats-grid"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="ch2-stat"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <span className="ch2-stat-value">{stat.value}</span>
              <span className="ch2-stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
