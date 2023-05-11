import { useContext } from 'react';

import { GlobalStoreContext } from '../store'

import { Box, Grid } from '@mui/material';

import Comment from './Comment';
import Statusbar from './Statusbar';

import { MapContainer, GeoJSON, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

export default function Mapview() {
    const { store } = useContext(GlobalStoreContext);
    console.log(store.openComment);

    const countryStyle = {
        fillColor: "red",
        fillOpacity: 1,
        color: "black",
        weight: 2,
    };

    const circleIcon = L.divIcon({
        className: "circle-icon",
        iconSize: [12, 12],
    });

    function onEachCountry(country, layer) {


        let popupContent = `${country.properties.admin}`;
        if (country.properties && country.properties.popupContent) {
            popupContent += country.properties.popupContent;
        }

        layer.bindPopup(popupContent);
    };

    const renderedMap = (
        <GeoJSON
            style={countryStyle}
            data={store.currentMap ? store.currentMap.dataFromMap.features : null}
            onEachFeature={onEachCountry}
        >
            {store.currentMap &&
                store.currentMap.markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={[marker.lat, marker.lng]}
                        icon={circleIcon}
                    >

                        <Tooltip
                            permanent
                            interactive
                            direction="right"
                            offset={[0, 0]}
                            opacity={1}
                            className="custom-tooltip"
                        >
                            <input
                                type="text"
                                defaultValue={marker.value}
                                style={{ fontFamily: marker.font }}
                                className="transparent-input"
                            />
                        </Tooltip>
                    </Marker>
                ))}
        </GeoJSON>
    );



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