import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import useRole from '../hooks/useRole';

export default function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const token = localStorage.getItem('access');
  const navigate = useNavigate();
  const role = useRole();

  if (role !== 'admin') {
    navigate('/dashboard');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        '/projects/',
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Project created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Project creation failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Create Project</h2>
      <input
        type="text"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
        style={{ resize: 'vertical', marginTop: '10px' }}
        required
      />
      <button type="submit" style={{ marginTop: '10px' }}>Create Project</button>
    </form>
  );
}
