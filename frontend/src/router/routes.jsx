import { lazy } from "react";
import PublicRoute from "../components/PublicRoute";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import NotFoundPage from "../pages/NotFoundPage";
import PasswordResetSuccessPage from "../pages/PasswordResetSuccessPage";
import ForgotPasswordConfirmationPage from "../pages/ForgotPasswordConfirmationPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";

const routes = [

  { path: "/login", element: <PublicRoute> <LoginPage /> </PublicRoute>  },
  { path: "/signup", element: <PublicRoute> <RegisterPage /> </PublicRoute> },
  { path: "/forgot-password", element: <PublicRoute> <ForgotPasswordPage /> </PublicRoute> },
  { path: "/reset-password/:token", element:<PublicRoute> <ResetPasswordPage /> </PublicRoute>  },
  { path: "/", element: <ProtectedRoute> <HomePage /> </ProtectedRoute> },
  { path: "/profile/:id", element: <ProtectedRoute> <ProfilePage /> </ProtectedRoute> },
  // { path: "/reset-success", element:  <PasswordResetSuccessPage /> },
  // { path: "/reset-link-sent-success", element:  <ForgotPasswordConfirmationPage /> },
  {path: "*", element: <NotFoundPage />}

];

export default routes;
