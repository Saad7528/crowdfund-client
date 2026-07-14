import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { FileHeart, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyContributions = () => {
  const { user } = useContext(AuthContext);
  
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 5; // 5 items per page

  const fetchContributions = async (page) => {
    setLoading(true);
    const token = localStorage.getItem('access-token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/contributions?supporter_email=${user.email}&page=${page}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setContributions(result.data || []);
        setTotalItems(result.total || 0);
        setTotalPages(Math.ceil((result.total || 0) / limit));
      }
    } catch (err) {
      console.error("Error loading contributions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchContributions(currentPage);
    }
  }, [user, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading && contributions.length === 0) {
    return (
      <div className="spinner-container" style={{ minHeight: '50vh' }}>
        <div className="modern-spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Contributions</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Log of all campaign pledges and support status.</p>

      <div className="glass-panel">
        {contributions.length > 0 ? (
          <>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Campaign Title</th>
                    <th>Credits Contributed</th>
                    <th>Creator</th>
                    <th>Pledge Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.map((c) => (
                    <tr key={c._id}>
                      <td style={{ fontWeight: 600 }}>{c.campaign_title}</td>
                      <td style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{c.contribution_amount} Credits</td>
                      <td>{c.creator_name}</td>
                      <td>{new Date(c.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-${c.status.toLowerCase()}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button 
                    key={p} 
                    onClick={() => handlePageChange(p)}
                    className="pagination-btn"
                    style={{ 
                      background: currentPage === p ? 'var(--color-primary)' : '', 
                      borderColor: currentPage === p ? 'var(--color-primary)' : '' 
                    }}
                  >
                    {p}
                  </button>
                ))}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {(currentPage-1)*limit + 1} - {Math.min(currentPage*limit, totalItems)} of {totalItems} contributions
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
            You haven't contributed to any campaigns yet.
          </div>
        )}
      </div>

    </div>
  );
};

export default MyContributions;
