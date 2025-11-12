import React from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Progress } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const Dashboard = () => {
  // Dữ liệu mẫu - sau này sẽ kết nối với API
  const statsData = {
    totalCustomers: 156,
    totalAppointments: 42,
    totalStaff: 18,
    todayAppointments: 8,
  };

  const recentAppointments = [
    {
      key: '1',
      customer: 'Nguyễn Thị A',
      service: 'Tư vấn hậu phẫu',
      date: '2025-01-12 09:00',
      status: 'confirmed',
      statusText: 'Đã xác nhận',
    },
    {
      key: '2',
      customer: 'Trần Văn B',
      service: 'Kiểm tra định kỳ',
      date: '2025-01-12 10:30',
      status: 'pending',
      statusText: 'Chờ xác nhận',
    },
    {
      key: '3',
      customer: 'Lê Thị C',
      service: 'Theo dõi vết thương',
      date: '2025-01-12 14:00',
      status: 'confirmed',
      statusText: 'Đã xác nhận',
    },
    {
      key: '4',
      customer: 'Phạm Văn D',
      service: 'Tái khám',
      date: '2025-01-13 08:30',
      status: 'completed',
      statusText: 'Đã hoàn thành',
    },
  ];

  const appointmentStatus = [
    { type: 'completed', count: 28, color: 'green' },
    { type: 'confirmed', count: 8, color: 'blue' },
    { type: 'pending', count: 6, color: 'orange' },
  ];

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          confirmed: { color: 'blue', icon: <CheckCircleOutlined /> },
          pending: { color: 'orange', icon: <ClockCircleOutlined /> },
          completed: { color: 'green', icon: <CheckCircleOutlined /> },
        };
        const config = statusConfig[status] || { color: 'default', icon: null };
        return (
          <Tag icon={config.icon} color={config.color}>
            {recentAppointments.find(item => item.status === status)?.statusText}
          </Tag>
        );
      },
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'confirmed':
        return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#fa8c16' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#fa541c' }} />;
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard Tổng quan</h1>
      
      {/* Thống kê tổng quan */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số Khách hàng"
              value={statsData.totalCustomers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số Cuộc hẹn"
              value={statsData.totalAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số Nhân viên"
              value={statsData.totalStaff}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Cuộc hẹn Hôm nay"
              value={statsData.todayAppointments}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Cuộc hẹn gần đây */}
        <Col span={16}>
          <Card title="Cuộc hẹn gần đây" bordered={false}>
            <Table
              columns={columns}
              dataSource={recentAppointments}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Thống kê trạng thái */}
        <Col span={8}>
          <Card title="Thống kê Trạng thái Cuộc hẹn" bordered={false}>
            {appointmentStatus.map((status, index) => (
              <div key={index} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>
                    {getStatusIcon(status.type)}
                    <span style={{ marginLeft: 8 }}>
                      {status.type === 'completed' && 'Đã hoàn thành'}
                      {status.type === 'confirmed' && 'Đã xác nhận'}
                      {status.type === 'pending' && 'Chờ xác nhận'}
                    </span>
                  </span>
                  <span>{status.count}</span>
                </div>
                <Progress
                  percent={Math.round((status.count / statsData.totalAppointments) * 100)}
                  strokeColor={status.color}
                  showInfo={false}
                />
              </div>
            ))}
          </Card>

          {/* Thông báo quan trọng */}
          <Card title="Thông báo quan trọng" bordered={false} style={{ marginTop: 16 }}>
            <div style={{ padding: '8px 0' }}>
              <div style={{ color: '#fa541c', marginBottom: 8 }}>
                <ExclamationCircleOutlined /> 2 cuộc hẹn cần xác nhận
              </div>
              <div style={{ color: '#1890ff', marginBottom: 8 }}>
                <CheckCircleOutlined /> 5 khách hàng mới trong tuần
              </div>
              <div style={{ color: '#52c41a' }}>
                <TeamOutlined /> 1 y tá mới gia nhập
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
