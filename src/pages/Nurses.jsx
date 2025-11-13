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
  Divider,
  AutoComplete
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  MedicineBoxOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import API_CONFIG from '../config/apiConfig';

const { Option } = Select;
const { TextArea } = Input;

const Nurses = () => {
  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNurse, setEditingNurse] = useState(null);
  const [doctorSearchLoading, setDoctorSearchLoading] = useState(false);
  const [doctorSearchResults, setDoctorSearchResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form] = Form.useForm();
  const { user } = useAuth();

  const specializationOptions = [
    { value: 'general', label: 'Điều dưỡng tổng quát' },
    { value: 'aesthetic', label: 'Điều dưỡng thẩm mỹ' },
    { value: 'surgical', label: 'Điều dưỡng phẫu thuật' },
    { value: 'recovery', label: 'Điều dưỡng hồi phục' },
    { value: 'emergency', label: 'Điều dưỡng cấp cứu' },
    { value: 'pediatric', label: 'Điều dưỡng nhi khoa' },
    { value: 'geriatric', label: 'Điều dưỡng lão khoa' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'inactive', label: 'Ngừng hoạt động' },
    { value: 'on_leave', label: 'Nghỉ phép' },
    { value: 'vacation', label: 'Nghỉ lễ' },
  ];

  // Kiểm tra quyền thêm/sửa y tá
  const canManageNurses = user?.is_staff || user?.role === 'admin';

  useEffect(() => {
    fetchNurses();
  }, []);

  const fetchNurses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/users/nurses/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNurses(data.results || data);
      } else {
        message.error('Không thể tải danh sách y tá');
      }
    } catch (error) {
      console.error('Error fetching nurses:', error);
      message.error('Lỗi khi tải danh sách y tá');
    } finally {
      setLoading(false);
    }
  };

  const searchDoctors = async (query) => {
    if (!query) return;
    
    setDoctorSearchLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/users/doctors/search/?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDoctorSearchResults(data.results || data);
      }
    } catch (error) {
      console.error('Error searching doctors:', error);
    } finally {
      setDoctorSearchLoading(false);
    }
  };

  const handleAddNurse = () => {
    setEditingNurse(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditNurse = async (nurse) => {
    setEditingNurse(nurse);
    
    // Nếu có bác sĩ quản lý, tìm kiếm để hiển thị tên
    if (nurse.assigned_doctor?.id) {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_CONFIG.BASE_URL}/users/doctors/search/?q=${encodeURIComponent(nurse.assigned_doctor.user?.first_name || '')}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDoctorSearchResults(data.results || data);
        }
      } catch (error) {
        console.error('Error searching current doctor:', error);
      }
    }

    form.setFieldsValue({
      first_name: nurse.user?.first_name || '',
      last_name: nurse.user?.last_name || '',
      email: nurse.user?.email || '',
      username: nurse.user?.username || '',
      years_of_experience: nurse.years_of_experience,
      bio: nurse.bio,
      education: nurse.education,
      certifications: nurse.certifications,
      phone_number: nurse.phone_number,
      emergency_contact: nurse.emergency_contact,
      is_available: nurse.is_available,
      status: nurse.status,
      assigned_doctor: nurse.assigned_doctor?.id || null,
    });
    setModalVisible(true);
  };

  const handleDoctorSelect = (doctorId) => {
    const selected = doctorSearchResults.find(doctor => doctor.id === doctorId);
    setSelectedDoctor(selected);
  };

  const handleDeleteNurse = async (nurseId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/users/nurses/${nurseId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success('Xóa y tá thành công');
        fetchNurses();
      } else {
        message.error('Không thể xóa y tá');
      }
    } catch (error) {
      console.error('Error deleting nurse:', error);
      message.error('Lỗi khi xóa y tá');
    }
  };

  const handleUpdateDoctor = async (nurseId, doctorId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/users/nurses/${nurseId}/update-doctor/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assigned_doctor_id: doctorId
        }),
      });

      if (response.ok) {
        const result = await response.json();
        message.success(result.message);
        if (result.unassigned_customers_count > 0) {
          message.info(`Đã gỡ ${result.unassigned_customers_count} khách hàng khỏi y tá này`);
        }
        fetchNurses();
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      message.error('Lỗi khi cập nhật bác sĩ');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('access_token');
      const url = editingNurse 
        ? `${API_CONFIG.BASE_URL}/users/nurses/${editingNurse.id}/`
        : `${API_CONFIG.BASE_URL}/users/nurses/`;
      
      const method = editingNurse ? 'PUT' : 'POST';

      const nurseData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        username: values.username,
        phone_number: values.phone_number,
        years_of_experience: values.years_of_experience || 0,
        bio: values.bio || '',
        education: values.education || '',
        certifications: values.certifications || '',
        emergency_contact: values.emergency_contact || '',
        is_available: values.is_available !== undefined ? values.is_available : true,
        status: values.status || 'active',
        assigned_doctor_id: values.assigned_doctor || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nurseData),
      });

      if (response.ok) {
        message.success(editingNurse ? 'Cập nhật y tá thành công' : 'Thêm y tá thành công');
        setModalVisible(false);
        fetchNurses();
      } else {
        const errorData = await response.json();
        message.error(errorData.detail || errorData.error || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error saving nurse:', error);
      message.error('Lỗi khi lưu thông tin y tá');
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
          <span>Y tá {user?.first_name} {user?.last_name}</span>
        </Space>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (phone) => (
        <Space>
          <PhoneOutlined />
          <span>{phone || 'Chưa có'}</span>
        </Space>
      ),
    },
    {
      title: 'Bác sĩ quản lý',
      dataIndex: 'assigned_doctor',
      key: 'assigned_doctor',
      render: (doctor, record) => {
        if (!doctor) {
          return <Tag color="orange">Chưa có bác sĩ</Tag>;
        }
        
        return (
          <Space direction="vertical" size="small">
            <span>Dr. {doctor.user?.first_name} {doctor.user?.last_name}</span>
            {canManageNurses && (
              <Button 
                type="link" 
                size="small" 
                onClick={() => handleUpdateDoctor(record.id, null)}
              >
                Gỡ bác sĩ
              </Button>
            )}
          </Space>
        );
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
              onClick={() => handleEditNurse(record)}
              disabled={!canManageNurses}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa y tá"
            description="Bạn có chắc chắn muốn xóa y tá này?"
            onConfirm={() => handleDeleteNurse(record.id)}
            okText="Có"
            cancelText="Không"
            disabled={!canManageNurses}
          >
            <Tooltip title="Xóa">
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                disabled={!canManageNurses}
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
            <TeamOutlined />
            <span>Quản lý Y tá</span>
          </Space>
        }
        extra={
          canManageNurses && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNurse}
            >
              Thêm Y tá
            </Button>
          )
        }
      >
        <Table
          columns={columns}
          dataSource={nurses}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} y tá`,
          }}
        />
      </Card>

      <Modal
        title={editingNurse ? 'Chỉnh sửa Y tá' : 'Thêm Y tá Mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
              >
                <Input placeholder="Nhập tên đăng nhập" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>

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
                name="years_of_experience"
                label="Số năm kinh nghiệm"
              >
                <InputNumber 
                  min={0} 
                  max={50} 
                  placeholder="Số năm kinh nghiệm"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
              >
                <Select placeholder="Chọn trạng thái">
                  {statusOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {canManageNurses && (
            <Form.Item
              name="assigned_doctor"
              label="Bác sĩ quản lý"
            >
              <Select
                placeholder="Tìm kiếm và chọn bác sĩ..."
                showSearch
                filterOption={false}
                onSearch={searchDoctors}
                onSelect={handleDoctorSelect}
                loading={doctorSearchLoading}
                notFoundContent={doctorSearchLoading ? "Đang tìm kiếm..." : "Không tìm thấy bác sĩ"}
              >
                {doctorSearchResults.map(doctor => (
                  <Option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.user?.first_name} {doctor.user?.last_name} - {doctor.specialization}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="education"
            label="Học vấn"
          >
            <TextArea rows={2} placeholder="Trình độ học vấn và bằng cấp" />
          </Form.Item>

          <Form.Item
            name="certifications"
            label="Chứng chỉ"
          >
            <TextArea rows={2} placeholder="Các chứng chỉ và chứng nhận" />
          </Form.Item>

          <Form.Item
            name="bio"
            label="Giới thiệu"
          >
            <TextArea rows={3} placeholder="Giới thiệu về y tá" />
          </Form.Item>

          <Form.Item
            name="emergency_contact"
            label="Liên hệ khẩn cấp"
          >
            <Input placeholder="Tên và số điện thoại liên hệ khẩn cấp" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="is_available"
                label="Có sẵn"
                valuePropName="checked"
              >
                <Switch checkedChildren="Có" unCheckedChildren="Không" defaultChecked />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingNurse ? 'Cập nhật' : 'Thêm'} Y tá
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

export default Nurses;
