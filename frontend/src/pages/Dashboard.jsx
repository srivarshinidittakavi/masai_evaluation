import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const Dashboard = () => {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, token } = useContext(AuthContext)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const { data } = await axios.get('http://localhost:5000/api/account/balance', config)
        setBalance(data.balance)
        setLoading(false)
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch balance')
        setLoading(false)
      }
    }
    fetchBalance()
  }, [token])

  const balanceCardStyle = {
    padding: '20px',
    backgroundColor: '#e0e0e0',
    marginBottom: '20px',
    borderRadius: '5px'
  }

  const actionCardStyle = {
    padding: '20px',
    border: '1px solid #ccc',
    width: '200px',
    borderRadius: '5px',
    textDecoration: 'none',
    color: 'black'
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1 style={{ marginBottom: '20px' }}>Welcome, {user?.name}!</h1>
        <div style={balanceCardStyle}>
          <h2>Current Balance</h2>
          {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : <h3>₹{balance?.toLocaleString()}</h3>}
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/send-money" style={actionCardStyle}>
            <h3>Send Money</h3>
            <p>Transfer to another user</p>
          </Link>
          <Link to="/statement" style={actionCardStyle}>
            <h3>Account Statement</h3>
            <p>View transaction history</p>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Dashboard