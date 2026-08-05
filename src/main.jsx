import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider as ReduxProvider } from 'react-redux'
import { Provider as GlobalProvider } from './context/index.jsx'
import { NotificationsProvider } from '@toolpad/core/useNotifications'
import slotProps from './config/notification.config'
import Loader from './components/shared/Loader.jsx'
import { createRoot } from 'react-dom/client'
import store from './store/index'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ReduxProvider store={store}>
        <NotificationsProvider slotProps={slotProps}>
          <GlobalProvider.Auth>
            <Loader />
            <App />
          </GlobalProvider.Auth>
        </NotificationsProvider>
      </ReduxProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
