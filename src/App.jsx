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
import { HomePage as UserHomePage } from './components/pages/user/home/HomePage';
import { ProjectsPage as UserProjectsPage } from './components/pages/user/projects/ProjectsPage';
import { SettingsPage as UserSettingsPage } from './components/pages/user/settings/SettingsPage';
import { ProtectedRoutes as UserProtectedRoutes } from "./components/pages/session/user/ProtectedRoutes";
{/* End User Imports */}

{/* Admin Imports */}
import { HomePage as AdminHomePage } from './components/pages/admin/home/HomePage';
import { MailPage as AdminMailPage } from './components/pages/admin/mail/MailPage';
import { PaymentsPage as AdminPaymentsPage } from './components/pages/admin/payments/PaymentsPage';
import { AccountsPage as AdminAccountsPage } from './components/pages/admin/accounts/AccountsPage';
import { ProjectsPage as AdminProjectsPage } from './components/pages/admin/projects/ProjectsPage';
import { ProtectedRoutes as AdminProtectedRoutes } from './components/pages/session/admin/ProtectedRoutes';
{/* End Admin Imports */}

function App() {

  const dispatch = useDispatch();
  const darkMode = useSelector( (state) => state.darkMode );

  useEffect(() => {
    dispatch(darkModeThunk());
  }, [darkMode]);

  return (
    <div className="select-none font-mono">
      <Loader />
      <Routes>
        <Route path="*" element={<Navigate to="/" />}/>
        <Route path="/join" element={<JoinPage />}/>
        <Route path="/contact" element={<ContactPage />}/>
        <Route path="/" element={<UserProtectedRoutes />}>
          <Route path="/" element={<UserHomePage />}/>
          <Route path="/projects" element={<UserProjectsPage />}/>
          <Route path="/settings" element={<UserSettingsPage />}/>
        </Route>
        <Route path="/admin" element={<AdminProtectedRoutes />}>
          <Route path="/admin" element={<AdminHomePage />}/>
          <Route path="/admin/mail" element={<AdminMailPage />}/>
          <Route path="/admin/accounts" element={<AdminAccountsPage />}/>
          <Route path="/admin/payments" element={<AdminPaymentsPage />}/>
          <Route path="/admin/projects/:id?" element={<AdminProjectsPage />}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
