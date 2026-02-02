import { createTheme, ThemeProvider } from '@mui/material'
import { BrowserRouter as Router } from 'react-router-dom'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { darkThunk } from './store/slices/dark.slice'
import { Auth } from './components/pages'
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


          <Route path="/" element={<Protected.User />} >
          
          </Route>

        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
