import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fullResponse, setFullResponse] = useState("");

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setPrevPrompts([]);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setSuggestions([]);
    setLoading(true);
    setShowResult(true);

    const updatedHistory = [...prevPrompts, { role: "user", content: prompt }];

    const briefPrompt = `${prompt}\n\nNota: Por favor, responde de manera breve y concisa, limitando la respuesta a 200 caracteres.`;
    const questionPrompt = `${prompt}\n\nNota:  Genera una pregunta relacionada con el tema sin repetir la pregunta original. Evita el uso de # y comentar *pregunta relacionada*`;

    try {
      // respuesta original
      let response = await runChat(briefPrompt, updatedHistory);
      console.log("Response from runChat:", response);

      if (typeof response === "string") {
        const truncatedResponse =
          response.length > 200 ? `${response.substring(0, 200)}...` : response;
        setFullResponse(truncatedResponse);
        setResultData(truncatedResponse);
        updatedHistory.push({ role: "assistant", content: truncatedResponse });
      } else {
        console.error("Unexpected response format:", response);
        setResultData("No response");
        return [];
      }

      setPrevPrompts(updatedHistory);

      // respuestas adicionales
      let additionalResponses = [];
      for (let i = 0; i < 3; i++) {
        let additionalResponse = await runChat(questionPrompt, updatedHistory);
        console.log(`Additional response ${i + 1}:`, additionalResponse);

        if (typeof additionalResponse === "string") {
          const relatedQuestion = additionalResponse.match(/.*\?$/m);
          if (relatedQuestion) {
            additionalResponses.push(relatedQuestion[0]);
            updatedHistory.push({
              role: "assistant",
              content: relatedQuestion[0],
            });
          }
        } else {
          console.error("Unexpected response format:", additionalResponse);
          return [];
        }
      }

      setSuggestions(additionalResponses);
      return additionalResponses;
    } catch (error) {
      console.error("Error occurred in onSent:", error);
      setResultData("An error occurred while fetching the response.");
      return [];
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    suggestions,
    setSuggestions,
    input,
    setInput,
    newChat,
    fullResponse,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
