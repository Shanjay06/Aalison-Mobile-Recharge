import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (isLogin) {
      // Login
      try {
        console.log('Login attempt with:', { email: formData.email, password: formData.password })
        
        const response = await fetch('http://localhost:7000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        })
        
        console.log('Login response status:', response.status)
        
        let data
        try {
          data = await response.json()
          console.log('Login response data:', data)
        } catch (jsonError) {
          console.error('Login JSON parse error:', jsonError)
          const textResponse = await response.text()
          console.log('Login raw response:', textResponse)
          setMessage('❌ Login route not found on server')
          return
        }
        
        if (response.ok) {
          setMessage('✅ Login successful!')
          localStorage.setItem('user', JSON.stringify(data.user))
          setTimeout(() => navigate('/profile'), 1500)
        } else {
          setMessage('❌ ' + (data.error || data.message || 'Login failed'))
        }
      } catch (error) {
        console.error('Login error:', error)
        setMessage('❌ Connection error: ' + error.message)
      }
    } else {
      // Signup
      if (formData.password !== formData.confirmPassword) {
        setMessage('❌ Passwords do not match!')
        setLoading(false)
        return
      }
      
      try {
        console.log('Signup attempt with data:', {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
          password: formData.password
        })
        
        const response = await fetch('http://localhost:7000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phone,
            password: formData.password
          })
        })
        
        console.log('Signup response status:', response.status)
        console.log('Signup response headers:', response.headers)
        
        let data
        try {
          data = await response.json()
          console.log('Signup response data:', data)
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError)
          const textResponse = await response.text()
          console.log('Raw response text:', textResponse)
          setMessage('❌ Server returned invalid response')
          return
        }
        
        if (response.ok) {
          setMessage('✅ Registration successful!')
          setTimeout(() => setIsLogin(true), 1500)
        } else {
          const errorMsg = data.error || data.message || data.details || `Server error (${response.status})`
          console.error('Signup failed:', errorMsg)
          setMessage('❌ ' + errorMsg)
        }
      } catch (error) {
        console.error('Signup connection error:', error)
        setMessage('❌ Connection error: ' + error.message)
      }
    }
    setLoading(false)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const inputStyle = {
    width: '100%',
    padding: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '20px',
    background: 'white',
    transition: 'all 0.2s ease'
  }

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
              Password
            </label>
            <input
              type="password"
              name="password"
              style={inputStyle}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={(e) => e.target.style.borderColor = '#e60012'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              minLength="6"
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
            style={{
              background: '#e60012',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              marginBottom: '24px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#cc0010'
              e.target.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#e60012'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            {loading ? 'Processing...' : (isLogin ? '🔑 Sign In' : '🎆 Create Account')}
          </button>
        </form>

        {message && (
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center',
            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '8px',
            color: message.includes('✅') ? '#155724' : '#721c24'
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

        {/* Welcome Offer */}
        <div style={{
          padding: '16px',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: 'white',
            fontWeight: '600'
          }}>
            🎉 New User Bonus: Get ₹100 cashback on first recharge!
          </p>
        </div>

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
            🔒 Your information is protected with bank-grade security
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage