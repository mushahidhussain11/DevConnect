import PostFeed from "./PostFeed";
import PostUploader from "./PostUploader";
const PostSection = () => {
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
    xl:max-w-4xl
  "
    >
      {/* Upload Post Section */}
      <PostUploader />

      {/* Feed Section */}
      <PostFeed />
    </div>
  );
};

export default PostSection;
