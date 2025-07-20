import {
  Home,
  User,
  Mail,
  Bell,
  FolderKanban,
  UserPlus
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useBreakpoint from "../../hooks/useBreakPoint";



const LeftSidebar = ({currentUser}) => {

  

  const navItems = [
  { label: "Home", icon: <Home size={18} />, path: "/" },
  { label: "Profile", icon: <User size={18} />, path: `/profile/${currentUser?.user?._id}` },
  { label: "Messages", icon: <Mail size={18} />, path: "/messages" },
  { label: "Projects", icon: <FolderKanban size={18} />, path: "/projects" },
  { label: "Notifications", icon: <Bell size={18} />, path: "/notifications" },
];

  const screen = useBreakpoint();

  return (
    <div className="flex flex-col items-center justify-center gap-6 relative top-3">
      {/* Profile Section */}
      {/* <div className="flex flex-col items-center text-center">
        <img
          src={currentUser?.user?.profilePic}
          alt="User"
          className="w-16 h-16 rounded-full mb-2 object-cover"
        />
        <div className="font-semibold text-gray-800">{currentUser?.user?.fullName ? currentUser?.user?.fullName : currentUser?.user?.username}</div>
        <div className="text-sm text-gray-500">{currentUser?.user?.role ? currentUser?.user?.role : "User"}</div>
      </div> */}

      {/* Navigation */}
      <nav className="flex flex-col gap-2 mt-2">
        {navItems.map(({ label, icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-[#EDF1FC] ${
                isActive ? "bg-[#EDF1FC] text-[#4C68D5]" : "text-gray-600"
              }`
            }
          >
            {icon}
          </NavLink>
        ))}
        
      </nav>
    </div>
  );
};

export default LeftSidebar;
