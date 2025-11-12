import React, { useState } from 'react';
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
  TimePicker,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const Appointments = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [form] = Form.useForm();

  // Dữ liệu mẫu cuộc hẹn
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      customerName: 'Nguyễn Thị A',
      customerPhone: '0901234567',
      service: 'Tư vấn hậu phẫu',
      date: '2025-01-12',
      time: '09:00',
      doctor: 'BS. Trần Văn X',
      status: 'confirmed',
      notes: 'Khách hàng cần tư vấn về chăm sóc vết thương',
    },
    {
      id: 2,
      customerName: 'Trần Văn B',
      customerPhone: '0902345678',
      service: 'Kiểm tra định kỳ',
      date: '2025-01-12',
      time: '10:30',
      doctor: 'BS. Lê Thị Y',
      status: 'pending',
      notes: 'Kiểm tra vết thương sau 2 tuần',
    },
    {
      id: 3,
      customerName: 'Lê Thị C',
      customerPhone: '0903456789',
      service: 'Theo dõi vết thương',
      date: '2025-01-12',
      time: '14:00',
      doctor: 'BS. Trần Văn X',
      status: 'confirmed',
      notes: 'Theo dõi tiến triển vết thương',
    },
    {
      id: 4,
      customerName: 'Phạm Văn D',
      customerPhone: '0904567890',
      service: 'Tái khám',
      date: '2025-01-13',
      time: '08:30',
      doctor: 'BS. Nguyễn Văn Z',
      status: 'completed',
      notes: 'Tái khám sau 1 tháng',
    },
    {
      id: 5,
      customerName: 'Hoàng Thị E',
      customerPhone: '0905678901',
      service: 'Tháo chỉ',
      date: '2025-01-13',
      time: '11:00',
      doctor: 'BS. Lê Thị Y',
      status: 'cancelled',
      notes: 'Khách hàng hủy do bận việc đột xuất',
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
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.customerPhone}</div>
        </div>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Ngày & Giờ',
      dataIndex: 'date',
      key: 'date',
      render: (date, record) => (
        <div>
          <div>{dayjs(date).format('DD/MM/YYYY')}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.time}</div>
        </div>
      ),
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          pending: { color: 'orange', text: 'Chờ xác nhận', icon: <ClockCircleOutlined /> },
          confirmed: { color: 'blue', text: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
          completed: { color: 'green', text: 'Đã hoàn thành', icon: <CheckCircleOutlined /> },
          cancelled: { color: 'red', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
        };
        const config = statusConfig[status] || { color: 'default', text: status, icon: null };
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
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
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                onClick={() => handleConfirm(record.id)}
                style={{ color: '#52c41a' }}
              >
                Xác nhận
              </Button>
              <Button
                type="link"
                danger
                onClick={() => handleCancel(record.id)}
              >
                Hủy
              </Button>
            </>
          )}
          {record.status === 'confirmed' && (
            <Button
              type="link"
              onClick={() => handleComplete(record.id)}
              style={{ color: '#52c41a' }}
            >
              Hoàn thành
            </Button>
          )}
          <Popconfirm
            title="Xóa cuộc hẹn"
            description="Bạn có chắc chắn muốn xóa cuộc hẹn này?"
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
    setEditingAppointment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    form.setFieldsValue({
      ...appointment,
      date: appointment.date ? dayjs(appointment.date) : null,
      time: appointment.time ? dayjs(appointment.time, 'HH:mm') : null,
    });
    setIsModalVisible(true);
  };

  const handleConfirm = (id) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, status: 'confirmed' } : apt
    ));
    message.success('Xác nhận cuộc hẹn thành công');
  };

  const handleCancel = (id) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, status: 'cancelled' } : apt
    ));
    message.success('Hủy cuộc hẹn thành công');
  };

  const handleComplete = (id) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, status: 'completed' } : apt
    ));
    message.success('Đánh dấu hoàn thành cuộc hẹn');
  };

  const handleDelete = (id) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    message.success('Xóa cuộc hẹn thành công');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingAppointment) {
        // Cập nhật cuộc hẹn
        setAppointments(appointments.map(apt =>
          apt.id === editingAppointment.id
            ? {
                ...apt,
                ...values,
                date: values.date?.format('YYYY-MM-DD'),
                time: values.time?.format('HH:mm'),
              }
            : apt
        ));
        message.success('Cập nhật cuộc hẹn thành công');
      } else {
        // Thêm cuộc hẹn mới
        const newAppointment = {
          id: Math.max(...appointments.map(apt => apt.id)) + 1,
          ...values,
          date: values.date?.format('YYYY-MM-DD'),
          time: values.time?.format('HH:mm'),
          status: 'pending',
        };
        setAppointments([...appointments, newAppointment]);
        message.success('Thêm cuộc hẹn mới thành công');
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
    <div style={{ padding: '0 24px' }}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0 }}>Quản lý Cuộc hẹn</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm Cuộc hẹn
          </Button>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Search
            placeholder="Tìm kiếm theo tên khách hàng, số điện thoại..."
            style={{ width: 300 }}
            onSearch={(value) => console.log('Search:', value)}
          />
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            allowClear
          >
            <Option value="pending">Chờ xác nhận</Option>
            <Option value="confirmed">Đã xác nhận</Option>
            <Option value="completed">Đã hoàn thành</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
          <Select
            placeholder="Dịch vụ"
            style={{ width: 200 }}
            allowClear
          >
            <Option value="Tư vấn hậu phẫu">Tư vấn hậu phẫu</Option>
            <Option value="Kiểm tra định kỳ">Kiểm tra định kỳ</Option>
            <Option value="Theo dõi vết thương">Theo dõi vết thương</Option>
            <Option value="Tái khám">Tái khám</Option>
            <Option value="Tháo chỉ">Tháo chỉ</Option>
          </Select>
          <DatePicker
            placeholder="Chọn ngày"
            style={{ width: 150 }}
          />
        </div>

        {/* Bảng cuộc hẹn */}
        <Table
          columns={columns}
          dataSource={appointments}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} cuộc hẹn`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa cuộc hẹn */}
      <Modal
        title={editingAppointment ? 'Sửa thông tin cuộc hẹn' : 'Thêm cuộc hẹn mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="appointmentForm"
        >
          <Form.Item
            name="customerName"
            label="Tên khách hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Form.Item
            name="customerPhone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="service"
            label="Dịch vụ"
            rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
          >
            <Select placeholder="Chọn dịch vụ">
              <Option value="Tư vấn hậu phẫu">Tư vấn hậu phẫu</Option>
              <Option value="Kiểm tra định kỳ">Kiểm tra định kỳ</Option>
              <Option value="Theo dõi vết thương">Theo dõi vết thương</Option>
              <Option value="Tái khám">Tái khám</Option>
              <Option value="Tháo chỉ">Tháo chỉ</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="doctor"
            label="Bác sĩ"
            rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}
          >
            <Select placeholder="Chọn bác sĩ">
              <Option value="BS. Trần Văn X">BS. Trần Văn X</Option>
              <Option value="BS. Lê Thị Y">BS. Lê Thị Y</Option>
              <Option value="BS. Nguyễn Văn Z">BS. Nguyễn Văn Z</Option>
              <Option value="BS. Phạm Thị T">BS. Phạm Thị T</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày hẹn"
            rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày hẹn"
            />
          </Form.Item>

          <Form.Item
            name="time"
            label="Giờ hẹn"
            rules={[{ required: true, message: 'Vui lòng chọn giờ hẹn' }]}
          >
            <TimePicker
              style={{ width: '100%' }}
              format="HH:mm"
              placeholder="Chọn giờ hẹn"
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea placeholder="Nhập ghi chú (nếu có)" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointments;
