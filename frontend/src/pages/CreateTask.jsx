import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import useRole from '../hooks/useRole';

export default function CreateTask() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    due_date: '',
    project: '',
    assigned_to: '',
  });

  const [contributors, setContributors] = useState([]);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  const role = useRole();

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/dashboard');
    }

    // Fetch contributors
    const fetchContributors = async () => {
      try {
        const res = await axiosInstance.get('/users/?role=contributor', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setContributors(res.data.results); 
      } catch (err) {
        console.error('Error fetching contributors:', err);
      }
    };

    // Fetch projects
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get('/projects/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(res.data.results || res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };

    fetchContributors();
    fetchProjects();
  }, [token, role, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/tasks/', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Task created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Task creation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Create Task</h2>
      <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
      
      <label>Status:</label>
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <label>Due Date:</label>
      <input type="date" name="due_date" value={form.due_date} onChange={handleChange} required />

      <label>Project:</label>
      <select name="project" value={form.project} onChange={handleChange} required>
        <option value="">-- Select Project --</option>
        {projects.map((proj) => (
          <option key={proj.id} value={proj.id}>{proj.title}</option>
        ))}
      </select>

      <label>Assign To:</label>
      <select name="assigned_to" value={form.assigned_to} onChange={handleChange} required>
        <option value="">-- Select Contributor --</option>
        {contributors.map((user) => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ))}
      </select>

      <button type="submit">Create Task</button>
    </form>
  );
}
