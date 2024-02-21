import React from 'react';
import { Landing } from '../../Landing';
import { Outlet } from 'react-router-dom';
import { PosAuthLayout } from '../../../layouts/PosAuthLayout';

export const ProtectedRoutes = () => {
  const sessionAuth = sessionStorage.getItem('authToken');

  if (sessionAuth)
    return (
      <PosAuthLayout>
        <Outlet />
      </PosAuthLayout>
    );

  return <Landing />;
};
