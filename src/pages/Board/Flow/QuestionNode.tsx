import React, { useState, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";
import "tailwindcss/tailwind.css";

const QuestionNode = ({ id, data }) => {
  console.log("QuestionNode -> data", data);

  const initialText = data.label;
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isPlaceholder = text === initialText;
  const [emoji, setEmoji] = useState("✨");

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (e.target.value !== initialText && e.target.value !== "") {
      setEmoji("👉");
    } else {
      setEmoji("✨");
    }
  };

  const toggleEditMode = () => setIsEditing(!isEditing);

  //loader "tipo cargando la respuesta" - "🤔"
  const handleSave = () => {
    setIsEditing(false);
    if (text === "") {
      setEmoji("✨");
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.style.width = "";
      inputRef.current.style.width = `${inputRef.current.scrollWidth}px`;
    }
  }, [text, isEditing]);

  return (
    <div className="p-2 bg-[#141414] shadow-md rounded-2xl flex items-center border border-[#444444] text-sm">
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          ref={inputRef}
          className={`editable-input p-2 bg-transparent border-none outline-none ml-6 ${
            isPlaceholder ? "text-gray-500" : "text-white"
          }`}
          style={{ width: "auto" }}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <span
          className={`m-2 ml-6 ${
            isPlaceholder ? "text-gray-500" : "text-white"
          }`}
          onDoubleClick={toggleEditMode}
        >
          {text}
        </span>
      )}
      <span
        className="edit-button p-2 text-blue-500 hover:text-blue-700 cursor-pointer"
        onClick={toggleEditMode}
      >
        {emoji}
      </span>
      <Handle
        type="target"
        position={"left" as Position}
        id={`${id}-target`}
        style={{ top: "50%", background: "#000", borderColor: "#aaa" }}
        // isValidConnection={(connection) => connection.source === source}
        onConnect={(params) => console.log("handle onConnect", params)}
      />
      <Handle
        type="source"
        position={"right" as Position}
        id={`${id}-source`}
        style={{ top: "50%", background: "#555" }}
      />
    </div>
  );
};

export default QuestionNode;
