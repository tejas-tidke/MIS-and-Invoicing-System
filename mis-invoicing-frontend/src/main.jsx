import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'; // Make sure this contains theme CSS (step 3)
import { ThemeProvider } from './context/ThemeContext.jsx'; // Import your theme context

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
