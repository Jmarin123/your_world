import Map from './Map.js';
import logo from './earthlogo.png'
import { Button } from '@mui/material';
import { Grid } from '@mui/material';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';

function RegisterORLogin() {
  return (
        <body>
          <img src={logo} alt="earthlogo"/>
          <Box id="box">
            <section id="account">Create an Account</section>
            <section id="login">Log into Account</section>
      
            <div id="line"></div>

            <TextField id='firstName' placeholder='first name' sx={{
              "& fieldset": { border: 'none' },
            }}></TextField>
            <TextField id='lastName' placeholder='last name' sx={{
              "& fieldset": { border: 'none' },
            }}></TextField>
            <TextField id='username' placeholder='username' sx={{
              "& fieldset": { border: 'none' },
            }}></TextField>
            <TextField id='email' placeholder='email' sx={{
              "& fieldset": { border: 'none' },
            }}></TextField>
            <TextField id='password' placeholder='password' sx={{
              "& fieldset": { border: 'none' },
            }}></TextField>
            <TextField id='repassword' placeholder='verify password' sx={{
              "& fieldset": { border: 'none' },
            }}></TextField>
            <Button id="register" sx={{ textTransform: `none` }}>
              <p id="text">Register</p>
            </Button>


            <TextField id='loginInput' placeholder='username/email' sx={{
              "& fieldset": { border: 'none' },
            }}></TextField>
            <TextField id='loginPassword' placeholder='password' sx={{
              "& fieldset": { border: 'none' },
            }}></TextField>


            <Button id="loginButton" sx={{textTransform: `none`}}>
              <p id="text">Login</p>
            </Button>
          </Box>
      </body>
  );
}

export default RegisterORLogin;
