import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import BoardPage from './pages/BoardPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/board" /> : <Navigate to="/login" />} />
          <Route path="/login" element={token ? <Navigate to="/board" /> : <AuthPage />} />
          <Route path="/register" element={token ? <Navigate to="/board" /> : <AuthPage />} />
          <Route
            path="/board"
            element={<ProtectedRoute><BoardPage /></ProtectedRoute>}
          />
        </Routes>
        <footer className="footer-blur">
          © 2025 Real-Time Collaborative To-Do Board. Website created by Sabeer Anwer Meeran
        </footer>
      </div>
    </Router>
  );
}

export default App;