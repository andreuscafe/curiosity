import React from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <svg className="loader-logo" width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_116_153)">
          <path
            d="M100 0C103.395 53.7596 146.24 96.6052 200 100C146.24 103.395 103.395 146.24 100 200C96.6052 146.24 53.7596 103.395 0 100C53.7596 96.6052 96.6052 53.7596 100 0Z"
            fill="url(#paint0_linear_116_153)"
            stroke="#000"
            strokeWidth="2"
          />
        </g>
        <defs>
          <clipPath id="clip0_116_153">
            <rect width="200" height="200" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <motion.div
        className="loader-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1] }}
        transition={{ duration: 3, ease: "easeInOut" }}
      >
        curio
      </motion.div>
    </div>
  );
};

export default Loader;
