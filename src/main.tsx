import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './app/App'
import { ErrorBoundary } from './app/ErrorBoundary'
import './styles/tokens.css'
import './styles/global.css'
import './styles/mobile.css'
import 'katex/dist/katex.min.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ErrorBoundary><App /></ErrorBoundary>
    </HashRouter>
  </StrictMode>,
)