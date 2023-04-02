import { React } from "react";
import logo from './earthlogo.png'
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';
import { Link } from "react-router-dom";
import { useContext } from 'react';
import AuthContext from '../auth'

function Register() {
  const { auth } = useContext(AuthContext);

  const handleSubmit = (event) => {
    console.log("in handleSubmit")
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get('firstName'))
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
        <body>
          <Link to={`/`}>
          <img src={logo} alt="earthlogo"/>
          </Link>
          <Box id="box" component="form" noValidate onSubmit={handleSubmit} >
            <section id="account">Create an Account</section>
      
            {/* <div id="line"></div> */}

            <TextField id='firstName' placeholder='first name' sx={{
          "& fieldset": { border: 'none' },
        }} name="firstName" data-cy='firstNameForm'></TextField>
        <TextField id='lastName' placeholder='last name' sx={{
          "& fieldset": { border: 'none' },
        }} name="lastName" data-cy='lastNameForm'></TextField>
        <TextField id='username' placeholder='username' sx={{
          "& fieldset": { border: 'none' },
        }} name="username"></TextField>
        <TextField id='email' placeholder='email' sx={{
          "& fieldset": { border: 'none' },
        }} data-cy='emailForm' name="emailForm"></TextField>
        <TextField id='password' placeholder='password' sx={{
          "& fieldset": { border: 'none' },
        }} name="password" data-cy='passwordForm'></TextField>
        <TextField id='repassword' placeholder='verify password' sx={{
          "& fieldset": { border: 'none' },
        }} name="repassword" data-cy='repeatPasswordForm'></TextField>
        <Button id="register" type="submit" sx={{ textTransform: `none` }} data-cy='registerButton' on>
          <p id="text">Register</p>
        </Button>
            {/* <TextField id='loginInput' placeholder='username/email' sx={{
              "& fieldset": { border: 'none' },
            }}></TextField>
            <TextField id='loginPassword' placeholder='password' sx={{
              "& fieldset": { border: 'none' },
            }}></TextField>


            <Button id="loginButton" sx={{textTransform: `none`}}>
              <p id="text">Login</p>
            </Button> */}
          </Box>

      </body>
      
  );
}

export default Register;
