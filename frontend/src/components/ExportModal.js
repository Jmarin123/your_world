import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store'
import { Box, Modal, Button, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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
    const [name, setName] = useState("");
    const [format, setFormat] = useState("Format");

    useEffect(() => {
        if (store.mapMarkedForExport) {
            setName(store.mapMarkedForExport.map_name)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.mapMarkedForExport]);

    // useEffect(() => {
    //     console.log("State variable changed in ExportModal")


    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [store.exportMapData]);

    async function handleConfirmExport(event) {
        let fileData = JSON.stringify(await store.exportMarkedMap());
        if (format === "GeoJSON") {
            const blob = new Blob([fileData], { type: 'application/json' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = (store.mapMarkedForExport.map_name).split(' ').join('_') + '.geojson';
            downloadLink.click();
        }
        else if (format === "SHP+DBF") {
            const response = await fetch('https://ogre.adc4gis.com/convertJson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'json': fileData
                })
            });
            const blob = await response.blob();
            const urlObject = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = urlObject;
            link.download = (store.mapMarkedForExport.map_name).split(' ').join('_') + '.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(urlObject);

        }
        else if (format === "Image") {
            console.log("image")
        }
        else {
            console.log("export map else")
        }
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
                                    <MenuItem value={'SHP+DBF'}>SHP+DBF</MenuItem>
                                    <MenuItem value={'GeoJSON'}>GeoJSON</MenuItem>
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