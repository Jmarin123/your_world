import logo from './earthlogo.png'
import { Button } from '@mui/material';
import globeLogo from './globelogo.png';

function SplashScreen() {
    return (
        <body id="splashScreenBackground">
            <div id="navBar">
                <section>Your World</section>
            </div>

            <img id="mainlogo" src={logo} alt="earthlogo"/>
            <section id="subtitle">Your Choice, Your Map, Your World</section>
            <section id="subtext">An interactive map design site, used to create your own custom maps and share with others! </section>
            <div id="line2"></div>

            <Button id="guestButton" sx={{textTransform: `none`}}>
              <p id="text">Continue as Guest</p>
            </Button>

            <Button id="regButton" sx={{textTransform: `none`}}>
              <p id="text">Sign Up</p>
            </Button>

            <Button id="logButton" sx={{textTransform: `none`}}>
              <p id="text">Login</p>
            </Button>

            <img id="globeLogo" src={globeLogo} alt="globeLogo"/>
        </body>
    );

}











export default SplashScreen;