import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";
import SideBar from "./Sidebar";

const Chatbot = (props) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const streamRef = useRef("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Set up Socket.IO listeners for chatbot streaming
  useEffect(() => {
    const onChunk = (data) => {
      streamRef.current += data.text;
      // Update the last message (the bot's streaming message) in real time
      setMessages((prev) => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].sender === "streaming") {
          updated[updated.length - 1] = {
            text: streamRef.current,
            sender: "streaming",
          };
        }
        return updated;
      });
    };

    const onDone = (data) => {
      // Replace the streaming message with the final version
      setMessages((prev) => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].sender === "streaming") {
          updated[updated.length - 1] = {
            text: data.text,
            sender: "sender",
          };
        }
        return updated;
      });
      setIsTyping(false);
      streamRef.current = "";
    };

    const onError = (data) => {
      console.error("Chatbot error:", data.message);
      setIsTyping(false);
      streamRef.current = "";
    };

    socket.on("chatbot:chunk", onChunk);
    socket.on("chatbot:done", onDone);
    socket.on("chatbot:error", onError);

    return () => {
      socket.off("chatbot:chunk", onChunk);
      socket.off("chatbot:done", onDone);
      socket.off("chatbot:error", onError);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    // Add user message
    const userMsg = { text: input, sender: "user" };
    // Add placeholder for bot's streaming response
    const botPlaceholder = { text: "", sender: "streaming" };
    setMessages((prev) => [...prev, userMsg, botPlaceholder]);

    setIsTyping(true);
    streamRef.current = "";

    // Emit to Socket.IO
    socket.emit("chatbot:ask", { input, content: props.content });
    setInput("");
  };

  return (
    <>
      <div style={styles.container} className="bot-container">
        <div style={styles.chatWindow}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={
                msg.sender === "user"
                  ? styles.userMessage
                  : styles.senderMessage
              }
            >
              {msg.text}
              {msg.sender === "streaming" && (
                <span style={{
                  display: "inline-block",
                  width: "6px",
                  height: "14px",
                  backgroundColor: "#333",
                  marginLeft: "3px",
                  animation: "blink 0.8s infinite",
                  verticalAlign: "text-bottom",
                  borderRadius: "1px",
                }} />
              )}
            </div>
          ))}
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="Type a message..."
          />
          <button onClick={handleSend} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  chatWindow: {
    width: "100%",
    maxWidth: "600px",
    height: "100%",
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px",
    overflowY: "scroll",
    backgroundColor: "#fff",
  },
  userMessage: {
    textAlign: "right",
    padding: "10px",
    margin: "5px",
    backgroundColor: "#d1ffd6",
    borderRadius: "5px",
  },
  senderMessage: {
    textAlign: "left",
    padding: "10px",
    margin: "5px",
    backgroundColor: "#e6e6e6",
    borderRadius: "5px",
  },
  inputContainer: {
    display: "flex",
    width: "80%",
    maxWidth: "600px",
    marginTop: "10px",
  },
  input: {
    flexGrow: 1,
    padding: "10px",
    borderRadius: "5px 0 0 5px",
    border: "1px solid #ddd",
    outline: "none",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "0 5px 5px 0",
    border: "1px solid #ddd",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Chatbot;
