import { createTheme, ThemeProvider } from '@mui/material'
import { BrowserRouter as Router } from 'react-router-dom'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { darkThunk } from './store/slices/dark.slice'
import { Auth, User, Admin } from './components/pages'
import Protected from './routes'
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
      <Router>
        <Routes>

          {/* Auth routes */}
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/contact" element={<Auth.Pages.Contact />} />
          <Route path="/customers" element={<Auth.Pages.Customers />} />
          <Route path="/register" element={<Auth.Pages.Register />} />


          <Route path="/" element={<Protected.User />}>
            <Route index element={<></>} />
            <Route path="settings" element={<User.Pages.Settings />} />
          </Route>

          <Route path="/admin" element={<Protected.Admin />}>
            <Route index element={<Admin.Pages.Home />} />
            <Route path="accounts" element={<Admin.Pages.Accounts />} />
            <Route path="mails" element={<Admin.Pages.Mails />} />
          </Route>

        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
