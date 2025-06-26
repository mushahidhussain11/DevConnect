import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PageLoader from '../components/PageLoader';

const ProtectedRoute = ({children}) => {
     const { user, loading } = useSelector((state) => state.auth);

      if (loading) return <PageLoader />
    return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute