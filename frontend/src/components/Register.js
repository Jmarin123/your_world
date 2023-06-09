import React, { useContext } from 'react';
import { Link } from "react-router-dom";

import AuthContext from '../auth/index'

import { Box, Button } from '@mui/material';

import logo from './earthlogo.png'

function Register() {
  const { auth } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    auth.registerUser(
      formData.get('firstName'),
      formData.get('lastName'),
      formData.get('username'),
      formData.get('emailForm'),
      formData.get('password'),
      formData.get('repassword')
    );
  };


  return (
    <div id="allLoginForm">
      <Link to={`/`}>
        <img src={logo} alt="earthlogo" title='Go Back' />
      </Link>
      <Box id="box2" component="form" noValidate onSubmit={handleSubmit} >
        <div id="account">Create an Account</div>
        <div>
          <input id='firstName' placeholder='first name' sx={{
            "& fieldset": { border: 'none' },
          }} name="firstName" data-cy='firstNameForm'></input>
          <input id='lastName' placeholder='last name' sx={{
            "& fieldset": { border: 'none' },
          }} name="lastName" data-cy='lastNameForm'></input>
        </div>
        <input id='username' placeholder='username' sx={{
          "& fieldset": { border: 'none' },
        }} name="username"></input>
        <input id='email' placeholder='email' sx={{
          "& fieldset": { border: 'none' },
        }} data-cy='emailForm' name="emailForm" type='email'></input>
        <input id='password' type="password" placeholder='password' sx={{
          "& fieldset": { border: 'none' },
        }} name="password" data-cy='passwordForm'></input>
        <input id='repassword' type="password" placeholder='verify password' sx={{
          "& fieldset": { border: 'none' },
        }} name="repassword" data-cy='repeatPasswordForm'></input>
        <Button id="register" type="submit" sx={{ textTransform: `none`, fontSize: '1vw' }} data-cy='registerButton' on="true">
          <p id="text">Register</p>
        </Button>

        <Link to="/login">
            <p id="textLink">Already A Member? Login Here!</p>
        </Link>
      </Box>
    </div>

  );
}

export default Register;
