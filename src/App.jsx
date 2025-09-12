import { useEffect, useState, useRef } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatBot, setShowChatbot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    setIsLoading(true);

    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    // Add "Thinking..." placeholder
    setChatHistory((prev) => [
      ...prev,
      { role: "model", text: "Thinking..." },
    ]);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Something went wrong");
      }

      const data = await response.json();
      const apiResponseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text
          ?.replace(/\*\*(.*?)\*\*/g, "$1")
          .trim() || "No response from AI";

      // Replace last "Thinking..." with API result
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "model", text: apiResponseText };
        return updated;
      });
    } catch (error) {
      console.error("Error fetching bot response:", error);

      // Replace last "Thinking..." with error message
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "model",
          text: "⚠️ Failed to get a response.",
          isError: true,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory, isLoading]);

  return (
    <div className={`container ${showChatBot ? "show-chatBot" : ""}`}>
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>

      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button
            onClick={() => setShowChatbot((prev) => !prev)}
            className="material-symbols-rounded"
          >
            keyboard_arrow_down
          </button>
        </div>

        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there 👋🏻 <br /> How can I help you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer">
          <ChatForm
            setChatHistory={setChatHistory}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            chatHistory={chatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
