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

    const briefPrompt = `${prompt}\n\nNota: Por favor, responde de manera breve y concisa, limitando la respuesta a 200 caracteres. Si necesitas más espacio, pregunta '¿Quieres saber más?' al final. No añadas "¿Queres saber más?" si la respuesta es corta.`;
    const briefPrompt2 = `${prompt}\n\nNota2: Quiero que ademas de responderme, me des una explicacion de porque la respuesta es correcta o incorrecta. Si necesitas mas espacio, pregunta '¿Quieres saber más?' al final. No añadas "¿Queres saber más?" si la respuesta es corta.`;
    let responses = [];

    try {
      // respuesta original
      let response = await runChat(briefPrompt,briefPrompt2, updatedHistory);
      console.log("Response from runChat:", response);

      if (typeof response === "string") {
        if (response.length > 200) {
          response = response.substring(0, 190) + "... ¿Queres saber más?";
        } else if (response.length > 190) {
          response += " ¿Quieres saber más?";
        }

        setFullResponse(`\`\`\`javascript\n${response}\n\`\`\``);
        setResultData(response);
        responses.push(response);
        updatedHistory.push({ role: "assistant", content: response });
      } else {
        console.error("Unexpected response format:", response);
        setResultData("No response");
        return [];
      }

      setPrevPrompts(updatedHistory);

      // respuestas adicionales
      let additionalResponses = [];
      for (let i = 0; i < 3; i++) {
        let additionalResponse = await runChat(briefPrompt, updatedHistory);
        console.log(`Additional response ${i + 1}:`, additionalResponse);

        if (typeof additionalResponse === "string") {
          if (additionalResponse.length > 200) {
            additionalResponse =
              additionalResponse.substring(0, 190) + "... ¿Queres saber más?";
          } else if (additionalResponse.length > 190) {
            additionalResponse += " ¿Queres saber más?";
          }

          additionalResponses.push(additionalResponse);
          updatedHistory.push({
            role: "assistant",
            content: additionalResponse,
          });
        } else {
          console.error("Unexpected response format:", additionalResponse);
          return [];
        }
      }

      setSuggestions(additionalResponses);
      return [response, ...additionalResponses];
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
