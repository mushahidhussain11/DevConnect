import React, { useState } from "react";
import { FiLogOut, FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { getSocket } from "../../lib/socket";

const Navbar = ({currentUser}) => {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
   const dispatch = useDispatch();
  
 

  const handleLogOut = async ()=>{
    try {
   
    await dispatch(logout()).unwrap();
    const socket = getSocket();
    if(socket){
      socket.disconnect();
    }
    navigate("/login")

    }catch (error){
      toast.error("Logout Failed!");
      console.log("Error in logout controller",error);
    } 
  }

  

  return (
    <>
      <header className="bg-white w-full shadow-sm border-b sticky top-0 z-50 border border-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo + App Name */}
          <div className="flex items-center gap-2">
            <img
              src="/assets/images/brandLogo.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-xl font-semibold text-[#4C68D5]">DevConnect</h1>
          </div>

          {/* Middle: Search bar (desktop only) */}
          <div className="hidden md:flex flex-1 mx-6 max-w-md relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pr-10 px-4 py-2 border border-gray-200 rounded-xl 
                     focus:outline-none focus:ring-1 focus:ring-[#4C68D5]"
            />
            <FiSearch
              className="absolute right-4 top-1/2 transform -translate-y-1/2 
                     text-gray-400 cursor-pointer"
            />
          </div>

          {/* Right: Avatar + Logout + Mobile Search Icon */}
          <div className="flex items-center gap-4">
            {/* Mobile Search Icon */}
            <button
              className="block ml-2 md:hidden p-2 text-gray-600 hover:text-[#4C68D5]"
              onClick={() => setShowSearch(true)}
            >
              <Search size={20} />
            </button>

            <Link to={`/profile/${currentUser?.user?._id}`}>
            <img
              src={currentUser?.user?.profilePic}
              alt="User Avatar"
              className="h-8 w-8 rounded-full object-cover hover:cursor-pointer"
            />
            </Link>
            <button onClick={handleLogOut} className="flex items-center gap-1 px-3 py-1.5 text-white bg-[#4C68D5] hover:bg-[#3c56b0] rounded-md text-sm transition">
              <FiLogOut className="text-sm" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search Drawer */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-white p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none"
            />
            <button
              onClick={() => setShowSearch(false)}
              className="ml-2 text-gray-500 text-2xl"
            >
              ✕
            </button>
          </div>
          {/* Optionally add suggestions or search results here */}
        </div>
      )}
    </>
  );
};

export default Navbar;
