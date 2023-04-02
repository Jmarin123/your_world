import logo from './earthlogo.png'
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';
import { Link } from "react-router-dom";

function Login() {
  return (
        <body>
          <Link to={`/`}>
          <img src={logo} alt="earthlogo"/>
          </Link>
          <Box id="box" >
           
              <section id="login">Log into Account</section>

            
              <TextField id='loginInput' placeholder='username/email' sx={{
                "& fieldset": { border: 'none' }, 
              }}></TextField>
              <TextField id='loginPassword' type="password" placeholder='password' sx={{
                "& fieldset": { border: 'none' },
              }}></TextField>
        

              <Button id="loginButton" sx={{textTransform: `none`}}>
                <p id="text">Login</p>
              </Button>
        
          </Box>
      </body>
  );
}

export default Login;
