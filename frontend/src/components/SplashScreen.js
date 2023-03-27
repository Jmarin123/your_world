import logo from './earthlogo.png'
import { Button } from '@mui/material';
import globeLogo from './globelogo.png';
import { Outlet, Link } from "react-router-dom";

function SplashScreen() {

    return (
        <div id="splashScreenBackground">
            <div id="navBar">
                <section>Your World</section>
                <img id="mainlogo" src={logo} alt="earthlogo"/>
            </div>

            
              <section id="subtitle">Your Choice, Your Map, Your World</section>
            <section id="subtext">An interactive map design site, used to create your own custom maps and share with others! </section>
            <div id="line2"></div>

            <Link to={`home`}>
              <Button id="guestButton" sx={{textTransform: `none`}}>
                <p id="text">Continue as Guest</p>
              </Button>
            </Link>

            <Link to={`registerORlogin`}>
              <Button id="regButton" sx={{textTransform: `none`}}>
                <p id="text">Sign Up</p>
              </Button>
            </Link>

            <Link to={`registerORlogin`}>
              <Button id="logButton" sx={{textTransform: `none`}}>
                <p id="text">Login</p>
              </Button>
            </Link>

            <img id="globeLogo" src={globeLogo} alt="globeLogo"/>
        </div>
    );

}











export default SplashScreen;