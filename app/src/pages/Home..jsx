import logo from '../assets/logo.svg';

function Home(){
    return(
        <div className='home'>
            <div className='c1'>
            <center><img id="logo" src={logo}></img></center>
            <><h1>CLAIM</h1>
            </>
            </div>            
            <h1>Welcome to the Home Page</h1>
            <p>This is the main landing page of our application.</p>
            <p>Explore our features and functionalities!</p>
        </div>
    );
}

export default Home;