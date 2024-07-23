import React, { useState } from "react";
import { motion } from "framer-motion";

const Suggestions = ({ suggestions = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleSuggestionClick = (suggestion) => {
    setModalContent(suggestion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  return (
    <>
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-xl px-4">
        <motion.div
          className="flex flex-row justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-card w-1/3 p-3 rounded bg-zinc-900 text-white transition-colors hover:bg-zinc-800"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.length > 50 ? suggestion.substring(0, 47) + "..." : suggestion}
            </button>
          ))}
        </motion.div>
      </div>

      {isModalOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
        >
          <motion.div
            className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <p>{modalContent}</p>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Suggestions;
