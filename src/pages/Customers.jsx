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
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const Customers = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();

  // Dữ liệu mẫu khách hàng
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Nguyễn Thị A',
      phone: '0901234567',
      email: 'nguyenthi.a@email.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      surgeryType: 'Nâng mũi',
      surgeryDate: '2024-12-15',
      status: 'active',
      lastAppointment: '2025-01-10',
    },
    {
      id: 2,
      name: 'Trần Văn B',
      phone: '0902345678',
      email: 'tranvan.b@email.com',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      surgeryType: 'Căng da mặt',
      surgeryDate: '2024-12-20',
      status: 'active',
      lastAppointment: '2025-01-08',
    },
    {
      id: 3,
      name: 'Lê Thị C',
      phone: '0903456789',
      email: 'lethi.c@email.com',
      address: '789 Đường DEF, Quận 5, TP.HCM',
      surgeryType: 'Hút mỡ bụng',
      surgeryDate: '2024-12-10',
      status: 'inactive',
      lastAppointment: '2024-12-28',
    },
    {
      id: 4,
      name: 'Phạm Văn D',
      phone: '0904567890',
      email: 'phamvan.d@email.com',
      address: '321 Đường GHI, Quận 10, TP.HCM',
      surgeryType: 'Nâng ngực',
      surgeryDate: '2024-12-25',
      status: 'active',
      lastAppointment: '2025-01-11',
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
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
      title: 'Lần khám cuối',
      dataIndex: 'lastAppointment',
      key: 'lastAppointment',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'Chưa có',
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
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
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
            title="Xóa khách hàng"
            description="Bạn có chắc chắn muốn xóa khách hàng này?"
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
    setEditingCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue({
      ...customer,
      surgeryDate: customer.surgeryDate ? dayjs(customer.surgeryDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleView = (customer) => {
    // Xử lý xem chi tiết khách hàng
    message.info(`Xem chi tiết khách hàng: ${customer.name}`);
  };

  const handleDelete = (id) => {
    setCustomers(customers.filter(customer => customer.id !== id));
    message.success('Xóa khách hàng thành công');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingCustomer) {
        // Cập nhật khách hàng
        setCustomers(customers.map(customer =>
          customer.id === editingCustomer.id
            ? { ...customer, ...values, surgeryDate: values.surgeryDate?.format('YYYY-MM-DD') }
            : customer
        ));
        message.success('Cập nhật khách hàng thành công');
      } else {
        // Thêm khách hàng mới
        const newCustomer = {
          id: Math.max(...customers.map(c => c.id)) + 1,
          ...values,
          surgeryDate: values.surgeryDate?.format('YYYY-MM-DD'),
          status: 'active',
          lastAppointment: null,
        };
        setCustomers([...customers, newCustomer]);
        message.success('Thêm khách hàng mới thành công');
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
          <h1 style={{ margin: 0 }}>Quản lý Khách hàng</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm Khách hàng
          </Button>
        </div>

        {/* Bộ lọc và tìm kiếm */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Search
            placeholder="Tìm kiếm theo tên, số điện thoại..."
            style={{ width: 300 }}
            onSearch={(value) => console.log('Search:', value)}
          />
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            allowClear
          >
            <Option value="active">Đang theo dõi</Option>
            <Option value="inactive">Ngừng theo dõi</Option>
          </Select>
          <Select
            placeholder="Loại phẫu thuật"
            style={{ width: 200 }}
            allowClear
          >
            <Option value="Nâng mũi">Nâng mũi</Option>
            <Option value="Căng da mặt">Căng da mặt</Option>
            <Option value="Hút mỡ bụng">Hút mỡ bụng</Option>
            <Option value="Nâng ngực">Nâng ngực</Option>
          </Select>
        </div>

        {/* Bảng khách hàng */}
        <Table
          columns={columns}
          dataSource={customers}
          loading={loading}
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
              <Option value="Nâng mũi">Nâng mũi</Option>
              <Option value="Căng da mặt">Căng da mặt</Option>
              <Option value="Hút mỡ bụng">Hút mỡ bụng</Option>
              <Option value="Nâng ngực">Nâng ngực</Option>
              <Option value="Khác">Khác</Option>
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
    </div>
  );
};

export default Customers;
