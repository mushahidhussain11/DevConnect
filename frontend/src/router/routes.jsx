import { lazy } from "react";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import NotFoundPage from "../pages/NotFoundPage";

const Home = lazy(() => import("../pages/HomePage"));

const routes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage/> },
  { path: "/reset-password/:token", element: <ResetPasswordPage /> },
  { path: "/", element: <ProtectedRoute> <Home /> </ProtectedRoute> },
  {path: "*", element: <NotFoundPage />}
];

export default routes;
