import React, { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStarOfLife } from "react-icons/fa";
import { Context } from "../../context/Context";
import "./Form.css";

const Form = ({ setMessages }) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const formRef = useRef(null);
  const buttonRef = useRef(null);
  const { onSent } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.length) return;

    setMessages(text);

    setText("");
    setVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setVisible(false);
      }
    };

    const handleMouseMove = (event) => {
      const formElement = formRef.current;
      const buttonElement = buttonRef.current;

      if (formElement) {
        const rect = formElement.getBoundingClientRect(),
          x = event.clientX - rect.left,
          y = event.clientY - rect.top;

        formElement.style.setProperty("--mouse-x", `${x}px`);
        formElement.style.setProperty("--mouse-y", `${y}px`);
      }

      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect(),
          x = event.clientX - rect.left,
          y = event.clientY - rect.top;

        buttonElement.style.setProperty("--mouse-x", `${x}px`);
        buttonElement.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [formRef, buttonRef]);

  return (
    <div className="fixed bottom-6 left-1/2 w-full max-w-xl -translate-x-1/2 px-4">
      <AnimatePresence>
        {visible && (
          <motion.form
            ref={formRef}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            onSubmit={handleSubmit}
            className="form-container"
          >
            <div className="form-background">
              <div className="form-content">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escribí tu mensaje acá..."
                  className="h-24 w-full resize-none rounded p-3 text-sm text-zinc-50 placeholder-zinc-500 caret-zinc-50 focus:outline-0"
                />
                <button
                  type="submit"
                  className="mt-2 w-full rounded bg-indigo-500 px-1.5 py-1 text-xs text-indigo-50 transition-colors hover:bg-indigo-500"
                >
                  Enviar
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      <div className="button-container" ref={buttonRef}>
        <div>
          <button
            onClick={() => setVisible((prev) => !prev)}
            className="grid w-full place-content-center rounded-full border border-zinc-700 bg-zinc-900 py-3 text-lg text-white transition-colors hover:bg-zinc-800 active:bg-zinc-900"
          >
            <FaStarOfLife
              className={`icon transition-transform ${
                visible ? "rotate-45 icon-active" : "rotate-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;