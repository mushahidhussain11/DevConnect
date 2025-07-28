import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../features/auth/authSlice"; // replace with your actual action
import LoadingSpinner from "../LoadingSpinner";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  
  
 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  

  const onSubmit = async (data) => {
   

    
    try {
      const response = await dispatch(forgotPassword(data)).unwrap();
      console.log(response)
      
      if(response?.response?.error?.statusCode===403) {
        setError("root", {
        type: "server",
        message: "Here is some technical issue, Please try again Later.",
      });

      return;
      }// Assuming this action exists
      navigate("/reset-link-sent-success", { state: { email: data?.email } });
    } catch (error) {
      setError("root", {
        type: "server",
        message: error || "Failed to send reset email.",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-secondary px-4">
      <div className="w-full max-w-sm bg-white p-6 pt-32 rounded-xl shadow-md border border-gray-100 relative overflow-hidden scrollbar-hide">
        {/* Logo */}
        <img
          src="/assets/images/logo.png"
          alt="DevConnect Logo"
          className="absolute left-1/2 -translate-x-1/2 top-0 sm:top-[-0.5rem] md:top-[-0.8rem] xl:top-[-1rem] w-40 sm:w-48 md:w-52 lg:w-60 xl:w-65 h-auto object-contain mb-4"
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 mb-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-red-500 text-xs">{errors.root.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span>Sending Reset Link...</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Back to login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <Link
            className="text-primary font-medium hover:underline"
            to="/login"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
