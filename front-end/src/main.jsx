import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <GoogleOAuthProvider clientId="828322710282-mci0pj7rb3ne981dbl1ahekg23t536tv.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
   
  </StrictMode>
)
