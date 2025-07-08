import React from "react";
import Navbar from "../components/layoutComponents/Navbar";
import LeftSidebar from "../components/layoutComponents/LeftSidebar";
import RightSidebar from "../components/layoutComponents/RightSidebar";
import MobileBottomNav from "../components/layoutComponents/MobileBottomNav";
import { useSelector } from "react-redux";

const MainLayout = ({ children }) => {
  const currentUser = useSelector((state) => state?.auth?.user);
  return (
    <div className="min-h-screen bg-[#FAFBFF] flex flex-col">
      {/* Navbar stays at top */}
      <Navbar currentUser={currentUser} />

      {/* Main content area (uses full screen height minus navbar) */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside
          className="hidden lg:block 
            lg:w-[230px] xl:w-[250px]
            bg-white rounded-xl shadow-md
            ml-4 mt-6 px-4 py-6 border border-gray-200 h-[25rem] sticky"
        >
          <LeftSidebar currentUser={currentUser} />
        </aside>

        {/* Scrollable Post Section */}
        <main
          className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide"
          style={{ maxHeight: "calc(100vh - 4.5rem)" }}
        >
          {children}
        </main>

        {/* Right Sidebar */}
        <aside
          className="hidden lg:block
            xl:w-[250px] h-[25rem]
            bg-white rounded-xl shadow-md
            mr-4 mt-6 px-4 py-6 border border-gray-200
             sticky"
        >
          <RightSidebar />
        </aside>
      </div>

      {/* Bottom nav for mobile screens */}
      <MobileBottomNav currentUser={currentUser} />
    </div>
  );
};

export default MainLayout;
