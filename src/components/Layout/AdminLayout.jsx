import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown, Space, Drawer } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  UserSwitchOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: 'Quản lý Khách hàng',
    },
    {
      key: '/appointments',
      icon: <CalendarOutlined />,
      label: 'Quản lý Cuộc hẹn',
    },
    {
      key: '/doctors',
      icon: <MedicineBoxOutlined />,
      label: 'Quản lý Bác sĩ',
    },
    {
      key: '/nurses',
      icon: <UserSwitchOutlined />,
      label: 'Quản lý Y tá',
    },
    {
      key: '/customer-care',
      icon: <HeartOutlined />,
      label: 'Chăm sóc Khách hàng',
    },
    {
      key: '/staff',
      icon: <TeamOutlined />,
      label: 'Quản lý Nhân viên',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    } else if (key === 'profile') {
      navigate('/profile');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed}
          style={{
            background: colorBgContainer,
          }}
          breakpoint="lg"
          onBreakpoint={(broken) => {
            if (broken) {
              setCollapsed(true);
            }
          }}
        >
          <div className="demo-logo-vertical" style={{ 
            height: 64, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderBottom: '1px solid #f0f0f0',
            marginBottom: 16
          }}>
            <h3 style={{ 
              margin: 0, 
              color: '#1890ff',
              fontSize: collapsed ? 14 : 16 
            }}>
              {collapsed ? 'BC' : 'BeautyCare'}
            </h3>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
      )}

      <Layout>
        <Header
          style={{
            padding: isMobile ? '0 12px' : '0 16px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 999,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileDrawerVisible(true)}
                style={{
                  fontSize: '16px',
                  width: 48,
                  height: 48,
                }}
              />
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
            )}
            {isMobile && (
              <h3 style={{ 
                margin: 0, 
                color: '#1890ff',
                fontSize: 16,
                marginLeft: 12
              }}>
                BeautyCare
              </h3>
            )}
          </div>
          
          <Space>
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                {!isMobile && <span>{user?.username || 'Admin'}</span>}
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: isMobile ? '16px 8px' : '24px 16px',
            padding: isMobile ? 16 : 24,
            minHeight: isMobile ? 'calc(100vh - 120px)' : 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
            maxHeight: isMobile ? 'calc(100vh - 120px)' : 'none',
          }}
        >
          {children}
        </Content>
      </Layout>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileDrawerVisible(false)}
        open={mobileDrawerVisible}
        width={280}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ borderBottom: '1px solid #f0f0f0' }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: 16
        }}>
          <h3 style={{ 
            margin: 0, 
            color: '#1890ff',
            fontSize: 16 
          }}>
            BeautyCare
          </h3>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(menuInfo) => {
            handleMenuClick(menuInfo);
            setMobileDrawerVisible(false);
          }}
        />
      </Drawer>
    </Layout>
  );
};

export default AdminLayout;
