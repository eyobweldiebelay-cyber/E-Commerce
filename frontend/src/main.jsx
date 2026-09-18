import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import './styles/global.css'
import './styles/navbar.css'
import './styles/forms.css'
import './styles/home.css'
import './styles/product.css'
import './styles/cart.css'
import './styles/dashboard.css'
import './styles/responsive.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)