import { accountThunk } from '../store/slices/account.slice';
import auth_service from '../services/auth.services';
import Layouts from '../components/layouts';
import { useDispatch } from 'react-redux';
import React from "react";

const AuthContext = React.createContext();
const AdminContext = React.createContext();


const AuthProvider = ({ children }) => {

  const [auth, setAuth] = React.useState(false);

  const dispatch = useDispatch();

  const checkAuth = async () => {
    const res = await auth_service.validate();
    if(res) dispatch(accountThunk());
    setAuth(res);
  };

  React.useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

const AdminProvider = ({ children }) => {

  const [admin, setAdmin] = React.useState(false);

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      <Layouts.Admin>
        {children}
      </Layouts.Admin>
    </AdminContext.Provider>
  )
}


export const Provider = {
  Auth: AuthProvider,
  Admin: AdminProvider,
};

export const Context = {
  Auth: AuthContext,
  Admin: AdminContext,
};
