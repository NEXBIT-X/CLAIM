import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from './assets/logo.svg'
import Home from './pages/Home.';
import Dash from './pages/Dash';
import Patent from './pages/Patent';
import Login from './pages/Login';

function Nav(){
  return(
    <>
    <nav>
      <div className='move'>
      <Link to="/">Home</Link>
      <Link to="/patents">Patent</Link>
      <Link to="/login">Login</Link>
      <Link to="/profile">Profile</Link>  
      </div>
      
      </nav>
    </>
  )
}

function App(){

  return (
    <>
   <Router>
   <Nav/>
   <Routes>
   <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/dash" element={<Dash/>} />
    <Route path="/patents"element={<Patent/>}/>
    <Route path="/login" element={<Login/>}/>
   </Routes>
   
   </Router>
   </>
  )
}

export default App