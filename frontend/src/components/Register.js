import logo from './earthlogo.png'
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';
import { Link } from "react-router-dom";

function Register() {
  return (
        <body>
          <Link to={`/`}>
          <img src={logo} alt="earthlogo"/>
          </Link>
          <Box id="box">
            <section id="account">Create an Account</section>
      
            {/* <div id="line"></div> */}

            <TextField id='firstName' placeholder='first name' sx={{
          "& fieldset": { border: 'none' },
        }} data-cy='firstNameForm'></TextField>
        <TextField id='lastName' placeholder='last name' sx={{
          "& fieldset": { border: 'none' },
        }} data-cy='lastNameForm'></TextField>
        <TextField id='username' placeholder='username' sx={{
          "& fieldset": { border: 'none' },
        }}></TextField>
        <TextField id='email' placeholder='email' sx={{
          "& fieldset": { border: 'none' },
        }} data-cy='emailForm'></TextField>
        <TextField id='password' placeholder='password' sx={{
          "& fieldset": { border: 'none' },
        }} data-cy='passwordForm'></TextField>
        <TextField id='repassword' placeholder='verify password' sx={{
          "& fieldset": { border: 'none' },
        }} data-cy='repeatPasswordForm'></TextField>
        <Button id="register" sx={{ textTransform: `none` }} data-cy='registerButton'>
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
