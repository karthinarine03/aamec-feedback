import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const AdminLogin = ({children}) => {
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [error,setError] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === "aamec@it") {
      setError(false)
      navigate("/admin")
      {children}
    } else {
      setError(true)
    }
  }

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center ">
      <div className="card shadow-lg p-4" style={{ width: "350px", borderRadius: "15px" }}>
        <h3 className="text-center mb-4">🔐 Admin Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              value="Administrator"
              readOnly
              className="form-control bg-light"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="form-control"
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            style={{ borderRadius: "10px" }}
          >
            Login
          </button>
        </form>
        {error && (
          <div className=' p-4 mt-3 adminError'>
          <span>Invalid Password</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminLogin
