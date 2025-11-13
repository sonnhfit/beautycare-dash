import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminLayout from './components/Layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Appointments from './pages/Appointments';
import Staff from './pages/Staff';
import Settings from './pages/Settings';
import CustomerCare from './pages/CustomerCare';
import Doctors from './pages/Doctors';
import Nurses from './pages/Nurses';
import Login from './pages/Login';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Có thể thay bằng loading spinner
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (chỉ hiển thị khi chưa đăng nhập)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/staff" element={<Staff />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/nurses" element={<Nurses />} />
                  <Route path="/customer-care" element={<CustomerCare />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
