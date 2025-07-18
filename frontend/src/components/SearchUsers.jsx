import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSearchedUsers } from "../features/user/userSlice";
import { followUser, unfollowUser } from "../features/user/userSlice";
import { toast } from "react-toastify";
import { Check } from "lucide-react";
import SearchUsersSkeleton from "./SearchUsersSkeleton";


  

export default function SearchPage() {
  const dispatch = useDispatch();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const currentUser = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
   const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");


  console.log("working")

 

  const handleFollowToggle = async (id) => {
    const user = searchedUsers.find((user) => user?._id === id);
    const isFollowing = user?.followers.includes(currentUser?.user?._id);

    try {
      if (isFollowing) {
        await dispatch(unfollowUser(id)).unwrap();

        setSearchedUsers((prev) =>
          prev.map((user) => {
            if (user?._id === id) {
              return {
                ...user,
                followers: user.followers.filter(
                  (follower) => follower !== currentUser?.user?._id
                ),
              };
            }
            return user;
          })
        );

        toast.info("User Unfollowed successfully");
      } else {
        await dispatch(followUser(id)).unwrap();

        setSearchedUsers((prev) =>
          prev.map((user) => {
            if (user?._id === id) {
              return {
                ...user,
                followers: [...user.followers, currentUser?.user?._id],
              };
            }
            return user;
          })
        );

        toast.success("User Followed successfully");
      }
    } catch (error) {
      console.error("Follow/Unfollow Error:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  

   useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    console.log(queryParams,location);
    const query = queryParams.get("query") || "";
    setSearchQuery(query);
  }, [location?.search]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log(searchQuery)
        const users = await dispatch(getSearchedUsers(searchQuery)).unwrap();
        setSearchedUsers(users?.users);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

   fetchUsers();
  }, [searchQuery]);

  return loading ? (
    <SearchUsersSkeleton />
  ) : (
    <div className="w-full flex justify-center  px-3 sm:px-4 md:px-6 py-6 relative bottom-6">
      <div
        className="w-full max-w-4xl bg-white border border-gray-200 rounded-xl shadow-md 
        p-4 sm:p-5 md:p-6 lg:p-6 
        h-[calc(100vh-5rem)] sm:h-[calc(100vh-5rem)] md:h-[calc(100vh-5rem)] 
        flex flex-col mb-6"
      >
        <h2 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold text-primary mb-4 sm:mb-5 text-center sm:text-left">
          Searched Users
        </h2>

        <div className="overflow-y-auto space-y-4 scrollbar-hide pr-1 flex-grow">
          {searchedUsers?.length === 0 ? (
            <p className="text-gray-500 text-center">No users found.</p>
          ) : (
            searchedUsers?.map((user) => {
              const isFollowing = user?.followers.includes(
                currentUser?.user?._id
              );
              return (
                <div
                  key={user?._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between 
                p-3 sm:p-4 md:p-4 transition hover:shadow-md rounded-lg border border-gray-200"
                >
                  <Link
                    to={`/profile/${user?._id}`}
                    className="w-full sm:w-auto"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img
                        src={user?.profilePic}
                        alt={user?.fullName}
                        className="w-8 h-8 sm:w-14 sm:h-14 rounded-full object-cover shadow-sm"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-base sm:text-[1rem]">
                          {user?.fullName}
                        </p>
                        <p className="text-sm text-gray-500">{user?.role}</p>
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleFollowToggle(user?._id)}
                    className={`mt-3 sm:mt-0  sm:ml-4 px-4 py-2 text-sm rounded-lg font-medium transition duration-200 hover:cursor-pointer ${
                      user?._id === currentUser?.user?._id && "hidden"
                    } w-full sm:w-auto ${
                      isFollowing
                        ? "bg-gray-200 text-gray-700"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    {isFollowing ? (
                      <div className="inline-flex items-center gap-x-2 text-sm">
                        <Check size={16} />
                        <span className="">Following</span>
                      </div>
                    ) : (
                      "Follow"
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
