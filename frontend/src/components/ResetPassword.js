import { Link, useNavigate, useSearchParams, } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Box, Modal, Button, Typography } from '@mui/material';
import logo from './earthlogo.png'
import AuthContext from '../auth/index'
export default function ResetPassword() {
    const { auth } = useContext(AuthContext);
    const errorModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const [open, setOpen] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSuccessClose = () => { forceNav("/login"); }
    const [queryParameters] = useSearchParams()
    const forceNav = useNavigate();
    useEffect(() => {
        if (queryParameters.get("email") === null || queryParameters.get("key") === null) {
            forceNav("/");
        }
    }, [queryParameters, forceNav]);
    let errorModal = (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={errorModalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Error
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                    {errorMsg}
                </Typography>
                <Button variant="contained" onClick={handleClose}>Close</Button>
            </Box>
        </Modal>)

    let successModal = (
        <Modal
            open={openSuccess}
            onClose={handleSuccessClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={errorModalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Success
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                    Password has been successfully reset.
                </Typography>
                <Button variant="contained" onClick={handleSuccessClose}>Close</Button>
            </Box>
        </Modal>)
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        console.log("password reseting: ", formData.get("password"))
        console.log("repeat password reseting: ", formData.get("repassword"))
        if (formData.get("password") !== formData.get("repassword")) {
            setErrorMsg("Passwords are not the same");
            handleOpen();
        } else if (formData.get("password").length < 7) {
            setErrorMsg("Password length is not greater than or equal to 8");
            handleOpen();
        } else {
            const response = await auth.passwordReset(formData.get("password"), queryParameters.get("email"), queryParameters.get("key"))
            if (response.success) {
                setOpenSuccess(true);
            } else {
                setErrorMsg(response.errorMessage);
                handleOpen();
            }
        }
    }
    let presentedPage = (<Box id="box" component="form" onSubmit={handleSubmit}>
        <div id="login">Reset Your Password</div>

        <input id='password' type="password" placeholder='password' sx={{
            "& fieldset": { border: 'none' },
        }} name="password" data-cy='passwordForm'></input>
        <input id='repassword' type="password" placeholder='verify password' sx={{
            "& fieldset": { border: 'none' },
        }} name="repassword" data-cy='repeatPasswordForm'></input>

        <Button id="returnLogin" type="submit" sx={{ textTransform: `none` }}>
            <p id="text">Reset Pasword</p>
        </Button>
    </Box>)
    return (<div id="allLoginForm">
        <Link to={`/`} id='earthLogoLink'>
            <img src={logo} alt="earthlogo" title='Go Back' />
        </Link>
        {presentedPage}
        {errorModal}
        {successModal}
    </div>)
}