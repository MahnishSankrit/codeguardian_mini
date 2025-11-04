import api from './api.js';

/**
 * Insight Service - Aggregated insights
 */
class InsightService {
  constructor() {
    this.baseUrl = api.API_BASE.VITE_INSIGHT_SERVICE_URL;
  }

  /**
   * Get aggregated insights combining AI reviews and metrics
   * @returns {Promise<Object>} Aggregated insights
   */
  async getInsights() {
    return api.apiCall(`${this.baseUrl}/insights`);
  }
}

export default new InsightService();

