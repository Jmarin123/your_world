import { useContext } from 'react'
import { Link } from "react-router-dom";

import AuthContext from '../auth/index'

import { Box, Button } from '@mui/material';

import logo from './earthlogo.png'

function Login() {
  const { auth } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    auth.loginUser(
      formData.get('email'),
      formData.get('password')
    );
  };

  return (
    <div>
      <Link to={`/`}>
        <img src={logo} alt="earthlogo" title='Go Back' />
      </Link>
      <Box id="box" component="form" noValidate onSubmit={handleSubmit}>
        <section id="login">Log into Account</section>

        <input id='loginInput' placeholder='email' sx={{
          "& fieldset": { border: 'none' },
        }} name="email" ></input>
        <input id='loginPassword' type="password" placeholder='password' sx={{
          "& fieldset": { border: 'none' },
        }} name="password" ></input>


        <Button id="loginButton" type="submit" sx={{ textTransform: `none` }}>
          <p id="text">Login</p>
        </Button>

      </Box>
    </div>
  );
}

export default Login;
