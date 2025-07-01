import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  // Fetch tasks assigned to this user
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/tasks/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(res.data.results || res.data);
      } catch (err) {
        console.error('Error fetching tasks', err);
        alert('Failed to load tasks');
      }
    };

    fetchTasks();
  }, [token]);

  // Handle status update
  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/tasks/${taskId}/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Status updated!');
      // refresh task list
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error('Error updating status', err);
      alert('Failed to update status');
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      <h2>My Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned to you.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong><br />
              Status:
              <select
                value={task.status}
                onChange={(e) => updateStatus(task.id, e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <br />
              Due: {task.due_date}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
