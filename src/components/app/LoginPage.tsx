import { useState, useEffect } from "react";
import { useMachine } from "@xstate/react";
import { motion, AnimatePresence } from "framer-motion";
import { locale } from "../../lib/locale";
import { loginMachine } from "../../machines/login";

interface LoginPageProps {
  onSuccess: (user: any) => void;
  onCancel: () => void;
}

export const LoginPage = ({ onSuccess, onCancel }: LoginPageProps) => {
  const [state, send] = useMachine(loginMachine);

  useEffect(() => {
    if (state.matches("authenticated")) {
      onSuccess(state.context.user);
    }
  }, [state, onSuccess]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isSubmitting = state.matches("submitting");
  const isChecking = state.matches("checkingAuth");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isChecking) return;
    send({ type: "SUBMIT", email, password });
  };

  return (
    <section className="app-login-shell">
      <div className="login-orb" />
      
      <AnimatePresence>
        {isChecking ? (
          <motion.div 
            key="checking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="login-loader"
          >
            <p>{locale("shards.viewer.loading") as string}</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="login-form-container"
          >
            <header>
              <p className="app-login-eyebrow">{locale("app.login.eyebrow") as string}</p>
              <h1>{locale("app.login.title") as string}</h1>
              <p className="login-subtitle">{locale("app.login.subtitle") as string}</p>
            </header>

            <form onSubmit={handleSubmit} className="app-login-form">
              <div className="form-group">
                <label htmlFor="email">{locale("app.login.emailLabel") as string}</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={locale("app.login.emailPlaceholder") as string}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">{locale("app.login.passwordLabel") as string}</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={locale("app.login.passwordPlaceholder") as string}
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {state.context.error && (
                <p className="login-error-message">{state.context.error}</p>
              )}

              <button 
                type="submit" 
                className="btn-primary login-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (locale("app.login.signingIn") as string) : (locale("app.login.submitButton") as string)}
              </button>
            </form>

            <button
              type="button"
              className="app-login-cancel"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11 7H3M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {locale("app.login.backToLanding") as string}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
