const API_BASE_URL = 'http://localhost:3000';

class ApiService {
  static async evaluateInterview(payload) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/evaluate-interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        throw new Error('API returned ' + res.status);
      }
      
      return await res.json();
    } catch (e) {
      console.error('API Error:', e);
      throw e;
    }
  }
}

window.ApiService = ApiService;
