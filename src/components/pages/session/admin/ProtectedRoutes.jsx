import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { Landing } from '../../Landing';

export const ProtectedRoutes = () => {
  const sessionAuth = sessionStorage.getItem('authToken');

  if (sessionAuth)
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );

  return <Landing />;
};
