import { motion } from "framer-motion";
import { locale } from "../../../lib/locale";

interface ReadingRoomViewProps {
  onProfile: () => void;
}

export const ReadingRoomView = ({ onProfile }: ReadingRoomViewProps) => (
  <section className="app-view app-reading-room">
    <motion.header
      className="app-view-header"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="app-view-eyebrow">{locale("app.views.readingRoom.eyebrow")}</p>
      <h2>{locale("app.views.readingRoom.title")}</h2>
      <p>{locale("app.views.readingRoom.subtitle")}</p>
    </motion.header>
    <motion.div
      className="reading-room-feed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {(locale("app.views.readingRoom.feed") as string[]).map((item, i) => (
        <motion.div
          key={item}
          className="feed-item"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="feed-dot" />
          <span>{item}</span>
        </motion.div>
      ))}
    </motion.div>
    <motion.div
      className="app-actions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <button type="button" className="btn-secondary" onClick={onProfile}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {locale("app.views.common.backToProfile")}
      </button>
    </motion.div>
  </section>
);
