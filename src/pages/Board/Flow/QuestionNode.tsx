import React from "react";
import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";
import useStore from "../../../store/useStore";

const QuestionNode = ({ id, data }) => {
  const { onSent, updateNodeType } = useStore();

  const handleClick = async () => {
    const response = await onSent(data.label, id);
    updateNodeType(id, "prompt", response);
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-2 bg-[#141414] shadow-md rounded-2xl flex items-center space-x-4 border border-[#444444] text-xs cursor-pointer max-w-xs"
        onClick={handleClick}
      >
        <span className="m-2 ml-6 text-white break-words max-w-full">
          {data.label}
        </span>
      </motion.div>
      <div className="absolute top-0 right-0 m-2 text-xs">
        <span className="text-white">✨</span>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-target`}
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          background: "#555",
        }}
      />
    </div>
  );
};

export default QuestionNode;
