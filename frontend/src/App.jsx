import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import Tasks from './pages/Tasks';
import CreateProject from './pages/CreateProject';
import ActivityLogs from './pages/ActivityLogs';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar';
import './index.css';

function AppRoutes() {
  const location = useLocation();
  const hideNavbarOn = ['/','/register','/login']; // Add more routes to hide Navbar if needed

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-task" element={<ProtectedRoute role="admin"><CreateTask /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
        <Route path="/logs" element={<ProtectedRoute><ActivityLogs /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

