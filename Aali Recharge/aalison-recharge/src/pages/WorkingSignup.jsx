import { useState } from 'react';

const WorkingSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Submitting...');

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
      } else {
        setMessage('❌ ' + data.error);
      }
    } catch (error) {
      setMessage('❌ Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <form className="recharge-form" onSubmit={handleSubmit}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Working Signup</h2>
          
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '15px', 
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
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default WorkingSignup;