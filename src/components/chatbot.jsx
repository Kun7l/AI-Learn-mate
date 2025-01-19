import React, { useState } from "react";
import axios from "axios";
import SideBar from "./Sidebar";

const Chatbot = (props) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSender, setIsSender] = useState(false); // Toggle to simulate sender/user

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const handelRes = async () => {
    console.log("handelres workedd");
    
    try {
      const response = await axios.post(
        "http://localhost:3000/chatbot",
        { input:input, content: props.content },
        { withCredentials: true }
      );
      console.log(messages);
      const newMessage = {
        text: response.data,
        sender: "sender",
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setIsSender(false);
      setInput("");
    } catch (error) {
      throw error;
    }
  };
  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = {
      text: input,
      sender: isSender ? "sender" : "user",
    };

    setMessages([...messages, newMessage]);
    setIsSender(!isSender);
    handelRes();
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
