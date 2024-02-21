import { Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { darkModeThunk } from './store/slices/darkMode.slice';
import './App.css'

import { Loader } from './components/shared/Loader';

{/* Auth Imports */}
import { LoginPage } from './components/pages/auth/LoginPage';
import { ContactPage } from './components/pages/ContactPage';
{/* End Auth Imports */}

{/* User Imports */}
import { ProtectedRoutes as UserProtectedRoutes } from "./components/pages/session/user/ProtectedRoutes";
{/* End User Imports */}

function App() {

  const dispatch = useDispatch();
  const darkMode = useSelector( (state) => state.darkMode );

  useEffect(() => {
    dispatch(darkModeThunk());
  }, [darkMode]);

  return (
    <div className="select-none">
      <Loader />
      <Routes>
        <Route path="*" element={<Navigate to="/" />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/contact" element={<ContactPage />}/>
        <Route path="/" element={<UserProtectedRoutes />}>
        </Route>
      </Routes>
    </div>
  )
}

export default App
