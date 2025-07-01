/* eslint-disable no-unused-vars */
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  let username = '';

  try {
    const decoded = jwtDecode(token); 
    username = decoded.username;
  } catch (err) {
    console.error('Invalid token');
  }

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/');
  };

return (
    <nav style={styles.nav}>
        <span style={styles.left}> Hi, {username} </span>
        <span style={styles.space}>  </span>
        <span><button onClick={handleLogout} style={styles.logoutButton}>Logout</button></span>
    </nav>
);
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#f2f2f2',
    borderBottom: '1px solid #ccc',
  },
  left: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: ' 0 20px',
    alignItems: "left",
    display: 'inline',
  },
  logoutButton: {
    padding: '5px 10px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
    space: {
    flex: 1,
    padding: '20px 20px',
    color: '#555',
  }

};
