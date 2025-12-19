import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const EnhancedAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({
    operator: 'All',
    amount: '',
    validity: '',
    data: '',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      // Always try backend first
      const [usersData, plansData] = await Promise.all([
        apiService.getUsers().catch(() => []),
        apiService.getAdminPlans().catch(() => [])
      ]);
      setUsers(usersData);
      setPlans(plansData);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to mock data only if backend fails
      setUsers([
        { _id: '1', name: 'John Doe', email: 'john@example.com', phoneNumber: '9876543210', role: 'user' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phoneNumber: '9876543211', role: 'user' }
      ]);
      setPlans([
        { _id: '1', operator: 'All', amount: 99, validity: '28 days', data: '1.5GB/day', description: 'Basic Plan' },
        { _id: '2', operator: 'All', amount: 199, validity: '56 days', data: '2GB/day', description: 'Popular Plan' },
        { _id: '3', operator: 'All', amount: 399, validity: '84 days', data: '3GB/day', description: 'Premium Plan' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user?')) {
      try {
        await apiService.deleteUser(userId);
        loadData();
      } catch (error) {
        alert('Error: Backend server not running. Please start the backend.');
      }
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to create plan:', newPlan);
      console.log('API URL:', 'http://localhost:7000/api/admin/plans');
      const result = await apiService.createPlan(newPlan);
      console.log('Plan created:', result);
      setNewPlan({ operator: 'All', amount: '', validity: '', data: '', description: '' });
      loadData();
      alert('Plan created successfully!');
    } catch (error) {
      console.error('Full error:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    try {
      await apiService.updatePlan(editingPlan._id, editingPlan);
      setEditingPlan(null);
      loadData();
    } catch (error) {
      alert('Error: Backend server not running. Please start the backend.');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Delete this plan?')) {
      try {
        await apiService.deletePlan(planId);
        loadData();
      } catch (error) {
        alert('Error: Backend server not running. Please start the backend.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    border: 'none',
    background: isActive ? '#e60012' : 'transparent',
    color: isActive ? 'white' : '#666',
    cursor: 'pointer',
    borderRadius: '6px',
    fontWeight: '500'
  });

  const cardStyle = {
    background: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e1e5e9'
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>Admin Dashboard</h1>
        <button onClick={handleLogout} style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid #e1e5e9', paddingBottom: '16px' }}>
        {['overview', 'users', 'plans'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={tabStyle(activeTab === tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ ...cardStyle, textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#e60012' }}>{users.length}</h3>
            <p style={{ margin: 0, color: '#666' }}>Total Users</p>
          </div>
          <div style={{ ...cardStyle, textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#28a745' }}>{plans.length}</h3>
            <p style={{ margin: 0, color: '#666' }}>Total Plans</p>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>User Management</h2>
          {users.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No users found</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e1e5e9' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e1e5e9' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e1e5e9' }}>Phone</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e1e5e9' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #e1e5e9' }}>
                    <td style={{ padding: '12px' }}>{user.name}</td>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>{user.phoneNumber || 'N/A'}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div>
          {/* Add New Plan */}
          <div style={{ ...cardStyle, marginBottom: '20px' }}>
            <h3>Add New Plan</h3>
            <form onSubmit={handleCreatePlan} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <input
                type="number"
                placeholder="Amount (₹)"
                value={newPlan.amount}
                onChange={(e) => setNewPlan({ ...newPlan, amount: e.target.value })}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
              <input
                type="text"
                placeholder="Validity (e.g., 28 days)"
                value={newPlan.validity}
                onChange={(e) => setNewPlan({ ...newPlan, validity: e.target.value })}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
              <input
                type="text"
                placeholder="Data (e.g., 1.5GB/day)"
                value={newPlan.data}
                onChange={(e) => setNewPlan({ ...newPlan, data: e.target.value })}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                required
              />
              <button type="submit" style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Add Plan
              </button>
            </form>
          </div>

          {/* Plans List */}
          <div style={cardStyle}>
            <h3>Manage Plans</h3>
            {plans.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No plans found</p>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {plans.map((plan) => (
                  <div key={plan._id} style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    {editingPlan && editingPlan._id === plan._id ? (
                      <form onSubmit={handleUpdatePlan} style={{ display: 'flex', gap: '8px', flex: 1 }}>
                        <input
                          type="number"
                          value={editingPlan.amount}
                          onChange={(e) => setEditingPlan({ ...editingPlan, amount: e.target.value })}
                          style={{ padding: '4px', border: '1px solid #ddd', borderRadius: '4px', width: '80px' }}
                        />
                        <input
                          type="text"
                          value={editingPlan.validity}
                          onChange={(e) => setEditingPlan({ ...editingPlan, validity: e.target.value })}
                          style={{ padding: '4px', border: '1px solid #ddd', borderRadius: '4px', width: '100px' }}
                        />
                        <input
                          type="text"
                          value={editingPlan.data}
                          onChange={(e) => setEditingPlan({ ...editingPlan, data: e.target.value })}
                          style={{ padding: '4px', border: '1px solid #ddd', borderRadius: '4px', width: '100px' }}
                        />
                        <input
                          type="text"
                          value={editingPlan.description}
                          onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                          style={{ padding: '4px', border: '1px solid #ddd', borderRadius: '4px', flex: 1 }}
                        />
                        <button type="submit" style={{ padding: '4px 8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Save</button>
                        <button type="button" onClick={() => setEditingPlan(null)} style={{ padding: '4px 8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>Cancel</button>
                      </form>
                    ) : (
                      <>
                        <div>
                          <strong>₹{plan.amount}</strong> - {plan.validity} - {plan.data} - {plan.description}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setEditingPlan(plan)}
                            style={{ padding: '4px 8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan._id)}
                            style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAdminDashboard;