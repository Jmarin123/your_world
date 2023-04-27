import { useContext } from 'react'
import AuthContext from '../auth/index'
import { Box, Modal, Button, Typography, Grid } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 423,
    height: 311,
    bgcolor: '#ECF2FF',
    borderRadius: 1,
    boxShadow: 16,
    p: 4,
};

const top = {
    position: 'absolute',
    width: 423,
    height: 71,
    left: 0,
    top: 0,
    bgcolor: '#756060',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

const buttonBox = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

export default function MUIErrorModal() {
    const { auth } = useContext(AuthContext);
    if (auth.error)
        console.log("auth.error: " + auth.error.message + typeof (auth.error.message));

    function handleCloseModal(event) {
        auth.hideModals();
    }

    return (
        <Modal
        open={auth.error !== null}
        >
            <Grid container sx={style}>
            <Grid container item >
                <Box sx={top}>
                    <Typography id="modal-heading">Authentication Error</Typography>
                </Box>
            </Grid>
            <Grid container item>
                <Box>
                <Typography id="modal-text" xs={4}>{auth.error ? auth.error : "error"}</Typography>
                </Box>
            </Grid>
            <Grid container item sx={buttonBox}>
                <Button id="modal-button" onClick={handleCloseModal}>Close</Button>

            </Grid>
            </Grid>
        </Modal>
    );
}