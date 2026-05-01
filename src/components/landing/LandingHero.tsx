import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { locale } from "../../lib/locale";

type LandingHeroProps = {
  onPrimary: () => void;
  onSecondary: () => void;
  highlightSummary?: string;
};

const textReveal = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.15 * i, duration: 1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Shard = ({ children, className, delay = 0 }: { children: React.ReactNode; className: string; delay?: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`hero-shard-v2 ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8 + delay, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="shard-inner">
        <div className="shard-glow" />
        {children}
      </div>
    </motion.div>
  );
};

export const LandingHero = ({ onPrimary, onSecondary, highlightSummary }: LandingHeroProps) => (
  <section className="landing-hero hero-section-v2">
    <div className="hero-spatial-bg">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-particle"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>

    <div className="hero-copy-v2">
      <motion.p
        className="hero-eyebrow-v2"
        custom={0}
        initial="hidden"
        animate="visible"
        variants={textReveal}
      >
        {locale("landingPage.hero.eyebrow")}
      </motion.p>

      <motion.h1
        className="hero-title-v2"
        custom={1}
        initial="hidden"
        animate="visible"
        variants={textReveal}
      >
        {locale("landingPage.hero.title")}
        <br />
        <span className="hero-gradient-text-v2">{locale("landingPage.hero.titleGradient")}</span>
      </motion.h1>

      <motion.p
        className="hero-subtext-v2"
        custom={2}
        initial="hidden"
        animate="visible"
        variants={textReveal}
      >
        {locale("landingPage.hero.subtext")}
      </motion.p>

      {highlightSummary && (
        <motion.p
          className="hero-highlight-v2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {highlightSummary}
        </motion.p>
      )}

      <motion.div
        className="hero-actions-v2"
        custom={3}
        initial="hidden"
        animate="visible"
        variants={textReveal}
      >
        <button className="btn-primary-v2" onClick={onPrimary}>
          <span>{locale("landingPage.hero.primaryAction")}</span>
          <div className="btn-glow-v2" />
        </button>
        <button className="btn-secondary-v2" onClick={onSecondary}>
          {locale("landingPage.hero.secondaryAction")}
        </button>
      </motion.div>
    </div>

    <div className="hero-visual-v2">
      <Shard className="shard-main" delay={0}>
        <div className="shard-label">{locale("landingPage.hero.cards.paceSelector")}</div>
        <div className="shard-pulse-v2">
          <div className="pulse-core" />
          <div className="pulse-ring" />
        </div>
      </Shard>

      <Shard className="shard-alt" delay={0.2}>
        <div className="shard-label">{locale("landingPage.hero.cards.modularEngine")}</div>
        <div className="shard-grid-v2">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              className="grid-cell-v2"
              animate={{
                opacity: [0.3, 1, 0.3],
                backgroundColor: i % 3 === 0 ? "#ffd369" : "#aa93ff",
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </Shard>

      <div className="hero-ambient-glow" />
    </div>
  </section>
);
