import API_CONFIG from '../config/apiConfig';

const API_BASE_URL = API_CONFIG.BASE_URL;

class CarePlanService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/doctors`;
  }

  async getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Template Management
  async getTemplates() {
    try {
      const response = await fetch(`${this.baseURL}/care-plan-templates/`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching templates:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTemplateById(id) {
    try {
      const response = await fetch(`${this.baseURL}/care-plan-templates/${id}/`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createTemplate(templateData) {
    try {
      const response = await fetch(`${this.baseURL}/care-plan-templates/`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error creating template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateTemplate(id, templateData) {
    try {
      const response = await fetch(`${this.baseURL}/care-plan-templates/${id}/`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error updating template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteTemplate(id) {
    try {
      const response = await fetch(`${this.baseURL}/care-plan-templates/${id}/`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Template deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Activity Template Management
  async createActivityTemplate(activityData) {
    try {
      const response = await fetch(`${this.baseURL}/activity-templates/`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error creating activity template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateActivityTemplate(id, activityData) {
    try {
      const response = await fetch(`${this.baseURL}/activity-templates/${id}/`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error updating activity template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteActivityTemplate(id) {
    try {
      const response = await fetch(`${this.baseURL}/activity-templates/${id}/`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Activity template deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting activity template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Care Journey Management
  async createCareJourney(templateId, customerId, surgeryId) {
    try {
      const response = await fetch(`${this.baseURL}/care-plan-templates/${templateId}/create_care_journey/`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({
          customer_id: customerId,
          surgery_id: surgeryId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error creating care journey:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getCareJourneys() {
    try {
      const response = await fetch(`${this.baseURL}/care-journeys/`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching care journeys:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getCareJourneyById(id) {
    try {
      const response = await fetch(`${this.baseURL}/care-journeys/${id}/`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching care journey:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper methods for data transformation
  transformTemplateForBackend(frontendTemplate) {
    // Map frontend procedure_type to backend surgery_type
    const surgeryTypeMap = {
      'nang_nguc': 'nang_nguc',
      'nang_mui': 'nang_mui',
      'treo_nguc': 'treo_nguc',
      'treo_nguc': 'treo_nguc',
      'khac': 'khac'
    };
    
    return {
      name: frontendTemplate.name,
      description: frontendTemplate.description,
      surgery_type: surgeryTypeMap[frontendTemplate.procedure_type] || 'other',
      duration_days: frontendTemplate.duration_days,
      general_care_notes: frontendTemplate.description,
      is_active: true,
      doctor: frontendTemplate.doctor_id, // This should be the doctor's ID
      activity_templates: frontendTemplate.activities?.map(activity => ({
        days_post_op: activity.days_post_op,
        name: activity.name,
        description: activity.description,
        action_type: activity.action_type,
        requires_media: activity.requires_media,
        photo_requirement: activity.photo_requirement || '',
        video_requirement: activity.video_requirement || '',
        text_requirement: activity.text_requirement || '',
        voice_requirement: activity.voice_requirement || '',
        approval_type: activity.approval_type,
        priority: activity.priority
      })) || []
    };
  }

  transformTemplateFromBackend(backendTemplate) {
    console.log('Backend template data:', backendTemplate);
    
    // Handle different response structures
    let doctorName = backendTemplate.doctor_name;
    let doctorId = backendTemplate.doctor;
    
    // If doctor_name is not directly available, try to construct it
    if (!doctorName && backendTemplate.doctor) {
      if (typeof backendTemplate.doctor === 'object') {
        // Nested doctor object
        doctorName = `${backendTemplate.doctor.user?.first_name || ''} ${backendTemplate.doctor.user?.last_name || ''}`.trim();
        doctorId = backendTemplate.doctor.id;
      } else if (typeof backendTemplate.doctor === 'number') {
        // Just doctor ID
        doctorId = backendTemplate.doctor;
      }
    }

    // Map backend surgery_type to frontend procedure_type
    const procedureTypeMap = {
      'nang_nguc': 'nang_nguc',
      'nang_mui': 'nang_mui',
      'hut_mo': 'hut_mo',
      'treo_nguc': 'treo_nguc',
      'khac': 'khac'
    };
    
    return {
      id: backendTemplate.id,
      name: backendTemplate.name,
      description: backendTemplate.description,
      procedure_type: procedureTypeMap[backendTemplate.surgery_type] || 'khac',
      duration_days: backendTemplate.duration_days,
      doctor_id: doctorId,
      doctor_name: doctorName || 'Chưa xác định',
      status: backendTemplate.is_active ? 'active' : 'inactive',
      created_at: backendTemplate.created_at,
      activities: backendTemplate.activity_templates?.map(activity => ({
        id: activity.id,
        days_post_op: activity.days_post_op,
        name: activity.name,
        description: activity.description,
        action_type: activity.action_type,
        requires_media: activity.requires_media,
        photo_requirement: activity.photo_requirement,
        video_requirement: activity.video_requirement,
        text_requirement: activity.text_requirement,
        voice_requirement: activity.voice_requirement,
        approval_type: activity.approval_type,
        priority: activity.priority || 'medium'
      })) || []
    };
  }
}

export default new CarePlanService();
