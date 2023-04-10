// import Map from './Map.js';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import MapCard from './MapCard.js'

export default function HomePage() {

    return (
        <Box sx={{ flexGrow: 1 }} id="homePageBackground">
            <Box id="publicBox" component="form" noValidate >
                <section id="public">Results</section>
                <div id='line'></div>

                <List id="map-cards-list" sx={{display: 'flex'}}>
                    <MapCard/>
                    <MapCard/>
                    <MapCard/>
                    <MapCard/>
                </List>
            </Box>
        </Box>
    );
}