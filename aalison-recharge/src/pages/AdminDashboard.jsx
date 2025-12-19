import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      const allUsers = await apiService.getUsers();
      setUsers(allUsers);
      
      const today = new Date().toDateString();
      const newUsersToday = allUsers.filter(user => 
        new Date(user.createdAt).toDateString() === today
      ).length;

      setStats({
        totalUsers: allUsers.length,
        newUsersToday,
        activeUsers: allUsers.filter(user => user.role === 'user').length
      });
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback to mock data if API fails
      setUsers([]);
      setStats({ totalUsers: 0, newUsersToday: 0, activeUsers: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.deleteUser(userId);
        loadUsers();
      } catch (error) {
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e1e5e9'
  };

  const statCardStyle = {
    ...cardStyle,
    textAlign: 'center',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600' }}>
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={statCardStyle}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#e60012' }}>
            {stats.totalUsers}
          </h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total Users</p>
        </div>
        
        <div style={statCardStyle}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#28a745' }}>
            {stats.activeUsers}
          </h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Active Users</p>
        </div>
        
        <div style={statCardStyle}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#17a2b8' }}>
            {stats.newUsersToday}
          </h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>New Today</p>
        </div>
      </div>

      {/* Users Table */}
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>User Management</h2>
        
        {users.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No users found
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '2px solid #e1e5e9',
                    fontWeight: '600'
                  }}>
                    Name
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '2px solid #e1e5e9',
                    fontWeight: '600'
                  }}>
                    Email
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '2px solid #e1e5e9',
                    fontWeight: '600'
                  }}>
                    Phone
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '2px solid #e1e5e9',
                    fontWeight: '600'
                  }}>
                    Role
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '2px solid #e1e5e9',
                    fontWeight: '600'
                  }}>
                    Created
                  </th>
                  <th style={{
                    padding: '12px',
                    textAlign: 'center',
                    borderBottom: '2px solid #e1e5e9',
                    fontWeight: '600'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #e1e5e9' }}>
                    <td style={{ padding: '12px' }}>{user.name}</td>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>{user.phoneNumber || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: user.role === 'admin' ? '#e3f2fd' : '#f3e5f5',
                        color: user.role === 'admin' ? '#1976d2' : '#7b1fa2'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;