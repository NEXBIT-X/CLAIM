import { useState } from 'react'
import './login.css'
import logo from '../assets/claim.svg'  

function App() {
  const [popAnimation, setPopAnimation] = useState(false)
  const [account, setAccount] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setPopAnimation(true)
    // Connect to Metamask
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
        // You can redirect or show success here
      } catch (err) {
        // Handle error (user denied, etc.)
      }
    } else {
      alert('Metamask not detected')
    }
    setTimeout(() => {
      setPopAnimation(false)
    }, 300)
  }

  return (
    <div className="login-bg">
      <div className="login-container">
        <form className={`login-box ${popAnimation ? 'pop-in' : ''}`} onSubmit={handleLogin}>
          <img src={logo} alt="Logo" className="login-logo" />
          <h2 className="login-title"></h2>
          <label className="login-label" style={{ display: "block", textAlign: "center", width: "100%" }}>
            <b> Link your Metamask</b>
          </label>
          <button className="login-btn" type="submit">Connect</button>
          {account && (
            <div style={{ marginTop: "16px", color: "#6e8efb", textAlign: "center" }}>
              Connected: {account}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default App
