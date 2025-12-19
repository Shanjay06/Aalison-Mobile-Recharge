import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../App'

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const theme = useTheme()
  const location = useLocation()
  
  // Get data from navigation state or use defaults
  const rechargeData = location.state || {
    phoneNumber: '9876543210',
    operator: 'AIRTEL',
    amount: 299,
    planType: 'Default Plan'
  }

  const buttonStyle = {
    background: 'white',
    color: theme.colors.text,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    margin: '0 4px'
  }

  const activeButtonStyle = {
    ...buttonStyle,
    background: '#e60012',
    color: 'white',
    border: '2px solid #e60012'
  }

  const inputStyle = {
    width: '100%',
    padding: '16px',
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '16px',
    background: theme.colors.cardBg,
    color: theme.colors.text,
    transition: 'all 0.2s ease'
  }

  const handlePayment = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setPaymentSuccess(true)
    }, 2000)
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleLogout = () => {
    alert('Logged out successfully!')
    window.location.href = '/login'
  }

  if (paymentSuccess) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '40px 20px'
      }}>
        <div style={{
          background: theme.colors.cardBg,
          borderRadius: '20px',
          padding: '60px 40px',
          textAlign: 'center',
          border: `1px solid ${theme.colors.border}`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #00c851 0%, #007e33 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            fontSize: '40px',
            color: 'white'
          }}>
            ✓
          </div>
          
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: theme.colors.text,
            marginBottom: '16px'
          }}>
            Payment Successful!
          </h1>
          
          <p style={{
            fontSize: '18px',
            color: theme.colors.textSecondary,
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Your recharge has been processed successfully. You will receive a confirmation SMS shortly.
          </p>
          
          <div style={{
            background: theme.colors.background,
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '40px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span style={{color: theme.colors.textSecondary}}>Amount:</span>
              <strong style={{color: theme.colors.text}}>₹{rechargeData.amount}</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span style={{color: theme.colors.textSecondary}}>Mobile:</span>
              <strong style={{color: theme.colors.text}}>{rechargeData.phoneNumber}</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: theme.colors.textSecondary}}>Transaction ID:</span>
              <strong style={{color: theme.colors.text}}>TXN{Date.now()}</strong>
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
            <button
              onClick={handleGoHome}
              style={{
                background: '#e60012',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1,
                maxWidth: '160px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#c0392b'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#e60012'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              Go to Home
            </button>
            
            <button
              onClick={handleLogout}
              style={{
                background: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1,
                maxWidth: '160px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#000'
                e.target.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.8)'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#333'
                e.target.style.boxShadow = 'none'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{maxWidth: '1000px', margin: '0 auto', padding: '40px 20px'}}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: '40px',
        color: theme.colors.text
      }}>
        Complete Your <span style={{color: '#e60012'}}>Payment</span>
      </h1>

      <div style={{display: 'flex', gap: '40px', flexWrap: 'wrap'}}>
        {/* Order Summary */}
        <div style={{flex: '1', minWidth: '300px'}}>
          <div style={{
            background: theme.colors.cardBg,
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            border: `1px solid ${theme.colors.border}`,
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '24px',
              color: theme.colors.text
            }}>
              Order Summary
            </h2>
            
            <div style={{
              padding: '20px',
              background: theme.colors.background,
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                <span style={{color: theme.colors.textSecondary}}>Mobile Number</span>
                <strong style={{color: theme.colors.text}}>{rechargeData.phoneNumber}</strong>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                <span style={{color: theme.colors.textSecondary}}>Operator</span>
                <strong style={{color: theme.colors.text}}>{rechargeData.operator.toUpperCase()}</strong>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: theme.colors.textSecondary}}>Plan</span>
                <strong style={{color: theme.colors.text}}>₹{rechargeData.amount} - {rechargeData.planType}</strong>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '18px',
              fontWeight: '700',
              padding: '20px',
              background: 'linear-gradient(135deg, #e60012 0%, #ff6600 100%)',
              color: 'white',
              borderRadius: '12px'
            }}>
              <span>Total Amount</span>
              <span>₹{rechargeData.amount}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div style={{flex: '1', minWidth: '400px'}}>
          <div style={{
            background: theme.colors.cardBg,
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            border: `1px solid ${theme.colors.border}`
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '24px',
              color: theme.colors.text
            }}>
              Payment Method
            </h2>
            
            {/* Payment Method Selection */}
            <div style={{marginBottom: '32px'}}>
              <div style={{display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap'}}>
                {['card', 'upi', 'wallet'].map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    style={paymentMethod === method ? activeButtonStyle : buttonStyle}
                  >
                    {method === 'card' ? 'Card' : method === 'upi' ? 'UPI' : 'Wallet'}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div>
                <input 
                  type="text" 
                  style={inputStyle} 
                  placeholder="Card Number"
                  onFocus={(e) => e.target.style.borderColor = '#e60012'}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                />
                <div style={{display: 'flex', gap: '16px'}}>
                  <input 
                    type="text" 
                    style={{...inputStyle, flex: 1}} 
                    placeholder="MM/YY"
                    onFocus={(e) => e.target.style.borderColor = '#e60012'}
                    onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                  />
                  <input 
                    type="text" 
                    style={{...inputStyle, flex: 1}} 
                    placeholder="CVV"
                    onFocus={(e) => e.target.style.borderColor = '#e60012'}
                    onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                  />
                </div>
                <input 
                  type="text" 
                  style={inputStyle} 
                  placeholder="Cardholder Name"
                  onFocus={(e) => e.target.style.borderColor = '#e60012'}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                />
              </div>
            )}

            {paymentMethod === 'upi' && (
              <input 
                type="text" 
                style={inputStyle} 
                placeholder="Enter UPI ID (e.g., yourname@paytm)"
                onFocus={(e) => e.target.style.borderColor = '#e60012'}
                onBlur={(e) => e.target.style.borderColor = theme.colors.border}
              />
            )}

            {paymentMethod === 'wallet' && (
              <select 
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#e60012'}
                onBlur={(e) => e.target.style.borderColor = theme.colors.border}
              >
                <option>Choose Wallet</option>
                <option>Paytm</option>
                <option>PhonePe</option>
                <option>Google Pay</option>
                <option>Amazon Pay</option>
              </select>
            )}

            {/* Promo Code Section */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{color: 'white', fontWeight: '600', fontSize: '14px'}}>Apply Promo Code</div>
                  <div style={{color: 'white', fontSize: '12px', opacity: 0.9}}>Get instant discounts</div>
                </div>
                <input 
                  type="text" 
                  placeholder="Enter code"
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    width: '120px'
                  }}
                />
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing}
              style={{
                background: processing 
                  ? 'linear-gradient(135deg, #00c851 0%, #007e33 100%)' 
                  : 'linear-gradient(135deg, #e60012 0%, #ff6600 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: processing ? 'not-allowed' : 'pointer',
                width: '100%',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(230, 0, 18, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!processing) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 25px rgba(230, 0, 18, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!processing) {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 15px rgba(230, 0, 18, 0.3)'
                }
              }}
            >
              {processing ? 'Processing Payment...' : `Pay ₹${rechargeData.amount}`}
            </button>

            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: theme.colors.background,
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: theme.colors.textSecondary
              }}>
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage