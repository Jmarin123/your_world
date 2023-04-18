import { useContext } from 'react';
import { Link } from "react-router-dom";

import AuthContext from '../auth/index'

import { Button } from '@mui/material';

import logo from './earthlogo.png'
import globeLogo from './globelogo.png';

function SplashScreen() {
  const { auth } = useContext(AuthContext);

  return (
    <div id="splashScreenBackground">
      <div id="navBar">
        <section>Your World</section>
        <img id="mainlogo" src={logo} alt="earthlogo" />
      </div>

      <section id="subtitle">Your Choice, Your Map, Your World</section>
      <section id="subtext">An interactive map design site, used to create your own custom maps and share with others! </section>
      <div id="splashpage-line"></div>

      <Link to={`public`}>
        <Button id="guestButton" onClick={() => auth.continueAsGuest()} sx={{ textTransform: `none` }} data-cy="guestButton">
          <p id="text">Continue as Guest</p>
        </Button>
      </Link>

      <Link to={`register`}>
        <Button id="regButton" sx={{ textTransform: `none` }} data-cy="registerButton">
          <p id="text">Sign Up</p>
        </Button>
      </Link>

      <Link to={`login`}>
        <Button id="logButton" sx={{ textTransform: `none` }} data-cy="loginButton">
          <p id="text">Login</p>
        </Button>
      </Link>

      <img id="globeLogo" src={globeLogo} alt="globeLogo" />
    </div>
  );
}











export default SplashScreen;