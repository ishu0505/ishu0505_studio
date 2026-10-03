import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/patrick-hand/latin-400.css';
import '@fontsource/gochi-hand/latin-400.css';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';
import './styles/bento.css';
import './styles/ui.css';
import './styles/sections.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
