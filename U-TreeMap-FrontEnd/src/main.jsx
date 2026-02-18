import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
// import LoginPage from './pages/LoginPage.jsx';
// import SignupPage from './pages/SignupPage.jsx';
// import SignupCompletePage from './pages/SignupCompletePage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/complete" element={<SignupCompletePage />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
