import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Select,
  DatePicker,
  Modal,
  Form,
  message,
  Popconfirm,
  Spin,
  Tooltip,
  Timeline,
  Avatar,
  List,
  Badge,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  UserOutlined,
  TeamOutlined,
  PhoneOutlined,
  MessageOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import customerService from '../services/customerService';
import doctorService from '../services/doctorService';
import nurseService from '../services/nurseService';

const { Search } = Input;
const { Option } = Select;

const Customers = () => {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [isJourneyModalVisible, setIsJourneyModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [assigningCustomer, setAssigningCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [surgeryTypeFilter, setSurgeryTypeFilter] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [filteredNurses, setFilteredNurses] = useState([]);
  const [nurseLoading, setNurseLoading] = useState(false);
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();

  // Mock data for customer journey timeline
  const mockCustomerJourney = (customer) => [
    {
      id: 1,
      type: 'surgery',
      title: 'Phẫu thuật nâng ngực',
      description: 'Khách hàng đã thực hiện phẫu thuật nâng ngực thành công',
      date: customer.surgeryDate || '2024-12-15',
      time: '08:30',
      status: 'completed',
      performedBy: 'BS. Nguyễn Văn A',
      notes: 'Phẫu thuật diễn ra thuận lợi, không có biến chứng',
      icon: <MedicineBoxOutlined />,
      color: 'green'
    },
    {
      id: 2,
      type: 'care_call',
      title: 'Gọi điện chăm sóc sau phẫu thuật',
      description: 'Y tá gọi điện kiểm tra tình trạng sức khỏe',
      date: '2024-12-16',
      time: '14:00',
      status: 'completed',
      performedBy: 'YT. Trần Thị B',
      notes: 'Khách hàng cảm thấy đau nhẹ, đã hướng dẫn sử dụng thuốc giảm đau',
      duration: '15 phút',
      icon: <PhoneOutlined />,
      color: 'blue'
    },
    {
      id: 3,
      type: 'customer_action',
      title: 'Khách hàng gửi hình ảnh vết mổ',
      description: 'Khách hàng chụp và gửi hình ảnh vết mổ qua ứng dụng',
      date: '2024-12-17',
      time: '09:15',
      status: 'completed',
      performedBy: customer.name,
      notes: 'Vết mổ sạch sẽ, không có dấu hiệu nhiễm trùng',
      icon: <MessageOutlined />,
      color: 'purple'
    },
    {
      id: 4,
      type: 'doctor_feedback',
      title: 'Bác sĩ đánh giá tình trạng',
      description: 'Bác sĩ xem xét hình ảnh và đưa ra nhận xét',
      date: '2024-12-17',
      time: '11:30',
      status: 'completed',
      performedBy: 'BS. Nguyễn Văn A',
      notes: 'Vết mổ lành tốt, tiếp tục theo dõi và vệ sinh đúng cách',
      icon: <CheckCircleOutlined />,
      color: 'green'
    },
    {
      id: 5,
      type: 'care_call',
      title: 'Gọi điện tư vấn chăm sóc',
      description: 'Y tá hướng dẫn chăm sóc vết mổ và chế độ dinh dưỡng',
      date: '2024-12-18',
      time: '10:00',
      status: 'completed',
      performedBy: 'YT. Trần Thị B',
      notes: 'Khách hàng tuân thủ tốt hướng dẫn, tình trạng ổn định',
      duration: '20 phút',
      icon: <PhoneOutlined />,
      color: 'blue'
    },
    {
      id: 6,
      type: 'customer_action',
      title: 'Khách hàng báo cáo triệu chứng',
      description: 'Khách hàng báo cáo cảm thấy ngứa nhẹ quanh vết mổ',
      date: '2024-12-19',
      time: '16:45',
      status: 'pending',
      performedBy: customer.name,
      notes: 'Đã thông báo cho y tá, đang chờ tư vấn',
      icon: <ExclamationCircleOutlined />,
      color: 'orange'
    },
    {
      id: 7,
      type: 'nurse_feedback',
      title: 'Y tá tư vấn về triệu chứng ngứa',
      description: 'Y tá giải thích về hiện tượng ngứa là bình thường trong quá trình lành vết thương',
      date: '2024-12-19',
      time: '17:30',
      status: 'completed',
      performedBy: 'YT. Trần Thị B',
      notes: 'Hướng dẫn khách hàng không gãi, giữ vệ sinh và báo cáo nếu triệu chứng nặng hơn',
      icon: <CheckCircleOutlined />,
      color: 'green'
    },
    {
      id: 8,
      type: 'upcoming',
      title: 'Lịch hẹn tái khám',
      description: 'Lịch hẹn tái khám định kỳ sau 1 tuần',
      date: '2024-12-22',
      time: '09:00',
      status: 'scheduled',
      performedBy: 'Hệ thống',
      notes: 'Khách hàng cần đến phòng khám để bác sĩ kiểm tra',
      icon: <CalendarOutlined />,
      color: 'cyan'
    }
  ];

  // Load customers from API
  useEffect(() => {
    fetchCustomers();
    fetchDoctors();
    fetchNurses();
  }, []);

  const fetchCustomers = async (searchQuery = '') => {
    setDataLoading(true);
    try {
      const data = await customerService.getCustomers(searchQuery);
      // Transform API data to match frontend format
      const transformedCustomers = data.map(customer => ({
        id: customer.id,
        name: `${customer.user?.first_name || ''} ${customer.user?.last_name || ''}`.trim(),
        phone: customer.phone_number,
        email: customer.user?.email,
        address: customer.address,
        surgeryType: getLatestSurgeryType(customer),
        surgeryDate: getLatestSurgeryDate(customer),
        status: customer.status,
        assignedDoctor: customer.assigned_doctor,
        assignedNurse: customer.assigned_nurse,
        originalData: customer // Keep original data for reference
      }));
      setCustomers(transformedCustomers);
    } catch (error) {
      message.error(error.message);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      message.error('Không thể tải danh sách bác sĩ');
    }
  };

  const fetchNurses = async () => {
    try {
      const data = await nurseService.getNurses();
      setNurses(data);
    } catch (error) {
      console.error('Error fetching nurses:', error);
      message.error('Không thể tải danh sách y tá');
    }
  };

  // Helper functions to extract data from customer object
  const getLatestSurgeryType = (customer) => {
    // This will be implemented when we have surgery data
    return ''; // Placeholder
  };

  const getLatestSurgeryDate = (customer) => {
    // This will be implemented when we have surgery data
    return '2024-12-15'; // Placeholder
  };

  const getDoctorName = (doctor) => {
    if (!doctor) return 'Chưa gán';
    return `${doctor.user?.first_name || ''} ${doctor.user?.last_name || ''}`.trim() || 'Không xác định';
  };

  const getNurseName = (nurse) => {
    if (!nurse) return 'Chưa gán';
    return `${nurse.user?.first_name || ''} ${nurse.user?.last_name || ''}`.trim() || 'Không xác định';
  };

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !searchQuery || 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || customer.status === statusFilter;
    const matchesSurgeryType = !surgeryTypeFilter || customer.surgeryType === surgeryTypeFilter;
    
    return matchesSearch && matchesStatus && matchesSurgeryType;
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <span>{text}</span>
          {record.status === 'inactive' && (
            <Tag color="red">Ngừng theo dõi</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Bác sĩ quản lý',
      dataIndex: 'assignedDoctor',
      key: 'assignedDoctor',
      render: (doctor) => (
        <Tooltip title={doctor?.specialization || 'Chưa gán bác sĩ'}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: doctor ? '#fff7e6' : '#f5f5f5',
            border: doctor ? '2px solid #fa8c16' : '2px solid #d9d9d9',
            color: doctor ? '#d46b08' : '#8c8c8c',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: doctor ? '0 2px 4px rgba(250, 140, 22, 0.1)' : 'none'
          }}>
            <UserOutlined style={{ marginRight: '6px', fontSize: '14px' }} />
            {getDoctorName(doctor)}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Y tá quản lý',
      dataIndex: 'assignedNurse',
      key: 'assignedNurse',
      render: (nurse) => (
        <Tooltip title={nurse?.specialization || 'Chưa gán y tá'}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: nurse ? '#f6ffed' : '#f5f5f5',
            border: nurse ? '2px dashed #52c41a' : '2px dashed #d9d9d9',
            color: nurse ? '#389e0d' : '#8c8c8c',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: nurse ? '0 2px 4px rgba(82, 196, 26, 0.1)' : 'none'
          }}>
            <TeamOutlined style={{ marginRight: '6px', fontSize: '14px' }} />
            {getNurseName(nurse)}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Loại phẫu thuật',
      dataIndex: 'surgeryType',
      key: 'surgeryType',
    },
    {
      title: 'Ngày phẫu thuật',
      dataIndex: 'surgeryDate',
      key: 'surgeryDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Đang theo dõi' : 'Ngừng theo dõi'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            title="Xem chi tiết"
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Sửa thông tin"
          />
          <Button
            type="link"
            icon={<TeamOutlined />}
            onClick={() => handleAssign(record)}
            title="Gán bác sĩ/y tá"
          />
          <Popconfirm
            title="Xóa khách hàng"
            description="Bạn có chắc chắn muốn xóa khách hàng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />} title="Xóa khách hàng" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      surgeryType: customer.surgeryType,
      surgeryDate: customer.surgeryDate ? dayjs(customer.surgeryDate) : null,
      status: customer.status,
    });
    setIsModalVisible(true);
  };

  const handleAssign = (customer) => {
    setAssigningCustomer(customer);
    assignForm.setFieldsValue({
      assigned_doctor_id: customer.assignedDoctor?.id || null,
      assigned_nurse_id: customer.assignedNurse?.id || null,
    });
    setIsAssignModalVisible(true);
  };

  const handleView = (customer) => {
    setViewingCustomer(customer);
    setIsJourneyModalVisible(true);
  };

  const handleJourneyModalCancel = () => {
    setIsJourneyModalVisible(false);
    setViewingCustomer(null);
  };

  const handleDelete = async (id) => {
    try {
      // Perform soft delete by setting deleted_at timestamp
      await customerService.softDeleteCustomer(id);
      // Remove the customer from local state
      setCustomers(customers.filter(customer => customer.id !== id));
      message.success('Đã xóa khách hàng thành công');
    } catch (error) {
      message.error('Không thể xóa khách hàng');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingCustomer) {
        // Cập nhật khách hàng
        const updateData = {
          phone_number: values.phone,
          address: values.address,
          status: values.status,
        };
        await customerService.updateCustomer(editingCustomer.id, updateData);
        message.success('Cập nhật khách hàng thành công');
        fetchCustomers(); // Refresh data
      } else {
        // Thêm khách hàng mới
        const createData = {
          phone_number: values.phone,
          address: values.address,
          surgery_type: values.surgeryType,
          surgery_date: values.surgeryDate?.format('YYYY-MM-DD'),
        };
        await customerService.createCustomer(createData);
        message.success('Thêm khách hàng mới thành công');
        fetchCustomers(); // Refresh data
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Operation failed:', error);
      message.error(error.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignModalOk = async () => {
    try {
      const values = await assignForm.validateFields();
      setLoading(true);

      // Prepare update data for the new API
      const updateData = {
        assigned_doctor: values.assigned_doctor_id || null,
        assigned_nurse: values.assigned_nurse_id || null,
      };

      // Use the new assignment update API
      await customerService.updateCustomerAssignment(assigningCustomer.id, updateData);
      message.success('Cập nhật bác sĩ/y tá quản lý thành công');
      fetchCustomers(); // Refresh data
      setIsAssignModalVisible(false);
      assignForm.resetFields();
    } catch (error) {
      console.error('Assign operation failed:', error);
      message.error(error.message || 'Không thể cập nhật bác sĩ/y tá');
    } finally {
      setLoading(false);
    }
  };

  // Filter nurses based on selected doctor
  const getFilteredNurses = () => {
    const selectedDoctorId = assignForm.getFieldValue('assigned_doctor_id');
    if (!selectedDoctorId) {
      return []; // Don't show any nurses if no doctor is selected
    }
    return nurses.filter(nurse => nurse.assigned_doctor?.id === selectedDoctorId);
  };

  // Handle doctor selection change
  const handleDoctorChange = async (doctorId) => {
    // Clear nurse selection when doctor changes
    assignForm.setFieldsValue({
      assigned_nurse_id: null
    });

    if (doctorId) {
      // Call API to get nurses by doctor
      setNurseLoading(true);
      try {
        const nursesData = await nurseService.getNursesByDoctor(doctorId);
        setFilteredNurses(nursesData);
      } catch (error) {
        console.error('Error fetching nurses by doctor:', error);
        message.error('Không thể tải danh sách y tá của bác sĩ');
        setFilteredNurses([]);
      } finally {
        setNurseLoading(false);
      }
    } else {
      // Clear filtered nurses when no doctor is selected
      setFilteredNurses([]);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    // Use backend search API instead of frontend filtering
    fetchCustomers(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const handleSurgeryTypeFilter = (value) => {
    setSurgeryTypeFilter(value);
  };

  const handleRefresh = () => {
    fetchCustomers();
    fetchDoctors();
    fetchNurses();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAssignModalCancel = () => {
    setIsAssignModalVisible(false);
    assignForm.resetFields();
  };

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>Quản lý Khách hàng</h1>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={dataLoading}
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Thêm Khách hàng
            </Button>
          </Space>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
          <Search
            placeholder="Tìm kiếm theo tên, số điện thoại, email..."
            style={{ width: 300 }}
            onSearch={handleSearch}
            allowClear
            enterButton={<SearchOutlined />}
          />
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            allowClear
            onChange={handleStatusFilter}
            value={statusFilter}
          >
            <Option value="active">Đang theo dõi</Option>
            <Option value="inactive">Ngừng theo dõi</Option>
            <Option value="new">Mới</Option>
            <Option value="discharged">Đã xuất viện</Option>
          </Select>
          <Select
            placeholder="Loại phẫu thuật"
            style={{ width: 200 }}
            allowClear
            onChange={handleSurgeryTypeFilter}
            value={surgeryTypeFilter}
          >
            <Option value="nâng ngực">Nâng ngực</Option>
            <Option value="hút mỡ">Hút mỡ</Option>
            <Option value="combo ngoài">Combo ngoài</Option>
            <Option value="combo trong">Combo trong</Option>
            <Option value="Nâng ngực treo sa trễ">Nâng ngực treo sa trễ</Option>
          </Select>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <Tag color="blue">Tổng: {filteredCustomers.length} khách hàng</Tag>
          </div>
        </div>

        {/* Bảng khách hàng */}
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          loading={dataLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} khách hàng`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa khách hàng */}
      <Modal
        title={editingCustomer ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="customerForm"
        >
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Nhập họ tên khách hàng" />
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
            name="email"
            label="Email"
            rules={[
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <Input.TextArea placeholder="Nhập địa chỉ" rows={3} />
          </Form.Item>

          <Form.Item
            name="surgeryType"
            label="Loại phẫu thuật"
            rules={[{ required: true, message: 'Vui lòng chọn loại phẫu thuật' }]}
          >
            <Select placeholder="Chọn loại phẫu thuật">
              <Option value="nâng ngực">Nâng ngực</Option>
              <Option value="hút mỡ">Hút mỡ</Option>
              <Option value="combo ngoài">Combo ngoài</Option>
              <Option value="combo trong">Combo trong</Option>
              <Option value="Nâng ngực treo sa trễ">Nâng ngực treo sa trễ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="surgeryDate"
            label="Ngày phẫu thuật"
            rules={[{ required: true, message: 'Vui lòng chọn ngày phẫu thuật' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày phẫu thuật"
            />
          </Form.Item>

          {editingCustomer && (
            <Form.Item
              name="status"
              label="Trạng thái"
            >
              <Select>
                <Option value="active">Đang theo dõi</Option>
                <Option value="inactive">Ngừng theo dõi</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Modal gán bác sĩ/y tá */}
      <Modal
        title={`Gán bác sĩ/y tá cho ${assigningCustomer?.name}`}
        open={isAssignModalVisible}
        onOk={handleAssignModalOk}
        onCancel={handleAssignModalCancel}
        confirmLoading={loading}
        width={500}
      >
        <Form
          form={assignForm}
          layout="vertical"
          name="assignForm"
        >
          <Form.Item
            name="assigned_doctor_id"
            label="Bác sĩ quản lý"
            rules={[{ required: true, message: 'Vui lòng chọn bác sĩ quản lý' }]}
          >
            <Select
              placeholder="Chọn bác sĩ quản lý"
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onKeyDown={(e) => {
                // Ngăn chặn submit form khi nhấn Enter trong tìm kiếm
                if (e.key === 'Enter') {
                  e.stopPropagation();
                }
              }}
              onChange={handleDoctorChange}
            >
              {doctors.map(doctor => (
                <Option key={doctor.id} value={doctor.id}>
                  {getDoctorName(doctor)} - {doctor.specialization || 'Không xác định'}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="assigned_nurse_id"
            label="Y tá quản lý"
          >
            <Select
              placeholder="Chọn y tá quản lý"
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onKeyDown={(e) => {
                // Ngăn chặn submit form khi nhấn Enter trong tìm kiếm
                if (e.key === 'Enter') {
                  e.stopPropagation();
                }
              }}
              disabled={!assignForm.getFieldValue('assigned_doctor_id')}
            >
              {getFilteredNurses().map(nurse => (
                <Option key={nurse.id} value={nurse.id}>
                  {getNurseName(nurse)} - {nurse.specialization || 'Không xác định'}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal hành trình khách hàng */}
      <Modal
        title={`Hành trình chăm sóc - ${viewingCustomer?.name}`}
        open={isJourneyModalVisible}
        onCancel={handleJourneyModalCancel}
        footer={[
          <Button key="close" onClick={handleJourneyModalCancel}>
            Đóng
          </Button>
        ]}
        width={800}
        style={{ maxHeight: '80vh' }}
      >
        {viewingCustomer && (
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div><strong>Thông tin khách hàng:</strong></div>
                <div>Tên: {viewingCustomer.name}</div>
                <div>Số điện thoại: {viewingCustomer.phone}</div>
                <div>Loại phẫu thuật: {viewingCustomer.surgeryType || 'Chưa cập nhật'}</div>
                <div>Ngày phẫu thuật: {dayjs(viewingCustomer.surgeryDate).format('DD/MM/YYYY')}</div>
              </Space>
            </div>

            <Divider />

            <Timeline
              mode="left"
              items={mockCustomerJourney(viewingCustomer).map((item) => ({
                color: item.color,
                dot: (
                  <Badge
                    count={item.icon}
                    style={{ 
                      backgroundColor: item.color,
                      color: 'white'
                    }}
                  />
                ),
                children: (
                  <Card 
                    size="small" 
                    style={{ 
                      marginBottom: 16,
                      borderLeft: `4px solid ${item.color}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: 8 }}>
                          {item.title}
                        </div>
                        <div style={{ color: '#666', marginBottom: 8 }}>
                          {item.description}
                        </div>
                        <div style={{ fontSize: '14px', color: '#888' }}>
                          <strong>Thực hiện bởi:</strong> {item.performedBy}
                        </div>
                        {item.notes && (
                          <div style={{ marginTop: 8, padding: 8, backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                            <strong>Ghi chú:</strong> {item.notes}
                          </div>
                        )}
                        {item.duration && (
                          <div style={{ marginTop: 4, fontSize: '12px', color: '#999' }}>
                            Thời lượng: {item.duration}
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right', minWidth: 120 }}>
                        <div style={{ fontWeight: 'bold', color: item.color }}>
                          {dayjs(item.date).format('DD/MM/YYYY')}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          {item.time}
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <Tag 
                            color={
                              item.status === 'completed' ? 'green' :
                              item.status === 'pending' ? 'orange' :
                              item.status === 'scheduled' ? 'blue' : 'default'
                            }
                          >
                            {item.status === 'completed' ? 'Hoàn thành' :
                             item.status === 'pending' ? 'Đang chờ' :
                             item.status === 'scheduled' ? 'Đã lên lịch' : item.status}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </Card>
                ),
              }))}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Customers;
