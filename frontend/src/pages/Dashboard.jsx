import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useRole from '../hooks/useRole';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const token = localStorage.getItem('access');
  const navigate = useNavigate();
  const role = useRole();

  // Fetch Tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url = statusFilter
          ? `http://localhost:8000/api/tasks/?status=${statusFilter}`
          : 'http://localhost:8000/api/tasks/';
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(res.data.results || res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to fetch tasks');
      }
    };

    fetchTasks();
  }, [statusFilter, token]);

  // Fetch Projects (for Admin)
  useEffect(() => {
    const fetchProjects = async () => {
      if (role !== 'admin') return;
      try {
        const res = await axios.get('http://localhost:8000/api/projects/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(res.data.results || res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
  }, [role, token]);

  // Handle Project Delete
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/projects/${projectId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {role === 'admin' && (
        <div className="admin-actions">
          <button onClick={() => navigate('/create-project')}>Create Project</button>
          <button onClick={() => navigate('/create-task')}>Create Task</button>
          <button onClick={() => navigate('/logs')}>View Activity Logs</button>
        </div>
      )}

      {role === 'contributor' && (
        <>
          <p>You can view and update your assigned tasks.</p>
          <button onClick={() => navigate('/tasks')}>View My Tasks</button>
        </>
      )}

      <div className="dashboard-grid">
        {/* LEFT COLUMN: Projects */}
        {role === 'admin' && (
          <div className="project-section">
            <h3>Projects</h3>
            <ul>
              {projects.length > 0 ? (
                projects.map((proj) => (
                  <li key={proj.id} className="project-card">
                    <strong>{proj.title}</strong><br />
                    Description: {proj.description}<br />
                    Created: {proj.created_at?.slice(0, 10)}
                    <br />
                    <button onClick={() => handleDeleteProject(proj.id)}>Delete</button>
                  </li>
                ))
              ) : (
                <p>No projects available.</p>
              )}
            </ul>
          </div>
        )}

        {/* RIGHT COLUMN: Tasks */}
        <div className="task-section">
          <div className="filter-section">
            <label>Filter by status: </label>
            <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
              <option value="">All</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <ul className="task-list">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li key={task.id} className="task-card">
                  <strong>{task.title}</strong><br />
                  Status: {task.status}<br />
                  Due: {task.due_date}
                </li>
              ))
            ) : (
              <li>No tasks found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
