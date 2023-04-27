import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

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

export default function RenameMapModal() {
    const { store } = useContext(GlobalStoreContext);
    const [name, setName] = useState("");

    function handleConfirmRename() {
        console.log("new name: ", name);
        store.changeMapName(name);
        console.log("Confirm rename modal")
    }
    function handleCloseModal(event) {
        store.hideModals();
    }
    function handleUpdateName(event) {
        setName(event.target.value);
    }

    return (
        <Modal
            open={store.isRenameModalOpen()}
        >
            <Grid container sx={style}>
                <Grid container item >
                    <Box sx={top}>
                        <Typography id="modal-heading">Rename Map</Typography>
                    </Box>
                </Grid>
                <Grid container item>
                    <Box>
                        <Typography id="modal-text" xs={4}>Name: </Typography>
                        <TextField id="modal-textfield" xs={12}
                            defaultValue={name}
                            onChange={handleUpdateName}
                            data-cy="rename-map-text"
                        />
                    </Box>
                </Grid>
                <Grid container item sx={buttonBox}>
                    <Button id="modal-button" onClick={handleConfirmRename} data-cy="rename-map-confirm">Confirm</Button>
                    <Button id="modal-button" onClick={handleCloseModal} data-cy="rename-map-cancel">Cancel</Button>

                </Grid>
            </Grid>
        </Modal>
    );
}