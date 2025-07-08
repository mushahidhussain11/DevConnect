import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UserInfo = ({
  profileUser,
  currentUser,
  postsChecked,
  setPostsChecked,
  projectsChecked,
  setProjectsChecked,
  settingsChecked,
  setSettingsChecked,
}) => {
  const isCurrentUser = currentUser?._id === profileUser?._id;


  const handlePostsClick = () => {
    setPostsChecked(true);
    setProjectsChecked(false);
    setSettingsChecked(false);
  };

  const handleProjectsClick = () => {
    setPostsChecked(false);
    setProjectsChecked(true);
    setSettingsChecked(false);
  };

  const handleSettingsClick = () => {
    setPostsChecked(false);
    setProjectsChecked(false);
    setSettingsChecked(true);
  };

  const baseBtnStyle =
    "px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition";

  const activeBtnStyle = "bg-primary text-white hover:bg-primary/90";
  const inactiveBtnStyle =
    "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <div className="max-w-3xl mx-auto mt-0 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Left: Profile Info */}
          <div className="flex items-center gap-4">
            <img
              src={profileUser?.profilePic}
              alt={profileUser?.fullName}
              className="w-20 h-20 rounded-full object-cover shadow-md"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {profileUser?.fullName}
              </h2>
              <p className="text-sm text-gray-500">@{profileUser?.username}</p>
              <p className="text-sm text-gray-600">{profileUser?.role ?? "User"}</p>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto text-center mt-4 md:mt-0">
            <div>
              <p className="text-xl font-semibold text-primary">
                {profileUser?.followers?.length ?? 0}
              </p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-primary">
                {profileUser?.following?.length ?? 0}
              </p>
              <p className="text-sm text-gray-600">Following</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-primary">
                {isCurrentUser ? currentUser?.numberOfPosts ?? 0 : profileUser?.numberOfPosts ?? 0}
              </p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-primary">
                {profileUser?.numberOfProjects ?? 0}
              </p>
              <p className="text-sm text-gray-600">Projects</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-gray-200" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-3 gap-2 items-center sm:items-start">
          {/* Posts + Projects */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handlePostsClick}
              className={`${baseBtnStyle} ${
                postsChecked ? activeBtnStyle : inactiveBtnStyle
              }`}
            >
              {isCurrentUser ? "My Posts" : "Posts"}
            </button>
            <button
              onClick={handleProjectsClick}
              className={`${baseBtnStyle} ${
                projectsChecked ? activeBtnStyle : inactiveBtnStyle
              }`}
            >
              {isCurrentUser ? "My Projects" : "Projects"}
            </button>
          </div>

          {/* Settings */}
          {isCurrentUser && (
            <div className="mt-2 sm:mt-0">
              <button
                onClick={handleSettingsClick}
                className={`${baseBtnStyle} w-full sm:w-auto ${
                  settingsChecked ? activeBtnStyle : inactiveBtnStyle
                }`}
              >
                Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
