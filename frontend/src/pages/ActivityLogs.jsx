import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/logs/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setLogs(data);
      } catch (err) {
        console.error('Error fetching logs', err);
        alert('Failed to load activity logs');
      }
    };

    fetchLogs();
  }, [token]);

  return (
    <div>
      <h2>Activity Logs</h2>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '1rem' }}>
        Back to Dashboard
      </button>

      {logs.length === 0 ? (
        <p>No activity logs found.</p>
      ) : (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              Task ID: {log.task}<br />
              Previous Status: {log.previous_status || 'N/A'}<br />
              Previous Due Date: {log.previous_due_date || 'N/A'}<br />
              Previous Assignee: {log.previous_assignee || 'N/A'}<br />
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
