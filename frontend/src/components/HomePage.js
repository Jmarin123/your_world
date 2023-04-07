// import Map from './Map.js';
import Box from '@mui/material/Box';

export default function AppBanner() {

    return (
        <Box sx={{ flexGrow: 1 }} id="homePageBackground">
            
            <Box id="publicBox" component="form" noValidate >
            <section id="public">Public Map Listing</section>
            <div id='line'></div>
            </Box>


            {/* <Box id="box">
                <Map />
            </Box> */}
        </Box>
    );
}

