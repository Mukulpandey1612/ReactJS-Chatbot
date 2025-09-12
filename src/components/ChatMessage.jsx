import ChatbotIcon from "./ChatbotIcon";

const ChatMessage = ({ chat }) => {
    const isError = chat.isError || chat.text?.startsWith("⚠️");

    return (
        <div
            className={`message ${chat.role === "model" ? "bot" : "user"}-message ${
                isError ? "error" : ""
            }`}
        >
            {chat.role === "model" && <ChatbotIcon />}
            <p className="message-text">{chat.text}</p>
        </div>
    );
};

export default ChatMessage;
