import logo from './earthlogo.png'
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';
import { Link } from "react-router-dom";
import { useContext } from 'react';
import AuthContext from '../auth'

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
        <body>
          <Link to={`/`}>
          <img src={logo} alt="earthlogo"/>
          </Link>
          <Box id="box" component="form" noValidate onSubmit={handleSubmit}>
           
              <section id="login">Log into Account</section>

            
              <TextField id='loginInput' placeholder='email' sx={{
                "& fieldset": { border: 'none' }, 
              }} name="email" ></TextField>
              <TextField id='loginPassword' type="password" placeholder='password' sx={{
                "& fieldset": { border: 'none' },
              }} name="password" ></TextField>
        

              <Button id="loginButton" type="submit" sx={{textTransform: `none`}}>
                <p id="text">Login</p>
              </Button>
        
          </Box>
      </body>
  );
}

export default Login;
