import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const FixedSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.password) {
      setMessage('Please fill all fields');
      return;
    }

    setLoading(true);
    setMessage('Creating account...');

    try {
      await authService.signup(formData);
      setMessage('Account created successfully!');
      setFormData({ name: '', email: '', phoneNumber: '', password: '' });
      setTimeout(() => navigate('/auth'), 1500);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '20px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Fixed Signup</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e1e5e9',
                borderRadius: '12px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e1e5e9',
                borderRadius: '12px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e1e5e9',
                borderRadius: '12px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e1e5e9',
                borderRadius: '12px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: loading ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '20px'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            textAlign: 'center',
            backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '8px',
            color: message.includes('successfully') ? '#155724' : '#721c24'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedSignup;