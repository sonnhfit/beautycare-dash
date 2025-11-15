import api from './authService';

const customerService = {
  /**
   * Get all customers (for admin/staff users)
   * @param {string} searchQuery - Optional search query for filtering
   * @returns {Promise} List of customers
   */
  async getCustomers(searchQuery = '') {
    try {
      const params = {};
      if (searchQuery) {
        params.search = searchQuery;
      }
      const response = await api.get('/customers/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw new Error('Không thể tải danh sách khách hàng.');
    }
  },

  /**
   * Get customer by ID
   * @param {number} id - Customer ID
   * @returns {Promise} Customer data
   */
  async getCustomerById(id) {
    try {
      const response = await api.get(`/customers/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw new Error('Không thể tải thông tin khách hàng.');
    }
  },

  /**
   * Create new customer
   * @param {Object} customerData - Customer data
   * @returns {Promise} Created customer
   */
  async createCustomer(customerData) {
    try {
      // For now, we'll use the placeholder endpoint
      // TODO: Implement proper customer creation when backend is ready
      const response = await api.post('/customers/create-with-phone/', customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error('Không thể tạo khách hàng mới.');
    }
  },

  /**
   * Update customer
   * @param {number} id - Customer ID
   * @param {Object} customerData - Updated customer data
   * @returns {Promise} Updated customer
   */
  async updateCustomer(id, customerData) {
    try {
      // For now, we'll use the detail endpoint with PUT method
      // TODO: Implement proper customer update when backend is ready
      const response = await api.put(`/customers/${id}/`, customerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw new Error('Không thể cập nhật thông tin khách hàng.');
    }
  },

  /**
   * Update customer assignment (doctor and nurse)
   * @param {number} id - Customer ID
   * @param {Object} assignmentData - Assignment data {assigned_doctor, assigned_nurse}
   * @returns {Promise} Updated customer
   */
  async updateCustomerAssignment(id, assignmentData) {
    try {
      const response = await api.patch(`/customers/${id}/update-assignment/`, assignmentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer assignment ${id}:`, error);
      throw new Error('Không thể cập nhật bác sĩ/y tá quản lý.');
    }
  },


  /**
   * Get customer medical records
   * @param {number} customerId - Customer ID
   * @returns {Promise} List of medical records
   */
  async getCustomerMedicalRecords(customerId) {
    try {
      const response = await api.get(`/customers/${customerId}/medical-records/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching medical records for customer ${customerId}:`, error);
      throw new Error('Không thể tải lịch sử y tế.');
    }
  },

  /**
   * Get customer appointments
   * @param {number} customerId - Customer ID
   * @returns {Promise} List of appointments
   */
  async getCustomerAppointments(customerId) {
    try {
      const response = await api.get(`/customers/${customerId}/appointments/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointments for customer ${customerId}:`, error);
      throw new Error('Không thể tải lịch hẹn.');
    }
  },

  /**
   * Get customer surgeries
   * @param {number} customerId - Customer ID
   * @returns {Promise} List of surgeries
   */
  async getCustomerSurgeries(customerId) {
    try {
      const response = await api.get(`/customers/${customerId}/surgeries/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching surgeries for customer ${customerId}:`, error);
      throw new Error('Không thể tải thông tin phẫu thuật.');
    }
  },

  /**
   * Search customers by name, phone, or email
   * @param {string} query - Search query
   * @returns {Promise} Search results
   */
  async searchCustomers(query) {
    try {
      // For now, we'll filter on the frontend
      // TODO: Implement backend search when available
      const customers = await this.getCustomers();
      const filtered = customers.filter(customer => 
        customer.user?.first_name?.toLowerCase().includes(query.toLowerCase()) ||
        customer.user?.last_name?.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone_number?.includes(query) ||
        customer.user?.email?.toLowerCase().includes(query.toLowerCase())
      );
      return filtered;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw new Error('Không thể tìm kiếm khách hàng.');
    }
  },

  /**
   * Filter customers by status
   * @param {string} status - Customer status
   * @returns {Promise} Filtered customers
   */
  async filterCustomersByStatus(status) {
    try {
      const customers = await this.getCustomers();
      const filtered = customers.filter(customer => customer.status === status);
      return filtered;
    } catch (error) {
      console.error('Error filtering customers by status:', error);
      throw new Error('Không thể lọc khách hàng theo trạng thái.');
    }
  },

  /**
   * Filter customers by surgery type
   * @param {string} surgeryType - Surgery type
   * @returns {Promise} Filtered customers
   */
  async filterCustomersBySurgeryType(surgeryType) {
    try {
      const customers = await this.getCustomers();
      // This will need to be updated when we have surgery data in the customer model
      const filtered = customers.filter(customer => 
        customer.surgeries?.some(surgery => surgery.surgery_type === surgeryType)
      );
      return filtered;
    } catch (error) {
      console.error('Error filtering customers by surgery type:', error);
      throw new Error('Không thể lọc khách hàng theo loại phẫu thuật.');
    }
  },

  /**
   * Soft delete customer by setting deleted_at timestamp
   * @param {number} id - Customer ID
   * @returns {Promise} Response message
   */
  async softDeleteCustomer(id) {
    try {
      const response = await api.delete(`/customers/${id}/soft-delete/`);
      return response.data;
    } catch (error) {
      console.error(`Error soft deleting customer ${id}:`, error);
      throw new Error('Không thể xóa khách hàng.');
    }
  },

  /**
   * Get customer statistics
   * @returns {Promise} Customer statistics
   */
  async getCustomerStats() {
    try {
      const customers = await this.getCustomers();
      const stats = {
        total: customers.length,
        active: customers.filter(c => c.status === 'active').length,
        inactive: customers.filter(c => c.status === 'inactive').length,
        new: customers.filter(c => c.status === 'new').length,
        discharged: customers.filter(c => c.status === 'discharged').length,
      };
      return stats;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw new Error('Không thể tải thống kê khách hàng.');
    }
  },

  /**
   * Get customer journey timeline by customer ID
   * @param {number} customerId - Customer ID
   * @returns {Promise} Customer journey timeline data
   */
  async getCustomerJourneyTimeline(customerId) {
    try {
      const response = await api.get(`/customers/${customerId}/journey-timeline/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer journey timeline for customer ${customerId}:`, error);
      throw new Error('Không thể tải hành trình chăm sóc của khách hàng.');
    }
  }
};

export default customerService;
