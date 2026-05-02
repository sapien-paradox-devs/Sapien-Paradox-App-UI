import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { locale } from "../../lib/locale";

const shardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { delay: 0.12 * i, duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
  }),
};

const pulseVariants = (speed: number) => ({
  animate: {
    boxShadow: [
      "0 0 20px rgba(170, 147, 255, 0.1)",
      "0 0 40px rgba(170, 147, 255, 0.3)",
      "0 0 20px rgba(170, 147, 255, 0.1)",
    ],
    transition: {
      duration: speed,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
});

export const ModularEngine = ({ pace = "steady" }: { pace?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const modularTiles = locale("landingPage.modularEngine.tiles") as Array<{
    title: string;
    description: string;
    icon: string;
    step: string;
  }>;

  const paceSpeeds = { crawl: 4, steady: 2.5, soar: 1.2 };
  const currentSpeed = paceSpeeds[pace as keyof typeof paceSpeeds] || 2.5;

  return (
    <section className="modular-engine-v2" ref={ref}>
      <motion.div
        className="section-heading-centered"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
      >
        <p className="section-eyebrow-glow">{locale("landingPage.modularEngine.eyebrow")}</p>
        <h2 className="glimmer-text">{locale("landingPage.modularEngine.title")}</h2>
        <p className="subtitle-faded">{locale("landingPage.modularEngine.subtext")}</p>
      </motion.div>

      <div className="engine-grid-fluid">
        {modularTiles.map((tile, i) => (
          <motion.article
            key={tile.title}
            className="engine-shard"
            custom={i}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={shardVariants}
            whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
          >
            <motion.div
              className="shard-pulse-layer"
              variants={pulseVariants(currentSpeed)}
              animate="animate"
            />
            <div className="shard-content">
              <div className="shard-header">
                <span className="shard-step">{tile.step}</span>
                <span className="shard-icon-wrap">{tile.icon}</span>
              </div>
              <h3>{tile.title}</h3>
              <p>{tile.description}</p>
              <div className="shard-bottom-beam" />
            </div>
            {i < modularTiles.length - 1 && (
              <div className="shard-connector">
                <motion.div
                  className="connector-line"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ delay: 1 + i * 0.2, duration: 1 }}
                />
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
};
