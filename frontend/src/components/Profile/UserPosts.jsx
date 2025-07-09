import Post from "../posts/Post";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserPosts } from "../../features/posts/postsSlice";
import { useState } from "react";
import UserPostsSkeleton from "../UserPostsSkeleton";

const UserPosts = ({ id }) => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        setIsLoading(true);

        await dispatch(fetchUserPosts({ id })).unwrap();
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    getUserPosts();
  }, [dispatch,id]);

  if (isLoading) {
    return Array.from({ length: 5 }).map((_, i) => <UserPostsSkeleton key={i} />);
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
    {posts?.length > 0 ? (
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <Post key={post._id} post={post} currentUser={user?.user} />
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 py-12">
        
        <h2 className="text-xl font-semibold">No Posts Yet</h2>
        <p className="text-sm ">You haven’t shared anything yet. Start posting to share your thoughts!</p>
      </div>
    )}
  </div>
  );
};

export default UserPosts;
