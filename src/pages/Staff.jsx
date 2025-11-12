import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  message,
  Popconfirm,
  Avatar,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const Staff = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();

  // Dữ liệu mẫu nhân viên
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'BS. Trần Văn X',
      email: 'tranvan.x@beautycare.com',
      phone: '0901111111',
      role: 'doctor',
      specialty: 'Phẫu thuật thẩm mỹ',
      status: 'active',
      avatar: null,
    },
    {
      id: 2,
      name: 'BS. Lê Thị Y',
      email: 'lethi.y@beautycare.com',
      phone: '0902222222',
      role: 'doctor',
      specialty: 'Da liễu thẩm mỹ',
      status: 'active',
      avatar: null,
    },
    {
      id: 3,
      name: 'YT. Nguyễn Thị A',
      email: 'nguyenthi.a@beautycare.com',
      phone: '0903333333',
      role: 'nurse',
      specialty: 'Chăm sóc hậu phẫu',
      status: 'active',
      avatar: null,
    },
    {
      id: 4,
      name: 'YT. Phạm Văn B',
      email: 'phamvan.b@beautycare.com',
      phone: '0904444444',
      role: 'nurse',
      specialty: 'Theo dõi bệnh nhân',
      status: 'inactive',
      avatar: null,
    },
    {
      id: 5,
      name: 'BS. Nguyễn Văn Z',
      email: 'nguyenvan.z@beautycare.com',
      phone: '0905555555',
      role: 'doctor',
      specialty: 'Phẫu thuật tạo hình',
      status: 'active',
      avatar: null,
    },
  ]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Nhân viên',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar 
            icon={record.role === 'doctor' ? <MedicineBoxOutlined /> : <UserOutlined />} 
            style={{ 
              backgroundColor: record.role === 'doctor' ? '#1890ff' : '#52c41a' 
            }}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag 
          color={role === 'doctor' ? 'blue' : 'green'} 
          icon={role === 'doctor' ? <MedicineBoxOutlined /> : <TeamOutlined />}
        >
          {role === 'doctor' ? 'Bác sĩ' : 'Y tá'}
        </Tag>
      ),
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'specialty',
      key: 'specialty',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Đang làm việc' : 'Ngừng làm việc'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title={record.status === 'active' ? 'Ngừng làm việc' : 'Kích hoạt lại'}
            description={`Bạn có chắc chắn muốn ${record.status === 'active' ? 'ngừng làm việc' : 'kích hoạt lại'} nhân viên này?`}
            onConfirm={() => handleToggleStatus(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              type="link" 
              danger={record.status === 'active'}
              style={{ color: record.status === 'active' ? '#ff4d4f' : '#52c41a' }}
            >
              {record.status === 'active' ? 'Ngừng làm việc' : 'Kích hoạt'}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Xóa nhân viên"
            description="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingStaff(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    form.setFieldsValue(staffMember);
    setIsModalVisible(true);
  };

  const handleToggleStatus = (id) => {
    setStaff(staff.map(member =>
      member.id === id 
        ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
        : member
    ));
    message.success('Cập nhật trạng thái thành công');
  };

  const handleDelete = (id) => {
    setStaff(staff.filter(member => member.id !== id));
    message.success('Xóa nhân viên thành công');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingStaff) {
        // Cập nhật nhân viên
        setStaff(staff.map(member =>
          member.id === editingStaff.id
            ? { ...member, ...values }
            : member
        ));
        message.success('Cập nhật nhân viên thành công');
      } else {
        // Thêm nhân viên mới
        const newStaff = {
          id: Math.max(...staff.map(m => m.id)) + 1,
          ...values,
          status: 'active',
          avatar: null,
        };
        setStaff([...staff, newStaff]);
        message.success('Thêm nhân viên mới thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0 }}>Quản lý Nhân viên</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm Nhân viên
          </Button>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Search
            placeholder="Tìm kiếm theo tên, email..."
            style={{ width: 300 }}
            onSearch={(value) => console.log('Search:', value)}
          />
          <Select
            placeholder="Vai trò"
            style={{ width: 150 }}
            allowClear
          >
            <Option value="doctor">Bác sĩ</Option>
            <Option value="nurse">Y tá</Option>
          </Select>
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            allowClear
          >
            <Option value="active">Đang làm việc</Option>
            <Option value="inactive">Ngừng làm việc</Option>
          </Select>
        </div>

        {/* Bảng nhân viên */}
        <Table
          columns={columns}
          dataSource={staff}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} nhân viên`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa nhân viên */}
      <Modal
        title={editingStaff ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="staffForm"
        >
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Nhập họ tên nhân viên" />
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

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="doctor">Bác sĩ</Option>
              <Option value="nurse">Y tá</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="specialty"
            label="Chuyên môn"
            rules={[{ required: true, message: 'Vui lòng nhập chuyên môn' }]}
          >
            <Input placeholder="Nhập chuyên môn" />
          </Form.Item>

          {editingStaff && (
            <Form.Item
              name="status"
              label="Trạng thái"
            >
              <Select>
                <Option value="active">Đang làm việc</Option>
                <Option value="inactive">Ngừng làm việc</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Staff;
