import React, { createContext, useState } from 'react';
import { login as loginApi, register as registerApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem('token'));

  const login = async (username, password) => {
    const { data } = await loginApi({ username, password });
    sessionStorage.setItem('token', data.token);
    setToken(data.token);
  };

  const register = async (username, password) => {
    const { data } = await registerApi({ username, password });
    sessionStorage.setItem('token', data.token);
    setToken(data.token);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};