import { Plus } from "lucide-react";


const suggestedUsers = [
  {
    name: "Olivia Anderson",
    role: "Financial Analyst",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Thomas Baker",
    role: "Project Manager",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    name: "Lily Lee",
    role: "Graphic Designer",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "Andrew Harris",
    role: "Data Scientist",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    name: "Sophie Miller",
    role: "UX Researcher",
    avatar: "https://randomuser.me/api/portraits/women/30.jpg",
  },
  {
    name: "James Moore",
    role: "DevOps Engineer",
    avatar: "https://randomuser.me/api/portraits/men/29.jpg",
  },
  {
    name: "Emily Green",
    role: "Frontend Developer",
    avatar: "https://randomuser.me/api/portraits/women/41.jpg",
  },
  {
    name: "Daniel Smith",
    role: "Backend Developer",
    avatar: "https://randomuser.me/api/portraits/men/40.jpg",
  },
];

const RightSidebar = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Heading */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Suggested Friends
      </h2>

      {/* Scrollable List OR Centered Message */}
      {suggestedUsers?.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-center font-semibold text-gray-500">
            No suggested users at the moment.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-hide">
          {suggestedUsers.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
              <button className="p-1 rounded-md bg-[#EDF1FC] hover:bg-[#dbe4fb] text-[#4C68D5]">
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
