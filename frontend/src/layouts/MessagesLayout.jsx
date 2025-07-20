import React from "react";
import Navbar from "../components/layoutComponents/Navbar";
import LeftSidebar from "../components/layoutComponents/LeftSidebar";
import MobileBottomNav from "../components/layoutComponents/MobileBottomNav";
import { useSelector } from "react-redux";
import LeftSidebarMessages from "../components/layoutComponents/LeftSidebarMessages";

const MessagesLayout = ({ children }) => {
  const currentUser = useSelector((state) => state?.auth?.user);

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex flex-col ">
      {/* Top Navbar */}
      <Navbar currentUser={currentUser} />

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar only on lg+ screens */}
        <aside
          className="hidden lg:block 
            lg:w-[60px] xl:w-[60px]
            bg-white rounded-xl shadow-md items-center justify-center
            ml-4 mt-[1rem] px-4 py-6 border border-gray-200 h-[18rem] sticky"
        >
          <LeftSidebarMessages currentUser={currentUser} />
        </aside>

        {/* Main Chat Area */}
        <main
          className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide"
          style={{ maxHeight: "calc(100vh - 4.5rem)" }}
        >
          {children}
        </main>
      </div>

      {/* Bottom navigation for mobile */}
      <MobileBottomNav currentUser={currentUser} />
    </div>
  );
};

export default MessagesLayout;
