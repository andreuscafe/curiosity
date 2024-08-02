import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStarOfLife } from "react-icons/fa";
import useStore from "../../../../store/useStore";
import "./Form.css";

const Form = () => {
  const [visible, setVisible] = useState(false);
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  const input = useStore((state) => state.input);
  const setInput = useStore((state) => state.setInput);
  const addMessage = useStore((state) => state.addMessage);
  const onSent = useStore((state) => state.onSent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.length) return;

    addMessage({ role: "user", content: input });
    setInput("");
    setVisible(false);

    await onSent(input);
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
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribí tu mensaje acá..."
                  className="h-24 w-full resize-none rounded p-3 text-sm text-zinc-50 placeholder-zinc-500 caret-zinc-50 focus:outline-0"
                />
                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    className="bg-[#292929] border-2 border-[#3e3e3e] rounded-lg text-white px-6 py-3 text-base hover:border-[#fff] cursor-pointer transition"
                  >
                    Enviar
                  </button>

                  <button className="bg-[#292929] border-2 border-[#3e3e3e] rounded-lg text-white px-6 py-3 text-base hover:border-[#fff] cursor-pointer transition">
                    Board
                  </button>
                </div>
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
