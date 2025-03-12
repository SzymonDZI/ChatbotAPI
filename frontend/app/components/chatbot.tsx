"use client";

import { useState, useEffect, useRef } from "react";
import "./chatbot.css";

interface Message {
  role: "user" | "ai";
  content: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const formatMessage = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      const aiMessage: Message = { role: "ai", content: data.response };

      setMessages((prev: Message[]) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-window dark-theme">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user-message" : "ai-message"}`}
            dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Wpisz wiadomość..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Wyślij</button>
      </div>
    </div>
  );
};

export default Chatbot;
