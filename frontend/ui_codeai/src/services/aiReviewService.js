import api from "./api.js";

class AIReviewService {
  constructor() {
    this.serviceKey = "AI_REVIEW_SERVICE";
  }

  async reviewCode(codeSnippet) {
    return api.api("/review", this.serviceKey, {
      method: "POST",
      body: JSON.stringify({ codeSnippet }),
    });
  }

  async runAIReview(payload) {
    return api.api("/review", this.serviceKey, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export default new AIReviewService();
