import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageLoader from './PageLoader';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PublicRoute;