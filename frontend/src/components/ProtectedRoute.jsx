import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PageLoader from '../components/PageLoader';

const ProtectedRoute = ({children}) => {
     const { user, isLoading,isAuthenticated } = useSelector((state) => state.auth);

      if (isLoading) return <PageLoader />
    return user && isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute