import { Provider, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser, socialLogin } from "../../features/auth/authSlice";

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading } = useSelector((state) => state.auth);
  const FACEBOOK_CLIENT_ID = import.meta.env.VITE_FACEBOOK_CLIENT_ID;

  const onSubmit = async (data) => {
    console.log("Form Submitted:", data);

    try {
      await dispatch(loginUser(data)).unwrap();
      navigate("/");
    } catch (error) {
      console.log("Error in Login:", error);
      setError("root", {
        type: "server",
        message: error || "Login failed. Please try again.",
      });
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Login Success:", tokenResponse);
      const payload = {
        token: tokenResponse?.access_token,
        provider: "google",
      };

      try {
        await dispatch(socialLogin(payload)).unwrap();
        navigate("/");
      } catch (error) {
        console.log("Error in Social Auth Login:", error);
        setError("root", {
          type: "server",
          message: "Login failed. Please try again.",
        });
      }
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  const handleFacebookLogin = (response) => {
    console.log(response)

    try {

    } catch (error) {
      
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-secondary px-4">
      <div className="w-full max-w-sm bg-white p-6 pt-32 rounded-xl shadow-md border border-gray-100 relative">
        {/* Branding Header */}

        <img
          src="/assets/images/logo.png"
          alt="DevConnect Logo"
          className="absolute left-1/2 -translate-x-1/2 top-0 sm:top-[-0.5rem] md:top-[-0.8rem] xl:top-[-1rem] w-40 sm:w-48 md:w-52 lg:w-60 xl:w-65 h-auto object-contain mb-4"
        />

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm  focus:ring-1 focus:ring-primary focus:outline-none"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm  focus:ring-1 focus:ring-primary focus:outline-none"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* 🔥 Show API error globally */}
          {errors.root && (
            <p className="text-red-500 text-xs">{errors.root.message}</p>
          )}

          <div className="text-right text-xs text-gray-500">
            {/* <a href="#" className="hover:underline">Forgot Password?</a> */}
            <Link to="/forgot-password" className="hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-sm text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Auth Options */}
        <div className="space-y-2">
          <button
            onClick={() => login()}
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
            appId={FACEBOOK_CLIENT_ID} // or your hardcoded FB App ID
            autoLoad={false}
            fields="name,email,picture"
            callback={handleFacebookLogin}
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

          {/* <button onClick={handleFacebookLogin} className="w-full text-gray-600 flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100">
            <img
              className="w-4 h-4 object-contain"
              src="/assets/images/facebook.png"
              alt="facebook-logo"
            />
            Continue with Facebook
          </button> */}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            className="text-primary font-medium hover:underline"
            to="/signup"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
