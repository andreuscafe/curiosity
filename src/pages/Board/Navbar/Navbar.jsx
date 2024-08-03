import React from "react";
import { motion } from "framer-motion";

const DURATION = 0.25;
const STAGGER = 0.025;

const RevealLink = ({ children, href }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-md font-semibold"
      style={{
        lineHeight: 0.75,
      }}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: 0,
                color: "gray",
              },
              hovered: {
                y: "-100%",
                color: "white",
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: "100%",
                color: "gray",
              },
              hovered: {
                y: 0,
                color: "white",
              },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};

const Navbar = ({ openModal }) => {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#1a1a1a] bg-opacity-70 backdrop-blur-md rounded-lg shadow-md p-3 w-auto max-w-2xl flex items-center justify-between z-50 border border-gray-700">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 rounded-full overflow-hidden">
          <img src="src/assets/icon.svg" alt="Logo" />
        </div>
        <span className="text-gray-300 text-xl font-medium">Curio</span>
      </div>

      <div className="flex space-x-4 ml-10">
        <RevealLink href="/">Home</RevealLink>
        <RevealLink href="/about">About</RevealLink>
      </div>

      <button
        onClick={openModal}
        className="text-white bg-transparent border border-white px-3 py-1 rounded-md hover:bg-white hover:text-black transition-colors duration-200 text-md font-semibold ml-10"
      >
        Tutorial
      </button>
    </nav>
  );
};

export default Navbar;
