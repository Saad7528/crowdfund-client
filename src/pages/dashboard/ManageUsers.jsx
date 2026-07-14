import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { Trash2, Shield, User, Award } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ManageUsers = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const token = localStorage.getItem('access-token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser._id) {
      alert("You cannot change your own admin role.");
      return;
    }

    const token = localStorage.getItem('access-token');
    try {
      const response = await fetch(`${API_URL}/users/role/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        alert(`User role updated to ${newRole}`);
        fetchUsers();
      } else {
        alert("Failed to update user role.");
      }
    } catch (err) {
      console.error("Error changing user role:", err);
    }
  };

  const handleRemoveUser = async (userId) => {
    if (userId === currentUser._id) {
      alert("You cannot delete your own admin account.");
      return;
    }

    if (!window.confirm("Are you sure you want to remove this user from the system?")) return;

    const token = localStorage.getItem('access-token');
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert("User removed successfully.");
        fetchUsers();
      } else {
        alert("Failed to remove user.");
      }
    } catch (err) {
      console.error("Error removing user:", err);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '50vh' }}>
        <div className="modern-spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Manage Users</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Admin operational console to edit user roles and system registry.</p>

      <div className="glass-panel">
        {users.length > 0 ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Credits Balance</th>
                  <th>Update Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={u.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                          alt={u.name} 
                          className="user-header-avatar"
                        />
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'Admin' ? 'badge-approved' : u.role === 'Creator' ? 'badge-pending' : 'badge-rejected'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
                      {u.credits !== undefined ? u.credits : 0} Credits
                    </td>
                    <td>
                      <select 
                        value={u.role} 
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="form-select"
                        style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
                        disabled={u._id === currentUser._id}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Creator">Creator</option>
                        <option value="Supporter">Supporter</option>
                      </select>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleRemoveUser(u._id)}
                        className="btn btn-danger" 
                        style={{ padding: '8px 12px' }}
                        disabled={u._id === currentUser._id}
                        title="Remove User"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
            No registered users found.
          </div>
        )}
      </div>

    </div>
  );
};

export default ManageUsers;
