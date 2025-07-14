import Project from "./Project";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProjects } from "../../features/projects/projectsSlice";
import ProjectsSkeleton from "../ProjectsSkeleton";

const ProjectFeed = () => {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  console.log(isLoading);

  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchAllProjects());
    });
  }, [dispatch]);

  console.log(projects);

  if (isLoading) {
    return Array.from({ length: 5 }).map((_, i) => (
      <ProjectsSkeleton key={i} />
    ));
  }

  return (
    <div className="flex flex-col gap-4">
      {Array.isArray(projects) && projects.length > 0 ? (
        projects.map((project) =>
          project ? (
            <Project
              key={project._id} // this assumes _id exists
              project={project}
              currentUser={user?.user}
            />
          ) : null
        )
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  );
};

export default ProjectFeed;
