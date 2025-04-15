import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'



createRoot(document.getElementById('root')).render(
  <App/>, // <React.StrictMode> is not used to avoid double rendering in development mode
)
