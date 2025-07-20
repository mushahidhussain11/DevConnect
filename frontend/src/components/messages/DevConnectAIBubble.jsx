import { motion } from "framer-motion";
import { BsRobot } from "react-icons/bs";

const DevConnectAIBubble = ({ text, isTyping = false }) => {
  return (
    <motion.div
      className="flex items-start gap-2 mb-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* AI Icon */}
      <div className="bg-white text-white w-8 h-8 rounded-full flex items-center justify-center shadow-xl mt-1">
        <img src="/assets/images/brandLogo.png" className="w-6 h-6" />
      </div>

      {/* Bubble */}
      <div className="bg-[#EDF1FC] px-4 py-3 rounded-2xl rounded-tl-sm max-w-[75%] shadow-sm text-sm text-gray-800 relative">
        {isTyping ? (
          <span className="flex items-center space-x-1 animate-pulse">
            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
          </span>
        ) : (
          text
        )}
      </div>
    </motion.div>
  );
};

export default DevConnectAIBubble;
