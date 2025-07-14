import ProjectFeed from "./ProjectFeed";
import ProjectUploader from "./ProjectUploader";
const ProjectSection = () => {
  return (
    <div
       className="
    w-full
    mx-auto
    px-2 sm:px-4
    pt-4 pb-10
    flex flex-col gap-6
    max-w-full
    md:max-w-2xl
    lg:max-w-3xl
    xl:max-w-2xl
  "
    >
      {/* Upload Project Section */}
      <ProjectUploader />

      {/* Feed Section */}
      <ProjectFeed />
    </div>
  );
};

export default ProjectSection;
