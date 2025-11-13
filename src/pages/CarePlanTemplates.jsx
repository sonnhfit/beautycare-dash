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
  InputNumber,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Tabs,
  Divider,
  List,
  Typography,
  Collapse,
  Switch
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CameraOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import carePlanService from '../services/carePlanService';
import doctorService from '../services/doctorService';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const CarePlanTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form] = Form.useForm();

  // Mock data for care plan templates
  const mockTemplates = [
    {
      id: 1,
      name: 'Quy trình chăm sóc hậu phẫu nâng ngực',
      description: 'Quy trình chăm sóc tiêu chuẩn cho khách hàng sau phẫu thuật nâng ngực',
      doctor_id: 1,
      doctor_name: 'BS Doãn Dương',
      procedure_type: 'nang_nguc',
      duration_days: 180,
      status: 'active',
      created_at: '2025-01-10T08:00:00Z',
      activities: [
        {
          id: 1,
          days_post_op: 1,
          name: 'Gọi mới, hỏi thăm sức khỏe',
          description: 'Gọi điện hỏi thăm tình trạng sức khỏe sau phẫu thuật',
          action_type: 'phone_call',
          requires_media: false,
          approval_type: 'none',
          priority: 'high'
        },
        {
          id: 2,
          days_post_op: 1,
          name: 'Chụp ảnh vết mổ',
          description: 'Chụp ảnh vết mổ từ 3 góc độ khác nhau',
          action_type: 'photo_upload',
          requires_media: true,
          photo_requirement: 'Chụp ảnh vết mổ từ trước, sau, và bên cạnh',
          approval_type: 'nurse',
          priority: 'medium'
        },
        {
          id: 3,
          days_post_op: 3,
          name: 'Hướng dẫn tập tay',
          description: 'Hướng dẫn khách hàng tập vận động tay nhẹ nhàng',
          action_type: 'video_upload',
          requires_media: true,
          video_requirement: 'Quay video thực hiện bài tập vận động tay',
          approval_type: 'nurse',
          priority: 'medium'
        },
        {
          id: 4,
          days_post_op: 7,
          name: 'Tái khám lần 1 - Cắt chỉ nách',
          description: 'Tái khám và cắt chỉ vết mổ đường nách',
          action_type: 'appointment',
          requires_media: false,
          approval_type: 'doctor',
          priority: 'high'
        },
        {
          id: 5,
          days_post_op: 14,
          name: 'Tái khám lần 2 - Bóc keo dán',
          description: 'Tái khám và bóc keo dán sinh học',
          action_type: 'appointment',
          requires_media: false,
          approval_type: 'doctor',
          priority: 'high'
        },
        {
          id: 6,
          days_post_op: 30,
          name: 'Tái khám lần 3 - Đánh giá form',
          description: 'Tái khám đánh giá form ngực và hướng dẫn massage',
          action_type: 'appointment',
          requires_media: false,
          approval_type: 'doctor',
          priority: 'high'
        }
      ]
    },
    {
      id: 2,
      name: 'Quy trình chăm sóc hậu phẫu nâng mũi',
      description: 'Quy trình chăm sóc cho khách hàng sau phẫu thuật nâng mũi',
      doctor_id: 2,
      doctor_name: 'BS Minh',
      procedure_type: 'nang_mui',
      duration_days: 90,
      status: 'active',
      created_at: '2025-01-11T10:00:00Z',
      activities: [
        {
          id: 7,
          days_post_op: 1,
          name: 'Kiểm tra sưng đau',
          description: 'Kiểm tra tình trạng sưng đau sau phẫu thuật',
          action_type: 'status_update',
          requires_media: false,
          approval_type: 'nurse',
          priority: 'high'
        },
        {
          id: 8,
          days_post_op: 7,
          name: 'Tái khám cắt chỉ',
          description: 'Tái khám và cắt chỉ vết mổ',
          action_type: 'appointment',
          requires_media: false,
          approval_type: 'doctor',
          priority: 'high'
        }
      ]
    }
  ];

  useEffect(() => {
    loadTemplates();
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response = await doctorService.getDoctors();
      console.log('Doctors API response:', response);
      // Handle different response structures
      if (response && Array.isArray(response)) {
        // Direct array response
        console.log('Doctors data (array):', response);
        setDoctors(response);
      } else if (response && response.success && response.data) {
        // Success response with data
        console.log('Doctors data (success):', response.data);
        setDoctors(response.data);
      } else if (response && response.data) {
        // Direct data response
        console.log('Doctors data (direct):', response.data);
        setDoctors(response.data);
      } else {
        console.log('Unexpected response format:', response);
        message.error('Lỗi khi tải danh sách bác sĩ: Định dạng response không hợp lệ');
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      message.error('Lỗi khi tải danh sách bác sĩ');
    }
  };

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await carePlanService.getTemplates();
      if (response.success) {
        // Transform backend data to frontend format
        const transformedTemplates = response.data.map(template => 
          carePlanService.transformTemplateFromBackend(template)
        );
        setTemplates(transformedTemplates);
      } else {
        message.error('Lỗi khi tải danh sách template: ' + response.error);
        // Fallback to mock data if API fails
        setTemplates(mockTemplates);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      message.error('Lỗi khi tải danh sách template');
      // Fallback to mock data
      setTemplates(mockTemplates);
    } finally {
      setLoading(false);
    }
  };

  const getActionTypeIcon = (type) => {
    const icons = {
      phone_call: <UserOutlined />,
      photo_upload: <CameraOutlined />,
      video_upload: <VideoCameraOutlined />,
      voice_note: <AudioOutlined />,
      text_feedback: <FileTextOutlined />,
      status_update: <MedicineBoxOutlined />,
      appointment: <CalendarOutlined />,
      medication: <MedicineBoxOutlined />
    };
    return icons[type] || <FileTextOutlined />;
  };

  const getActionTypeDisplay = (type) => {
    const types = {
      phone_call: 'Gọi điện',
      photo_upload: 'Chụp ảnh',
      video_upload: 'Quay video',
      voice_note: 'Ghi âm',
      text_feedback: 'Viết phản hồi',
      status_update: 'Cập nhật trạng thái',
      appointment: 'Lịch hẹn',
      medication: 'Thuốc men'
    };
    return types[type] || type;
  };

  const getApprovalTypeDisplay = (type) => {
    const types = {
      none: 'Không cần',
      nurse: 'Y tá',
      doctor: 'Bác sĩ',
      both: 'Cả hai'
    };
    return types[type] || type;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'blue',
      medium: 'orange',
      high: 'red'
    };
    return colors[priority] || 'default';
  };

  const handleAddNew = () => {
    setSelectedTemplate(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    console.log('Editing template:', template);
    form.setFieldsValue({
      ...template,
      doctor_id: template.doctor || template.doctor_id,
      procedure_type: template.procedure_type,
      activities: template.activities || []
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await carePlanService.deleteTemplate(id);
      if (response.success) {
        setTemplates(templates.filter(item => item.id !== id));
        message.success('Đã xóa template');
      } else {
        message.error('Lỗi khi xóa template: ' + response.error);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      message.error('Lỗi khi xóa template');
    }
  };

  const handleDuplicate = async (template) => {
    try {
      const duplicateData = {
        ...carePlanService.transformTemplateForBackend(template),
        name: `${template.name} (Bản sao)`
      };
      
      const response = await carePlanService.createTemplate(duplicateData);
      if (response.success) {
        const newTemplate = carePlanService.transformTemplateFromBackend(response.data);
        setTemplates([...templates, newTemplate]);
        message.success('Đã sao chép template');
      } else {
        message.error('Lỗi khi sao chép template: ' + response.error);
      }
    } catch (error) {
      console.error('Error duplicating template:', error);
      message.error('Lỗi khi sao chép template');
    }
  };

  const handleModalOk = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      
      // Find selected doctor to get doctor name
      const selectedDoctor = doctors.find(doctor => doctor.id === values.doctor_id);
      const doctorName = selectedDoctor ? 
        `${selectedDoctor.user?.first_name} ${selectedDoctor.user?.last_name}` : 'Unknown Doctor';
      
      const templateData = carePlanService.transformTemplateForBackend({
        ...values,
        doctor_name: doctorName,
        status: 'active'
      });

      if (selectedTemplate) {
        // Update existing template
        const response = await carePlanService.updateTemplate(selectedTemplate.id, templateData);
        if (response.success) {
          const updatedTemplate = carePlanService.transformTemplateFromBackend(response.data);
          setTemplates(templates.map(item => 
            item.id === selectedTemplate.id ? updatedTemplate : item
          ));
          message.success('Cập nhật template thành công');
        } else {
          message.error('Lỗi khi cập nhật template: ' + response.error);
          return;
        }
      } else {
        // Create new template
        const response = await carePlanService.createTemplate(templateData);
        if (response.success) {
          const newTemplate = carePlanService.transformTemplateFromBackend(response.data);
          setTemplates([...templates, newTemplate]);
          message.success('Thêm template thành công');
        } else {
          message.error('Lỗi khi thêm template: ' + response.error);
          return;
        }
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error saving template:', error);
      message.error('Lỗi khi lưu template');
    }
  };

  const handleApplyTemplate = (template, customerId) => {
    // In real app, this would call API to create care plan instances
    message.success(`Đã áp dụng template "${template.name}" cho khách hàng`);
    console.log('Applying template:', template, 'to customer:', customerId);
  };

  const columns = [
    {
      title: 'Tên template',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <div><strong>{name}</strong></div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description}
          </div>
        </div>
      )
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctor_name',
      key: 'doctor_name',
      render: (doctorName) => doctorName || 'Chưa xác định'
    },
    {
      title: 'Loại phẫu thuật',
      dataIndex: 'procedure_type',
      key: 'procedure_type',
      render: (type) => (
        <Tag color="blue">
          {type === 'nang_nguc' || type === 'breast_augmentation' ? 'Nâng ngực' : 
           type === 'nang_mui' ? 'Nâng mũi' : 
           type === 'hut_mo' ? 'Hút mỡ' : 'Khác'}
        </Tag>
      )
    },
    {
      title: 'Thời gian (ngày)',
      dataIndex: 'duration_days',
      key: 'duration_days',
      render: (days) => `${days} ngày`
    },
    {
      title: 'Số hoạt động',
      key: 'activity_count',
      render: (_, record) => record.activities?.length || 0
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
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
          <Button
            type="link"
            icon={<CopyOutlined />}
            onClick={() => handleDuplicate(record)}
          >
            Sao chép
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa template này?"
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
    total: templates.length,
    active: templates.filter(item => item.status === 'active').length,
    nang_nguc: templates.filter(item => item.procedure_type === 'nang_nguc').length,
    nang_mui: templates.filter(item => item.procedure_type === 'nang_mui').length
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số template"
                value={stats.total}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Template đang hoạt động"
                value={stats.active}
                valueStyle={{ color: '#52c41a' }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Template nâng ngực"
                value={stats.nang_nguc}
                valueStyle={{ color: '#1890ff' }}
                prefix={<MedicineBoxOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Template nâng mũi"
                value={stats.nang_mui}
                valueStyle={{ color: '#722ed1' }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Card
        title="Quản lý Template Chăm sóc"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Thêm Template
          </Button>
        }
      >
        <Tabs defaultActiveKey="list">
          <TabPane tab="Danh sách Template" key="list">
            <Table
              columns={columns}
              dataSource={templates}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} template`
              }}
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{ margin: 0 }}>
                    <Title level={5}>Các hoạt động trong template:</Title>
                    <List
                      size="small"
                      dataSource={record.activities}
                      renderItem={(activity) => (
                        <List.Item>
                          <Space>
                            {getActionTypeIcon(activity.action_type)}
                            <div>
                              <Text strong>Ngày {activity.days_post_op}: {activity.name}</Text>
                              <br />
                              <Text type="secondary">{activity.description}</Text>
                              <br />
                              <Space size="small">
                                <Tag size="small">{getActionTypeDisplay(activity.action_type)}</Tag>
                                {activity.requires_media && <Tag size="small" color="blue">Cần media</Tag>}
                                <Tag size="small" color={getPriorityColor(activity.priority)}>
                                  Ưu tiên: {activity.priority}
                                </Tag>
                                <Tag size="small">
                                  Phê duyệt: {getApprovalTypeDisplay(activity.approval_type)}
                                </Tag>
                              </Space>
                            </div>
                          </Space>
                        </List.Item>
                      )}
                    />
                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                      <Button 
                        type="primary" 
                        onClick={() => handleApplyTemplate(record, 1)}
                      >
                        Áp dụng template này
                      </Button>
                    </div>
                  </div>
                )
              }}
            />
          </TabPane>
          
          <TabPane tab="Template Mẫu" key="templates">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card 
                  title="Quy trình Nâng ngực (BS Doãn Dương)" 
                  extra={<Button type="link">Sử dụng</Button>}
                >
                  <Text strong>Thời gian: 180 ngày</Text>
                  <br />
                  <Text type="secondary">Bao gồm 10 mốc chăm sóc chính với các hoạt động:</Text>
                  <ul style={{ marginTop: 8 }}>
                    <li>Chụp ảnh vết mổ (Ngày 1, 3, 7)</li>
                    <li>Quay video tập tay (Ngày 3, 5, 7)</li>
                    <li>Tái khám (Ngày 7, 14, 30)</li>
                    <li>Ghi âm cảm nhận (Ngày 14, 30, 90)</li>
                  </ul>
                </Card>
              </Col>
              <Col span={12}>
                <Card 
                  title="Quy trình Nâng mũi (BS Minh)" 
                  extra={<Button type="link">Sử dụng</Button>}
                >
                  <Text strong>Thời gian: 90 ngày</Text>
                  <br />
                  <Text type="secondary">Bao gồm 6 mốc chăm sóc chính với các hoạt động:</Text>
                  <ul style={{ marginTop: 8 }}>
                    <li>Kiểm tra sưng đau (Ngày 1, 3, 7)</li>
                    <li>Chụp ảnh mũi (Ngày 7, 14, 30)</li>
                    <li>Tái khám cắt chỉ (Ngày 7, 14)</li>
                    <li>Đánh giá kết quả (Ngày 30, 60, 90)</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={selectedTemplate ? 'Chỉnh sửa Template' : 'Thêm Template Mới'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={800}
        okText={selectedTemplate ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          name="templateForm"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên template"
                rules={[{ required: true, message: 'Vui lòng nhập tên template' }]}
              >
                <Input placeholder="Nhập tên template" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="doctor_id"
                label="Bác sĩ"
                rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}
              >
                <Select placeholder="Chọn bác sĩ">
                  {doctors.length > 0 ? (
                    doctors.map(doctor => (
                      <Option key={doctor.id} value={doctor.id}>
                        {doctor.user?.first_name} {doctor.user?.last_name} - {doctor.specialization}
                      </Option>
                    ))
                  ) : (
                    <Option disabled value="">
                      Đang tải danh sách bác sĩ...
                    </Option>
                  )}
                </Select>
              </Form.Item>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Số bác sĩ: {doctors.length}
              </div>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="procedure_type"
                label="Loại phẫu thuật"
                rules={[{ required: true, message: 'Vui lòng chọn loại phẫu thuật' }]}
              >
                <Select placeholder="Chọn loại phẫu thuật">
                  <Option value="nang_nguc">Nâng ngực</Option>
                  <Option value="nang_mui">Nâng mũi</Option>
                  <Option value="hut_mo">Hút mỡ</Option>
                  <Option value="treo_nguc">Treo ngực</Option>
                  <Option value="khac">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration_days"
                label="Thời gian chăm sóc (ngày)"
                rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}
                initialValue={90}
              >
                <InputNumber
                  min={1}
                  max={365}
                  style={{ width: '100%' }}
                  placeholder="Số ngày chăm sóc"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea
              rows={3}
              placeholder="Nhập mô tả chi tiết về template"
            />
          </Form.Item>

          <Divider>Hoạt động chăm sóc</Divider>
          
          <Form.List name="activities">
            {(fields, { add, remove }) => (
              <div>
                {fields.map(({ key, name, ...restField }) => (
                  <Card 
                    key={key} 
                    size="small" 
                    style={{ marginBottom: 16 }}
                    title={`Hoạt động ${name + 1}`}
                    extra={
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ color: '#ff4d4f' }}
                      />
                    }
                  >
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'days_post_op']}
                          label="Ngày sau phẫu thuật"
                          rules={[{ required: true, message: 'Nhập số ngày' }]}
                        >
                          <InputNumber
                            min={1}
                            max={365}
                            placeholder="Số ngày"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={16}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          label="Tên hoạt động"
                          rules={[{ required: true, message: 'Nhập tên hoạt động' }]}
                        >
                          <Input placeholder="Tên hoạt động" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      label="Mô tả"
                      rules={[{ required: true, message: 'Nhập mô tả' }]}
                    >
                      <TextArea
                        rows={2}
                        placeholder="Mô tả chi tiết hoạt động"
                      />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'action_type']}
                          label="Loại hành động"
                          rules={[{ required: true, message: 'Chọn loại hành động' }]}
                        >
                          <Select placeholder="Chọn loại">
                            <Option value="phone_call">Gọi điện</Option>
                            <Option value="photo_upload">Chụp ảnh</Option>
                            <Option value="video_upload">Quay video</Option>
                            <Option value="voice_note">Ghi âm</Option>
                            <Option value="text_feedback">Viết phản hồi</Option>
                            <Option value="status_update">Cập nhật trạng thái</Option>
                            <Option value="appointment">Lịch hẹn</Option>
                            <Option value="medication">Thuốc men</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'approval_type']}
                          label="Phê duyệt bởi"
                          rules={[{ required: true, message: 'Chọn loại phê duyệt' }]}
                        >
                          <Select placeholder="Chọn loại phê duyệt">
                            <Option value="none">Không cần</Option>
                            <Option value="nurse">Y tá</Option>
                            <Option value="doctor">Bác sĩ</Option>
                            <Option value="both">Cả hai</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'priority']}
                          label="Mức độ ưu tiên"
                          rules={[{ required: true, message: 'Chọn mức ưu tiên' }]}
                        >
                          <Select placeholder="Chọn mức ưu tiên">
                            <Option value="low">Thấp</Option>
                            <Option value="medium">Trung bình</Option>
                            <Option value="high">Cao</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      {...restField}
                      name={[name, 'requires_media']}
                      valuePropName="checked"
                      initialValue={false}
                    >
                      <Switch
                        checkedChildren="Cần media"
                        unCheckedChildren="Không cần media"
                      />
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) => 
                        prevValues.activities?.[name]?.action_type !== curValues.activities?.[name]?.action_type
                      }
                    >
                      {({ getFieldValue }) => {
                        const actionType = getFieldValue(['activities', name, 'action_type']);
                        const requiresMedia = getFieldValue(['activities', name, 'requires_media']);
                        
                        if (!requiresMedia) return null;

                        let requirementField = null;
                        let placeholder = '';
                        
                        switch (actionType) {
                          case 'photo_upload':
                            requirementField = 'photo_requirement';
                            placeholder = 'Yêu cầu chụp ảnh (ví dụ: Chụp ảnh vết mổ từ 3 góc độ)';
                            break;
                          case 'video_upload':
                            requirementField = 'video_requirement';
                            placeholder = 'Yêu cầu quay video (ví dụ: Quay video tập tay 30 giây)';
                            break;
                          case 'voice_note':
                            requirementField = 'voice_requirement';
                            placeholder = 'Yêu cầu ghi âm (ví dụ: Ghi âm cảm nhận 1 phút)';
                            break;
                          case 'text_feedback':
                            requirementField = 'text_requirement';
                            placeholder = 'Yêu cầu viết (ví dụ: Viết ít nhất 200 từ)';
                            break;
                          default:
                            return null;
                        }

                        return (
                          <Form.Item
                            {...restField}
                            name={[name, requirementField]}
                            label="Yêu cầu cụ thể"
                            rules={[{ required: true, message: 'Nhập yêu cầu cụ thể' }]}
                          >
                            <TextArea
                              rows={2}
                              placeholder={placeholder}
                            />
                          </Form.Item>
                        );
                      }}
                    </Form.Item>
                  </Card>
                ))}
                
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm hoạt động
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default CarePlanTemplates;
