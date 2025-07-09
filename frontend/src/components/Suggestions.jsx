import { Plus, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getSuggestedUsers, followUser } from "../features/user/userSlice";
import SuggestedUsersSkeleton from "./SuggestedUsersSkeleton";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const Suggestions = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { suggestedUsers } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [removedUsers, setRemovedUsers] = useState([]);


  if(!location?.state?.fromButton){
    return;
  }

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        if (!suggestedUsers ) {
          setIsLoading(true);
          await dispatch(getSuggestedUsers());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestedUsers();
  }, [dispatch, suggestedUsers]);

  const handleFollowUser = async (id) => {
    try {
      await dispatch(followUser(id)).unwrap();
      toast.success("User followed successfully");
      setRemovedUsers((prev) => [...prev, id]); // fade out
    } catch (error) {
      console.error("Follow Error:", error);
      toast.error(error.message || "Something went wrong");
    }
  };
  
  return (
    <div className="sm:flex md:flex lg:hidden xl:hidden justify-center w-full mt-6 px-4 relative bottom-9">
      <div className="w-full max-w-md bg-white p-5 shadow-lg rounded-xl border border-gray-200 animate-fade-in">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center border-b pb-2">
          <UserPlus className="inline-block mr-2 mb-1 w-6 h-6 text-primary" /> Suggested Friends
        </h2>

        {isLoading ? (
          <SuggestedUsersSkeleton />
        ) : suggestedUsers?.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-center text-gray-500 font-medium">
              No suggested users right now.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto pr-1 scrollbar-hide">
            <AnimatePresence>
              {suggestedUsers
                ?.filter((user) => !removedUsers.includes(user._id))
                .map((user) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.3 },
                    }}
                    className="flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-indigo-100 to-white hover:shadow-md transition-all rounded-xl"
                  >
                    <Link to={`/profile/${user._id}`} className="flex items-center gap-3">
                      <img
                        src={user.profilePic}
                        alt={user.fullName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-indigo-200"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleFollowUser(user._id)}
                      className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition text-indigo-600 shadow-md"
                    >
                      <Plus size={18} />
                    </button>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
