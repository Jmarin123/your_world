import { useContext, useState, useEffect } from 'react';

import { GlobalStoreContext } from '../store'

import { Box, Grid } from '@mui/material';

import Comment from './Comment';
import Statusbar from './Statusbar';

import { MapContainer, GeoJSON, Marker, Tooltip } from 'react-leaflet';
// TileLayer

export default function Mapview() {
    const { store } = useContext(GlobalStoreContext);
    const [background, setBackground] = useState("#AAD3DF");
    const [containerKey, setContainerKey] = useState(0);

    useEffect(() => {
        console.log('State variable changed:', store.currentMap);
        if(store.currentMap && store.currentMap.dataFromMap.background){
            setBackground(store.currentMap.dataFromMap.background)
            setContainerKey(containerKey+1)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.currentMap]);
    
    function styleMap(feature){
        return {
          fillColor: feature.properties.fillColor || "#ff0000",
          fillOpacity: 1,
          color: feature.properties.borderColor || "#000000",
          weight: 2,
        }
      }

    function onEachCountry(country, layer) {
        let popupContent = `${country.properties.admin}`;
        if (country.properties && country.properties.popupContent) {
            popupContent += country.properties.popupContent;
        }

        layer.bindPopup(popupContent);
    };

    const renderedMap = (
        <GeoJSON
            style={styleMap}
            data={store.currentMap ? store.currentMap.dataFromMap.features : null}
            onEachFeature={onEachCountry}
        >
            {store.currentMap &&
                store.currentMap.markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={[marker.lat, marker.lng]}
                        // icon={circleIcon}
                        opacity={0}
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
                                readOnly
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
                <MapContainer id="mapContainer" style={{ height: "80vh", backgroundColor: background }} key={containerKey} zoom={2} center={[20, 100]}>
                    {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
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
                                <MapContainer id="mapContainer" style={{ height: "80vh", backgroundColor: background }} zoom={2} center={[20, 100]}>
                                    {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
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