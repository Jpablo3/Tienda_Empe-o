import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión al cargar
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const userType = localStorage.getItem('userType');
      const userEmail = localStorage.getItem('userEmail');

      if (token && userId) {
        setUser({
          token,
          userId,
          userType,
          userEmail,
          isAuthenticated: true
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token, userId, userType, userEmail) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userType', userType);
    localStorage.setItem('userEmail', userEmail);

    setUser({
      token,
      userId,
      userType,
      userEmail,
      isAuthenticated: true
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('redirectAfterLogin');

    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null && user.isAuthenticated;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
