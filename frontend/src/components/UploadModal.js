import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

var shapefile = require("shapefile");

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

export default function UploadModal() {
    const { store } = useContext(GlobalStoreContext);
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);

    async function parseJsonFile(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.onload = event => resolve(JSON.parse(event.target.result))
            fileReader.onerror = error => reject(error)
            fileReader.readAsText(file)
        })
    }

    async function parseInputFile(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = function () {
                var arrayBuffer = fileReader.result
                var bytes = new Uint8Array(arrayBuffer);
                resolve(bytes);
            }
            fileReader.onerror = error => reject(error)
        })
    }

    const assignName = (dataForMap) => {
        for (let i = 0; i < dataForMap.features.length; i++) {
            if (typeof dataForMap.features[i].properties.NAME_4 !== 'undefined') {
                dataForMap.features[i].properties.sovereignt = dataForMap.features[i].properties.NAME_4;
            }
            else if (typeof dataForMap.features[i].properties.NAME_3 !== 'undefined') {
                dataForMap.features[i].properties.sovereignt = dataForMap.features[i].properties.NAME_3;
            }
            else if (typeof dataForMap.features[i].properties.NAME_2 !== 'undefined') {
                dataForMap.features[i].properties.sovereignt = dataForMap.features[i].properties.NAME_2;
            }
            else if (typeof dataForMap.features[i].properties.NAME_1 !== 'undefined') {
                dataForMap.features[i].properties.sovereignt = dataForMap.features[i].properties.NAME_1;
            }
            else if (typeof dataForMap.features[i].properties.NAME_0 !== 'undefined') {
                dataForMap.features[i].properties.sovereignt = dataForMap.features[i].properties.NAME_0;
            }
            else {
                dataForMap.features[i].properties.name = '';
            }
        }

        return dataForMap;
    }

    async function handleSubmit(event) {
        if (store.uploadType === "shp/dbf") {
            const shpArray = await parseInputFile(file1)
            const dbfArray = await parseInputFile(file2)

            let object = await shapefile.read(shpArray, dbfArray)
            assignName(object)

            store.createNewMap(object)
        }
        else {
            const object = await parseJsonFile(file1)
            // assignName(object)

            store.createNewMap(object)
        }
    }

    function handleCancel() {
        store.hideModals();
    }

    let uploadShpInput = (<div>
        <form>
            <input type="file" accept=".shp" onChange={(e) => setFile1(e.target.files[0])} data-cy='upload-shp' />
            <input type="file" accept=".dbf" onChange={(e) => setFile2(e.target.files[0])} data-cy='upload-dbf' />
        </form>
    </div>)

    let uploadGeojsonInput = (<div>
        <form>
            <input type="file" accept=".geojson,.json" onChange={(e) => setFile1(e.target.files[0])} data-cy='upload-geojson' />
        </form>
    </div>)

    return (
        <Modal
            open={store.currentModal === "UPLOAD_FILE"}
            data-cy='upload-modal'
        >
            <Grid container sx={style}>
                <Grid container item >
                    <Box sx={top}>
                        <Typography id="modal-heading">Upload Files</Typography>
                    </Box>
                </Grid>
                <Grid container item>
                    <Box>
                        {
                            store.uploadType === "shp/dbf" ? uploadShpInput : uploadGeojsonInput
                        }
                    </Box>
                </Grid>
                <Grid container item sx={buttonBox}>
                    <Button id="modal-button" onClick={handleSubmit} data-cy='upload-confirm'>Confirm</Button>
                    <Button id="modal-button" onClick={handleCancel} data-cy='upload-cancel'>Cancel</Button>
                </Grid>
            </Grid>
        </Modal>
    );
}