import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navbarStyle = {
    padding: '15px',
    backgroundColor: '#f0f0f0',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const linkStyle = {
    marginRight: '15px',
    textDecoration: 'none',
    color: '#333'
  }

  return (
    <nav style={navbarStyle}>
      <div>
        <Link to="/" style={linkStyle}>Dashboard</Link>
        <Link to="/send-money" style={linkStyle}>Send Money</Link>
        <Link to="/statement" style={linkStyle}>Statement</Link>
      </div>
      {user && (
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {user.name}</span>
          <button onClick={handleLogout} style={{ padding: '5px 10px' }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar