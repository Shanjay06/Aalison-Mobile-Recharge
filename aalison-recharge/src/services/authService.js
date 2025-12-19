const API_BASE_URL = 'http://localhost:8000/api';

class AuthService {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    this.token = localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      ...options
    };

    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  }

  async signup(userData) {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.success) {
      this.token = response.data.token;
      this.currentUser = response.data.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
    
    return response;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.token = null;
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.token && !!this.currentUser;
  }

  isAdmin() {
    return this.currentUser?.role === 'admin';
  }

  async getAllUsers() {
    const response = await this.request('/users');
    return response.data.users;
  }

  async deleteUser(userId) {
    const response = await this.request(`/users/${userId}`, {
      method: 'DELETE'
    });
    return response;
  }
}

export default new AuthService();