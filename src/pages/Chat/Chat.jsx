import React from "react";
import Header from "./components/Header/Header";
import Form from "./components/Form/Form";
import MessageList from "./components/MessageContainer/MessageList";
import Background from "./components/Background/Background";
import Suggestions from "./components/Suggestions/Suggestions";
import useStore from "../../store/useStore";

const Chat = () => {
  const messages = useStore((state) => state.messages);
  const headerVisible = useStore((state) => state.headerVisible);
  const addMessage = useStore((state) => state.addMessage);
  const setHeaderVisible = useStore((state) => state.setHeaderVisible);
  const onSent = useStore((state) => state.onSent);
  const setSuggestions = useStore((state) => state.setSuggestions);
  const suggestions = useStore((state) => state.suggestions);

  const handleFormSubmit = async (newMessage) => {
    const userMessage = {
      text: newMessage,
    };

    addMessage(userMessage);

    setHeaderVisible(false);

    const response = await onSent(newMessage);
    if (Array.isArray(response) && response.length > 0) {
      const firstResponse = response[0];
      const aiMessage = {
        text: firstResponse,
      };
      addMessage(aiMessage);

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
        <Form onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default Chat;
