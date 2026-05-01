import { motion } from "framer-motion";
import { locale } from "../../../lib/locale";

interface ProfileViewProps {
  role?: string;
  onReadingRoom: () => void;
  onAdminView: () => void;
  onLogout: () => void;
}

export const ProfileView = ({ role, onReadingRoom, onAdminView, onLogout }: ProfileViewProps) => (
  <section className="app-view app-profile">
    <motion.header
      className="app-view-header"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="app-view-eyebrow">{locale("app.views.profile.eyebrow")}</p>
      <h2>
        {role === "admin"
          ? locale("app.views.profile.adminTitle")
          : locale("app.views.profile.readerTitle")}
      </h2>
      <p>
        {role === "admin"
          ? locale("app.views.profile.adminSubtitle")
          : locale("app.views.profile.readerSubtitle")}
      </p>
    </motion.header>
    <motion.div
      className="profile-stats"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="stat-card">
        <span className="stat-value">12</span>
        <span className="stat-label">{locale("app.views.profile.stats.chapters")}</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">Steady</span>
        <span className="stat-label">{locale("app.views.profile.stats.pace")}</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">3</span>
        <span className="stat-label">{locale("app.views.profile.stats.activePaths")}</span>
      </div>
    </motion.div>
    <motion.div
      className="app-actions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <button type="button" className="btn-primary" onClick={onReadingRoom}>
        {locale("app.views.common.openReadingRoom")}
      </button>
      {role === "admin" && (
        <button type="button" className="btn-secondary" onClick={onAdminView}>
          {locale("app.views.common.goToAdminView")}
        </button>
      )}
      <button type="button" className="btn-ghost" onClick={onLogout}>
        {locale("app.views.common.logout")}
      </button>
    </motion.div>
  </section>
);
