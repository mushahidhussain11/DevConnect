import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../features/auth/authSlice"; // your reset action
import LoadingSpinner from "../LoadingSpinner";
import PasswordResetSuccess from "../../pages/PasswordResetSuccessPage";

const ResetPassword = () => {

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm();

  const { token } = useParams();
  const [tokenValid, setTokenValid] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || token?.length !== 40 || !/^[a-f0-9]{40}$/i.test(token)) {
      setTokenValid(false);
    }
  }, [token]);

  const onSubmit = async (data) => {

    const credentials = {
      token,
      data: data,
    };

    try {

      
      await dispatch(
        resetPassword(credentials)
      ).unwrap();
      navigate("/reset-success",{ state: { fromReset: true }, replace: true }, );
     
    } catch (error) {
      setError("root", {
        type: "server",
        message: error || "Password reset failed.",
      });
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-secondary px-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Invalid or Expired Token</h2>
          <p className="text-sm text-gray-600">Please request a new password reset link.</p>
        </div>
      </div>
    );
  }

  return (
     <div className="min-h-screen flex justify-center items-center bg-secondary px-4">
      <div className="w-full max-w-sm bg-white p-6 pt-32 rounded-xl shadow-md border border-gray-100 relative overflow-hidden scrollbar-hide">
        {/* Logo */}
        <img
  src="/assets/images/logo.png"
  alt="DevConnect Logo"
  className="absolute left-1/2 -translate-x-1/2 sm:top-0 md:top-0 lg:top-[-1rem] xl:top-[-1rem] top-0 w-44 sm:w-48 md:w-52 lg:w-60 xl:w-65 h-auto object-contain"
/>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (val) =>
                  val === watch("password") || "Passwords do not match",
              })}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
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
                <span>Resetting Password...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  )
};

export default ResetPassword;
