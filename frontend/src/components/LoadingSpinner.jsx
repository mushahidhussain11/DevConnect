
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <motion.div
      className="w-4 h-4 border-[2px] border-white border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  );
}
