import api from './api.js';

/**
 * Notification Service - Send notifications
 */
class NotificationService {
  constructor() {
    this.baseUrl = api.API_BASE.VITE_NOTIFICATION_SERVICE_URL;
  }

  /**
   * Send general notification
   * @param {Object} payload - Notification payload
   * @returns {Promise<Object>} Success response
   */
  async receiveNotification(payload) {
    return api.apiCall(`${this.baseUrl}/`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  /**
   * Send email notification
   * @param {Object} emailData - Email data (to, subject, message)
   * @returns {Promise<Object>} Success response
   */
  async sendEmail(emailData) {
    return api.apiCall(`${this.baseUrl}/email`, {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
  }

  /**
   * Publish to SNS
   * @param {Object} snsData - SNS publish data
   * @returns {Promise<Object>} Success response
   */
  async publishSNS(snsData) {
    return api.apiCall(`${this.baseUrl}/sns`, {
      method: 'POST',
      body: JSON.stringify(snsData)
    });
  }
}

export default new NotificationService();

