import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, error } = useAuth()
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      navigate('/')
    }
  }

  const containerStyle = {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  }

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    border: '1px solid #ddd',
    borderRadius: '3px'
  }

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '20px' }}>Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={submitHandler}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label><br />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label><br />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={inputStyle}
          />
        </div>
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  )
}

export default Login