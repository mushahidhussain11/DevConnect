import Post from "./Post";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllPosts } from "../../features/posts/postsSlice";
import LoadingSpinner from "../LoadingSpinner";
import PostsSkeleton from "../PostsSkeleton";

const PostFeed = () => {
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);
   const { user } = useSelector((state) => state.auth);

  console.log(isLoading);
 

  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchAllPosts());
    }, 500);
  }, [dispatch]);


  if (isLoading ) {
     return Array.from({ length: 5 }).map((_, i) => <PostsSkeleton key={i} />) 
  }

  return (
    <div className="flex flex-col gap-4">
      {posts?.map((post) => (
        <Post key={post._id} post={post} currentUser={user?.user} />
      ))}
    </div>
  );
};

export default PostFeed;
