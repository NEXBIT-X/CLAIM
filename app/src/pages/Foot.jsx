import logo from '../assets/logo.svg';

function Foot(){
  return(
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col logo">
          <img src={logo} alt="CLAIM Logo" height="80" width="80" />
      
        </div>

        <div className="footer-col">
          <h3>CLAIM</h3>
          <ul>
            <li><a href="#">Get CLAIM</a></li>
            <li><a href="#">Home</a></li>
            <li><a href="#">Patent</a></li>
            <li><a href="#">Login</a></li>
            <li><a href="#">Profile</a></li>
            <li><a href="#">Log Out</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Developer</h3>
          <ul>
            <li><a href="https://claim.hashnode.space/">View the Docs</a></li>
            <li><a href="#">Wallet Connect</a></li>
            <li><a href="https://github.com/ABHIJEETH-V-N/CLAIM">GitHub Repo</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>About</h3>
          <ul>
            <li><a href="#">NEXBIT</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="language">
          🌐 English (UK)
        </div>

        <div className="footer-links">
          <a href="#">NEXBIT</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}

export default Foot;