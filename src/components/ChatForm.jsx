import { useRef, useEffect } from "react";

const ChatForm = ({ setChatHistory, setIsLoading, isLoading, chatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    const chatBody = document.querySelector('.chat-body');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [chatHistory]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage || isLoading) return;

    inputRef.current.value = "";

    // Add user message
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage }
    ]);

    // Set loading state
    setIsLoading(true);

    // Call API for bot response (removed simulated message)
    generateBotResponse([
      ...chatHistory,
      { role: "user", text: userMessage }
    ]);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        disabled={isLoading}
        required
      />
      <button 
        type="submit"
        className="material-symbols-rounded"
        disabled={isLoading}
      >
        arrow_upward
      </button>
    </form>
  );
};

export default ChatForm;
