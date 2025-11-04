import api from './api.js';

class MetricsService {
  constructor() {
    // keep if you need direct base, but prefer calling api.api with alias below
    this.baseUrl = api.API_BASE.VITE_METRICS_SERVICE_URL;
  }

  async getMetrics() {
    // use service alias so builds pick up VITE_* correctly
    return api.api('/metrics', 'METRICS_SERVICE');
  }

  async pushMetric(metric) {
    return api.api('/metrics', 'METRICS_SERVICE', {
      method: 'POST',
      body: JSON.stringify(metric)
    });
  }
}

export default new MetricsService();