import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (activeTab === 'login') {
        if (userType === 'admin') {
          // Admin login
          const result = await apiService.adminLogin(formData.password);
          localStorage.setItem('adminToken', result.token);
          localStorage.setItem('user', JSON.stringify({ name: 'Administrator', role: 'admin' }));
          setMessage('Admin login successful');
          setTimeout(() => navigate('/admin'), 1000);
        } else {
          // User login
          const result = await apiService.login({
            email: formData.email,
            password: formData.password
          });
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          setMessage('Login successful');
          setTimeout(() => navigate('/'), 1000);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match');
          setLoading(false);
          return;
        }

        await apiService.register({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password
        });
        
        setMessage('Account created successfully! Data saved to database.');
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: ''
        });
        setTimeout(() => setActiveTab('login'), 1500);
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#e60012',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

  const tabStyle = (isActive) => ({
    flex: 1,
    padding: '12px',
    backgroundColor: isActive ? '#e60012' : 'transparent',
    color: isActive ? 'white' : '#666',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '450px'
      }}>
        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e1e5e9' }}>
          <button
            style={tabStyle(activeTab === 'login')}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            style={tabStyle(activeTab === 'signup')}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <div style={{ padding: '32px' }}>
          {/* User Type Selection for Login */}
          {activeTab === 'login' && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                Login as:
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="userType"
                    value="user"
                    checked={userType === 'user'}
                    onChange={(e) => setUserType(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  User
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="userType"
                    value="admin"
                    checked={userType === 'admin'}
                    onChange={(e) => setUserType(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  Administrator
                </label>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {activeTab === 'signup' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333'
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </>
            )}

            {!(activeTab === 'login' && userType === 'admin') && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Enter your email"
                  required={!(activeTab === 'login' && userType === 'admin')}
                />
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Enter your password"
                minLength="6"
                required
              />
            </div>

            {activeTab === 'signup' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Confirm your password"
                  minLength="6"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                backgroundColor: loading ? '#ccc' : '#e60012',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Processing...' : (activeTab === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {message && (
            <div style={{
              marginTop: '20px',
              padding: '12px',
              textAlign: 'center',
              backgroundColor: message.includes('successful') ? '#d4edda' : '#f8d7da',
              border: `1px solid ${message.includes('successful') ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '6px',
              color: message.includes('successful') ? '#155724' : '#721c24',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}

          {/* Admin Login Hint */}
          {activeTab === 'login' && userType === 'admin' && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#666',
              textAlign: 'center'
            }}>
              Admin password: admin123
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;