import { useState } from 'react'
import './login.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [popAnimation, setPopAnimation] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setPopAnimation(true)
    // Delay further action (like showing an alert) to let the animation play (300ms)
    setTimeout(() => {
      alert(`Email: ${email}\nPassword: ${password}`)
      setPopAnimation(false)
    }, 300)
  }

  return (
    <div className="login-bg">
      <div className="login-container">
        <form className={`login-box ${popAnimation ? 'pop-in' : ''}`} onSubmit={handleLogin}>
          <img src={reactLogo} alt="Logo" className="login-logo" />
          <h2 className="login-title"></h2>
          <label className="login-label">User Name</label>
          <input
            className="login-input"
            type="text"
            placeholder="Enter user name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="login-label">Metamask ID</label>
          <input
            className="login-input"
            type="password"
            placeholder="Enter Metamask ID"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="login-btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}

export default App
