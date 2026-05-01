import { motion, AnimatePresence } from "framer-motion";
import { locale } from "../../lib/locale";

interface ShardViewProps {
  shard: { id: string; token: string; status: "loading" | "valid" | "expired" };
  onClose: () => void;
}

export const ShardView = ({ shard, onClose }: ShardViewProps) => {
  return (
    <motion.div 
      className="shard-mobile-shell"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
    >
      <div className="shard-mobile-header">
        <div className="handle-bar" />
        <button className="shard-close-minimal" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="shard-mobile-content">
        <AnimatePresence mode="wait">
          {shard.status === "loading" && (
            <motion.div 
              key="loading"
              className="shard-state-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="temporal-pulse-loader" />
              <p className="loading-text">{locale("shards.viewer.loading")}</p>
            </motion.div>
          )}

          {shard.status === "valid" && (
            <motion.div 
              key="valid"
              className="shard-pdf-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <iframe
                src="/physics_shard.pdf"
                className="mobile-pdf-iframe"
                title="Sapien Shard"
              />
              <div className="pdf-overlay-hint">
                <span>{locale("shards.viewer.hint")}</span>
              </div>
            </motion.div>
          )}

          {shard.status === "expired" && (
            <motion.div 
              key="expired"
              className="shard-state-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="expired-visual-mobile">
                <motion.div 
                  className="expired-ring-mobile"
                  animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="expired-icon-mobile">⌛</span>
              </div>
              <h2 className="expired-title">{locale("shards.viewer.expired.title")}</h2>
              <p className="expired-desc">{locale("shards.viewer.expired.description")}</p>
              <button className="btn-primary-v2 w-full" onClick={onClose}>
                {locale("shards.viewer.expired.action")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
