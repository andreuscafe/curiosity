import React, { useState, useContext } from "react";
import Header from "./components/Header/Header";
import Form from "./components/Form/Form";
import MessageList from "./components/MessageContainer/MessageList";
import Background from "./components/Background/Background";
import Suggestions from "./components/Suggestions/Suggestions";
import { Context } from "./context/Context";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(true);
  const { onSent, suggestions, setSuggestions } = useContext(Context);

  const handleFormSubmit = async (newMessage) => {
    const userMessage = {
      id: Math.random(),
      text: newMessage,
    };

    setMessages((prev) => [...prev, userMessage]);

    setHeaderVisible(false);

    const response = await onSent(newMessage);
    if (Array.isArray(response) && response.length > 0) {
      const firstResponse = response[0];
      const aiMessage = {
        id: Math.random(),
        text: firstResponse,
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Respuestas adicionales
      const additionalResponses = response.slice(1);
      setSuggestions(additionalResponses);
    } else {
      console.error("Expected an array of suggestions");
      setSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen relative">
      <Background />
      {Array.isArray(suggestions) && suggestions.length > 0 && (
        <Suggestions suggestions={suggestions} />
      )}
      <div className="relative z-10">
        {headerVisible && <Header />}
        <MessageList messages={messages} />
        <Form setMessages={handleFormSubmit} />
      </div>
    </div>
  );
};

export default App;
