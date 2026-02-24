import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessage()
  }, [])

  const fetchMessage = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/health`)
      const data = await response.json()
      setMessage(`Backend Status: ${JSON.stringify(data)}`)
    } catch (error) {
      setMessage(`Error connecting to backend: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Berkeley Student Information System</h1>
      <div className="card">
        <button onClick={fetchMessage}>Check Backend Status</button>
        {loading && <p>Loading...</p>}
        {message && <p>{message}</p>}
      </div>
      <p className="info">API URL: {API_URL}</p>
    </div>
  )
}

export default App
