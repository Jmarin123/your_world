// import { useContext, useState } from 'react';
// import { GlobalStoreContext } from '../store'
import Map from './Map.js';
import Box from '@mui/material/Box';

export default function AppBanner() {

    return (
        <Box sx={{ flexGrow: 1 }} id="homePageBackground">

            <Box id="box">
                <Map />
            </Box>

        </Box>
    );
}