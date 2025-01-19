import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/authcontext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  let navigate = useNavigate();

  if (!user) {
    navigate("/login");
  }
  return children;
};

export default ProtectedRoute;
