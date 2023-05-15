//import { useContext } from 'react'
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { Box, Button } from '@mui/material';
import logo from './earthlogo.png'
import AuthContext from '../auth/index'
export default function ForgotPassword() {
    const { auth } = useContext(AuthContext);
    let [submitted, setSubmitted] = useState(false);
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        console.log("password reseting: ", formData.get("email"))
        auth.sendPasswordEmail(formData.get("email"));
        setSubmitted(true);
    }
    let presentedPage = null;
    if (submitted) {
        presentedPage = (<Box id="box">
            <div>An email has been sent to reset your password.</div>
            <Button id="returnLogin" type="button" sx={{ textTransform: `none` }}
                component={Link}
                to="/login">
                <p id="text">Return to Login</p>
            </Button>
        </Box>)
    } else {
        presentedPage = (<Box id="box" component="form" onSubmit={handleSubmit}>
            <div id="login">Forgot Password</div>

            <input id='loginInput' placeholder='email' sx={{
                "& fieldset": { border: 'none' },
            }} name="email" type="email" required ></input>

            <Button id="returnLogin" type="submit" sx={{ textTransform: `none` }}>
                <p id="text">Send Email</p>
            </Button>
        </Box>)
    }
    return (<div id="allLoginForm">
        <Link to={`/`} id='earthLogoLink'>
            <img src={logo} alt="earthlogo" title='Go Back' />
        </Link>
        {presentedPage}
    </div>)
}