import { useContext } from 'react'
import GlobalStoreContext from '../store';
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

export default function DeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.mapMarkedForDeletion) {
        name = store.mapMarkedForDeletion.name;
    }

    function handleConfirmDelete(event) {
        store.deleteMarkedMap();
        store.hideModals();
    }
    function handleCloseModal(event) {
        store.hideModals();
    }

    return (
        <Modal
            open={store.mapMarkedForDeletion !== null}
        >
            <Grid container sx={style}>
                <Grid container item >
                    <Box sx={top}>
                        <Typography id="modal-heading">Map Deletion</Typography>
                    </Box>
                </Grid>
                <Grid container item>
                    <Box>
                        <Typography id="modal-text" xs={4}>Are you sure you want to delete <b>{name}</b>?</Typography>
                    </Box>
                </Grid>
                <Grid container item sx={buttonBox}>
                    <Button id="modal-button" onClick={handleConfirmDelete} data-cy='delete-map-confirm'>Confirm</Button>
                    <Button id="modal-button" onClick={handleCloseModal} data-cy='delete-map-cancel'>Cancel</Button>

                </Grid>
            </Grid>
        </Modal>
    );
}