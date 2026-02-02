import React from 'react'
import { Context }  from '../context';
import { Outlet } from 'react-router-dom';
import Layouts from '../components/layouts';
import { Auth } from '../components/pages';

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

  return (
    <Layouts.Admin>
      <Outlet />
    </Layouts.Admin>
  )
}

const Protected = { User, Admin };

export default Protected;
