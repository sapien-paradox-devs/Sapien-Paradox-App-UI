import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { locale } from "../../lib/locale";

type PaceSelectorProps = {
  pace: string;
  onChange: (pace: string) => void;
};

export const PaceSelector = ({ pace, onChange }: PaceSelectorProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const paceOptions = locale("landingPage.paceSelector.options") as Array<{
    value: string;
    label: string;
    description: string;
    speed: number;
  }>;
  const activePace = paceOptions.find((p) => p.value === pace);

  return (
    <section className="pace-selector-v2" ref={ref}>
      <motion.div
        className="section-heading-centered"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <p className="section-eyebrow-glow">{locale("landingPage.paceSelector.eyebrow")}</p>
        <h2 className="glimmer-text">{locale("landingPage.paceSelector.title")}</h2>
        <p className="subtitle-faded">{locale("landingPage.paceSelector.subtext")}</p>
      </motion.div>

      <div className="pace-container-v2">
        <div className="temporal-rings">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="temporal-ring"
              animate={{
                scale: [1, 1.2 + i * 0.2, 1],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: activePace?.speed ? activePace.speed * (1 + i * 0.5) : 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: `${100 + i * 60}px`,
                height: `${100 + i * 60}px`,
              }}
            />
          ))}
          <div className="temporal-core">
            <motion.div
              className="core-glow"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: activePace?.speed || 2,
                repeat: Infinity,
              }}
            />
            <span className="core-label">{activePace?.label}</span>
          </div>
        </div>

        <div className="pace-options-v2">
          {paceOptions.map((option, i) => (
            <motion.button
              key={option.value}
              className={`pace-btn-v2 ${pace === option.value ? "is-active" : ""}`}
              onClick={() => onChange(option.value)}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ x: 10 }}
            >
              <div className="pace-btn-content">
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </div>
              {pace === option.value && (
                <motion.div
                  className="pace-btn-active-glow"
                  layoutId="paceGlow"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
