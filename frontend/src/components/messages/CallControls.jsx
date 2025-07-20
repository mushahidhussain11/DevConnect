import { PhoneCall, Video } from "lucide-react";

const CallControls = () => (
  <div className="flex gap-2 px-4 py-2 border-t border-gray-200 justify-end">
    <button className="bg-[#4C68D5] text-white px-3 py-1 rounded-lg text-sm">
      <PhoneCall size={16} />
    </button>
    <button className="bg-[#4C68D5] text-white px-3 py-1 rounded-lg text-sm">
      <Video size={16} />
    </button>
  </div>
);
 
export default CallControls;