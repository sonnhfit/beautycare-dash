// Centralized API configuration
const API_CONFIG = {
  // Base URL for all API endpoints
  // Change this to switch between different backend environments
  BASE_URL: 'https://beautycare.runagent.io/api',
//   BASE_URL: 'http://127.0.0.1:8000/api',
  
  // API endpoints configuration
  ENDPOINTS: {
    USERS: '/users',
    DOCTORS: '/doctors',
    NURSES: '/nurses',
    CUSTOMERS: '/customers',
    APPOINTMENTS: '/appointments',
    MEDIA: '/media'
  }
};

export default API_CONFIG;
