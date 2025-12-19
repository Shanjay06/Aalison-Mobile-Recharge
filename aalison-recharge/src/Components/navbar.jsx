import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../App'
// import authService from '../services/authService'

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const theme = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, [])

  useEffect(() => {
    if (theme.isDarkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [theme.isDarkMode])

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    setCurrentUser(null);
    navigate('/');
  }

  return (
    <nav style={{
      background: theme.colors.cardBg,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '12px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease'
    }}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Link to="/" style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#e60012',
          textDecoration: 'none',
          letterSpacing: '-0.5px'
        }}>
          Aalison
        </Link>
        <div style={{display: 'flex', gap: '40px', alignItems: 'center'}}>
          <Link to="/" style={{color: theme.colors.text, fontWeight: '500', textDecoration: 'none', fontSize: '16px', transition: 'color 0.3s'}}>Home</Link>
          <Link to="/plans" style={{color: theme.colors.text, fontWeight: '500', textDecoration: 'none', fontSize: '16px', transition: 'color 0.3s'}}>Plans</Link>
          <Link to="/history" style={{color: theme.colors.text, fontWeight: '500', textDecoration: 'none', fontSize: '16px', transition: 'color 0.3s'}}>History</Link>
          <Link to="/profile" style={{color: theme.colors.text, fontWeight: '500', textDecoration: 'none', fontSize: '16px', transition: 'color 0.3s'}}>Profile</Link>
          
          <button
            onClick={theme.toggleTheme}
            style={{
              background: 'none',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '20px',
              padding: '8px 12px',
              cursor: 'pointer',
              color: theme.colors.text,
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            {theme.isDarkMode ? 'Light' : 'Dark'}
          </button>
          
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: theme.colors.text, fontSize: '14px' }}>
                {currentUser.name} {currentUser.role === 'admin' && '(Admin)'}
              </span>
              {currentUser.role === 'admin' && (
                <Link
                  to="/admin"
                  style={{
                    background: '#007bff',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                style={{
                  background: '#333',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/auth"
              style={{
                background: 'linear-gradient(135deg, #e60012 0%, #ff6600 100%)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(230, 0, 18, 0.3)'
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar