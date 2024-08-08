import React, { useState, useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";
import useStore from "../../../store/useStore";

interface PromptNodeProps {
  id: string;
  data: {
    label: string;
  };
}

const PromptNode = ({ id, data }: PromptNodeProps) => {
  const initialText = "¿Qué te gustaría saber?";
  const [text, setText] = useState<string>(data.label || initialText);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [emoji, setEmoji] = useState<string>("✨");
  const { onSent, nodes, updateNodeLabel } = useStore();

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
      updateNodeLabel(id, text);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.style.width = "auto";
      inputRef.current.style.width = `${Math.max(
        inputRef.current.scrollWidth,
        50
      )}px`;
    }
  }, [text, isEditing]);

  useEffect(() => {
    if (!isEditing) {
      const mainNode = nodes.find((node) => node.id === id);
      if (mainNode) {
        setText(mainNode.data.label);
      }
    }
  }, [nodes, id, isEditing]);

  return (
    <div className="relative p-2 bg-[#141414] shadow-md rounded-2xl border border-[#444444] text-sm flex flex-col items-start">
      <div className="flex flex-col items-start space-y-2 max-w-xs w-full relative">
        <div className="flex items-center space-x-2 w-full">
          <div className="flex flex-grow items-center">
            {isEditing ? (
              <input
                type="text"
                value={text}
                onChange={handleTextChange}
                ref={inputRef}
                className={`editable-input p-2 bg-transparent border-none outline-none ${
                  text === initialText ? "text-gray-500" : "text-white"
                }`}
                style={{ width: "auto" }}
                onBlur={handleSave}
                autoFocus
              />
            ) : (
              <span
                className={`m-2 ${
                  text === initialText ? "text-gray-500" : "text-white"
                } break-words max-w-full`}
                onDoubleClick={toggleEditMode}
              >
                {text}
              </span>
            )}
          </div>
          <div className="relative flex items-center justify-center w-6 h-6">
            {isThinking ? (
              <div className="animate-spin border-t-2 border-yellow-500 border-solid w-6 h-6 rounded-full"></div>
            ) : (
              <span
                className="edit-button p-2 text-blue-500 hover:text-blue-700 cursor-pointer text-xs"
                onClick={toggleEditMode}
              >
                {emoji}
              </span>
            )}
          </div>
        </div>
        {isCompleted && !isThinking && (
          <div className="mt-2 p-2 bg-[#141414] rounded-md text-white text-xs text-justify">
            {response}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-source`}
        style={{
          position: "absolute",
          transform: "translateY(-50%)",
          background: "#555",
        }}
      />
    </div>
  );
};

export default PromptNode;
