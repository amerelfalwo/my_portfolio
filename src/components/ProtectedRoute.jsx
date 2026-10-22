import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../api';

const ProtectedRoute = ({ children }) => {
  const [authed] = useState(() => (typeof window !== 'undefined' ? isAuthenticated() : false));

  if (!authed) {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
