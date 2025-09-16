import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '../../components/layout';
import { getAllIssuesFull } from '../../services/issues';
import SearchBar from '../../components/common/SearchBar';

const AllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return issues;
    const term = search.toLowerCase();
    return issues.filter(issue => {
      const title = (issue.title || '').toLowerCase();
      const reporter = (issue.reporter?.name || issue.reporter || '').toLowerCase();
      const location = (issue.location?.address || issue.location || '').toLowerCase();
      const status = (issue.status || '').toLowerCase();
      const category = (issue.category || '').toLowerCase();
      const priority = (issue.priority || '').toLowerCase();
      return [title, reporter, location, status, category, priority].some(v => v.includes(term));
    });
  }, [issues, search]);

  useEffect(() => {
    const fetchAllIssues = async () => {
      setLoading(true);
      const response = await getAllIssuesFull();
      if (response.success) {
        console.log('[AllIssues] fetched issues length:', response.data.length, 'sample first item:', response.data[0]);
        setIssues(response.data);
        setError(null);
      } else {
        console.warn('[AllIssues] fetch error:', response.error);
        setError(response.error || 'Failed to fetch issues.');
      }
      setLoading(false);
    };
    fetchAllIssues();
  }, []);

  return (
    <DashboardLayout>
      <div className="card">
        <div className="card-header" style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
          <h2 style={{marginBottom:0}}>All Issues</h2>
          <SearchBar onChange={setSearch} placeholder="Search issues (title, reporter, status...)" />
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="search-meta">Showing {filtered.length} of {issues.length} issues{search ? ` for "${search}"` : ''}.</div>
              {filtered.length === 0 ? (
                <div className="no-results">No issues match your search.</div>
              ) : (
                <div className="table-container" style={{marginTop:'0.5rem'}}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Reporter</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Category</th>
                        <th>Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(issue => (
                        <tr key={issue.id || issue._id}>
                          <td>{issue.title}</td>
                          <td>{issue.reporter?.name || issue.reporter}</td>
                          <td>{issue.location?.address || issue.location}</td>
                          <td>{issue.date || issue.createdAt}</td>
                          <td>{issue.status}</td>
                          <td>{issue.category}</td>
                          <td>{issue.priority}{/* Chat panel accessible from citizen My Issues modal currently */}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AllIssues;
