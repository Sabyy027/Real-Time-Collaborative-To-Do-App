import React, { createContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (username, password) => {
    const { data } = await loginApi({ username, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
  };

  const register = async (username, password) => {
    const { data } = await registerApi({ username, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 