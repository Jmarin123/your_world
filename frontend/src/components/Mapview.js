import { useContext } from 'react';

import { GlobalStoreContext } from '../store'

import { Box, Grid } from '@mui/material';

import Comment from './Comment';
import Statusbar from './Statusbar';

import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet';

export default function Mapview() {
    const { store } = useContext(GlobalStoreContext);
    console.log(store.openComment);

    const countryStyle = {
        fillColor: "red",
        fillOpacity: 1,
        color: "black",
        weight: 2,
    };

    function onEachCountry(country, layer) {
        // layer.on({
        //     click: this.changeCountryColor,
        // });

        let popupContent = `${country.properties.admin}`;
        if (country.properties && country.properties.popupContent) {
          popupContent += country.properties.popupContent;
        }
        
        layer.bindPopup(popupContent);
    };

    let renderedMap = <GeoJSON
        style={countryStyle}
        data={store.currentMap ? store.currentMap.dataFromMap.features : null}
        onEachFeature={onEachCountry}
    />

    let mapViewMenu =
        <Box sx={{ flexGrow: 1 }} id="homePageBackground">
            <Box id="statusBoxEdit">
                <Statusbar />
            </Box>

            <Box id="mapBox" component="form" noValidate >
                <MapContainer id="mapContainer" style={{ height: "80vh" }} zoom={2} center={[20, 100]}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {
                        store.currentMap ? renderedMap : <div></div>
                    }
                </MapContainer>
            </Box>


        </Box>

    if (store.openComment) {
        mapViewMenu =
            <div >
                <Grid container spacing={0.5}>
                    <Grid item xs={9}
                        style={{
                            paddingLeft: '0%',
                            top: '50px',
                            left: '10px',
                            height: '1000px',
                            // overflowY: 'auto',
                        }}
                    >
                        <Box sx={{ flexGrow: 1 }} id="homePageBackground">
                            <Box id="statusBoxEdit">
                                <Statusbar />
                            </Box>
                            <Box id="mapBox" component="form" noValidate >
                                <MapContainer id="mapContainer" style={{ height: "80vh" }} zoom={2} center={[20, 100]}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    {
                                        store.currentMap ? renderedMap : <div></div>
                                    }
                                </MapContainer>
                            </Box>

                        </Box>
                    </Grid>

                    <Grid item xs={3}
                        style={{
                            paddingRight: '1%',
                            top: '50px',
                            height: '90px'
                            // overflowY: 'auto',
                        }}
                    >
                        <Comment />
                    </Grid>

                </Grid>
            </div >
    }
    return (

        mapViewMenu

    );
}