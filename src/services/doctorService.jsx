import api from './authService';

const doctorService = {
  /**
   * Get all doctors
   * @returns {Promise} List of doctors
   */
  async getDoctors() {
    try {
      // Using the correct endpoint from users app
      const response = await api.get('/doctors/search/');
      console.log('Doctor service response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw new Error('Không thể tải danh sách bác sĩ.');
    }
  },

  /**
   * Search doctors by name or specialization
   * @param {string} query - Search query
   * @returns {Promise} Search results
   */
  async searchDoctors(query) {
    try {
      const response = await api.get('/doctors/search/', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching doctors:', error);
      throw new Error('Không thể tìm kiếm bác sĩ.');
    }
  }
};

export default doctorService;
