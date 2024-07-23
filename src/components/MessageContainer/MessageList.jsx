import React from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import "./MessageList.css";

const MessageList = ({ messages }) => (
  <div className="message-list-container">
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
        <span className="message-text">{message.text}</span>
      </motion.div>
    ))}
  </div>
);

export default MessageList;