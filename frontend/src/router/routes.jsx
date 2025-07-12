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
import SuggestionsPage from "../pages/SuggestionsPage";
import SearchPage from "../pages/SearchPage";
import NotificationsPage from "../pages/NotificationsPage";

const routes = [

  { path: "/login", element: <PublicRoute> <LoginPage /> </PublicRoute>  },
  { path: "/signup", element: <PublicRoute> <RegisterPage /> </PublicRoute> },
  { path: "/forgot-password", element: <PublicRoute> <ForgotPasswordPage /> </PublicRoute> },
  { path: "/reset-password/:token", element:<PublicRoute> <ResetPasswordPage /> </PublicRoute>  },
  { path: "/", element: <ProtectedRoute> <HomePage /> </ProtectedRoute> },
  { path: "/profile/:id", element: <ProtectedRoute> <ProfilePage /> </ProtectedRoute> },
  { path: "/suggestions", element: <ProtectedRoute> <SuggestionsPage /> </ProtectedRoute> },
  { path: "/search", element: <ProtectedRoute> <SearchPage/> </ProtectedRoute> },
  { path: "/notifications", element: <ProtectedRoute> <NotificationsPage/> </ProtectedRoute> },
  // { path: "/reset-success", element:  <PasswordResetSuccessPage /> },
  // { path: "/reset-link-sent-success", element:  <ForgotPasswordConfirmationPage /> },
  {path: "*", element: <NotFoundPage />}

];

export default routes;
