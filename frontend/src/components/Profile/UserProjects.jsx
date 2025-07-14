import Project from "../projects/Project"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProjects } from "../../features/projects/projectsSlice";
import { useState } from "react";
import UserProjectsSkeleton from "../UserProjectsSkeleton";

const UserProjects = ({ id }) => {
  const dispatch = useDispatch();
  const { userProjects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserProjects = async () => {
      try {
        setIsLoading(true);

        await dispatch(fetchUserProjects({ id })).unwrap();
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    getUserProjects();
  }, [dispatch,id]);

  if (isLoading) {
    return Array.from({ length: 5 }).map((_, i) => <UserProjectsSkeleton key={i} />);
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
    {userProjects?.length > 0 ? (
      <div className="flex flex-col gap-6">
        {userProjects.map((project) => (
          <Project key={project._id} project={project} currentUser={user?.user} />
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center text-center text-gray-500 py-12">
        
        <h2 className="text-xl font-semibold">No Projects Yet</h2>
        <p className="text-sm ">You haven’t shared anything yet. Start posting to share your Projects!</p>
      </div>
    )}
  </div>
  );
};

export default UserProjects;
