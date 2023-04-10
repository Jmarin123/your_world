import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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

export default function ExportModal() {
    const { store } = useContext(GlobalStoreContext);
    const [name] = useState("Atlantis");
    const [format, setFormat] = useState("Format");

    // if (store.listMarkedForDeletion) {
//         name = store.listMarkedForDeletion.name;
//     }
    function handleConfirmExport(event) {
        store.hideModals();
    }
    function handleCloseModal(event) {
        store.hideModals();
    }

    function handleChange(event) {
        setFormat(event.target.value);
    }

    return (
        <Modal
            open={store.mapMarkedForExport !== null}
        >
            <Grid container sx={style}>
            <Grid container item >
                <Box sx={top}>
                    <Typography id="modal-heading">Export Map</Typography>
                </Box>
            </Grid>
            <Grid container item>
                <Box sx={{ mt: 4 }}>
                <Box>
                <Typography id="modal-text" xs={4}>Please select in which format you would like to export <b>{name}</b>:</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label">Format</InputLabel>
                <Select
                    labelId="export-file-format"
                    id="export-file-format"
                    value={format}
                    label="Format"
                    onChange={handleChange}
                >
                    <MenuItem value={'SHP/DBF Zip'}>SHP/DBF Zip</MenuItem>
                    <MenuItem value={'GeoJSON'}>GeoJSON</MenuItem>
                    <MenuItem value={'Image'}>Image (PNG)</MenuItem>
                </Select>
                </FormControl>
                </Box>
                </Box>
            </Grid>
            <Grid container item sx={buttonBox}>
                <Button id="modal-button" onClick={handleConfirmExport}>Confirm</Button> 
                <Button id="modal-button" onClick={handleCloseModal}>Cancel</Button>

            </Grid>
            </Grid>
        </Modal>
    );
}