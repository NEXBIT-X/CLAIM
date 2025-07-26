import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from 'react';
import logo from './assets/legacy.svg';
import Home from './pages/Home.';
import Dash from './pages/Dash';
import Patent from './pages/Patent';
import Login from './pages/Login';


function SideNav({ isOpen, toggleNav }) {
  return (
    <div className={`side-nav ${isOpen ? 'open' : ''}`}>
      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/" onClick={toggleNav}>Home</Link>
        <Link to="/patents" onClick={toggleNav}>Patents</Link>
        <Link to="/login" onClick={toggleNav}>Login</Link>
        <Link to="/profile" onClick={toggleNav}>Profile</Link>
      </div>

      {/* Logo fixed at bottom */}
      <div className="nav-logo-bottom">
        <img src={logo} alt="Logo" className="bottom-logo" />
      </div>
    </div>
  );
}


function App(){
  const [navOpen, setNavOpen] = useState(false);
  const toggleNav = () => setNavOpen(prev => !prev);
  
  // Closes the side navigation if it's open when clicking the page container
  const closeNav = () => {
    if(navOpen) {
      setNavOpen(false);
    }
  };
  
  return (
    <Router>
      <header>
        <button className="hamburger" onClick={toggleNav}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>
      <SideNav isOpen={navOpen} toggleNav={toggleNav} />
      <div className="page-container" onClick={closeNav}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/profile" element={<Dash/>}/>
          <Route path="/patents" element={<Patent/>}/>
          <Route path="/logout" element={<Login/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;
