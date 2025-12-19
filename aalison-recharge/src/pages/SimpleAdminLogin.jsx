import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleAdminLogin = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      try {
        const result = await fetch('http://localhost:7000/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        const data = await result.json();
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } catch (error) {
        localStorage.setItem('adminToken', 'admin-token-' + Date.now());
        navigate('/admin');
      }
    } else {
      setMessage('Invalid password');
    }
  };

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#e60012',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            background: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <small>Password: admin123</small>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminLogin;