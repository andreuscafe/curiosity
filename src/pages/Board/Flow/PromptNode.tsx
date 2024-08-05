import React, { useState, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";
import "tailwindcss/tailwind.css";
import useStore from "../../../store/useStore";

interface PromptNodeProps {
  id: string;
  data: {
    label: string;
  };
}

const PromptNode = ({ id, data }: PromptNodeProps) => {
  const initialText = "¿Qué te gustaría saber?";
  const [text, setText] = useState<string>(data.label);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isPlaceholder = text === initialText;
  const [emoji, setEmoji] = useState<string>("✨");
  const { onSent, nodes } = useStore();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (e.target.value !== initialText && e.target.value !== "") {
      setEmoji("👉");
    } else {
      setEmoji("✨");
    }
  };

  const toggleEditMode = () => {
    if (!isThinking && !isCompleted) {
      setIsEditing(!isEditing);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    if (text === "") {
      setEmoji("✨");
      setText(initialText);
    } else {
      setIsThinking(true);
      setIsCompleted(false);
      const responseText = await onSent(text, id); 
      setResponse(responseText); 
      setIsThinking(false);
      setIsCompleted(true);
      setEmoji("✅");
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.style.width = "auto";
      inputRef.current.style.width = `${Math.max(inputRef.current.scrollWidth, 50)}px`;
    }
  }, [text, isEditing]);

  useEffect(() => {
    const mainNode = nodes.find((node) => node.id === id);
    if (mainNode) {
      setText(mainNode.data.label);
    }
  }, [nodes, id]);

  return (
    <div className="p-2 bg-[#141414] shadow-md rounded-2xl border border-[#444444] text-sm">
      <div className="flex flex-col items-start space-y-2">
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              ref={inputRef}
              className={`editable-input p-2 bg-transparent border-none outline-none ${
                isPlaceholder ? "text-gray-500" : "text-white"
              }`}
              style={{ width: "auto" }}
              onBlur={handleSave}
              autoFocus
            />
          ) : (
            <span
              className={`m-2 ${
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
            type="source"
            position={Position.Right}
            id={`${id}-source`}
            style={{ top: "50%", background: "#555" }}
          />
        </div>
        {isCompleted && (
          <div className="mt-2 p-2 bg-[#242424] rounded-md text-white">
            {response}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptNode;