import React, { useEffect, useRef, useState } from "react";
import ChatItem from "./ChatItem";
import TypingIndicator from "./TypingIndicator";
import ChatHeader from "./ChatHeader";
import EmojiPicker from "emoji-picker-react";
import { FiSend } from "react-icons/fi";
import { Smile, MessageCircleOff } from "lucide-react"; // 👈 import icon
import { useDispatch, useSelector } from "react-redux";
import { fetchConversationMessages } from "../../features/messages/messagesSlice";
import MessageSkeleton from "../MessageSkeleton";
import { getSocket } from "../../lib/socket";

const ChatWindow = ({ conversation, handleBack,setUserConversations }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const otherUser = conversation?.members?.find(
    (member) => member._id !== user?.user?._id
  );

  const [messages, setMessages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const socket = getSocket();

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(
          fetchConversationMessages(conversation?._id)
        );

        const data = response?.payload?.messages ?? [];
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [dispatch, conversation]);

  // Simulate incoming message
  useEffect(() => {
    if (!conversation?._id) return;

    socket.on("receive-message", ({savedMessage,conversationId}) => {
      if (conversationId === conversation?._id) {
        setMessages((prevMessages) => [...prevMessages, savedMessage]);
      }
    });

    // Typing indicator
    socket.on("user-typing", ({ conversationId }) => {
      if (conversationId === conversation?._id) {
        setIsTyping(true);
      }
    });
    socket.on("user-stop-typing", ({ conversationId }) => {
      if (conversationId === conversation?._id) {
        setIsTyping(false);
      }
    });

    return () => {
      // socket.disconnect();
      socket.off("receive-message");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, [conversation?._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      senderId: user?.user?._id,
      text: input,
      createdAt: new Date().toISOString(),
    };


 setUserConversations(prev => {
  const index = prev.findIndex(c => c._id === conversation?._id);
  if (index === -1) {
    console.log("Conversation not found");
    return prev;
  }

  const updatedConv = {
    ...prev[index],
  };

  const newConvs = [
    updatedConv,
    ...prev.slice(0, index),
    ...prev.slice(index + 1),
  ];

  console.log("Returning new conversations list:", newConvs);
  return newConvs;
});




    // Emit to server
    socket.emit("send-message", {
      senderId: user?.user?._id,
      receiverId: otherUser?._id,
       conversationId: conversation?._id,
      text: input,
    });

    // Optimistically add message locally
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // socket.emit("stop-typing", {
    //   conversationId: conversation._id,
    //   user: user?.user?._id,
    // });
  };

  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const handleTyping = (e) => {
    setInput(e.target.value);

    if (!isTypingRef.current) {
      socket.emit("typing", {
        to: otherUser?._id,
        conversationId: conversation?._id,
      });
      isTypingRef.current = true;
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", {
        to: otherUser?._id,
        conversationId: conversation?._id,
      });
      isTypingRef.current = false;
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with name, status, video/audio call icons */}
      <ChatHeader conversation={conversation} handleBack={handleBack} />

      {/* Chat area */}
      <div
        className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 "
        style={{ display: "flex", flexDirection: "column" }}
        ref={chatEndRef}
      >
        {isLoading ? (
          <div>
            <MessageSkeleton isOwnMessage={true} />
            <MessageSkeleton isOwnMessage={false} />
            <MessageSkeleton isOwnMessage={true} />
            <MessageSkeleton isOwnMessage={false} />
            <MessageSkeleton isOwnMessage={true} />
            <MessageSkeleton isOwnMessage={false} />
            <MessageSkeleton isOwnMessage={true} />
            <MessageSkeleton isOwnMessage={false} />
          </div>
        ) : (
          <div style={{ marginTop: "auto" }}>
            {messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center my-10 animate-fade-in mx-auto">
                <div className="bg-[#e9edff] p-4 rounded-full shadow-md mb-4">
                  <MessageCircleOff className="h-10 w-10 text-[#4C68D5]" />
                </div>
                <h2 className="text-xl font-semibold text-gray-700">
                  No Messages Yet
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Start the conversation to see messages here.
                </p>
              </div>
            ) : (
              <>
                {messages?.map((msg, idx) => (
                  <ChatItem
                    key={idx}
                    message={msg}
                    isOwnMessage={msg.senderId === user?.user?._id}
                  />
                ))}
                {isTyping && <TypingIndicator otherUser={otherUser} />}
                <div ref={chatEndRef} />
              </>
            )}
          </div>
        )}
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
            onChange={handleTyping}
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
