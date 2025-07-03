import { NavLink } from "react-router-dom";
import {
  Home,
  Mail,
  FolderKanban,
  Bell,
  User,
  UserPlus
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Messages", icon: Mail, path: "/messages" },
  { label: "Projects", icon: FolderKanban, path: "/projects" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Follow", icon: UserPlus, path: "/profile" },
];

const MobileBottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-14 bg-white border-t border-gray-200 shadow-md flex justify-around items-center lg:hidden">
      {navItems.map(({ label, icon: Icon, path }) => (
        <NavLink
          key={label}
          to={path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center text-xs transition ${
              isActive ? "text-[#4C68D5]" : "text-gray-500"
            }`
          }
        >
          <Icon size={20} className="mb-[2px]" />
          <span className="text-[11px]">{label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default MobileBottomNav;
