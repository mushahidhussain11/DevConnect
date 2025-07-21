import React, { useEffect, useRef, useState } from "react";
import ChatItem from "./ChatItem";
import TypingIndicator from "./TypingIndicator";
import ChatHeader from "./ChatHeader";
import EmojiPicker from "emoji-picker-react";
import { FiSend } from "react-icons/fi";
import { Smile } from "lucide-react"; // 👈 import icon

const ChatWindow = ({ conversation,handleBack }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "me",
      text: "Hey there! How’s it going?",
      timestamp: "2025-07-19T10:00:00Z",
    },
    {
      id: 2,
      sender: conversation?.id || "user123",
      text: "Hi! I'm good, how about you?",
      timestamp: "2025-07-19T10:01:00Z",
    },
    {
      id: 3,
      sender: "me",
      text: "All good! Working on the DevConnect project 🚀",
      timestamp: "2025-07-19T10:02:00Z",
    },
    {
      id: 4,
      sender: conversation?.id || "user123",
      text: "That’s awesome! Need any help?",
      timestamp: "2025-07-19T10:03:00Z",
    },
    {
      id: 1,
      sender: "me",
      text: "Hey there! How’s it going?",
      timestamp: "2025-07-19T10:00:00Z",
    },
    {
      id: 2,
      sender: conversation?.id || "user123",
      text: "Hi! I'm good, how about you?",
      timestamp: "2025-07-19T10:01:00Z",
    },
    {
      id: 3,
      sender: "me",
      text: "All good! Working on the DevConnect project 🚀",
      timestamp: "2025-07-19T10:02:00Z",
    },
    {
      id: 4,
      sender: conversation?.id || "user123",
      text: "That’s awesome! Need any help?",
      timestamp: "2025-07-19T10:03:00Z",
    },
    {
      id: 1,
      sender: "me",
      text: "Hey there! How’s it going?",
      timestamp: "2025-07-19T10:00:00Z",
    },
    {
      id: 2,
      sender: conversation?.id || "user123",
      text: "Hi! I'm good, how about you?",
      timestamp: "2025-07-19T10:01:00Z",
    },
    {
      id: 3,
      sender: "me",
      text: "All good! Working on the DevConnect project 🚀",
      timestamp: "2025-07-19T10:02:00Z",
    },
    {
      id: 4,
      sender: conversation?.id || "user123",
      text: "That’s awesome! Need any help?",
      timestamp: "2025-07-19T10:03:00Z",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Simulate incoming message
  useEffect(() => {
    if (isTyping) {
      const timeout = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: conversation.id,
            text: "This is a reply message.",
            timestamp: new Date().toISOString(),
          },
        ]);
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isTyping]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);
  };

  
  return (
    <div className="flex flex-col h-full">
      {/* Header with name, status, video/audio call icons */}
      <ChatHeader conversation={conversation} handleBack={handleBack} />

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        {messages.map((msg, idx) => (
          <ChatItem
            key={idx}
            message={msg}
            isOwnMessage={msg.sender === "me"}
          />
        ))}

        {isTyping && <TypingIndicator sender={conversation.name} />}

        <div ref={chatEndRef} />
      </div>

      {/* Input section */}
      <div className="relative px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-xl text-gray-500 hover:text-[#4C68D5] xs:relative xs:right-5"
          >
            <Smile size={24} />
          </button>

          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-5 py-3 rounded-xl bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#4C68D5] focus:bg-white shadow-sm transition duration-200  border border-gray-300 xs:relative xs:right-5"
          />

          <button
            onClick={handleSend}
            className="bg-[#4C68D5] hover:bg-[#3c56b0] text-white p-2 rounded-full xs:relative xs:right-3"
          >
            <FiSend size={18} />
          </button>
        </div>

        {showEmojiPicker && (
          <div
            ref={emojiRef}
            className="absolute bottom-20 left-4 z-20 shadow-xl rounded-2xl overflow-hidden border border-gray-200 bg-white"
          >
            <EmojiPicker
              onEmojiClick={(e) => setInput((prev) => prev + e.emoji)}
              theme="light"
              height={350}
              width={300}
            />

          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
