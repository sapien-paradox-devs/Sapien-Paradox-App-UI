import { motion, AnimatePresence } from "framer-motion";
import { locale } from "../../lib/locale";

type FormField = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
  renderIf?: (context: {
    books: Array<{ id: string; title: string; tagline: string; summary: string }>;
    pace: string;
    formValues: Record<string, string | undefined>;
    selectedBookId?: string;
  }) => boolean;
};

type SignUpDialogProps = {
  fields: FormField[];
  formValues: Record<string, string | undefined>;
  selectedBook?: { id: string; title: string; tagline: string; summary: string };
  pace: string;
  submitting?: boolean;
  books: { id: string; title: string; tagline: string; summary: string }[];
  selectedBookId?: string;
  onFieldChange: (name: string, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.97,
    transition: { duration: 0.25 },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

export const SignUpDialog = ({
  fields,
  formValues,
  selectedBook,
  pace,
  submitting,
  books,
  selectedBookId,
  onFieldChange,
  onSubmit,
  onClose,
}: SignUpDialogProps) => {
  const renderField = (field: FormField, index: number) => {
    if (
      field.renderIf &&
      !field.renderIf({
        books,
        pace,
        formValues,
        selectedBookId: selectedBookId ?? selectedBook?.id,
      })
    ) {
      return null;
    }

    const commonProps = {
      value: formValues[field.name] ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onFieldChange(field.name, e.target.value),
    };

    return (
      <motion.label
        key={field.name}
        custom={index}
        initial="hidden"
        animate="visible"
        variants={fieldVariants}
      >
        <span>{field.label}</span>
        {field.type === "select" ? (
          <select {...commonProps}>
            <option value="" disabled>{locale("landingPage.signUp.choose")}</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : field.type === "textarea" ? (
          <textarea rows={3} placeholder={field.placeholder} {...commonProps} />
        ) : (
          <input type={field.type} placeholder={field.placeholder} {...commonProps} />
        )}
      </motion.label>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="signup-dialog"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
      >
        <motion.div className="dialog-backdrop" onClick={onClose} />
        <motion.div className="dialog-card" variants={cardVariants}>
          <header>
            <p className="dialog-eyebrow">{locale("landingPage.signUp.eyebrow")}</p>
            <h3>{locale("landingPage.signUp.title")}</h3>
            {selectedBook && (
              <motion.p
                className="selected-book"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                dangerouslySetInnerHTML={{
                  __html: locale("landingPage.signUp.selectedBookInfo", {
                    title: selectedBook.title,
                    pace: pace
                  })
                }}
              />
            )}
          </header>
          <div className="dialog-meta">
            <p>{locale("landingPage.signUp.meta")}</p>
            <div className="dialog-meta-details">
              <span>{locale("landingPage.signUp.selectedPaths", { title: selectedBook?.title ?? locale("landingPage.signUp.pickFocus") })}</span>
              <span>{locale("landingPage.signUp.tempo", { pace })}</span>
            </div>
          </div>
          <div className="dialog-form">
            {fields.map((field, i) => renderField(field, i))}
          </div>
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button type="button" className="btn-secondary" onClick={onClose}>
              {locale("landingPage.signUp.maybeLater")}
            </button>
            <button type="button" className="btn-primary" onClick={onSubmit} disabled={submitting}>
              {submitting ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  {locale("landingPage.signUp.sending")}
                </span>
              ) : (
                locale("landingPage.signUp.sendModule")
              )}
            </button>
          </motion.footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
