import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

// Use relative URL when using proxy
const API_URL = 'http://localhost:5000/api'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo)
      setUser(parsedUser)
      setToken(parsedUser.token)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      console.log('Attempting login with:', { email, password })
      console.log('API URL:', `${API_URL}/auth/login`)
      
      const { data } = await axios.post(`${API_URL}/auth/login`, { 
        email, 
        password 
      }, {
        headers: { 'Content-Type': 'application/json' }
      })
      
      console.log('Login response:', data)
      localStorage.setItem('userInfo', JSON.stringify(data))
      setUser(data)
      setToken(data.token)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error.response || error)
      setError(error.response?.data?.message || 'Login failed')
      return { success: false, error: error.response?.data?.message }
    }
  }

  const signup = async (name, email, password) => {
    try {
      setError(null)
      console.log('Attempting signup with:', { name, email, password })
      console.log('API URL:', `${API_URL}/auth/signup`)
      
      const { data } = await axios.post(`${API_URL}/auth/signup`, { 
        name, 
        email, 
        password 
      }, {
        headers: { 'Content-Type': 'application/json' }
      })
      
      console.log('Signup response:', data)
      localStorage.setItem('userInfo', JSON.stringify(data))
      setUser(data)
      setToken(data.token)
      return { success: true }
    } catch (error) {
      console.error('Signup error:', error.response || error)
      setError(error.response?.data?.message || 'Signup failed')
      return { success: false, error: error.response?.data?.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('userInfo')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}