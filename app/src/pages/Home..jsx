import logo from '../assets/logo.svg';
import Foot  from './Foot';

function Home(){
    return(
        <div className='home'>
            {/* <center><img id="logo" src={logo}></img></center> */}
            <div class="carousel">
            <img src={logo} alt="CLAIM" id='log'/>
            <blockquote class="testimonial">
            <p class="testimonial-text">CLAIM</p>
            <p class="testimonial-author">Decentralized Idea Proof Platform</p><br/>
            <p class="testimonial-job">CLAIM solves these problems by making the process faster, 
                      transparent, and available to anyone with an internet connection and a 
                      wallet. 
            </p>
            </blockquote>
            </div>
            <section>
        <div class="grid-3-cols">
        <h2 class="apg">What makes our CLAIM special</h2>

          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="features-icon"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            <p class="features-title"><strong>Blockchain backed proof</strong></p>
            <p class="features-text">
              Timestamp your idea with a single click. Immutable, secure, and stored forever.
            </p>
          </div>

   

          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="features-icon"
              fill="none"
              viewBox="0 0 24 24"
           
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p class="features-title">
              <strong>Designed for everyone</strong>
            </p>
            <p class="features-text">
              Whether you're a student or a startup, CLAIM puts idea ownership in your hands.            </p>
          </div>
        </div>
      </section>




<section>
        <div class="grid-3-cols">
          <div>
            <p class="features-title"><strong>🔐Why CLAIM matters</strong></p>
            <p class="features-text">
              Protect your ideas before they’re stolen
              Traditional patent systems are expensive, slow, and out of reach for many creators. CLAIM offers a smarter way.

              Not a legal patent, but powerful proof
              By minting your idea as an NFT on the blockchain, CLAIM gives you a tamper proof, timestamped record proving the idea was yours              first.

              Transparent, fair, and open
              CLAIM works on decentralized networks like Polygon and IPFS so no middlemen, no hidden fees, and full public visibility.

            </p>
          </div>

   

          <div>
              <p class="features-title">
              <strong>🌱Built for the future</strong>
            </p>
            <p class="features-text">
              Scalable and adaptable
              CLAIM is built to grow with your needs supporting multi chain environments, AI powered originality checks, and smart licensing.

              Your creativity deserves protection
              From startups to students, CLAIM ensures your innovation stays yours and helps you share it safely when youre ready.         </p>
          </div>
        </div>
      </section>
      <Foot/>
        </div>
    );
}

export default Home;
