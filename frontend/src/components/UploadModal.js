import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
// import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

var shapefile = require("shapefile");

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 250,
    bgcolor: '#e5f6fd',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

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
        fileReader.onload = function() {
            var arrayBuffer = fileReader.result
            var bytes = new Uint8Array(arrayBuffer);
            resolve(bytes);
            }
        fileReader.onerror = error => reject(error)
        })
    }

      async function handleSubmit(event) {
        if(store.uploadType === "shp/dbf"){
            const shpArray = await parseInputFile(file1)
            const dbfArray = await parseInputFile(file2)

            const object = await shapefile.read(shpArray, dbfArray)
            
            store.createNewMap(object)
        }
        else{
            const object = await parseJsonFile(file1)
            // assignName(object)

            store.createNewMap(object)
        }
    }

    function handleCancel() {
        store.hideModals();
    }

    let uploadShpInput = <div>
        <form>
        <input type="file" accept=".shp" onChange={(e) => setFile1(e.target.files[0])}/>
        <input type="file" accept=".dbf" onChange={(e) => setFile2(e.target.files[0])}/></form></div>

    let uploadGeojsonInput = <div><form><input type="file" accept=".geojson,.json" onChange={(e) => setFile1(e.target.files[0])}/></form></div>

    return (
        <Modal
            open={store.currentModal === "UPLOAD_FILE"}
        >
            <Box sx={style}>
            <div
            id="upload-modal"
            className="modal is-visible">
            <div
                id='upload-root'
                className="modal-root">
                <div
                    id="upload-modal-header"
                    className="modal-north">Upload File</div>
                    {
                        store.uploadType === "shp/dbf" ? uploadShpInput : uploadGeojsonInput
                    }
                <div className="modal-south">
                    <p></p>
                    <div id="confirm-cancel-container">
                        <Button
                            id='upload-submit-button'
                            onClick={handleSubmit}
                            variant="contained">
                                Confirm
                        </Button>
                        <Button
                            id='upload-cancel-button'
                            onClick={handleCancel}
                            variant="contained">
                                Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
            </Box>
        </Modal>
    );
}