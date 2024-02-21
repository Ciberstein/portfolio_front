import { Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { darkModeThunk } from './store/slices/darkMode.slice';
import './App.css'

import { Loader } from './components/shared/Loader';

{/* Auth Imports */}
import { JoinPage } from './components/pages/auth/JoinPage';
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
        <Route path="/join" element={<JoinPage />}/>
        <Route path="/contact" element={<ContactPage />}/>
        <Route path="/" element={<UserProtectedRoutes />}>
        </Route>
      </Routes>
    </div>
  )
}

export default App
