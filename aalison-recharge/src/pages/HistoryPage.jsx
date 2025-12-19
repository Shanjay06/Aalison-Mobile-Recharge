import { useState } from 'react'
import authService from '../services/authService'

const HistoryPage = () => {
  const [filter, setFilter] = useState('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  
  const transactions = [
    { id: 'TXN240115001', date: '15 Jan 2024', time: '14:30', phone: '9876543210', operator: 'Airtel', amount: 299, status: 'Success', type: 'Prepaid' },
    { id: 'TXN240112002', date: '12 Jan 2024', time: '09:15', phone: '9876543210', operator: 'Jio', amount: 599, status: 'Success', type: 'Postpaid' },
    { id: 'TXN240110003', date: '10 Jan 2024', time: '16:45', phone: '9876543210', operator: 'Netflix', amount: 649, status: 'Failed', type: 'OTT' },
    { id: 'TXN240108004', date: '08 Jan 2024', time: '11:20', phone: '9876543210', operator: 'Vi', amount: 199, status: 'Success', type: 'Data Pack' }
  ]

  const filteredTransactions = transactions.filter(t => 
    filter === 'all' || t.status.toLowerCase() === filter
  )

  const stats = [
    { label: 'Total Transactions', value: transactions.length, color: '#333' },
    { label: 'Total Spent', value: `₹${transactions.reduce((sum, t) => sum + t.amount, 0)}`, color: '#e60012' },
    { label: 'Success Rate', value: `${Math.round((transactions.filter(t => t.status === 'Success').length / transactions.length) * 100)}%`, color: '#00c851' }
  ]

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '40px 20px'}}>
      <div style={{marginBottom: '48px'}}>
        <h1 style={{fontSize: '32px', fontWeight: '600', color: '#333', marginBottom: '8px'}}>
          Transaction History
        </h1>
        <p style={{fontSize: '16px', color: '#666'}}>
          View and manage all your transactions
        </p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px'}}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #f0f0f0',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '28px', fontWeight: '700', color: stat.color, marginBottom: '8px'}}>
              {stat.value}
            </div>
            <div style={{fontSize: '14px', color: '#666', fontWeight: '500'}}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{marginBottom: '32px'}}>
        {['all', 'success', 'failed'].map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            style={{
              background: filter === filterType ? '#e60012' : 'white',
              color: filter === filterType ? 'white' : '#666',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              marginRight: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      <div style={{background: 'white', borderRadius: '12px', border: '1px solid #f0f0f0', overflow: 'hidden'}}>
        {filteredTransactions.length === 0 ? (
          <div style={{padding: '60px 20px', textAlign: 'center'}}>
            <h3 style={{fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '8px'}}>
              No transactions found
            </h3>
            <p style={{color: '#666', fontSize: '14px', marginBottom: '20px'}}>
              {filter === 'all' ? 'Start by making your first recharge' : `No ${filter} transactions available`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => window.location.href = '/plans'}
                style={{
                  background: '#e60012',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Start Recharging
              </button>
            )}
          </div>
        ) : (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 100px 80px 100px',
              gap: '16px',
              padding: '16px 24px',
              background: '#f8f9fa',
              borderBottom: '1px solid #f0f0f0',
              fontSize: '12px',
              fontWeight: '600',
              color: '#666',
              textTransform: 'uppercase'
            }}>
              <div>Transaction Details</div>
              <div>Amount</div>
              <div>Type</div>
              <div>Status</div>
              <div>Action</div>
            </div>

            {filteredTransactions.map((transaction, index) => (
              <div 
                key={transaction.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 100px 80px 100px',
                  gap: '16px',
                  padding: '20px 24px',
                  borderBottom: index < filteredTransactions.length - 1 ? '1px solid #f0f0f0' : 'none',
                  transition: 'background 0.2s ease'
                }}
              >
                <div>
                  <div style={{fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px'}}>
                    {transaction.operator} - {transaction.phone}
                  </div>
                  <div style={{fontSize: '12px', color: '#666'}}>
                    {transaction.date} at {transaction.time} • ID: {transaction.id}
                  </div>
                </div>
                
                <div style={{fontSize: '16px', fontWeight: '600', color: '#333'}}>
                  ₹{transaction.amount}
                </div>
                
                <div style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#666',
                  background: '#f0f0f0',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  width: 'fit-content'
                }}>
                  {transaction.type}
                </div>
                
                <div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: transaction.status === 'Success' ? '#00c851' : '#ff4444',
                    background: transaction.status === 'Success' ? '#e8f5e8' : '#ffe8e8',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {transaction.status}
                  </span>
                </div>
                
                <div>
                  <button
                    style={{
                      background: 'none',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#666',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
        padding: '20px',
        borderRadius: '12px',
        marginTop: '32px',
        textAlign: 'center'
      }}>
        <h3 style={{color: '#2d3436', marginBottom: '12px', fontSize: '18px'}}>
          Refer & Earn Program
        </h3>
        <p style={{color: '#636e72', fontSize: '14px', marginBottom: '16px'}}>
          Invite friends and earn ₹50 for each successful referral!
        </p>
        <button 
          onClick={() => setShowInviteModal(true)}
          style={{
            background: '#e17055',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
        >
          Invite Now
        </button>
      </div>

      {showInviteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{marginBottom: '20px', color: '#333'}}>Invite Friends</h3>
            
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333'}}>
                Friend's Email
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{marginBottom: '20px'}}>
              <p style={{fontSize: '14px', color: '#666', marginBottom: '12px'}}>
                Your referral link:
              </p>
              <div style={{
                background: '#f8f9fa',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#333',
                wordBreak: 'break-all',
                border: '1px solid #e0e0e0'
              }}>
                https://aalison.com/signup?ref={authService.getCurrentUser()?.id || 'user123'}
              </div>
            </div>

            {inviteMessage && (
              <div style={{
                padding: '12px',
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '6px',
                color: '#155724',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {inviteMessage}
              </div>
            )}

            <div style={{display: 'flex', gap: '12px'}}>
              <button
                onClick={() => {
                  if (inviteEmail) {
                    setInviteMessage('Invitation sent successfully!')
                    setInviteEmail('')
                    setTimeout(() => {
                      setInviteMessage('')
                      setShowInviteModal(false)
                    }, 2000)
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#e60012',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Send Invite
              </button>
              <button
                onClick={() => setShowInviteModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoryPage