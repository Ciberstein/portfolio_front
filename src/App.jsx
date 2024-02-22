import { Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { darkModeThunk } from './store/slices/darkMode.slice';
import './App.css'

import { Loader } from './components/shared/Loader';

{/* Auth Imports */}
import { JoinPage } from './components/pages/auth/JoinPage';
{/* End Auth Imports */}

{/* User Imports */}
import { ProtectedRoutes as UserProtectedRoutes } from "./components/pages/session/user/ProtectedRoutes";
import { ContactPage } from './components/pages/ContactPage';
import { ProjectsPage } from './components/pages/user/projects/ProjectsPage';
import { SettingsPage } from './components/pages/user/settings/SettingsPage';
import { HomePage as UserHomePage } from './components/pages/user/home/HomePage';
{/* End User Imports */}

{/* Admin Imports */}
import { ProtectedRoutes as AdminProtectedRoutes } from './components/pages/session/admin/ProtectedRoutes';
import { HomePage as AdminHomePage } from './components/pages/admin/home/HomePage';
{/* End Admin Imports */}

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
          <Route path="/" element={<UserHomePage />}/>
          <Route path="/projects" element={<ProjectsPage />}/>
          <Route path="/settings" element={<SettingsPage />}/>
        </Route>
        <Route path="/admin" element={<AdminProtectedRoutes />}>
          <Route path="/admin" element={<AdminHomePage />}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
