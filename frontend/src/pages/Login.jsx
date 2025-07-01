import { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axiosInstance.post('/token/', form);
    const access = res.data.access;
    const refresh = res.data.refresh;

    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);

    // ✅ Decode access token to extract user information
    const token = localStorage.getItem('access');
    if (token) {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      console.log(decoded);
    } else {
      console.log('No token found');
    }
    
    // ✅ Decode access token to extract role
    const decoded = jwtDecode(access);
    const role = decoded.role; // assuming your JWT includes `role`
    localStorage.setItem('role', role);

    alert('Login successful!');
    navigate('/dashboard');
  
  } catch (err) {
    console.error(err);
    alert('Login failed. Check credentials.');
  }
};


  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Login</h2>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
}
