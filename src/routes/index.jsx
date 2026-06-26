import React from 'react'
import { Context } from '../context';
import { Navigate, Outlet } from 'react-router-dom';
import Layouts from '../components/layouts';
import { Auth } from '../components/pages';
import { useSelector } from 'react-redux';

const User = () => {
  const { auth } = React.useContext(Context.Auth);

  if (!auth) return <Auth.Pages.Home />

  return (
    <Layouts.User>
      <Outlet />
    </Layouts.User>
  )
}

const Admin = () => {
  const { auth } = React.useContext(Context.Auth);
  const account = useSelector(state => state.account);

  if (!auth) return <Navigate to="/customers" />;
  if (account?.authority < 100) return <Navigate to="/" />;

  return (
    <Layouts.Admin>
      <Outlet />
    </Layouts.Admin>
  )
}

const Protected = { User, Admin };

export default Protected;
