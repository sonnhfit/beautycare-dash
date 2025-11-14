import api from './authService';

const customerCareService = {
  /**
   * Get daily care activities for a customer
   * @param {number} customerId - Customer ID
   * @returns {Promise} List of daily care activities
   */
  async getCustomerActivities(customerId) {
    try {
      // Use legacy endpoint that works without database errors
      const response = await api.get(`/daily-activities/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer activities:', error);
      throw new Error('Không thể tải hoạt động của khách hàng.');
    }
  },

  /**
   * Create a new daily care activity
   * @param {Object} activityData - Activity data
   * @returns {Promise} Created activity
   */
  async createActivity(activityData) {
    try {
      // Use legacy endpoint that works without database errors
      const response = await api.post('/daily-activities/', activityData);
      return response.data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw new Error('Không thể tạo hoạt động mới.');
    }
  },

  /**
   * Update a daily care activity
   * @param {number} activityId - Activity ID
   * @param {Object} activityData - Updated activity data
   * @returns {Promise} Updated activity
   */
  async updateActivity(activityId, activityData) {
    try {
      // Use legacy endpoint that works without database errors
      const response = await api.put(`/daily-activities/${activityId}/`, activityData);
      return response.data;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw new Error('Không thể cập nhật hoạt động.');
    }
  },

  /**
   * Delete a daily care activity
   * @param {number} activityId - Activity ID
   * @returns {Promise} Response message
   */
  async deleteActivity(activityId) {
    try {
      // Use legacy endpoint that works without database errors
      const response = await api.delete(`/daily-activities/${activityId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw new Error('Không thể xóa hoạt động.');
    }
  },

  /**
   * Submit activity for completion/approval
   * @param {number} activityId - Activity ID
   * @param {Object} submissionData - Submission data
   * @returns {Promise} Response message
   */
  async submitActivity(activityId, submissionData) {
    try {
      const response = await api.post(`/care-activities/daily-activities/${activityId}/submit/`, submissionData);
      return response.data;
    } catch (error) {
      console.error('Error submitting activity:', error);
      throw new Error('Không thể gửi hoạt động để phê duyệt.');
    }
  },

  /**
   * Approve activity (for nurses/doctors)
   * @param {number} activityId - Activity ID
   * @param {Object} approvalData - Approval data
   * @returns {Promise} Response message
   */
  async approveActivity(activityId, approvalData) {
    try {
      const response = await api.post(`/care-activities/daily-activities/${activityId}/approve/`, approvalData);
      return response.data;
    } catch (error) {
      console.error('Error approving activity:', error);
      throw new Error('Không thể phê duyệt hoạt động.');
    }
  },

  /**
   * Reject activity (for nurses/doctors)
   * @param {number} activityId - Activity ID
   * @param {Object} rejectionData - Rejection data
   * @returns {Promise} Response message
   */
  async rejectActivity(activityId, rejectionData) {
    try {
      const response = await api.post(`/care-activities/daily-activities/${activityId}/reject/`, rejectionData);
      return response.data;
    } catch (error) {
      console.error('Error rejecting activity:', error);
      throw new Error('Không thể từ chối hoạt động.');
    }
  },

  /**
   * Get activities pending approval
   * @returns {Promise} List of pending activities
   */
  async getPendingApprovals() {
    try {
      const response = await api.get('/care-activities/daily-activities/pending_approval/');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw new Error('Không thể tải hoạt động chờ phê duyệt.');
    }
  },

  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise} Created appointment
   */
  async createAppointment(appointmentData) {
    try {
      const response = await api.post('/customers/appointments/', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('Không thể tạo lịch hẹn mới.');
    }
  },

  /**
   * Update an appointment
   * @param {number} appointmentId - Appointment ID
   * @param {Object} appointmentData - Updated appointment data
   * @returns {Promise} Updated appointment
   */
  async updateAppointment(appointmentId, appointmentData) {
    try {
      const response = await api.put(`/customers/appointments/${appointmentId}/`, appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw new Error('Không thể cập nhật lịch hẹn.');
    }
  },

  /**
   * Delete an appointment
   * @param {number} appointmentId - Appointment ID
   * @returns {Promise} Response message
   */
  async deleteAppointment(appointmentId) {
    try {
      const response = await api.delete(`/customers/appointments/${appointmentId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw new Error('Không thể xóa lịch hẹn.');
    }
  },

  /**
   * Get customer care dashboard overview
   * @returns {Promise} Dashboard statistics
   */
  async getDashboardOverview() {
    try {
      const response = await api.get('/customer-care-dashboard/overview/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw new Error('Không thể tải thống kê dashboard.');
    }
  }
};

export default customerCareService;
