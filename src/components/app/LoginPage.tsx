import { motion } from "framer-motion";
import { locale } from "../../lib/locale";

interface LoginPageProps {
  onSubmit: (role: string) => void;
  onCancel: () => void;
}

export const LoginPage = ({ onSubmit, onCancel }: LoginPageProps) => (
  <section className="app-login-shell">
    <div className="login-orb" />
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="app-login-eyebrow">{locale("app.login.eyebrow")}</p>
      <h1>{locale("app.login.title")}</h1>
      <p className="login-subtitle">{locale("app.login.subtitle")}</p>
    </motion.header>
    <motion.div
      className="app-login-actions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.button
        type="button"
        className="login-role-card"
        onClick={() => onSubmit("customer")}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="role-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 19V5a2 2 0 012-2h8l6 6v10a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14 3v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <strong>{locale("app.login.roles.reader.title")}</strong>
        <span>{locale("app.login.roles.reader.description")}</span>
      </motion.button>
      <motion.button
        type="button"
        className="login-role-card login-role-admin"
        onClick={() => onSubmit("admin")}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="role-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
        <strong>{locale("app.login.roles.admin.title")}</strong>
        <span>{locale("app.login.roles.admin.description")}</span>
      </motion.button>
    </motion.div>
    <motion.button
      type="button"
      className="app-login-cancel"
      onClick={onCancel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {locale("app.login.backToLanding")}
    </motion.button>
  </section>
);
