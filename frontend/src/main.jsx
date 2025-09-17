import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/theme.css'
import './styles/auth.css'
import './styles/dashboard.css' // Import dashboard styles
import './styles/header.css' // Import header styles
import './styles/mobile-menu.css' // Import mobile menu styles
import './styles/my-issues.css' // Import my issues styles
import './styles/indian-gov-theme.css' // Import our new Indian Government theme
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
