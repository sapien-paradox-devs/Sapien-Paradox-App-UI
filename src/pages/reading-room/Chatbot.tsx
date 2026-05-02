import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Chatbot.css";

const MOCK_API_KEY = "sk-sapien-sample-token-12345";

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
    { role: "bot", content: "Greetings. I am the Oracle of this shard. What seek you?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);

    // Fake network delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: `I have processed your query: "${userMessage}". The architecture shifts accordingly.` }
      ]);
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] } as any}
          >
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <h3>Oracle</h3>
                <span className="chatbot-status">Active ({MOCK_API_KEY.slice(0, 8)}...)</span>
              </div>
              <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                &times;
              </button>
            </div>
            
            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  className={`chatbot-message ${msg.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="chatbot-bubble">{msg.content}</div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="chatbot-message bot">
                  <div className="chatbot-bubble typing">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chatbot-input-area" onSubmit={handleSend}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query the Oracle..."
                className="chatbot-input"
              />
              <button type="submit" className="chatbot-send" disabled={!input.trim() || isTyping}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle Chat"
      >
        {isOpen ? (
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
           </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </motion.button>
    </>
  );
};