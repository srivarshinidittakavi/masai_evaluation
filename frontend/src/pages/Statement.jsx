import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const Statement = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useContext(AuthContext)

  useEffect(() => {
    const fetchStatement = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const { data } = await axios.get('http://localhost:5000/api/account/statement', config)
        setTransactions(data)
        setLoading(false)
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch statement')
        setLoading(false)
      }
    }
    fetchStatement()
  }, [token])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const containerStyle = { padding: '20px' }
  const tableStyle = { width: '100%', borderCollapse: 'collapse' }
  const thStyle = { padding: '10px', textAlign: 'left', border: '1px solid #ddd', backgroundColor: '#f0f0f0' }
  const tdStyle = { padding: '10px', border: '1px solid #ddd' }

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h1 style={{ marginBottom: '20px' }}>Account Statement</h1>
        {loading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : transactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>From</th>
                <th style={thStyle}>To</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td style={tdStyle}>{formatDate(transaction.date)}</td>
                  <td style={{ ...tdStyle, color: transaction.type === 'Credit' ? 'green' : 'red' }}>
                    {transaction.type}
                  </td>
                  <td style={tdStyle}>₹{transaction.amount.toLocaleString()}</td>
                  <td style={tdStyle}>{transaction.from}</td>
                  <td style={tdStyle}>{transaction.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default Statement