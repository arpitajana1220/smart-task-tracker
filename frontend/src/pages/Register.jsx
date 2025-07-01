import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'contributor' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/register/', form);
      alert('Registered successfully!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Register</h2>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} type="email" required />
      <input name="password" placeholder="Password" onChange={handleChange} type="password" required />
      <select name="role" onChange={handleChange}>
        <option value="contributor">Contributor</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}
