import { CheckCircle } from "lucide-react";
import { useNavigate,useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function PasswordResetSuccessPage() {
    
  const navigate = useNavigate();

  const location = useLocation();
  

  // Access protection
  useEffect(() => {
  if (location.state?.fromReset !== true) {
    navigate("/login");
  }
}, [location?.state, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-t-4 border-[#4C68D5] text-center space-y-6 py-8 px-6 sm:px-8">
        <CheckCircle className="text-[#4C68D5] mx-auto w-12 h-12" />

        <h2 className="text-2xl font-bold text-gray-800">Password Updated</h2>

        <p className="text-sm text-gray-600 leading-relaxed">
          Your password has been successfully updated. You can now log in with your new credentials.
        </p>

        <p className="text-xs text-gray-500">
          If you didn’t initiate this change, please contact support immediately.
        </p>

        <button
          onClick={() => navigate("/login",{replace:true})}
          className="bg-[#4C68D5] hover:bg-[#3b56b8] text-white text-sm font-medium px-6 py-2 rounded-md transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
