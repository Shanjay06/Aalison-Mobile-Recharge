import { useState, useEffect } from 'react'
import { useTheme } from '../App'
import apiService from '../services/api'

const PlansPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('prepaid')
  const [selectedOperator, setSelectedOperator] = useState('airtel')
  const [dbPlans, setDbPlans] = useState([])
  const theme = useTheme()

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await apiService.getPlans()
        setDbPlans(data)
      } catch (error) {
        console.error('Failed to load plans:', error)
      }
    }
    loadPlans()
  }, [])

  const categories = [
    { id: 'prepaid', label: 'Prepaid' },
    { id: 'postpaid', label: 'Postpaid' },
    { id: 'data', label: 'Data Packs' },
    { id: 'ott', label: 'OTT Subscriptions' }
  ]

  const plans = {
    prepaid: {
      airtel: [
        { price: 199, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: false },
        { price: 299, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', popular: true },
        { price: 449, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: false },
        { price: 599, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: false }
      ],
      jio: [
        { price: 149, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', popular: false },
        { price: 239, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: true },
        { price: 399, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: false },
        { price: 666, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: false }
      ],
      vi: [
        { price: 179, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', popular: false },
        { price: 249, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: true },
        { price: 479, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: false },
        { price: 719, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: false }
      ]
    },
    postpaid: {
      airtel: [
        { price: 399, validity: 'Monthly', data: '40GB', calls: 'Unlimited', sms: 'Unlimited', popular: false },
        { price: 599, validity: 'Monthly', data: '75GB', calls: 'Unlimited', sms: 'Unlimited', popular: true },
        { price: 999, validity: 'Monthly', data: '150GB', calls: 'Unlimited', sms: 'Unlimited', popular: false }
      ],
      jio: [
        { price: 349, validity: 'Monthly', data: '30GB', calls: 'Unlimited', sms: 'Unlimited', popular: false },
        { price: 499, validity: 'Monthly', data: '75GB', calls: 'Unlimited', sms: 'Unlimited', popular: true },
        { price: 799, validity: 'Monthly', data: '150GB', calls: 'Unlimited', sms: 'Unlimited', popular: false }
      ],
      vi: [
        { price: 379, validity: 'Monthly', data: '40GB', calls: 'Unlimited', sms: 'Unlimited', popular: false },
        { price: 549, validity: 'Monthly', data: '75GB', calls: 'Unlimited', sms: 'Unlimited', popular: true },
        { price: 899, validity: 'Monthly', data: '150GB', calls: 'Unlimited', sms: 'Unlimited', popular: false }
      ]
    },
    data: {
      airtel: [
        { price: 19, validity: '1 day', data: '1GB', calls: 'N/A', sms: 'N/A', popular: false },
        { price: 48, validity: '3 days', data: '3GB', calls: 'N/A', sms: 'N/A', popular: true },
        { price: 98, validity: '7 days', data: '12GB', calls: 'N/A', sms: 'N/A', popular: false },
        { price: 251, validity: '30 days', data: '50GB', calls: 'N/A', sms: 'N/A', popular: false }
      ],
      jio: [
        { price: 15, validity: '1 day', data: '1GB', calls: 'N/A', sms: 'N/A', popular: false },
        { price: 39, validity: '2 days', data: '2GB', calls: 'N/A', sms: 'N/A', popular: true },
        { price: 75, validity: '7 days', data: '6GB', calls: 'N/A', sms: 'N/A', popular: false },
        { price: 199, validity: '30 days', data: '25GB', calls: 'N/A', sms: 'N/A', popular: false }
      ],
      vi: [
        { price: 16, validity: '1 day', data: '1GB', calls: 'N/A', sms: 'N/A', popular: false },
        { price: 44, validity: '3 days', data: '3GB', calls: 'N/A', sms: 'N/A', popular: true },
        { price: 87, validity: '7 days', data: '9GB', calls: 'N/A', sms: 'N/A', popular: false },
        { price: 229, validity: '30 days', data: '40GB', calls: 'N/A', sms: 'N/A', popular: false }
      ]
    },
    ott: {
      netflix: [
        { price: 149, validity: 'Monthly', data: 'Mobile Only', calls: 'N/A', sms: 'N/A', popular: false },
        { price: 199, validity: 'Monthly', data: 'Basic (480p)', calls: 'N/A', sms: 'N/A', popular: true },
        { price: 499, validity: 'Monthly', data: 'Standard (1080p)', calls: 'N/A', sms: 'N/A', popular: false },
        { price: 649, validity: 'Monthly', data: 'Premium (4K)', calls: 'N/A', sms: 'N/A', popular: false }
      ],
      prime: [
        { price: 179, validity: 'Monthly', data: 'Prime Video + Music', calls: 'N/A', sms: 'N/A', popular: true },
        { price: 1499, validity: 'Yearly', data: 'Prime Video + Music + Shopping', calls: 'N/A', sms: 'N/A', popular: false }
      ],
      hotstar: [
        { price: 149, validity: 'Monthly', data: 'Mobile Only', calls: 'N/A', sms: 'N/A', popular: false },
        { price: 299, validity: 'Monthly', data: 'Super (All Devices)', calls: 'N/A', sms: 'N/A', popular: true },
        { price: 1499, validity: 'Yearly', data: 'Super (All Devices)', calls: 'N/A', sms: 'N/A', popular: false }
      ]
    }
  }

  const getOperators = () => {
    if (selectedCategory === 'ott') {
      return ['netflix', 'prime', 'hotstar']
    }
    return ['airtel', 'jio', 'vi']
  }

  const getCurrentPlans = () => {
    // Show database plans if available, otherwise show static plans
    if (dbPlans.length > 0) {
      return dbPlans.map(plan => ({
        price: plan.amount,
        validity: plan.validity,
        data: plan.data,
        calls: 'Unlimited',
        sms: '100/day',
        popular: plan.amount === 199,
        description: plan.description
      }))
    }
    return plans[selectedCategory]?.[selectedOperator] || []
  }

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '40px 20px'}}>
      <div style={{marginBottom: '48px'}}>
        <h1 style={{fontSize: '32px', fontWeight: '600', color: theme.colors.text, marginBottom: '8px'}}>
          Choose Your Plan
        </h1>
        <p style={{fontSize: '16px', color: theme.colors.textSecondary}}>
          Select from prepaid, postpaid, data packs, and OTT subscriptions
        </p>
      </div>

      {/* Promotional Ad */}
      <div style={{
        background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '32px',
        textAlign: 'center',
        opacity: 0.95
      }}>
        <strong>SPECIAL PROMO:</strong> Recharge now and get instant ₹50 cashback + 2GB bonus data on plans above ₹299!
      </div>

      {/* Category Selection */}
      <div style={{marginBottom: '32px'}}>
        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id)
                setSelectedOperator(getOperators()[0])
              }}
              style={{
                background: selectedCategory === category.id ? '#e60012' : theme.colors.cardBg,
                color: selectedCategory === category.id ? 'white' : theme.colors.textSecondary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Operator Selection */}
      <div style={{marginBottom: '40px'}}>
        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
          {getOperators().map(operator => (
            <button
              key={operator}
              onClick={() => setSelectedOperator(operator)}
              style={{
                background: selectedOperator === operator ? '#e60012' : theme.colors.cardBg,
                color: selectedOperator === operator ? 'white' : theme.colors.textSecondary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {operator === 'prime' ? 'Amazon Prime' : operator === 'hotstar' ? 'Disney+ Hotstar' : operator}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
        {getCurrentPlans().map((plan, index) => (
          <div 
            key={index}
            style={{
              background: theme.colors.cardBg,
              borderRadius: '12px',
              padding: '24px',
              border: plan.popular ? '2px solid #e60012' : `1px solid ${theme.colors.border}`,
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)'
              e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '20px',
                background: '#e60012',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                POPULAR
              </div>
            )}
            
            {plan.price >= 299 && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '20px',
                background: '#27ae60',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '10px',
                fontWeight: '600',
                opacity: 0.9
              }}>
                ₹50 OFF
              </div>
            )}
            
            <div style={{marginBottom: '20px'}}>
              <div style={{fontSize: '32px', fontWeight: '700', color: theme.colors.text, marginBottom: '4px'}}>
                ₹{plan.price}
              </div>
              <div style={{fontSize: '14px', color: theme.colors.textSecondary}}>
                {plan.validity}
              </div>
            </div>
            
            <div style={{marginBottom: '24px'}}>
              {selectedCategory !== 'ott' ? (
                <>
                  <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${theme.colors.border}`}}>
                    <span style={{fontSize: '14px', color: theme.colors.textSecondary}}>Data</span>
                    <span style={{fontSize: '14px', fontWeight: '500', color: theme.colors.text}}>{plan.data}</span>
                  </div>
                  {plan.calls !== 'N/A' && (
                    <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${theme.colors.border}`}}>
                      <span style={{fontSize: '14px', color: theme.colors.textSecondary}}>Voice</span>
                      <span style={{fontSize: '14px', fontWeight: '500', color: theme.colors.text}}>{plan.calls}</span>
                    </div>
                  )}
                  {plan.sms !== 'N/A' && (
                    <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0'}}>
                      <span style={{fontSize: '14px', color: theme.colors.textSecondary}}>SMS</span>
                      <span style={{fontSize: '14px', fontWeight: '500', color: theme.colors.text}}>{plan.sms}</span>
                    </div>
                  )}
                </>
              ) : (
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0'}}>
                  <span style={{fontSize: '14px', color: theme.colors.textSecondary}}>Quality</span>
                  <span style={{fontSize: '14px', fontWeight: '500', color: theme.colors.text}}>{plan.data}</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => {
                if (selectedCategory === 'ott') {
                  const urls = {
                    netflix: 'https://www.netflix.com/signup',
                    prime: 'https://www.primevideo.com/offers/nonprimehomepage/ref=dv_web_force_root',
                    hotstar: 'https://www.hotstar.com/in/subscribe'
                  }
                  window.open(urls[selectedOperator] || 'https://www.netflix.com', '_blank')
                } else {
                  // For database plans, use description in URL, for static plans use category
                  const planType = plan.description || selectedCategory
                  window.location.href = `/payment?operator=${selectedOperator}&amount=${plan.price}&category=${planType}`
                }
              }}
              style={{
                background: '#e60012',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: selectedCategory === 'ott' ? '14px 20px' : '16px 24px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                width: selectedCategory === 'data' ? '85%' : '100%',
                height: selectedCategory === 'postpaid' ? '52px' : '48px',
                margin: selectedCategory === 'data' ? '0 auto' : '0',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#c0392b'
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#e60012'
                e.target.style.transform = 'scale(1)'
              }}
            >
              {selectedCategory === 'ott' ? 'Subscribe Now' : 'Recharge Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlansPage