import React, { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import DevConnectAIWelcome from "./DevConnectAIWelcome";
import DevConnectAIBubble from "./DevConnectAIBubble";
import ChatItem from "./ChatItem";
import { Smile } from "lucide-react";

const DevConnectAI = () => {
  const bottomRef = useRef(null); // ✅ Added for auto-scroll

  const currentUser = {
    _id: "123",
    name: "Demo User",
  };

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingText, setTypingText] = useState("");
  const emojiRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" }); // ✅ Improved scroll behavior
  }, [messages, typingText, loadingResponse]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: currentUser._id,
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };



    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoadingResponse(true);
    setTypingText("");

    const aiFullResponse = "Dev Connect is an innovative initiative designed to bridge the gap between aspiring developers, industry professionals, and technology enthusiasts through collaborative learning, networking, and knowledge-sharing opportunities. The core idea of Dev Connect is to create a dynamic ecosystem where individuals from diverse backgrounds—ranging from students and early-career developers to experienced engineers and entrepreneurs—can engage in meaningful discussions, workshops, and project-based learning. The platform not only promotes technical excellence by hosting sessions on trending technologies like MERN stack, DevOps, AI, and cloud computing, but also encourages soft skill development through team-based projects, hackathons, and real-world problem-solving challenges. Dev Connect acts as a launchpad for young talent by offering mentorship, career guidance, and exposure to current industry practices, ultimately empowering participants to thrive in the fast-paced world of software development.";

    let index = 0;
    const interval = setInterval(() => {
      if (index < aiFullResponse.length) {
        setTypingText((prev) => prev + aiFullResponse[index]);
        index++;
      } else {
        clearInterval(interval);
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: aiFullResponse,
            timestamp: new Date().toISOString(),
          },
        ]);
        setTypingText("");
        setLoadingResponse(false);
      }
    }, 15); // Speed of typing
  };

  
  
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

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-hide">
        {/* Welcome screen */}
        {messages.length === 0 && <DevConnectAIWelcome />}

        {/* Chat items */}
        {messages.map((msg, idx) => (
          <div key={idx}>
            {msg.sender === "ai" ? (
              <DevConnectAIBubble text={msg.text} />
            ) : (
              <ChatItem message={msg} isOwnMessage={true} />
            )}
          </div>
        ))}

        {/* Typing AI bubble */}
        {loadingResponse && !typingText && <DevConnectAIBubble isTyping />}
        {typingText && <DevConnectAIBubble text={typingText} />}

        {/* Dummy div for auto-scroll */}
        <div ref={bottomRef} />
      </div>

      {/* Input section */}
      <div className="relative px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center bg-white border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus-within:ring-1 focus-within:ring-[#4C68D5] transition space-x-2">
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-xl text-gray-500 hover:text-[#4C68D5]"
            title="Emoji"
          >
            <Smile size={22} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask something..."
            className="flex-1 px-3 py-1.5 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          />

          <button
            onClick={handleSend}
            className="bg-[#4C68D5] hover:bg-[#3c56b0] text-white p-2 rounded-full"
            title="Send"
          >
            <FiSend size={18} />
          </button>
        </div>

        {showEmojiPicker && (
          <div
          ref={emojiRef}
           className="absolute bottom-16 left-4 z-20">
            <EmojiPicker
              onEmojiClick={(e) => setInput((prev) => prev + e.emoji)}
              theme="light"
              height={350}
              width={280}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DevConnectAI;
