import React from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "../../../../store/useStore";
import "./MessageList.css";

const MessageList = () => {
  const messages = useStore((state) => state.messages);

  return (
    <div className="message-list-container">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className="message flex items-center mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <IoPersonCircleOutline className="mr-3 text-xl" />
            <span className="message-text">{message.content}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MessageList;
