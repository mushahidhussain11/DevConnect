import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { updateUserInfo } from "../../features/user/userSlice";
import { updateCurrentUserInfo } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner";
import { updateProfileUserInfo } from "../../features/user/userSlice";
// import { updateUserInfo } from "../../redux/slices/userSlice";

const UserSettings = ({ id }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user?.user);

  const [previewImage, setPreviewImage] = useState(user?.profilePic);
  const [isLoading, setIsLoading] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      username: user?.username || "",
      role: user?.role || "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => value?.toString().trim() !== ""
      )
    );
    console.log(filteredData);
    const propertyCount = Object.keys(filteredData).length;
    console.log(propertyCount);

    if (propertyCount === 0 && !newImage) {
      setIsLoading(false);
      return setError("root", {
        type: "server",
        message: "All fields should not be empty",
      });
    }

    try {
      const formData = new FormData();
      formData.append("id", id);
      if (filteredData?.fullName)
        formData.append("fullName", filteredData?.fullName);
      if (filteredData?.username)
        formData.append("username", filteredData?.username);
      if (filteredData?.role) formData.append("role", filteredData?.role);
      if (filteredData?.password)
        formData.append("password", filteredData?.password);
      if (newImage) formData.append("profilePic", newImage);

      const res = await dispatch(updateUserInfo({ formData })).unwrap();

      const profilePic = res?.user.profilePic;

      const formDataObj = Object.fromEntries(formData.entries());

      await dispatch(updateCurrentUserInfo({ formDataObj, profilePic }));
      await dispatch(updateProfileUserInfo({ formDataObj, profilePic }));
      toast.success("User info updated successfully");

      reset({
        fullName: res?.user?.fullName || "",
        username: res?.user?.username || "",
        role: res?.user?.role || "",
        password: "", // Always keep password field empty
      });
    } catch (error) {
      console.error("Error in updating user info:", error);
      setError("root", {
        type: "server",
        message: error || "Failed to update user info.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setValue("profilePic", reader.result);
      };
      reader.readAsDataURL(file);
    }

    setNewImage(file);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 mt-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Update Profile
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Pic Upload */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={previewImage || "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-gray-200"
              />
              <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer hover:bg-primary/90 transition text-xs">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Pencil className="w-4 h-4" />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Click icon to change photo
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              {...register("fullName")}
              className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter full name"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              {...register("username")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter username"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              {...register("role")}
              className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Role: e.g Software Engineer"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              New Password <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="password"
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter new password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {errors.root && (
            <p className="text-red-500 text-sm">{errors.root.message}</p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary flex items-center justify-center hover:bg-primary/90 transition text-white py-2 rounded-lg disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner />
                  <span>Updating</span>
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
