import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Badge,
  Checkbox
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';

const { Option } = Select;
const { TextArea } = Input;

const CustomerCare = () => {
  const { user } = useAuth();
  const [customerCareData, setCustomerCareData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCare, setSelectedCare] = useState(null);
  const [form] = Form.useForm();

  // Mock data - In real app, this would come from API
  const mockCustomerCareData = [
    {
      id: 1,
      customer: { id: 1, name: 'Nguyễn Văn A', phone: '0123456789' },
      care_type: 'daily_check',
      title: 'Kiểm tra sức khỏe buổi sáng',
      description: 'Kiểm tra nhiệt độ, huyết áp và tình trạng vết thương',
      assigned_nurse: { id: 1, name: 'Y tá Mai' },
      assigned_doctor: { id: 1, name: 'Bác sĩ Hùng' },
      priority: 'medium',
      scheduled_date: '2025-01-13',
      scheduled_time: '08:00:00',
      duration_minutes: 15,
      status: 'scheduled',
      notes: '',
      requires_follow_up: false,
      created_at: '2025-01-12T10:00:00Z'
    },
    {
      id: 2,
      customer: { id: 2, name: 'Trần Thị B', phone: '0987654321' },
      care_type: 'medication_reminder',
      title: 'Nhắc uống thuốc kháng sinh',
      description: 'Nhắc khách hàng uống thuốc Augmentin 1g',
      assigned_nurse: { id: 2, name: 'Y tá Lan' },
      assigned_doctor: { id: 1, name: 'Bác sĩ Hùng' },
      priority: 'high',
      scheduled_date: '2025-01-13',
      scheduled_time: '12:00:00',
      duration_minutes: 10,
      status: 'completed',
      completed_at: '2025-01-13T12:05:00Z',
      notes: 'Khách hàng đã uống thuốc đúng giờ',
      requires_follow_up: false,
      created_at: '2025-01-12T14:30:00Z'
    },
    {
      id: 3,
      customer: { id: 3, name: 'Lê Văn C', phone: '0912345678' },
      care_type: 'follow_up',
      title: 'Theo dõi sau phẫu thuật',
      description: 'Gọi điện theo dõi tình trạng hồi phục',
      assigned_nurse: { id: 1, name: 'Y tá Mai' },
      assigned_doctor: { id: 2, name: 'Bác sĩ Minh' },
      priority: 'medium',
      scheduled_date: '2025-01-14',
      scheduled_time: '15:00:00',
      duration_minutes: 20,
      status: 'scheduled',
      notes: '',
      requires_follow_up: true,
      follow_up_date: '2025-01-16',
      created_at: '2025-01-12T16:45:00Z'
    }
  ];

  useEffect(() => {
    loadCustomerCareData();
  }, []);

  const loadCustomerCareData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCustomerCareData(mockCustomerCareData);
      setLoading(false);
    }, 1000);
  };

  const getCareTypeDisplay = (type) => {
    const types = {
      daily_check: 'Kiểm tra Hàng ngày',
      medication_reminder: 'Nhắc uống Thuốc',
      follow_up: 'Theo dõi',
      appointment_reminder: 'Nhắc lịch hẹn',
      symptom_check: 'Kiểm tra Triệu chứng',
      emotional_support: 'Hỗ trợ Tâm lý',
      education: 'Giáo dục Bệnh nhân',
      other: 'Khác'
    };
    return types[type] || type;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'blue',
      medium: 'orange',
      high: 'red',
      urgent: 'purple'
    };
    return colors[priority] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'blue',
      in_progress: 'orange',
      completed: 'green',
      cancelled: 'red',
      missed: 'gray'
    };
    return colors[status] || 'default';
  };

  const getStatusDisplay = (status) => {
    const statuses = {
      scheduled: 'Đã lên lịch',
      in_progress: 'Đang thực hiện',
      completed: 'Đã hoàn thành',
      cancelled: 'Đã hủy',
      missed: 'Đã bỏ lỡ'
    };
    return statuses[status] || status;
  };

  const handleAddNew = () => {
    setSelectedCare(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedCare(record);
    form.setFieldsValue({
      ...record,
      scheduled_date: record.scheduled_date ? dayjs(record.scheduled_date) : null,
      scheduled_time: record.scheduled_time ? dayjs(record.scheduled_time, 'HH:mm:ss') : null,
      follow_up_date: record.follow_up_date ? dayjs(record.follow_up_date) : null
    });
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    // In real app, call API to delete
    setCustomerCareData(customerCareData.filter(item => item.id !== id));
    message.success('Đã xóa hoạt động chăm sóc');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const careData = {
        ...values,
        scheduled_date: values.scheduled_date ? values.scheduled_date.format('YYYY-MM-DD') : null,
        scheduled_time: values.scheduled_time ? values.scheduled_time.format('HH:mm:ss') : null,
        follow_up_date: values.follow_up_date ? values.follow_up_date.format('YYYY-MM-DD') : null
      };

      if (selectedCare) {
        // Update existing
        setCustomerCareData(customerCareData.map(item => 
          item.id === selectedCare.id ? { ...item, ...careData } : item
        ));
        message.success('Cập nhật hoạt động chăm sóc thành công');
      } else {
        // Add new
        const newCare = {
          id: Date.now(),
          ...careData,
          created_at: new Date().toISOString(),
          status: 'scheduled'
        };
        setCustomerCareData([...customerCareData, newCare]);
        message.success('Thêm hoạt động chăm sóc thành công');
      }

      setModalVisible(false);
      form.resetFields();
    });
  };

  const handleStatusChange = (id, newStatus) => {
    setCustomerCareData(customerCareData.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    ));
    message.success('Cập nhật trạng thái thành công');
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => (
        <Space>
          <UserOutlined />
          <span>{customer?.name}</span>
        </Space>
      )
    },
    {
      title: 'Loại chăm sóc',
      dataIndex: 'care_type',
      key: 'care_type',
      render: (type) => getCareTypeDisplay(type)
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
    },
    {
      title: 'Y tá phụ trách',
      dataIndex: 'assigned_nurse',
      key: 'assigned_nurse',
      render: (nurse) => nurse?.name || 'Chưa phân công'
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'low' ? 'Thấp' : 
           priority === 'medium' ? 'Trung bình' : 
           priority === 'high' ? 'Cao' : 'Khẩn cấp'}
        </Tag>
      )
    },
    {
      title: 'Ngày',
      dataIndex: 'scheduled_date',
      key: 'scheduled_date',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Giờ',
      dataIndex: 'scheduled_time',
      key: 'scheduled_time',
      render: (time) => time ? time.substring(0, 5) : ''
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 120 }}
        >
          <Option value="scheduled">Đã lên lịch</Option>
          <Option value="in_progress">Đang thực hiện</Option>
          <Option value="completed">Đã hoàn thành</Option>
          <Option value="cancelled">Đã hủy</Option>
        </Select>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleEdit(record)}
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const stats = {
    total: customerCareData.length,
    scheduled: customerCareData.filter(item => item.status === 'scheduled').length,
    inProgress: customerCareData.filter(item => item.status === 'in_progress').length,
    completed: customerCareData.filter(item => item.status === 'completed').length
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số hoạt động"
                value={stats.total}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đã lên lịch"
                value={stats.scheduled}
                valueStyle={{ color: '#1890ff' }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đang thực hiện"
                value={stats.inProgress}
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đã hoàn thành"
                value={stats.completed}
                valueStyle={{ color: '#52c41a' }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Card
        title="Quản lý Chăm sóc Khách hàng"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Thêm mới
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={customerCareData}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} hoạt động`
          }}
        />
      </Card>

      <Modal
        title={selectedCare ? 'Chỉnh sửa Hoạt động Chăm sóc' : 'Thêm Hoạt động Chăm sóc Mới'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={700}
        okText={selectedCare ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          name="customerCareForm"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customer"
                label="Khách hàng"
                rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
              >
                <Select placeholder="Chọn khách hàng">
                  <Option value={1}>Nguyễn Văn A</Option>
                  <Option value={2}>Trần Thị B</Option>
                  <Option value={3}>Lê Văn C</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="care_type"
                label="Loại chăm sóc"
                rules={[{ required: true, message: 'Vui lòng chọn loại chăm sóc' }]}
              >
                <Select placeholder="Chọn loại chăm sóc">
                  <Option value="daily_check">Kiểm tra Hàng ngày</Option>
                  <Option value="medication_reminder">Nhắc uống Thuốc</Option>
                  <Option value="follow_up">Theo dõi</Option>
                  <Option value="appointment_reminder">Nhắc lịch hẹn</Option>
                  <Option value="symptom_check">Kiểm tra Triệu chứng</Option>
                  <Option value="emotional_support">Hỗ trợ Tâm lý</Option>
                  <Option value="education">Giáo dục Bệnh nhân</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề hoạt động chăm sóc" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea
              rows={3}
              placeholder="Nhập mô tả chi tiết về hoạt động chăm sóc"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="assigned_nurse"
                label="Y tá phụ trách"
              >
                <Select placeholder="Chọn y tá">
                  <Option value={1}>Y tá Mai</Option>
                  <Option value={2}>Y tá Lan</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="Mức độ ưu tiên"
                initialValue="medium"
              >
                <Select>
                  <Option value="low">Thấp</Option>
                  <Option value="medium">Trung bình</Option>
                  <Option value="high">Cao</Option>
                  <Option value="urgent">Khẩn cấp</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="duration_minutes"
                label="Thời lượng (phút)"
                initialValue={15}
              >
                <Input type="number" min={5} max={480} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="scheduled_date"
                label="Ngày thực hiện"
                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="scheduled_time"
                label="Giờ thực hiện"
                rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
              >
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea
              rows={2}
              placeholder="Nhập ghi chú (nếu có)"
            />
          </Form.Item>

          <Form.Item
            name="requires_follow_up"
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox>Cần theo dõi sau khi hoàn thành</Checkbox>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.requires_follow_up !== currentValues.requires_follow_up}
          >
            {({ getFieldValue }) =>
              getFieldValue('requires_follow_up') ? (
                <Form.Item
                  name="follow_up_date"
                  label="Ngày theo dõi"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày theo dõi' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerCare;
