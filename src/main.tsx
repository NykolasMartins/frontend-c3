import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="918038471470-82ouvfu1dajq7rnn5nb6tmeglejelm6g.apps.googleusercontent.com">
    <StrictMode>
      <BrowserRouter>
        <App />
      </ BrowserRouter>
    </StrictMode>
  </GoogleOAuthProvider>
)
