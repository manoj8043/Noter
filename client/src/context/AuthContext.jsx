import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set DB to header first via api interceptor or manually here? 
          // api.js handles header if token is in localStorage typically, or we set it globally
          // Let's rely on api interceptor reading from localStorage
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
          console.error('Auto-login failed:', err);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const register = async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('token', res.data.token);
    await loadUser(); // Reload user data
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const loadUser = async () => {
      try {
          const res = await api.get('/auth/me');
          setUser(res.data);
      } catch (err) {
          localStorage.removeItem('token');
      }
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
