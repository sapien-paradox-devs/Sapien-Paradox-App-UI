import { motion } from "framer-motion";
import { locale } from "../../../lib/locale";

interface AdminViewProps {
  onProfile: () => void;
  onReadingRoom: () => void;
}

export const AdminView = ({ onProfile, onReadingRoom }: AdminViewProps) => (
  <section className="app-view app-admin">
    <motion.header
      className="app-view-header"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="app-view-eyebrow">{locale("app.views.admin.eyebrow")}</p>
      <h2>{locale("app.views.admin.title")}</h2>
      <p>{locale("app.views.admin.subtitle")}</p>
    </motion.header>
    <motion.div
      className="admin-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {(locale("app.views.admin.dashboard") as Array<{ title: string; desc: string }>).map((card, i) => (
        <motion.article
          key={card.title}
          className="admin-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.1, duration: 0.5 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <div className="admin-card-indicator" />
          <h3>{card.title}</h3>
          <p>{card.desc}</p>
        </motion.article>
      ))}
    </motion.div>
    <motion.div
      className="app-actions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <button type="button" className="btn-secondary" onClick={onReadingRoom}>
        {locale("app.views.common.jumpToReadingRoom")}
      </button>
      <button type="button" className="btn-ghost" onClick={onProfile}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {locale("app.views.common.backToProfile")}
      </button>
    </motion.div>
  </section>
);
