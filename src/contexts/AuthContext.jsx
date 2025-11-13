import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage khi component mount
    const checkAuthStatus = async () => {
      try {
        const isAuthenticated = authService.isAuthenticated();
        
        if (isAuthenticated) {
          // Verify token is still valid
          const isValid = await authService.verifyToken();
          
          if (isValid) {
            const user = authService.getCurrentUser();
            setIsAuthenticated(true);
            setUser(user);
          } else {
            // Token is invalid, try to refresh
            const newToken = await authService.refreshToken();
            if (newToken) {
              const user = authService.getCurrentUser();
              setIsAuthenticated(true);
              setUser(user);
            } else {
              // Refresh failed, logout
              authService.logout();
              setIsAuthenticated(false);
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const result = await authService.login(username, password);
      
      setIsAuthenticated(true);
      setUser(result.user);
      
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
