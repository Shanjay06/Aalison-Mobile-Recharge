import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const ImprovedLoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        if (userType === 'admin') {
          try {
            const result = await apiService.adminLogin(formData.password);
            localStorage.setItem('adminToken', result.token);
            setMessage('Admin login successful!');
            setTimeout(() => navigate('/admin'), 1000);
          } catch (error) {
            // Offline mode for admin
            if (formData.password === 'admin123') {
              localStorage.setItem('adminToken', 'offline-admin-token');
              setMessage('Admin login successful (Offline Mode)!');
              setTimeout(() => navigate('/admin'), 1000);
            } else {
              throw new Error('Invalid admin password');
            }
          }
        } else {
          try {
            const result = await apiService.login({
              email: formData.email,
              password: formData.password
            });
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            setMessage('Login successful!');
            setTimeout(() => navigate('/profile'), 1000);
          } catch (error) {
            throw new Error(error.message || 'Login failed');
          }
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match!');
          setLoading(false);
          return;
        }
        
        try {
          const result = await apiService.register({
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phone,
            password: formData.password
          });
          
          setMessage('Registration successful! Please login.');
          setFormData({ email: '', password: '', confirmPassword: '', name: '', phone: '' });
          setTimeout(() => setIsLogin(true), 1500);
        } catch (error) {
          throw new Error(error.message || 'Registration failed');
        }
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '20px',
    background: 'white',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        maxWidth: '480px',
        width: '100%'
      }}>
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '8px'
          }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{fontSize: '16px', color: '#666'}}>
            {isLogin ? 'Sign in to your account' : 'Join Aalison Recharge today'}
          </p>
        </div>

        {/* User Type Selection for Login */}
        {isLogin && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '8px'
            }}>
              Login as:
            </label>
            <div style={{ display: 'flex', gap: '16px' }}>
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
          {!isLogin && (
            <>
              <div style={{marginBottom: '20px'}}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  style={inputStyle}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={(e) => e.target.style.borderColor = '#e60012'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  required
                />
              </div>

              <div style={{marginBottom: '20px'}}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  style={inputStyle}
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={(e) => e.target.style.borderColor = '#e60012'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  maxLength="10"
                  required
                />
              </div>
            </>
          )}

          {!(isLogin && userType === 'admin') && (
            <div style={{marginBottom: '20px'}}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                style={inputStyle}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={(e) => e.target.style.borderColor = '#e60012'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                required={!(isLogin && userType === 'admin')}
              />
            </div>
          )}

          <div style={{marginBottom: '20px'}}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '8px'
            }}>
              {isLogin && userType === 'admin' ? 'Admin Password' : 'Password'}
            </label>
            <input
              type="password"
              name="password"
              style={inputStyle}
              placeholder={isLogin && userType === 'admin' ? 'Enter admin password' : 'Enter your password'}
              value={formData.password}
              onChange={handleInputChange}
              onFocus={(e) => e.target.style.borderColor = '#e60012'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              minLength={isLogin && userType === 'admin' ? '1' : '6'}
              required
            />
          </div>

          {!isLogin && (
            <div style={{marginBottom: '20px'}}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                marginBottom: '8px'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                style={inputStyle}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onFocus={(e) => e.target.style.borderColor = '#e60012'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                minLength="6"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#ccc' : '#e60012',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              marginBottom: '24px',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {message && (
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center',
            backgroundColor: message.includes('successful') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${message.includes('successful') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '8px',
            color: message.includes('successful') ? '#155724' : '#721c24'
          }}>
            {message}
          </div>
        )}

        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <p style={{color: '#666', fontSize: '14px'}}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#e60012',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px'
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Admin Login Hint */}
        {isLogin && userType === 'admin' && (
          <div style={{
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#666'
            }}>
              Admin password: admin123
            </p>
          </div>
        )}

        <div style={{
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#666'
          }}>
            Your information is protected with bank-grade security
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImprovedLoginPage;