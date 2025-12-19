import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../App'

const HomePage = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [operator, setOperator] = useState('')
  const [amount, setAmount] = useState('')
  const theme = useTheme()
  const navigate = useNavigate()

  const handleQuickRecharge = (e) => {
    e.preventDefault()
    if (!phoneNumber || !operator || !amount) {
      alert('Please fill all fields')
      return
    }
    navigate('/payment', { 
      state: { 
        phoneNumber, 
        operator, 
        amount: parseInt(amount),
        planType: 'Quick Recharge'
      } 
    })
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`)
      document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`)
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const buttonStyle = {
    background: 'linear-gradient(135deg, #e60012 0%, #ff6600 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(230, 0, 18, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  }

  const inputStyle = {
    width: '100%',
    padding: '16px',
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '16px',
    transition: 'all 0.3s ease',
    background: theme.colors.cardBg,
    color: theme.colors.text
  }

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
      {/* Promotional Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        margin: '20px 0',
        textAlign: 'center',
        opacity: 0.9
      }}>
        <strong>MEGA OFFER:</strong> Get 20% cashback on first recharge + Free Netflix for 1 month! Use code: WELCOME20
      </div>

      {/* Hero Section */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '500px',
        gap: '60px',
        padding: '40px 0'
      }}>
        <div style={{flex: 1}}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '20px',
            color: theme.colors.text,
            lineHeight: '1.2'
          }}>
            Instant Mobile <span style={{color: '#e60012'}}>Recharge</span>
          </h1>
          <p style={{
            fontSize: '18px',
            color: theme.colors.textSecondary,
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            Fast, secure, and reliable mobile recharge for all operators. Get instant confirmation and enjoy seamless connectivity.
          </p>
          <Link to="/plans" style={{
            ...buttonStyle,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '16px 32px',
            width: '180px',
            justifyContent: 'center'
          }}>
            Explore Plans
          </Link>
        </div>
        
        <div style={{
          flex: 1,
          background: theme.colors.cardBg,
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.colors.border}`
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '30px',
            color: theme.colors.text,
            textAlign: 'center'
          }}>
            Quick Recharge
          </h2>
          
          <form onSubmit={handleQuickRecharge}>
            <input
              type="tel"
              style={inputStyle}
              placeholder="Enter mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength="10"
            />
            
            <select
              style={inputStyle}
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            >
              <option value="">Select Operator</option>
              <option value="airtel">Airtel</option>
              <option value="jio">Jio</option>
              <option value="vi">Vi</option>
              <option value="bsnl">BSNL</option>
            </select>
            
            <select
              style={inputStyle}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            >
              <option value="">Select Amount</option>
              <option value="99">₹99</option>
              <option value="199">₹199</option>
              <option value="299">₹299</option>
              <option value="399">₹399</option>
              <option value="599">₹599</option>
            </select>
            
            <button 
              type="submit" 
              style={{...buttonStyle, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '18px 24px', height: '56px'}}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)'
                e.target.style.boxShadow = '0 8px 25px rgba(230, 0, 18, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)'
                e.target.style.boxShadow = '0 4px 15px rgba(230, 0, 18, 0.2)'
              }}
            >
              Recharge Now
            </button>
          </form>
        </div>
      </section>

      {/* Offers Section */}
      <section style={{padding: '60px 0', background: theme.colors.background, margin: '40px -20px', borderRadius: '16px'}}>
        <div style={{padding: '0 20px'}}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: '40px',
            color: theme.colors.text
          }}>
            Limited Time Offers
          </h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px'}}>
            {[
              {title: '50% OFF on First Recharge', desc: 'New users get 50% discount', code: 'FIRST50', color: '#e74c3c'},
              {title: 'Cashback Bonanza', desc: 'Up to ₹100 cashback on recharges above ₹500', code: 'CASH100', color: '#27ae60'},
              {title: 'Free OTT Subscription', desc: 'Get 3 months free Netflix with annual plans', code: 'NETFLIX3', color: '#f39c12'}
            ].map((offer, index) => (
              <div 
                key={index}
                style={{
                  background: theme.colors.cardBg,
                  borderRadius: '12px',
                  padding: '24px',
                  border: `2px solid ${offer.color}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: offer.color,
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  LIMITED
                </div>
                <h3 style={{color: offer.color, marginBottom: '8px', fontSize: '18px'}}>{offer.title}</h3>
                <p style={{color: theme.colors.textSecondary, marginBottom: '12px', fontSize: '14px'}}>{offer.desc}</p>
                <div style={{
                  background: theme.colors.border,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: theme.colors.text,
                  textAlign: 'center'
                }}>
                  Code: {offer.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{padding: '80px 0'}}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '60px',
          color: theme.colors.text
        }}>
          Frequently Asked Questions
        </h2>
        
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          {[
            {q: 'How long does it take for my recharge to be processed?', a: 'Recharges are processed instantly within 5-10 seconds. You will receive a confirmation SMS immediately.'},
            {q: 'Is my payment information secure?', a: 'Yes, we use bank-grade encryption and secure payment gateways. Your card details are never stored on our servers.'},
            {q: 'Which operators do you support?', a: 'We support all major operators including Airtel, Jio, Vi (Vodafone Idea), and BSNL across all circles in India.'},
            {q: 'Can I get a refund if my recharge fails?', a: 'Yes, if your recharge fails, the amount will be automatically refunded to your original payment method within 3-5 business days.'},
            {q: 'Do you offer any cashback or rewards?', a: 'Yes, we offer various cashback offers and promotional codes. Check our offers section for current deals and discounts.'}
          ].map((faq, index) => (
            <div 
              key={index}
              style={{
                background: theme.colors.cardBg,
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '16px',
                border: `1px solid ${theme.colors.border}`,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateX(8px)'
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateX(0)'
                e.target.style.boxShadow = 'none'
              }}
            >
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: theme.colors.text
              }}>
                {faq.q}
              </h3>
              <p style={{
                color: theme.colors.textSecondary,
                lineHeight: '1.6',
                fontSize: '16px',
                margin: 0
              }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage