import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container">
      <h1>Welcome to Smart Task Tracker</h1>
      <p>Track tasks, projects, and stay productive!</p>
      <div>
        <Link to="/register"><button>Register</button></Link>
        <Link to="/login"><button>Login</button></Link>
      </div>
    </div>
  );
}
