import { useMemo } from "react";
import { useMachine } from "@xstate/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { locale } from "../../lib/locale";

import { SignUpDialog } from "../../components/landing/SignUpDialog";
import { BooksShowcase } from "../../components/landing/BooksShowcase";
import { LandingHero } from "../../components/landing/LandingHero";
import { ModularEngine } from "../../components/landing/ModularEngine";
import { PaceSelector } from "../../components/landing/PaceSelector";
import { ShardView } from "./ShardView";
import { machine, fieldStructure } from "./machine";

const CtaPanel = ({ onAction, pace }: { onAction: () => void; pace: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const paceSpeeds = { crawl: 4, steady: 2.5, soar: 1.2 };
  const currentSpeed = paceSpeeds[pace as keyof typeof paceSpeeds] || 2.5;

  return (
    <section className="cta-panel-v2" ref={ref}>
      <motion.div
        className="cta-copy-v2"
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="cta-eyebrow-v2">{locale("landingPage.cta.eyebrow")}</p>
        <h3 className="glimmer-text-v2">{locale("landingPage.cta.title")}</h3>
        <p className="cta-subtext-v2">{locale("landingPage.cta.subtext")}</p>
        <button className="btn-primary-v2" type="button" onClick={onAction}>
          <span>{locale("landingPage.cta.button")}</span>
          <div className="btn-glow-v2" />
        </button>
      </motion.div>

      <div className="cta-visual-v2">
        <div className="cta-grid-v2">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="cta-cell-v2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isInView
                  ? {
                      opacity: [0.2, 1, 0.2],
                      scale: [1, 1.05, 1],
                      borderColor: [
                        "rgba(255, 255, 255, 0.05)",
                        "#ffd369",
                        "rgba(255, 255, 255, 0.05)",
                      ],
                    }
                  : {}
              }
              transition={{
                duration: currentSpeed,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              <div className="cell-inner-glow" />
            </motion.div>
          ))}
        </div>
        <div className="cta-ambient-blur" />
      </div>
    </section>
  );
};

export const LandingPage = () => {
  const [state, send] = useMachine(machine);
  const formFields = useMemo(() => fieldStructure(state.context), [state.context]);
  const selectedBook = state.context.books.find((book) => book.id === state.context.selectedBookId);

  return (
    <main className="landing-page-v2">
      <LandingHero
        onPrimary={() => send({ type: "OPEN_FORM" })}
        onSecondary={() => send({ type: "OPEN_FORM" })}
        highlightSummary={selectedBook?.tagline}
      />

      <div className="section-divider" />

      <section className="library-stage-v2">
        <BooksShowcase
          books={state.context.books}
          selectedId={state.context.selectedBookId}
          onSelect={(id) => send({ type: "SET_BOOK", bookId: id })}
        />
      </section>

      <div className="section-divider" />

      <section className="modular-stage-v2">
        <ModularEngine pace={state.context.pace} />
      </section>

      <div className="section-divider" />

      <section className="pace-stage-v2">
        <PaceSelector pace={state.context.pace} onChange={(pace) => send({ type: "SET_PACE", pace })} />
      </section>

      <div className="section-divider" />

      <CtaPanel onAction={() => send({ type: "OPEN_FORM" })} pace={state.context.pace} />

      {(state.matches("form") || state.matches("submitting")) && (
        <SignUpDialog
          fields={formFields}
          formValues={state.context.formValues}
          selectedBook={selectedBook}
          pace={state.context.pace}
          submitting={state.matches("submitting")}
          onFieldChange={(name, value) => send({ type: "UPDATE_FIELD", field: name, value })}
          onSubmit={() => send({ type: "SUBMIT" })}
          onClose={() => send({ type: "CLOSE_FORM" })}
          books={state.context.books}
          selectedBookId={state.context.selectedBookId}
        />
      )}

      {state.context.shard && (
        <ShardView 
          shard={state.context.shard} 
          onClose={() => send({ type: "CLOSE_SHARD" })} 
        />
      )}
    </main>
  );
};
