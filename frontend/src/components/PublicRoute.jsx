import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageLoader from './PageLoader';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);

  if (isLoading) return <PageLoader />;

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PublicRoute;