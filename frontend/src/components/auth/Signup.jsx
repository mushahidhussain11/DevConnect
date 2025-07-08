import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useForm } from "react-hook-form";
import { signUpUser, socialLogin } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import { createSocket } from "../../lib/socket";

const Signup = () => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading ,setIsLoading ] = useState(false)
  const FACEBOOK_CLIENT_ID = import.meta.env.VITE_FACEBOOK_CLIENT_ID;

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log(data);
    try {
      
      const response = await dispatch(signUpUser(data)).unwrap();
      const userId = response?.user?._id;
      if (userId) {
        const socket = createSocket(userId);
        socket?.connect();
      }
      toast.success("Signup successful!");
      navigate("/");
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Signup Failed!");
      setError("root", {
        type: "server",
        message: error || "Signup failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const payload = {
        token: tokenResponse?.access_token,
        provider: "google",
      };
      try {
        setIsLoading(true)
        const response = await dispatch(socialLogin(payload)).unwrap();
        const userId = response?.user?._id;

        if (userId) {
        const socket = createSocket(userId);
        socket?.connect();
      }
        toast.success("Signup successful!");
        navigate("/");
      } catch (error) {
        toast.error("Signup Failed!");
        setError("root", {
          type: "server",
          message: "Google signup failed. Please try again.",
        });
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => {
      console.log("Google login failed");
    },
  });

  const handleFacebookSignup = async (response) => {
    const accessToken = response?.accessToken;
    const payload = {
      token: accessToken,
      provider: "facebook",
    };

    try {
      setIsLoading(true)
      const response = await dispatch(socialLogin(payload)).unwrap();
      const userId = response?.user?._id;
      if (userId) {
        const socket = createSocket(userId);
        socket?.connect();
      }
      toast.success("Signup successful!");
      navigate("/");
    } catch (error) {
      toast.error("Signup Failed!");
      setError("root", {
        type: "server",
        message: "Facebook signup failed. Please try again.",
      });
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-secondary px-4 ">
      <div className="w-full max-w-sm bg-white pl-6 pr-6 pb-2 pt-32 rounded-xl shadow-md border border-gray-100 relative">
        {/* Logo */}
        <img
          src="/assets/images/logo.png"
          alt="DevConnect Logo"
          className="absolute left-1/2 -translate-x-1/2 top-0 sm:top-[-0.5rem] md:top-[-0.8rem] xl:top-[-1rem] w-40 sm:w-48 md:w-52 lg:w-60 xl:w-65 h-auto object-contain mb-4"
        />

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Full Name"
              {...register("fullName", { required: "Full Name is required" })}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              onChange={(e) => {
                clearErrors(["fullName", "root"]); // ✅ clear error
                setValue("fullName", e.target.value);
              }}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="mb-3">
            <input
              type="text"
              placeholder="Username"
              {...register("username", { required: "Username is required" })}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              onChange={(e) => {
                clearErrors(["username", "root"]); // ✅ clear error
                setValue("username", e.target.value);
              }}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              onChange={(e) => {
                clearErrors(["email", "root"]); // ✅ clear error
                setValue("email", e.target.value);
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              onChange={(e) => {
                clearErrors(["password", "root"]); // ✅ clear error
                setValue("password", e.target.value);
              }}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-red-500 text-xs mb-2">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span>Signing up...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-sm text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => loginWithGoogle()}
            className="w-full text-gray-600 flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100"
          >
            <img
              className="w-5 h-5 object-contain"
              src="/assets/images/google.png"
              alt="google-logo"
            />
            Continue with Google
          </button>

          <FacebookLogin
            appId={FACEBOOK_CLIENT_ID}
            autoLoad={false}
            fields="name,email,picture"
            callback={handleFacebookSignup}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                className="w-full text-gray-600 flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100"
              >
                <img
                  className="w-4 h-4 object-contain"
                  src="/assets/images/facebook.png"
                  alt="facebook-logo"
                />
                Continue with Facebook
              </button>
            )}
          />
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
