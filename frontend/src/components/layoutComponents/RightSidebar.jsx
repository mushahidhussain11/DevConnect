import { Check, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getSuggestedUsers } from "../../features/user/userSlice";
import { useSelector } from "react-redux";
import SuggestedUsersSkeleton from "../SuggestedUsersSkeleton";
import { followUser } from "../../features/user/userSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const RightSidebar = () => {
  const dispatch = useDispatch();

  const { suggestedUsers } = useSelector((state) => state.user);
  console.log(suggestedUsers);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        if (!suggestedUsers) {
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
    console.log("following user")

    try {

        await dispatch(followUser(id)).unwrap();
        toast.success("User Followed successfully"); 
    } catch (error) {
      console.error("Follow  Error:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Heading */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Suggested Friends
      </h2>

      {/* Conditional Content */}
      {isLoading ? (
        <SuggestedUsersSkeleton />
      ) : suggestedUsers?.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-center font-semibold text-gray-500">
            No suggested users at the moment.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-hide">
          {suggestedUsers?.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3"
            >
              <Link to={`/profile/${user?._id}`}>
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePic}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                </div>
              </Link>
              <button onClick={() => handleFollowUser(user?._id)} className="p-1 hover:cursor-pointer rounded-md bg-[#EDF1FC] hover:bg-[#dbe4fb] text-[#4C68D5]">
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
