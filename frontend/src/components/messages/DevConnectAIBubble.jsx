import { motion } from "framer-motion";


const DevConnectAIBubble = ({ text, isTyping = false }) => {
  return (
    <motion.div
      className="flex items-start gap-2 mb-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* AI Icon */}
      <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-xl mt-1">
        <img src="/assets/images/brandLogo.png" className="w-6 h-6" />
      </div>

      {/* Bubble */}
      <div className="bg-[#EDF1FC] px-4 py-3 rounded-2xl rounded-tl-sm max-w-[75%] shadow-sm text-sm text-gray-800 relative">
        {isTyping ? (
          <div className="flex items-end space-x-1 h-4">
            <motion.span
              className="w-2 h-2 bg-gray-500 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                delay: 0,
                repeatDelay: 0.5, // 0.5s pause after each cycle
              }}
            />
            <motion.span
              className="w-2 h-2 bg-gray-500 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.2,
                repeatDelay: 0.5,
              }}
            />
            <motion.span
              className="w-2 h-2 bg-gray-500 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.4,
                repeatDelay: 0.5,
              }}
            />
          </div>
        ) : (
          text
        )}
      </div>
    </motion.div>
  );
};

export default DevConnectAIBubble;
