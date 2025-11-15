import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Switch,
  message,
  Popconfirm,
  Upload,
  Image,
  Divider,
  Timeline,
  Progress,
  Badge,
  Avatar,
  List,
  Typography,
  Tooltip,
  Drawer,
  Collapse,
  Dropdown,
  Checkbox
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CameraOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UploadOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  SettingOutlined,
  MoreOutlined,
  DragOutlined,
  CopyOutlined,
  ScheduleOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import customerService from '../services/customerService';
import carePlanService from '../services/carePlanService';
import doctorService from '../services/doctorService';
import nurseService from '../services/nurseService';
import customerCareService from '../services/customerCareService';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

const CustomerCare = () => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('activities');
  const [activities, setActivities] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  // Filter states
  const [doctorFilter, setDoctorFilter] = useState(null);
  const [surgeryTypeFilter, setSurgeryTypeFilter] = useState(null);
  const [postOpDayFilter, setPostOpDayFilter] = useState(null);
  const [taskStatusFilter, setTaskStatusFilter] = useState(null);

  // Modal states
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [dailyCareActivityModalVisible, setDailyCareActivityModalVisible] = useState(false);
  const [headerActivityModalVisible, setHeaderActivityModalVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // Forms
  const [activityForm] = Form.useForm();
  const [appointmentForm] = Form.useForm();
  const [dailyCareActivityForm] = Form.useForm();
  const [headerActivityForm] = Form.useForm();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [customersData, doctorsData] = await Promise.all([
        customerService.getCustomers(),
        doctorService.getDoctors()
      ]);
      
      // Transform customers data to match frontend format
      const transformedCustomers = customersData.map(customer => ({
        id: customer.id,
        name: `${customer.user?.first_name || ''} ${customer.user?.last_name || ''}`.trim() || customer.user?.username || 'Khách hàng',
        surgeryType: customer.surgeries?.[0]?.surgery_type || 'Chưa có thông tin',
        postOpDay: calculatePostOpDay(customer.surgeries?.[0]?.surgery_date),
        todayTasks: calculateTodayTasks(customer),
        nextAppointment: getNextAppointment(customer),
        progress: calculateProgress(customer),
        doctor: customer.assigned_doctor?.user?.first_name ? 
          `BS. ${customer.assigned_doctor.user.first_name} ${customer.assigned_doctor.user.last_name || ''}`.trim() : 
          'Chưa gán bác sĩ',
        status: customer.status || 'active'
      }));
      
      setCustomers(transformedCustomers);
      setDoctors(doctorsData);
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      message.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for data transformation
  const calculatePostOpDay = (surgeryDate) => {
    if (!surgeryDate) return 0;
    const surgery = new Date(surgeryDate);
    const today = new Date();
    const diffTime = Math.abs(today - surgery);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTodayTasks = (customer) => {
    // This would be calculated from the customer's care journey activities
    // For now, return a mock value
    return Math.floor(Math.random() * 5) + 1;
  };

  const getNextAppointment = (customer) => {
    // This would be fetched from customer's appointments
    // For now, return null
    return null;
  };

  const calculateProgress = (customer) => {
    // This would be calculated based on completed activities vs total activities
    // For now, return a mock value
    return Math.floor(Math.random() * 100);
  };

  // Load customer activities when a customer is selected
  const loadCustomerActivities = async (customerId) => {
    try {
      const activitiesData = await customerCareService.getCustomerActivities(customerId);
      
      // Transform activities data to group by day
      const groupedActivities = {};
      
      // Handle different response formats
      const activitiesList = activitiesData.results || activitiesData.data || [];
      
      activitiesList.forEach(activity => {
        const day = activity.days_post_op || 1;
        if (!groupedActivities[day]) {
          groupedActivities[day] = [];
        }
        
        groupedActivities[day].push({
          id: activity.id,
          name: activity.name,
          description: activity.description,
          type: activity.action_type,
          status: activity.status,
          dueDate: activity.scheduled_date,
          priority: activity.priority || 'medium',
          requiresApproval: activity.approval_type !== 'none'
        });
      });
      
      setActivities(groupedActivities);
    } catch (error) {
      console.error('Error loading customer activities:', error);
      message.error('Lỗi khi tải hoạt động của khách hàng');
    }
  };

  // Load customer appointments when a customer is selected
  const loadCustomerAppointments = async (customerId) => {
    try {
      const appointmentsData = await customerService.getCustomerAppointments(customerId);
      // Transform appointments data to match frontend format
      const transformedAppointments = appointmentsData.map(appointment => ({
        id: appointment.id,
        type: appointment.appointment_type || 'tai_kham',
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        doctor: appointment.doctor?.user?.first_name ? 
          `BS. ${appointment.doctor.user.first_name} ${appointment.doctor.user.last_name || ''}`.trim() : 
          'Chưa gán bác sĩ',
        status: appointment.status || 'pending',
        notes: appointment.purpose || appointment.notes || ''
      }));
      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error loading customer appointments:', error);
      message.error('Lỗi khi tải lịch hẹn của khách hàng');
    }
  };

  // Handle customer selection
  const handleCustomerSelect = async (customer) => {
    setSelectedCustomer(customer);
    setDrawerVisible(true);
    
    // Load customer-specific data
    await Promise.all([
      loadCustomerActivities(customer.id),
      loadCustomerAppointments(customer.id)
    ]);
  };

  // Filter functions
  const filteredCustomers = customers.filter(customer => {
    if (doctorFilter && customer.doctor !== doctorFilter) return false;
    if (surgeryTypeFilter && customer.surgeryType !== surgeryTypeFilter) return false;
    if (postOpDayFilter && customer.postOpDay !== postOpDayFilter) return false;
    return true;
  });

  // Activity Management
  const handleAddActivity = (day) => {
    setSelectedDay(day);
    setEditingActivity(null);
    activityForm.resetFields();
    setActivityModalVisible(true);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    activityForm.setFieldsValue({
      ...activity,
      dueDate: activity.dueDate ? dayjs(activity.dueDate) : null
    });
    setActivityModalVisible(true);
  };

  const handleDeleteActivity = async (id) => {
    try {
      await customerCareService.deleteActivity(id);
      message.success('Đã xóa hoạt động');
      // Reload activities after deletion
      if (selectedCustomer) {
        await loadCustomerActivities(selectedCustomer.id);
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      message.error('Lỗi khi xóa hoạt động');
    }
  };

  const handleDuplicateActivity = async (activity) => {
    try {
      const duplicateData = {
        ...activity,
        name: `${activity.name} (Bản sao)`,
        customer: selectedCustomer.id
      };
      await customerCareService.createActivity(duplicateData);
      message.success('Đã nhân bản hoạt động');
      // Reload activities after duplication
      if (selectedCustomer) {
        await loadCustomerActivities(selectedCustomer.id);
      }
    } catch (error) {
      console.error('Error duplicating activity:', error);
      message.error('Lỗi khi nhân bản hoạt động');
    }
  };

  const handleActivityModalOk = async () => {
    try {
      console.log('Starting handleActivityModalOk...');
      const values = await activityForm.validateFields();
      console.log('Form values validated:', values);
      
      // Get care journey for this customer
      console.log('Getting care journey for customer:', selectedCustomer.id);
      const careJourneyId = await getCareJourneyForCustomer(selectedCustomer.id);
      console.log('Care journey ID:', careJourneyId);
      
      if (!careJourneyId) {
        message.error('Không tìm thấy lộ trình chăm sóc cho khách hàng này');
        return;
      }

      const activityData = {
        name: values.name,
        description: values.description,
        care_journey_id: careJourneyId,
        days_post_op: parseInt(selectedDay || 1),
        scheduled_date: values.dueDate.format('YYYY-MM-DD'),
        action_type: values.type,
        priority: values.priority,
        status: values.status || 'scheduled', // Default to 'scheduled' instead of 'pending'
        approval_type: values.requiresApproval ? 'nurse' : 'none'
      };

      console.log('Creating activity with data:', activityData);

      if (editingActivity) {
        console.log('Updating existing activity:', editingActivity.id);
        await customerCareService.updateActivity(editingActivity.id, activityData);
        message.success('Cập nhật hoạt động thành công');
      } else {
        console.log('Creating new activity...');
        await customerCareService.createDailyCareActivity(activityData);
        console.log('Activity created successfully');
        message.success('Thêm hoạt động mới thành công');
      }
      
      setActivityModalVisible(false);
      activityForm.resetFields();
      
      // Reload activities after save
      if (selectedCustomer) {
        await loadCustomerActivities(selectedCustomer.id);
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      console.error('Error details:', error.response?.data || error.message);
      message.error('Lỗi khi lưu hoạt động: ' + (error.response?.data?.error || error.message));
    }
  };

  // Appointment Management
  const handleAddAppointment = () => {
    setEditingAppointment(null);
    appointmentForm.resetFields();
    setAppointmentModalVisible(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    appointmentForm.setFieldsValue({
      ...appointment,
      date: appointment.date ? dayjs(appointment.date) : null,
      time: appointment.time ? dayjs(appointment.time, 'HH:mm') : null
    });
    setAppointmentModalVisible(true);
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await customerCareService.deleteAppointment(id);
      message.success('Đã xóa lịch hẹn');
      // Reload appointments after deletion
      if (selectedCustomer) {
        await loadCustomerAppointments(selectedCustomer.id);
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      message.error('Lỗi khi xóa lịch hẹn');
    }
  };

  const handleAppointmentModalOk = async () => {
    try {
      const values = await appointmentForm.validateFields();
      
      // Map frontend values to backend valid choices
      const appointmentTypeMap = {
        'tai_kham': 'follow_up',
        'cat_chi': 'check_up',
        'kiem_tra': 'check_up',
        'tu_van': 'consultation'
      };
      
      const statusMap = {
        'pending': 'scheduled',
        'confirmed': 'confirmed',
        'completed': 'completed'
      };
      
      const appointmentData = {
        customer_id: selectedCustomer.id,
        appointment_date: values.date.format('YYYY-MM-DD'),
        appointment_time: values.time.format('HH:mm'),
        appointment_type: appointmentTypeMap[values.type] || 'consultation',
        status: statusMap[values.status] || 'scheduled',
        purpose: values.notes || `Lịch hẹn ${values.type}`
      };

      if (editingAppointment) {
        await customerCareService.updateAppointment(editingAppointment.id, appointmentData);
        message.success('Cập nhật lịch hẹn thành công');
      } else {
        await customerCareService.createAppointment(appointmentData);
        message.success('Thêm lịch hẹn mới thành công');
      }
      
      setAppointmentModalVisible(false);
      appointmentForm.resetFields();
      
      // Reload appointments after save
      if (selectedCustomer) {
        await loadCustomerAppointments(selectedCustomer.id);
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      message.error('Lỗi khi lưu lịch hẹn');
    }
  };

  // Helper functions
  const getActivityStatusColor = (status) => {
    const colors = {
      completed: 'green',
      in_progress: 'blue',
      pending: 'orange',
      cancelled: 'red'
    };
    return colors[status] || 'default';
  };

  const getActivityStatusText = (status) => {
    const texts = {
      completed: 'Hoàn thành',
      in_progress: 'Đang thực hiện',
      pending: 'Chờ thực hiện',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  const getAppointmentStatusColor = (status) => {
    const colors = {
      confirmed: 'green',
      pending: 'orange',
      completed: 'blue',
      cancelled: 'red'
    };
    return colors[status] || 'default';
  };

  const getAppointmentStatusText = (status) => {
    const texts = {
      confirmed: 'Đã xác nhận',
      pending: 'Chờ xác nhận',
      completed: 'Đã hoàn thành',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  // Header Activity Management
  const handleAddHeaderActivity = () => {
    setHeaderActivityModalVisible(true);
    headerActivityForm.resetFields();
    headerActivityForm.setFieldsValue({
      days_post_op: 1,
      scheduled_date: dayjs().add(1, 'day'),
      status: 'scheduled',
      approval_type: 'none'
    });
  };

  const handleHeaderActivityModalOk = async () => {
    try {
      const values = await headerActivityForm.validateFields();
      
      // Get care journey for this customer
      const careJourneyId = await getCareJourneyForCustomer(selectedCustomer.id);
      if (!careJourneyId) {
        message.error('Không tìm thấy lộ trình chăm sóc cho khách hàng này');
        return;
      }

      const activityData = {
        name: values.name,
        description: values.description,
        care_journey_id: careJourneyId,
        days_post_op: parseInt(values.days_post_op),
        scheduled_date: values.scheduled_date.format('YYYY-MM-DD'),
        action_type: values.type,
        priority: values.priority,
        status: values.status,
        approval_type: values.requiresApproval ? 'nurse' : 'none'
      };

      await customerCareService.createDailyCareActivity(activityData);
      message.success('Thêm hoạt động mới thành công');
      
      setHeaderActivityModalVisible(false);
      headerActivityForm.resetFields();
      
      // Reload activities after save
      if (selectedCustomer) {
        await loadCustomerActivities(selectedCustomer.id);
      }
    } catch (error) {
      console.error('Error creating header activity:', error);
      message.error('Lỗi khi tạo hoạt động mới');
    }
  };

  // Daily Care Activity Management
  const handleAddDailyCareActivity = (day) => {
    setSelectedDay(day);
    dailyCareActivityForm.resetFields();
    dailyCareActivityForm.setFieldsValue({
      days_post_op: parseInt(day),
      scheduled_date: dayjs().add(parseInt(day), 'day'),
      status: 'scheduled',
      approval_type: 'none'
    });
    setDailyCareActivityModalVisible(true);
  };

  const handleDailyCareActivityModalOk = async () => {
    try {
      const values = await dailyCareActivityForm.validateFields();
      
      // Get care journey for this customer
      const careJourneyId = await getCareJourneyForCustomer(selectedCustomer.id);
      if (!careJourneyId) {
        message.error('Không tìm thấy lộ trình chăm sóc cho khách hàng này');
        return;
      }

      const activityData = {
        ...values,
        care_journey_id: careJourneyId,
        scheduled_date: values.scheduled_date.format('YYYY-MM-DD'),
        status: values.status,
        approval_type: values.approval_type,
        requires_media: values.requires_media || false,
        photo_requirement: values.photo_requirement || false,
        video_requirement: values.video_requirement || false,
        text_requirement: values.text_requirement || false,
        voice_requirement: values.voice_requirement || false
      };

      await customerCareService.createDailyCareActivity(activityData);
      message.success('Thêm hoạt động mới thành công');
      
      setDailyCareActivityModalVisible(false);
      dailyCareActivityForm.resetFields();
      
      // Reload activities after save
      if (selectedCustomer) {
        await loadCustomerActivities(selectedCustomer.id);
      }
    } catch (error) {
      console.error('Error creating daily care activity:', error);
      message.error('Lỗi khi tạo hoạt động mới');
    }
  };

  // Helper function to get care journey for customer
  const getCareJourneyForCustomer = async (customerId) => {
    try {
      console.log('Fetching care journeys for customer:', customerId);
      // Fetch the actual care journey for this customer
      const response = await customerCareService.getCustomerCareJourneys(customerId);
      console.log('Care journeys response:', response);
      
      // Extract data from response - handle different response formats
      const careJourneys = response.data || response.results || [];
      console.log('Care journeys data:', careJourneys);
      
      // Return the first active care journey, or create a new one if none exists
      if (careJourneys && careJourneys.length > 0) {
        const activeJourney = careJourneys.find(journey => journey.status === 'active');
        if (activeJourney) {
          console.log('Found active care journey:', activeJourney.id);
          return activeJourney.id;
        }
        // If no active journey, return the most recent one
        console.log('No active journey, returning first one:', careJourneys[0].id);
        return careJourneys[0].id;
      }
      
      // If no care journey exists, we need to create one
      // For now, return null and show error message
      console.log('No care journeys found for customer');
      return null;
    } catch (error) {
      console.error('Error getting care journey:', error);
      console.error('Error details:', error.response?.data || error.message);
      return null;
    }
  };

  // Table columns
  const customerColumns = [
    {
      title: 'Tên khách hàng',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Ngày hậu phẫu',
      dataIndex: 'postOpDay',
      key: 'postOpDay',
      render: (day) => <Tag color="blue">Day {day}</Tag>,
    },
    {
      title: 'Task hôm nay',
      dataIndex: 'todayTasks',
      key: 'todayTasks',
      render: (count) => (
        <Badge count={count} showZero={false} />
      ),
    },
    {
      title: 'Tái khám tiếp theo',
      dataIndex: 'nextAppointment',
      key: 'nextAppointment',
      render: (date) => date ? dayjs(date).format('DD/MM - HH:mm') : '-',
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => handleCustomerSelect(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 24px' }}>
      {/* Header */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={2} style={{ margin: 0 }}>Admin Dashboard - Chăm sóc Khách hàng</Title>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={loadInitialData}>
                  Làm mới
                </Button>
                <Button type="primary" icon={<UserAddOutlined />}>
                  Thêm khách hàng
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="Bộ lọc nhanh" size="small">
            <Space wrap>
              <Select
                placeholder="Theo bác sĩ"
                style={{ width: 150 }}
                onChange={setDoctorFilter}
                allowClear
              >
                <Option value="BS. Trần Văn X">BS. Trần Văn X</Option>
                <Option value="BS. Lê Thị Y">BS. Lê Thị Y</Option>
              </Select>
              
              <Select
                placeholder="Theo loại phẫu thuật"
                style={{ width: 180 }}
                onChange={setSurgeryTypeFilter}
                allowClear
              >
                <Option value="Nâng ngực">Nâng ngực</Option>
                <Option value="Nâng mũi">Nâng mũi</Option>
                <Option value="Hút mỡ">Hút mỡ</Option>
              </Select>
              
              <Select
                placeholder="Theo ngày hậu phẫu"
                style={{ width: 150 }}
                onChange={setPostOpDayFilter}
                allowClear
              >
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <Option key={day} value={day}>Day {day}</Option>
                ))}
              </Select>
              
              <Select
                placeholder="Theo trạng thái task"
                style={{ width: 180 }}
                onChange={setTaskStatusFilter}
                allowClear
              >
                <Option value="pending">Chờ</Option>
                <Option value="in_progress">Đang làm</Option>
                <Option value="completed">Hoàn thành</Option>
              </Select>
              
              <Button icon={<FilterOutlined />} type="primary">
                Áp dụng
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Patients Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title={`Danh sách khách hàng (${filteredCustomers.length})`}
            extra={
              <Space>
                <Search placeholder="Tìm kiếm khách hàng..." style={{ width: 200 }} />
                <Button icon={<SettingOutlined />}>Cài đặt cột</Button>
              </Space>
            }
          >
              <Table
              columns={customerColumns}
              dataSource={filteredCustomers}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              onRow={(record) => ({
                onClick: () => handleCustomerSelect(record),
                style: { cursor: 'pointer' }
              })}
            />
          </Card>
        </Col>
      </Row>

      {/* Customer Detail Drawer */}
      <Drawer
        title={`Chi tiết khách hàng: ${selectedCustomer?.name}`}
        placement="right"
        width={800}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Space>
            <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddHeaderActivity}>
              Thêm Task
            </Button>
          </Space>
        }
      >
        {selectedCustomer && (
          <div>
            {/* Patient Info Summary */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Text strong>Loại phẫu thuật:</Text>
                  <br />
                  <Tag color="blue">{selectedCustomer.surgeryType}</Tag>
                </Col>
                <Col span={8}>
                  <Text strong>Ngày hậu phẫu:</Text>
                  <br />
                  <Tag color="green">Day {selectedCustomer.postOpDay}</Tag>
                </Col>
                <Col span={8}>
                  <Text strong>Bác sĩ phụ trách:</Text>
                  <br />
                  <Text>{selectedCustomer.doctor}</Text>
                </Col>
              </Row>
            </Card>

            {/* Tabs for Activities and Appointments */}
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button 
                  type={activeTab === 'activities' ? 'primary' : 'default'}
                  onClick={() => setActiveTab('activities')}
                >
                  Hoạt động Hàng ngày
                </Button>
                <Button 
                  type={activeTab === 'appointments' ? 'primary' : 'default'}
                  onClick={() => setActiveTab('appointments')}
                >
                  Lịch tái khám
                </Button>
              </Space>
            </div>

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div>
                <Collapse defaultActiveKey={['1']}>
                  {Object.entries(activities).map(([day, dayActivities]) => (
                    <Panel 
                      header={`Ngày ${day}`} 
                      key={day}
                      extra={
                        <Button 
                          size="small" 
                          icon={<PlusOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddActivity(day);
                          }}
                        >
                          Thêm Task
                        </Button>
                      }
                    >
                      <List
                        dataSource={dayActivities}
                        renderItem={(activity) => (
                          <List.Item
                            actions={[
                              <Button 
                                type="link" 
                                icon={<EditOutlined />} 
                                onClick={() => handleEditActivity(activity)}
                              />,
                              <Button 
                                type="link" 
                                icon={<CopyOutlined />}
                                onClick={() => handleDuplicateActivity(activity)}
                              >
                                Nhân bản
                              </Button>,
                              <Popconfirm
                                title="Xóa hoạt động"
                                description="Bạn có chắc chắn muốn xóa hoạt động này?"
                                onConfirm={() => handleDeleteActivity(activity.id)}
                                okText="Có"
                                cancelText="Không"
                              >
                                <Button type="link" danger icon={<DeleteOutlined />} />
                              </Popconfirm>
                            ]}
                          >
                            <List.Item.Meta
                              avatar={
                                <Avatar 
                                  style={{ 
                                    backgroundColor: getActivityStatusColor(activity.status),
                                    color: 'white'
                                  }}
                                >
                                  {getActivityStatusText(activity.status).charAt(0)}
                                </Avatar>
                              }
                              title={
                                <Space>
                                  <Text strong>{activity.name}</Text>
                                  <Tag color={getActivityStatusColor(activity.status)}>
                                    {getActivityStatusText(activity.status)}
                                  </Tag>
                                  {activity.priority === 'high' && (
                                    <Tag color="red">Ưu tiên cao</Tag>
                                  )}
                                </Space>
                              }
                              description={
                                <div>
                                  <Text type="secondary">{activity.description}</Text>
                                  <br />
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Hạn: {dayjs(activity.dueDate).format('DD/MM/YYYY')}
                                  </Text>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Panel>
                  ))}
                </Collapse>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                <div style={{ textAlign: 'right', marginBottom: 16 }}>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleAddAppointment}
                  >
                    Thêm lịch tái khám
                  </Button>
                </div>
                
                <Timeline>
                  {appointments.map((appointment) => (
                    <Timeline.Item
                      key={appointment.id}
                      color={getAppointmentStatusColor(appointment.status)}
                      dot={
                        appointment.status === 'confirmed' ? <CheckCircleOutlined /> :
                        appointment.status === 'completed' ? <CheckCircleOutlined /> :
                        <ClockCircleOutlined />
                      }
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <Text strong>
                            {dayjs(appointment.date).format('DD/MM')} - {appointment.time}
                          </Text>
                          <br />
                          <Text type="secondary">
                            {appointment.type === 'tai_kham' ? 'Tái khám' : 'Cắt chỉ'}
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Bác sĩ: {appointment.doctor}
                          </Text>
                          {appointment.notes && (
                            <>
                              <br />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                Ghi chú: {appointment.notes}
                              </Text>
                            </>
                          )}
                        </div>
                        <Space>
                          <Tag color={getAppointmentStatusColor(appointment.status)}>
                            {getAppointmentStatusText(appointment.status)}
                          </Tag>
                          <Button 
                            type="link" 
                            icon={<EditOutlined />}
                            onClick={() => handleEditAppointment(appointment)}
                          />
                          <Popconfirm
                            title="Xóa lịch hẹn"
                            description="Bạn có chắc chắn muốn xóa lịch hẹn này?"
                            onConfirm={() => handleDeleteAppointment(appointment.id)}
                            okText="Có"
                            cancelText="Không"
                          >
                            <Button type="link" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </Space>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Activity Modal */}
      <Modal
        title={editingActivity ? 'Sửa Hoạt động' : 'Thêm Hoạt động Mới'}
        open={activityModalVisible}
        onOk={handleActivityModalOk}
        onCancel={() => setActivityModalVisible(false)}
        width={600}
      >
        <Form form={activityForm} layout="vertical">
          <Form.Item name="name" label="Tên hoạt động" rules={[{ required: true }]}>
            <Input placeholder="Nhập tên hoạt động" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <TextArea placeholder="Nhập mô tả hoạt động" rows={3} />
          </Form.Item>
          <Form.Item name="type" label="Loại hoạt động" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại hoạt động">
              <Option value="simple_check">Kiểm tra đơn giản</Option>
              <Option value="photo_upload">Chụp ảnh</Option>
              <Option value="video_upload">Quay video</Option>
              <Option value="voice_note">Ghi âm</Option>
              <Option value="status_update">Cập nhật trạng thái</Option>
              <Option value="text_feedback">Phản hồi văn bản</Option>
              <Option value="medication_reminder">Nhắc thuốc</Option>
              <Option value="exercise">Bài tập</Option>
              <Option value="follow_up">Theo dõi</Option>
              <Option value="appointment">Lịch hẹn</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dueDate" label="Hạn hoàn thành" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="priority" label="Mức độ ưu tiên">
            <Select placeholder="Chọn mức ưu tiên">
              <Option value="low">Thấp</Option>
              <Option value="medium">Trung bình</Option>
              <Option value="high">Cao</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              <Option value="scheduled">Đã lên lịch</Option>
              <Option value="in_progress">Đang thực hiện</Option>
              <Option value="pending_approval">Chờ phê duyệt</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Form.Item>
          <Form.Item name="requiresApproval" valuePropName="checked">
            <Switch checkedChildren="Cần phê duyệt" unCheckedChildren="Không cần phê duyệt" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Appointment Modal */}
      <Modal
        title={editingAppointment ? 'Sửa Lịch hẹn' : 'Thêm Lịch hẹn Mới'}
        open={appointmentModalVisible}
        onOk={handleAppointmentModalOk}
        onCancel={() => setAppointmentModalVisible(false)}
        width={600}
      >
        <Form form={appointmentForm} layout="vertical">
          <Form.Item name="type" label="Loại lịch hẹn" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại lịch hẹn">
              <Option value="tai_kham">Tái khám</Option>
              <Option value="cat_chi">Cắt chỉ</Option>
              <Option value="kiem_tra">Kiểm tra định kỳ</Option>
              <Option value="tu_van">Tư vấn</Option>
            </Select>
          </Form.Item>
          <Form.Item name="doctor" label="Bác sĩ" rules={[{ required: true }]}>
            <Select placeholder="Chọn bác sĩ">
              <Option value="BS. Trần Văn X">BS. Trần Văn X</Option>
              <Option value="BS. Lê Thị Y">BS. Lê Thị Y</Option>
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Ngày hẹn" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="time" label="Giờ hẹn" rules={[{ required: true }]}>
            <TimePicker style={{ width: '100%' }} format="HH:mm" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="completed">Đã hoàn thành</Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <TextArea placeholder="Nhập ghi chú (nếu có)" rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Header Activity Modal */}
      <Modal
        title="Thêm Hoạt động Mới"
        open={headerActivityModalVisible}
        onOk={handleHeaderActivityModalOk}
        onCancel={() => setHeaderActivityModalVisible(false)}
        width={600}
      >
        <Form form={headerActivityForm} layout="vertical">
          <Form.Item name="name" label="Tên hoạt động" rules={[{ required: true }]}>
            <Input placeholder="Nhập tên hoạt động" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <TextArea placeholder="Nhập mô tả hoạt động" rows={3} />
          </Form.Item>
          <Form.Item name="type" label="Loại hoạt động" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại hoạt động">
              <Option value="simple_check">Kiểm tra đơn giản</Option>
              <Option value="photo_upload">Chụp ảnh</Option>
              <Option value="video_upload">Quay video</Option>
              <Option value="voice_note">Ghi âm</Option>
              <Option value="status_update">Cập nhật trạng thái</Option>
              <Option value="text_feedback">Phản hồi văn bản</Option>
              <Option value="medication_reminder">Nhắc thuốc</Option>
              <Option value="exercise">Bài tập</Option>
              <Option value="follow_up">Theo dõi</Option>
              <Option value="appointment">Lịch hẹn</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item name="days_post_op" label="Ngày hậu phẫu" rules={[{ required: true }]}>
            <InputNumber 
              min={1} 
              max={30} 
              placeholder="Nhập số ngày hậu phẫu"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="scheduled_date" label="Ngày thực hiện" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="priority" label="Mức độ ưu tiên">
            <Select placeholder="Chọn mức ưu tiên">
              <Option value="low">Thấp</Option>
              <Option value="medium">Trung bình</Option>
              <Option value="high">Cao</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              <Option value="scheduled">Đã lên lịch</Option>
              <Option value="in_progress">Đang thực hiện</Option>
              <Option value="pending_approval">Chờ phê duyệt</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Form.Item>
          <Form.Item name="requiresApproval" valuePropName="checked">
            <Switch checkedChildren="Cần phê duyệt" unCheckedChildren="Không cần phê duyệt" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerCare;
