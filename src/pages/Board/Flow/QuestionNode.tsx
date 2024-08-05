import React from "react";
import { Handle, Position } from "reactflow";
import "tailwindcss/tailwind.css";
import { motion } from "framer-motion";
import useStore from "../../../store/useStore";

const QuestionNode = ({ id, data }) => {
  const { onSent } = useStore();
  
  const handleClick = async () => {
    await onSent(data.label, id);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-2 bg-[#141414] shadow-md rounded-2xl flex items-center space-x-4 border border-[#444444] text-sm cursor-pointer"
      onClick={handleClick}
    >
      <span className="m-2 ml-6 text-white">{data.label} 👉</span>
      <Handle
        type="source"
        position={"left" as Position}
        id={`${id}-source`}
        style={{ top: "50%", background: "#555" }}
      />
    </motion.div>
  );
};

export default QuestionNode;
