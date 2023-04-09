import { useContext } from 'react'
// import GlobalStoreContext from '../store';
import AuthContext from '../auth/index'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';

const style = {
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
            <Box sx={style}>
                <Alert severity="error">{auth.error ? auth.error : "error"}</Alert>
                <div id="confirm-cancel-container">
                    <button
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleCloseModal}
                    >Cancel</button>
                </div>
            </Box>
        </Modal>
    );
}