import React, { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import DevConnectAIWelcome from "./DevConnectAIWelcome";
import DevConnectAIBubble from "./DevConnectAIBubble";
import ChatItem from "./ChatItem";
import { Smile,ArrowLeft } from "lucide-react";
import { fetchConversationMessages } from "../../features/messages/messagesSlice";
import { sendAIMessage } from "../../features/messages/messagesSlice";
import ChatHeaderForAI from "./ChatHeaderForAI";

const DevConnectAI = ({handleBack,conversation}) => {


  const bottomRef = useRef(null);

  const currentUser = useSelector((state) => state?.auth?.user);
  console.log(currentUser)

  const dispatch = useDispatch();

  console.log(conversation)

   // Fixed AI sender ID
  const AI_ID = "64b7f7f96fdd1c0001a0a1a1"

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingText, setTypingText] = useState("");
  const emojiRef = useRef(null);
 const [isLoading,setIsLoading] = useState(false)

   const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
    useEffect(() => {
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText, loadingResponse]);

  // Outside click to close emoji
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


  let createdConversation = null
  



  const handleSend = async () => {
  if (!input.trim()) return;

  let aiFullResponse = ""

  const userMessage = {
    senderId: currentUser?.user?._id,
    receiverId: AI_ID,
    text: input.trim(),
    createdAt:  new Date().toISOString(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");

  setTypingText("");

  


 

  // Dispatch user message to DB
  try {
    setLoadingResponse(true);
    const response = await dispatch(
      sendAIMessage({
        conversationId: conversation?._id ? conversation._id : null,
        senderId: currentUser?.user?._id,
        receiverId: AI_ID,
        text: userMessage?.text,
      })
    ).unwrap();
  
   
    aiFullResponse = response?.aiMessage?.text ? response.aiMessage?.text : "AI Does not respond due to some to technical issues. Sorry for inconvenience!"
   

  } catch (err) {

    console.error("Failed to send user message:", err);

  } finally {
    setLoadingResponse(false);
  }

  // AI Simulated Typing Response


  // let index = 0;
  // const typingInterval = setInterval(() => {
    // if (index < aiFullResponse.length) {
    //   setTypingText((prev) => prev + aiFullResponse[index]);
    //   index++;
    // } else {
    //   clearInterval(typingInterval);
    //   setTypingText("");


      const aiMessage = {
        senderId: AI_ID,
        receiverId: currentUser?._id,
        text: aiFullResponse,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);

    // }
  // }, 15);
};



   useEffect(() => {

    

      const fetchMessages = async () => {
        if(!conversation?._id) return
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

    console.log(messages)


  return (
    <div className="flex flex-col h-full bg-white">
      {/* {(isMobile || isTablet) && (
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 shadow-md hover:shadow-lg transition duration-200 xs:relative xs:right-2"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        )} */}

        <ChatHeaderForAI handleBack={handleBack}/>
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4 space-y-4 scrollbar-hide">
        {/* Welcome message */}
        {messages?.length === 0 && <DevConnectAIWelcome />}

        {/* Messages */}
        {messages?.map((msg, idx) => (
          <div key={idx}>
            {(msg?.senderId !== currentUser?.user?._id) ? (
              <DevConnectAIBubble text={msg.text} />
              // <div>hello</div>
            ) : (
              <ChatItem message={msg} isOwnMessage={true} />
            )}
          </div>
        ))}

        {/* AI Typing */}
        {loadingResponse && !typingText && <DevConnectAIBubble isTyping />}
        {typingText && <DevConnectAIBubble text={typingText} />}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="relative px-3 md:px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-2 md:px-4 md:py-2 shadow-sm focus-within:ring-1 focus-within:ring-[#4C68D5] transition space-x-2 sm:space-x-3">
          {/* Emoji Button */}
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-gray-500 hover:text-[#4C68D5] shrink-0"
            title="Emoji"
          >
            <Smile size={22} />
          </button>

          {/* Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask something..."
            className="flex-1 bg-transparent text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="bg-[#4C68D5] hover:bg-[#3c56b0] text-white p-2 rounded-full transition"
            title="Send"
          >
            <FiSend size={18} />
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            ref={emojiRef}
            className="absolute bottom-[4.5rem] left-2 sm:left-4 z-20"
          >
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
