import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'preferences', label: 'Preferences' }
  ]

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      navigate('/auth')
      return
    }
    setCurrentUser(user)
  }, [navigate])

  if (!currentUser) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  const profileData = {
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phoneNumber || 'Not provided',
    role: currentUser.role
  }

  return (
    <div style={{maxWidth: '1000px', margin: '0 auto', padding: '40px 20px'}}>
      <div style={{marginBottom: '48px'}}>
        <h1 style={{fontSize: '32px', fontWeight: '600', color: '#333', marginBottom: '8px'}}>
          Account Settings
        </h1>
        <p style={{fontSize: '16px', color: '#666'}}>
          Manage your account information and preferences
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #f0f0f0',
        marginBottom: '40px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: '500',
              color: activeTab === tab.id ? '#e60012' : '#666',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid #e60012' : '2px solid transparent',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.color = '#333'
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.color = '#666'
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{display: 'flex', gap: '40px', flexWrap: 'wrap'}}>
          <div style={{flex: '1', minWidth: '300px'}}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #f0f0f0',
              marginBottom: '24px'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
                <h2 style={{fontSize: '20px', fontWeight: '600', color: '#333'}}>
                  Personal Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    background: isEditing ? '#00c851' : '#e60012',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '0.9'
                    e.target.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '1'
                    e.target.style.transform = 'translateY(0)'
                  }}
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>

              <div style={{display: 'grid', gap: '20px'}}>
                {Object.entries(profileData).map(([key, value]) => (
                  <div key={key}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#333',
                      marginBottom: '8px',
                      textTransform: 'capitalize'
                    }}>
                      {key === 'phone' ? 'Phone Number' : key}
                    </label>
                    <input
                      type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                      defaultValue={value}
                      disabled={!isEditing}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '6px',
                        fontSize: '16px',
                        background: isEditing ? 'white' : '#f8f9fa',
                        color: '#333',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        if (isEditing) e.target.style.borderColor = '#e60012'
                      }}
                      onBlur={(e) => {
                        if (isEditing) e.target.style.borderColor = '#e0e0e0'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{flex: '1', minWidth: '300px'}}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #f0f0f0'
            }}>
              <h2 style={{fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '24px'}}>
                Account Statistics
              </h2>
              
              <div style={{display: 'grid', gap: '20px'}}>
                {[
                  { label: 'Total Recharges', value: '47', color: '#e60012' },
                  { label: 'Amount Spent', value: '₹12,450', color: '#00c851' },
                  { label: 'Cashback Earned', value: '₹245', color: '#ff6600' },
                  { label: 'Member Since', value: 'Jan 2023', color: '#333' }
                ].map((stat, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 0',
                    borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <span style={{fontSize: '14px', color: '#666'}}>{stat.label}</span>
                    <span style={{fontSize: '16px', fontWeight: '600', color: stat.color}}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Promotional Offers */}
          <div style={{
            background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
            marginTop: '24px'
          }}>
            <h3 style={{marginBottom: '12px', fontSize: '18px'}}>
              Exclusive Member Offers
            </h3>
            <div style={{fontSize: '14px', marginBottom: '16px', opacity: 0.9}}>
              • Premium plans at 30% discount<br/>
              • Free OTT subscriptions for 6 months<br/>
              • Priority customer support
            </div>
            <button style={{
              background: 'white',
              color: '#6c5ce7',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Claim Offers
            </button>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div style={{maxWidth: '600px'}}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #f0f0f0',
            marginBottom: '24px'
          }}>
            <h2 style={{fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '24px'}}>
              Change Password
            </h2>
            
            <div style={{display: 'grid', gap: '16px'}}>
              {['Current Password', 'New Password', 'Confirm Password'].map((label, index) => (
                <div key={index}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    {label}
                  </label>
                  <input
                    type="password"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '16px',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#e60012'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
              ))}
              
              <button
                style={{
                  background: '#e60012',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginTop: '8px',
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
Update Password
              </button>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #f0f0f0'
          }}>
            <h2 style={{fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '24px'}}>
              Two-Factor Authentication
            </h2>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '4px'}}>
                  SMS Authentication
                </div>
                <div style={{fontSize: '14px', color: '#666'}}>
                  Receive verification codes via SMS
                </div>
              </div>
              <button
                style={{
                  background: '#00c851',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#00a844'
                  e.target.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#00c851'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div style={{maxWidth: '600px'}}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid #f0f0f0'
          }}>
            <h2 style={{fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '24px'}}>
              Notification Preferences
            </h2>
            
            <div style={{display: 'grid', gap: '20px'}}>
              {[
                { title: 'Email Notifications', desc: 'Receive transaction confirmations via email', enabled: true },
                { title: 'SMS Alerts', desc: 'Get SMS notifications for successful recharges', enabled: true },
                { title: 'Promotional Offers', desc: 'Receive special offers and discount notifications', enabled: false },
                { title: 'Auto-Recharge Reminders', desc: 'Get notified when your balance is low', enabled: true }
              ].map((pref, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 0',
                  borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <div style={{flex: 1}}>
                    <div style={{fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '4px'}}>
                      {pref.title}
                    </div>
                    <div style={{fontSize: '14px', color: '#666'}}>
                      {pref.desc}
                    </div>
                  </div>
                  <button
                    style={{
                      background: pref.enabled ? '#00c851' : '#e0e0e0',
                      color: pref.enabled ? 'white' : '#666',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: '70px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '0.9'
                      e.target.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '1'
                      e.target.style.transform = 'translateY(0)'
                    }}
                  >
                    {pref.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage