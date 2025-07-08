import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const AuthPage = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="auth-page">
      <AuthForm isLogin={isLogin} />
      <div className="switch-auth">
        {isLogin ? (
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        ) : (
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;