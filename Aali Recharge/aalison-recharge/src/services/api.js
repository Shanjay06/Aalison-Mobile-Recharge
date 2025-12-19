const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');
    const token = adminToken || userToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log('Making request to:', url);
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));
      
      const text = await response.text();
      console.log('Response text:', text.substring(0, 200));
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Server returned HTML instead of JSON. Check if backend is running on port 8000.');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    console.log('API login called with:', credentials);
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    console.log('API register called with:', userData);
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Admin methods
  async adminLogin(password) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async getUsers() {
    return this.request('/admin/users');
  }

  async createUser(userData) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Plans methods
  async getPlans() {
    return this.request('/plans');
  }

  // Admin plan management
  async getAdminPlans() {
    return this.request('/admin/plans');
  }

  async createPlan(planData) {
    console.log('API createPlan called with:', planData);
    console.log('Making request to:', API_BASE_URL + '/admin/plans');
    return this.request('/admin/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async updatePlan(id, planData) {
    return this.request(`/admin/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
  }

  async deletePlan(id) {
    return this.request(`/admin/plans/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();