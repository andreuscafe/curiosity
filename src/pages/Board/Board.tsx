import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import { TfiHelpAlt } from "react-icons/tfi";
import Flow from "./Flow/Flow.js";

const Board = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Navbar openModal={() => setIsOpen(true)} />
      <Flow />

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-auto cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0, rotate: "12.5deg" }}
              animate={{ scale: 1, rotate: "0deg" }}
              exit={{ scale: 0, rotate: "0deg" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
            >
              <TfiHelpAlt className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24 strong" />
              <div className="relative z-20">
                <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                  <TfiHelpAlt className="m-0" />
                </div>
                <h3 className="text-3xl font-bold text-center mb-2">
                  Breve explicacion de como se usa el board.
                </h3>
                <p className="text-center mb-6">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Id
                  Soy un lorem bien loco aperiam vitae, sapiente ducimus eveniet
                  in velit.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                  >
                    Nah, yo sé usarlo
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                  >
                    Entendido!
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Board;