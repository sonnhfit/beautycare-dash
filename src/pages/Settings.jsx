import React from 'react';
import { Card, Form, Input, Button, Switch, Select, Divider, message } from 'antd';
import { SaveOutlined, BellOutlined, SecurityScanOutlined } from '@ant-design/icons';

const { Option } = Select;

const Settings = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Settings saved:', values);
    message.success('Cài đặt đã được lưu thành công');
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Cài đặt Hệ thống</h1>
      
      <Card title="Thông tin chung" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            clinicName: 'BeautyCare',
            address: '123 Đường ABC, Quận 1, TP.HCM',
            phone: '028 1234 5678',
            email: 'info@beautycare',
          }}
        >
          <Form.Item
            name="clinicName"
            label="Tên phòng khám"
            rules={[{ required: true, message: 'Vui lòng nhập tên phòng khám' }]}
          >
            <Input placeholder="Nhập tên phòng khám" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea placeholder="Nhập địa chỉ" rows={3} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
        </Form>
      </Card>

      <Card title="Cài đặt Thông báo" style={{ marginBottom: 24 }}>
        <Form layout="vertical">
          <Form.Item label="Thông báo Email">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Gửi thông báo qua email</span>
              <Switch defaultChecked />
            </div>
          </Form.Item>

          <Form.Item label="Thông báo SMS">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Gửi thông báo qua SMS</span>
              <Switch defaultChecked />
            </div>
          </Form.Item>

          <Form.Item label="Nhắc lịch hẹn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Tự động nhắc lịch hẹn</span>
              <Switch defaultChecked />
            </div>
          </Form.Item>

          <Form.Item label="Thời gian nhắc lịch">
            <Select defaultValue="1" style={{ width: 200 }}>
              <Option value="1">1 giờ trước</Option>
              <Option value="2">2 giờ trước</Option>
              <Option value="6">6 giờ trước</Option>
              <Option value="24">1 ngày trước</Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Bảo mật" style={{ marginBottom: 24 }}>
        <Form layout="vertical">
          <Form.Item label="Độ dài mật khẩu tối thiểu">
            <Select defaultValue="8" style={{ width: 200 }}>
              <Option value="6">6 ký tự</Option>
              <Option value="8">8 ký tự</Option>
              <Option value="12">12 ký tự</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Yêu cầu mật khẩu phức tạp">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</span>
              <Switch />
            </div>
          </Form.Item>

          <Form.Item label="Thời gian hết hạn phiên đăng nhập">
            <Select defaultValue="8" style={{ width: 200 }}>
              <Option value="4">4 giờ</Option>
              <Option value="8">8 giờ</Option>
              <Option value="24">24 giờ</Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Giao diện">
        <Form layout="vertical">
          <Form.Item label="Chủ đề">
            <Select defaultValue="light" style={{ width: 200 }}>
              <Option value="light">Sáng</Option>
              <Option value="dark">Tối</Option>
              <Option value="auto">Tự động</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Ngôn ngữ">
            <Select defaultValue="vi" style={{ width: 200 }}>
              <Option value="vi">Tiếng Việt</Option>
              <Option value="en">English</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mật độ hiển thị">
            <Select defaultValue="default" style={{ width: 200 }}>
              <Option value="compact">Nhỏ gọn</Option>
              <Option value="default">Mặc định</Option>
              <Option value="comfortable">Thoải mái</Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>

      <Divider />

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Button 
          type="primary" 
          size="large" 
          icon={<SaveOutlined />}
          onClick={() => form.submit()}
        >
          Lưu Cài đặt
        </Button>
      </div>
    </div>
  );
};

export default Settings;
