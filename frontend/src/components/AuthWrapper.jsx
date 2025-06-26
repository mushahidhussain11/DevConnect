import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCurrentUser } from "../features/auth/authSlice";
import PageLoader from "./PageLoader";

const AuthWrapper = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLoading } = useSelector((state) => state.auth);



  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      const currentPath = location.pathname;
      const isAuthRoute = currentPath === "/login" || currentPath === "/signup" || currentPath === "/forgot-password" || currentPath.startsWith("/reset-password");

      if (user && isAuthRoute) {
        // If logged in and visiting /login or /signup, redirect to home
        navigate("/");

      } else if (!user && !isAuthRoute) {
        // If not logged in and visiting protected route, redirect to login
        navigate("/login");
      }
    }
  }, [user, isLoading, navigate, location.pathname]);

  return null;
};

export default AuthWrapper;
