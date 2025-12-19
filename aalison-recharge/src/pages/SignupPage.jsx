import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Form submitted with data:', formData);
    
    // Check if all fields are filled
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.password) {
      setMessage('Please fill all fields');
      return;
    }
    
    setLoading(true);
    setMessage('Processing...');

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Registration successful!');
        setFormData({ name: '', email: '', phoneNumber: '', password: '' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage('❌ ' + (data.error || 'Registration failed'));
      }
    } catch (error) {
      console.error('Frontend error:', error);
      setMessage('❌ Connection error. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <form className="recharge-form" onSubmit={handleSubmit}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Sign Up</h2>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              className="form-input"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '15px', 
              marginTop: '20px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          {message && (
            <p style={{ 
              textAlign: 'center', 
              marginTop: '15px',
              color: message.includes('successful') ? 'green' : 'red'
            }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;