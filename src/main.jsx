import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Gestao from './templates/gestao'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Gestao/>
    {/* <App /> */}
  </StrictMode>,
)
