import React from "react";
import { motion } from "framer-motion";
import { getNodesBounds, getViewportForBounds } from "reactflow";
import { toPng } from "html-to-image";
import useStore from "../../../store/useStore";

const DURATION = 0.25;
const STAGGER = 0.025;

const RevealLink = ({ children, href }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-md font-semibold"
      style={{ lineHeight: 0.75 }}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { y: 0, color: "gray" },
              hovered: { y: "-100%", color: "white" },
            }}
            transition={{ duration: DURATION, ease: "easeInOut", delay: STAGGER * i }}
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
              initial: { y: "100%", color: "gray" },
              hovered: { y: 0, color: "white" },
            }}
            transition={{ duration: DURATION, ease: "easeInOut", delay: STAGGER * i }}
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
  const nodes = useStore((state) => state.nodes);

  const downloadImage = (dataUrl) => {
    const a = document.createElement("a");
    a.setAttribute("download", "mi-flujo.png");
    a.setAttribute("href", dataUrl);
    a.click();
  };

  const handleDownload = () => {
    const viewportElement = document.querySelector(".react-flow__viewport") as HTMLElement;

    if (!viewportElement) {
      console.error("Viewport element not found.");
      return;
    }

    const nodesBounds = getNodesBounds(nodes);
    const viewport = getViewportForBounds(nodesBounds, 1920, 1080, 0.5, 2);

    toPng(viewportElement, {
      backgroundColor: "#242424",
      width: 1920,
      height: 1080,
      style: {
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    })
      .then((dataUrl) => {
        const img = new Image();
        img.src = dataUrl;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(img, 0, 0);

            const logo = new Image();
            logo.src = "src/assets/logo-descarga.svg";

            const logoWidth = 192; 
            const aspectRatio = 171 / 544;
            const logoHeight = logoWidth * aspectRatio; 

            logo.onload = () => {
              ctx.drawImage(
                logo,
                20, 
                canvas.height - logoHeight - 20,
                logoWidth,
                logoHeight
              );
              downloadImage(canvas.toDataURL());
            };
          }
        };
      })
      .catch((error) => {
        console.error("Error generating image:", error);
      });
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#1a1a1a] bg-opacity-70 backdrop-blur-md rounded-2xl shadow-md p-3 w-auto max-w-2xl flex items-center justify-between z-50 border border-[#444444]">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 rounded-full overflow-hidden">
          <img src="src/assets/icon.svg" alt="Logo" />
        </div>
        <span className="text-gray-300 text-xl font-medium"><img src="src\assets\logo-descarga.svg" className="w-20" /></span>
      </div>

      <div className="flex space-x-4 ml-10">
        <RevealLink href="/">Home</RevealLink>
        <RevealLink href="/about">About</RevealLink>
      </div>

      <div className="flex space-x-4 ml-10">
        <button
          onClick={openModal}
          className="text-white bg-transparent border border-white px-3 py-1 rounded-md hover:bg-white hover:text-black transition-colors duration-200 text-md font-semibold"
        >
          Tutorial
        </button>

        <button
          onClick={handleDownload}
          className="text-white bg-transparent border border-white px-3 py-1 rounded-md hover:bg-white hover:text-black transition-colors duration-200 text-md font-semibold"
        >
          Descargar imagen
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
