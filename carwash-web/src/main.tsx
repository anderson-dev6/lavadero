import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { InventarioProvider } from './context/InventarioContext'
import { ReservasProvider } from './context/ReservasContext'
import { ServiciosProvider } from './context/ServiciosContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ServiciosProvider>
          <ReservasProvider>
            <InventarioProvider>
              <App />
            </InventarioProvider>
          </ReservasProvider>
        </ServiciosProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
