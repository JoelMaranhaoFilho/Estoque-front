import type { ReactNode } from 'react';
// src/components/PrivateRoute.tsx
import React, { useContext, } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
