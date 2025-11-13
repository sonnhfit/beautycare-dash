import api from './authService';

const nurseService = {
  /**
   * Get all nurses
   * @returns {Promise} List of nurses
   */
  async getNurses() {
    try {
      const response = await api.get('/nurses/');
      return response.data;
    } catch (error) {
      console.error('Error fetching nurses:', error);
      throw new Error('Không thể tải danh sách y tá.');
    }
  },

  /**
   * Get nurse by ID
   * @param {number} id - Nurse ID
   * @returns {Promise} Nurse data
   */
  async getNurseById(id) {
    try {
      const response = await api.get(`/nurses/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching nurse ${id}:`, error);
      throw new Error('Không thể tải thông tin y tá.');
    }
  },

  /**
   * Get nurses by doctor ID
   * @param {number} doctorId - Doctor ID
   * @returns {Promise} List of nurses assigned to the doctor
   */
  async getNursesByDoctor(doctorId) {
    try {
      const response = await api.get(`/nurses/?doctor_id=${doctorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching nurses for doctor ${doctorId}:`, error);
      throw new Error('Không thể tải danh sách y tá của bác sĩ.');
    }
  }
};

export default nurseService;
