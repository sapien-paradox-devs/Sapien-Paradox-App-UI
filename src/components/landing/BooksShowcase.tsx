import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { locale } from "../../lib/locale";

type Book = { id: string; title: string; tagline: string; summary: string };

type BooksShowcaseProps = {
  books: Book[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

const nodePositions = [
  { x: "20%", y: "40%" },
  { x: "50%", y: "60%" },
  { x: "80%", y: "35%" },
];

export const BooksShowcase = ({ books, selectedId, onSelect }: BooksShowcaseProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const librarySlabs = [
    { cls: "legacy", ...locale("landingPage.library.oldWay") },
    { cls: "parasok", ...locale("landingPage.library.parasokWay") },
  ];

  return (
    <section className="books-showcase-spatial" ref={ref}>
      <motion.div
        className="section-heading-centered"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <p className="section-eyebrow-glow">{locale("landingPage.library.eyebrow")}</p>
        <h2 className="glimmer-text">{locale("landingPage.library.title")}</h2>
        <p className="subtitle-faded">{locale("landingPage.library.subtext")}</p>
      </motion.div>

      <div className="constellation-container">
        <svg className="constellation-svg">
          <motion.path
            d="M 150 200 Q 400 350 750 180"
            fill="none"
            stroke="#aa93ff"
            strokeWidth="1"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.3 } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>

        {books.map((book, i) => {
          const pos = nodePositions[i % nodePositions.length];
          const isActive = selectedId === book.id;
          const isHovered = hoveredId === book.id;

          return (
            <motion.div
              key={book.id}
              className={`book-node ${isActive ? "is-active" : ""}`}
              style={{ left: pos.x, top: pos.y }}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.2, type: "spring" }}
              onMouseEnter={() => setHoveredId(book.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelect(book.id)}
            >
              <div className="node-orb-wrap">
                <motion.div
                  className="node-pulse"
                  animate={isActive ? { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="node-orb" />
              </div>

              <AnimatePresence>
                {(isActive || isHovered) && (
                  <motion.div
                    className="node-card"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="node-tagline">{book.tagline}</p>
                    <h3>{book.title}</h3>
                    <p className="node-summary">{book.summary}</p>
                    <div className="node-card-arrow" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="node-label-static">{book.title}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="library-slabs-v2">
        {librarySlabs.map((slab, i) => (
          <motion.article
            key={slab.cls}
            className={`slab-v2 ${slab.cls}`}
            initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="slab-header">
              <span className="slab-dot-v2" />
              <p className="slab-label-v2">{slab.label}</p>
            </div>
            <h3>{slab.title}</h3>
            <p className="slab-desc-v2">{slab.desc}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
