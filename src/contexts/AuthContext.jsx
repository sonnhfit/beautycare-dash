import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const checkAuthStatus = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      const userRole = localStorage.getItem('userRole');
      const username = localStorage.getItem('username');

      if (authStatus === 'true' && userRole && username) {
        setIsAuthenticated(true);
        setUser({
          username,
          role: userRole
        });
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      // TODO: Thay thế bằng API call thực tế
      // Giả lập login thành công
      return new Promise((resolve) => {
        setTimeout(() => {
          const userData = {
            username,
            role: 'admin' // Trong thực tế sẽ lấy từ API response
          };

          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', userData.role);
          localStorage.setItem('username', userData.username);

          setIsAuthenticated(true);
          setUser(userData);
          resolve(userData);
        }, 1000);
      });
    } catch (error) {
      throw new Error('Đăng nhập thất bại');
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    
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
