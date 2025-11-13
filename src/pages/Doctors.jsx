import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  message,
  Card,
  Tag,
  Popconfirm,
  Tooltip,
  Row,
  Col,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import API_CONFIG from '../config/apiConfig';

const { Option } = Select;
const { TextArea } = Input;

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form] = Form.useForm();
  const { user } = useAuth();

  const specializationOptions = [
    { value: 'minor_surgery', label: 'Tiểu phẫu' },
    { value: 'major_surgery', label: 'Đại phẫu' },
    { value: 'dermatology', label: 'Da liễu' },
    { value: 'traditional_medicine', label: 'Y học cổ truyền' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on_leave', label: 'On Leave' },
    { value: 'vacation', label: 'Vacation' },
  ];

  // Kiểm tra quyền thêm/sửa bác sĩ
  // Tạm thời cho phép tất cả user để test
  const canManageDoctors = true; // user?.role === 'customer_care' || user?.is_superuser;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/doctors/doctors/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.results || data);
      } else {
        message.error('Không thể tải danh sách bác sĩ');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      message.error('Lỗi khi tải danh sách bác sĩ');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    form.setFieldsValue({
      first_name: doctor.user?.first_name || '',
      last_name: doctor.user?.last_name || '',
      email: doctor.user?.email || '',
      license_number: doctor.license_number,
      specialization: doctor.specialization,
      years_of_experience: doctor.years_of_experience,
      bio: doctor.bio,
      education: doctor.education,
      certifications: doctor.certifications,
      languages_spoken: doctor.languages_spoken,
      phone_number: doctor.phone_number,
      consultation_fee: doctor.consultation_fee,
      is_available: doctor.is_available,
      status: doctor.status,
    });
    setModalVisible(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/doctors/doctors/${doctorId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success('Xóa bác sĩ thành công');
        fetchDoctors();
      } else {
        message.error('Không thể xóa bác sĩ');
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      message.error('Lỗi khi xóa bác sĩ');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('access_token');
      const url = editingDoctor 
        ? `${API_CONFIG.BASE_URL}/doctors/doctors/${editingDoctor.id}/`
        : `${API_CONFIG.BASE_URL}/doctors/doctors/`;
      
      const method = editingDoctor ? 'PUT' : 'POST';

      const doctorData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone_number: values.phone_number,
        specialization: values.specialization,
        area: values.area,
        branch: values.branch,
        // Set default values for other fields
        license_number: '',
        years_of_experience: 0,
        bio: '',
        education: '',
        certifications: '',
        languages_spoken: '',
        emergency_contact: '',
        consultation_fee: 0,
        is_available: true,
        status: 'active',
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });

      if (response.ok) {
        message.success(editingDoctor ? 'Cập nhật bác sĩ thành công' : 'Thêm bác sĩ thành công');
        setModalVisible(false);
        fetchDoctors();
      } else {
        const errorData = await response.json();
        message.error(errorData.detail || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error saving doctor:', error);
      message.error('Lỗi khi lưu thông tin bác sĩ');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên',
      dataIndex: 'user',
      key: 'name',
      render: (user) => (
        <Space>
          <UserOutlined />
          <span>Dr. {user?.first_name} {user?.last_name}</span>
        </Space>
      ),
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (specialization) => {
        const spec = specializationOptions.find(s => s.value === specialization);
        return <Tag color="blue">{spec?.label || specialization}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          active: { color: 'green', text: 'Đang hoạt động' },
          inactive: { color: 'red', text: 'Ngừng hoạt động' },
          on_leave: { color: 'orange', text: 'Nghỉ phép' },
          vacation: { color: 'gold', text: 'Nghỉ lễ' },
        };
        const statusInfo = statusMap[status] || { color: 'default', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditDoctor(record)}
              disabled={!canManageDoctors}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa bác sĩ"
            description="Bạn có chắc chắn muốn xóa bác sĩ này?"
            onConfirm={() => handleDeleteDoctor(record.id)}
            okText="Có"
            cancelText="Không"
            disabled={!canManageDoctors}
          >
            <Tooltip title="Xóa">
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                disabled={!canManageDoctors}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={
          <Space>
            <MedicineBoxOutlined />
            <span>Quản lý Bác sĩ</span>
          </Space>
        }
        extra={
          canManageDoctors && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddDoctor}
            >
              Thêm Bác sĩ
            </Button>
          )
        }
      >
        <Table
          columns={columns}
          dataSource={doctors}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} bác sĩ`,
          }}
        />
      </Card>

      <Modal
        title={editingDoctor ? 'Chỉnh sửa Bác sĩ' : 'Thêm Bác sĩ Mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="Tên"
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nhập tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Họ"
                rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
              >
                <Input placeholder="Nhập họ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="area"
                label="Khu vực"
                rules={[{ required: true, message: 'Vui lòng nhập khu vực' }]}
              >
                <Input placeholder="VD: Hà Nội, TP.HCM" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="branch"
                label="Chi nhánh"
                rules={[{ required: true, message: 'Vui lòng nhập chi nhánh' }]}
              >
                <Input placeholder="Nhập chi nhánh làm việc" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="specialization"
            label="Chuyên môn"
            rules={[{ required: true, message: 'Vui lòng chọn chuyên môn' }]}
          >
            <Select placeholder="Chọn chuyên môn">
              {specializationOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingDoctor ? 'Cập nhật' : 'Thêm'} Bác sĩ
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Doctors;
