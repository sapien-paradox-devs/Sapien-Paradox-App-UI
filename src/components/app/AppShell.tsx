import { useMachine } from "@xstate/react";
import { motion, AnimatePresence } from "framer-motion";
import { locale } from "../../lib/locale";

import { machine } from "../../machines/app";
import { LandingPage } from "../../pages/landing";
import { LoginPage } from "./LoginPage";
import { ProfileView } from "./user/ProfileView";
import { ReadingRoomView } from "./user/ReadingRoomView";
import { AdminView } from "./user/AdminView";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: 0.3 } 
  },
};

export const AppShell = () => {
  const [state, send] = useMachine(machine);

  return (
    <main className="app-shell">
      <AnimatePresence mode="wait">
        {state.matches("landing") && (
          <motion.div key="landing" {...(pageTransition as any)}>
            <div className="app-landing-actions">
              <button type="button" className="btn-ghost" onClick={() => send({ type: "GO_TO_LOGIN" })}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1a4 4 0 110 8 4 4 0 010-8zM2 14c0-2.21 2.69-4 6-4s6 1.79 6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                {locale("app.shell.signIn")}
              </button>
            </div>
            <LandingPage />
          </motion.div>
        )}

        {state.matches("login") && (
          <motion.div key="login" {...(pageTransition as any)}>
            <LoginPage
              onSuccess={(userData: any) => send({ type: "LOGIN_SUCCESS", data: userData })}
              onCancel={() => send({ type: "RETURN_TO_LANDING" })}
            />
          </motion.div>
        )}

        {state.matches("user.profile") && (
          <motion.div key="profile" {...(pageTransition as any)}>
            <ProfileView
              user={(state.context as any).user}
              onReadingRoom={() => send({ type: "VIEW_READING_ROOM" })}
              onAdminView={() => send({ type: "VIEW_ADMIN" })}
              onLogout={() => send({ type: "LOGOUT" })}
            />
          </motion.div>
        )}

        {state.matches("user.readingRoom") && (
          <motion.div key="readingRoom" {...(pageTransition as any)}>
            <ReadingRoomView onProfile={() => send({ type: "VIEW_PROFILE" })} />
          </motion.div>
        )}

        {state.matches("user.admin") && (
          <motion.div key="admin" {...(pageTransition as any)}>
            <AdminView
              onReadingRoom={() => send({ type: "VIEW_READING_ROOM" })}
              onProfile={() => send({ type: "VIEW_PROFILE" })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
