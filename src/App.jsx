import { createTheme, ThemeProvider } from '@mui/material'
import { BrowserRouter as Router } from 'react-router-dom'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { darkThunk } from './store/slices/dark.slice'
import { Auth, User, Admin } from './components/pages'
import Protected from './routes'
import { Toasts } from './components/shared/Toasts'
import React from 'react'
import './App.css'

function App() {

  const dark = useSelector((state) => state.dark);
  const dispatch = useDispatch();

  const lightTheme = createTheme({
    palette: { mode: "light" },
  });

  const darkTheme = createTheme({
    palette: { mode: "dark" },
  });

  React.useEffect(() => {
    dispatch(darkThunk());
  }, [dark]);

  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      {/* Outside the Router: an API call can fail on any route, including
          while one is being replaced. */}
      <Toasts />
      <Router>
        <Routes>

          {/* Auth routes */}
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/contact" element={<Auth.Pages.Contact />} />
          <Route path="/customers" element={<Auth.Pages.Customers />} />


          <Route path="/" element={<Protected.User />}>
            <Route index element={<User.Pages.Home />} />
            <Route path="settings" element={<User.Pages.Settings />} />
            <Route path="quotes" element={<User.Pages.Quotes />} />
            <Route path="projects" element={<User.Pages.Projects />} />
          </Route>

          <Route path="/admin" element={<Protected.Admin />}>
            <Route index element={<Admin.Pages.Dashboard />} />

            <Route path="portfolio" element={<Admin.Portfolio.Layout />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<Admin.Portfolio.Profile />} />
              <Route path="services" element={<Admin.Portfolio.Services />} />
              <Route path="languages" element={<Admin.Portfolio.Languages />} />
              <Route path="education" element={<Admin.Portfolio.Education />} />
              <Route path="certificates" element={<Admin.Portfolio.Certificates />} />
              <Route path="skills" element={<Admin.Portfolio.Skills />} />
              <Route path="experience" element={<Admin.Portfolio.Experience />} />
              <Route path="projects" element={<Admin.Portfolio.Projects />} />
            </Route>

            <Route path="accounts" element={<Admin.Pages.Accounts />} />
            <Route path="mails" element={<Admin.Pages.Mails />} />
            <Route path="jobs" element={<Admin.Pages.Jobs />} />
            <Route path="quotes" element={<Admin.Pages.Quotes />} />
            <Route path="client-projects" element={<Admin.Pages.ClientProjects />} />
          </Route>

        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
