import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const SendMoney = () => {
  const [users, setUsers] = useState([])
  const [receiverEmail, setReceiverEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const { data } = await axios.get('http://localhost:5000/api/account/users', config)
        setUsers(data)
        setFetchLoading(false)
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch users')
        setFetchLoading(false)
      }
    }
    fetchUsers()
  }, [token])

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const { data } = await axios.post(
        'http://localhost:5000/api/account/transfer',
        { receiverEmail, amount: parseFloat(amount) },
        config
      )
      setSuccess(`Transfer successful! New balance: ₹${data.newBalance}`)
      setReceiverEmail('')
      setAmount('')
      setLoading(false)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      setError(error.response?.data?.message || 'Transfer failed')
      setLoading(false)
    }
  }

  const containerStyle = { padding: '20px' }
  const usersListStyle = {
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  }
  const formStyle = { maxWidth: '400px' }
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
    <>
      <Navbar />
      <div style={containerStyle}>
        <h1 style={{ marginBottom: '20px' }}>Send Money</h1>
        {fetchLoading ? (
          <p>Loading users...</p>
        ) : (
          <>
            <div style={usersListStyle}>
              <h3 style={{ marginBottom: '10px' }}>Available Users to Send Money:</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {users.map((u) => (
                  <li 
                    key={u.id} 
                    onClick={() => setReceiverEmail(u.email)} 
                    style={{ 
                      padding: '5px', 
                      cursor: 'pointer', 
                      borderBottom: '1px solid #eee' 
                    }}
                  >
                    {u.name} - {u.email}
                  </li>
                ))}
              </ul>
            </div>
            <form onSubmit={submitHandler} style={formStyle}>
              {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
              {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}
              <div style={{ marginBottom: '15px' }}>
                <label>Receiver Email:</label><br />
                <input 
                  type="email" 
                  value={receiverEmail} 
                  onChange={(e) => setReceiverEmail(e.target.value)} 
                  required 
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Amount (₹):</label><br />
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  required 
                  min="1" 
                  step="0.01" 
                  style={inputStyle}
                />
              </div>
              <button type="submit" disabled={loading} style={buttonStyle}>
                {loading ? 'Processing...' : 'Send Money'}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  )
}

export default SendMoney