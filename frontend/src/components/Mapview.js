import { useContext, useState, useEffect, useRef } from 'react';

import { GlobalStoreContext } from '../store'

import { Box, Grid } from '@mui/material';

import Comment from './Comment';

import Recenter from './Recenter'
import { MapContainer, GeoJSON, Marker, Tooltip } from 'react-leaflet';
// TileLayer

export default function Mapview() {
    const { store } = useContext(GlobalStoreContext);
    const [background, setBackground] = useState("#AAD3DF");
    const [containerKey, setContainerKey] = useState(0);
    const [legendItems, setLegendItems] = useState([]);
    const [mapName, setMapName] = useState("");
    const [bounds, setBounds] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null)
    const [listOfProperties, setListOfProperties] = useState({});
    
    const geoJsonLayer = useRef(null);
    
    useEffect(() => {
        console.log('State variable changed:', geoJsonLayer.current);
        if (geoJsonLayer && geoJsonLayer.current) {
        if (geoJsonLayer.current.getBounds() !== null) {
            setBounds(geoJsonLayer.current.getBounds())
        }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.currentMap]);

    useEffect(() => {
        console.log('State variable changed:', store.currentMap);
        if (store.currentMap && store.currentMap.dataFromMap.background) {
            setBackground(store.currentMap.dataFromMap.background);
            setContainerKey((prevKey) => prevKey + 1);
            setMapName(store.currentMap.name)
        }
        if (store.currentMap && store.currentMap.dataFromMap.features) {
            const uniqueFillColors = new Set();
            const items = [];

            store.currentMap.dataFromMap.features.forEach((feature) => {
                const fillColor = feature.properties.fillColor;
                if (!uniqueFillColors.has(fillColor)) {
                    uniqueFillColors.add(fillColor);
                    items.push({
                        color: fillColor,
                        label: feature.properties.label,
                    });
                }
            });
            setMapName(store.currentMap.name)
            setLegendItems(items);
        }
    }, [store.currentMap]);

    useEffect(() => {
        if (selectedFeature) {
          setListOfProperties(selectedFeature.feature.properties)
        } else {
          setListOfProperties({});
        }
      }, [selectedFeature]);

    let myLegend = (
        <div className="legend">
            {legendItems.map((item, index) => (
                <div key={index} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                    {item.isEditing ? (
                        <input
                            type="text"
                            value={item.label}
                            // onChange={(event) => handleLabelChange(event, index)}
                            // onBlur={() => handleLabelBlur(index)}
                            autoFocus
                        />
                    ) : (
                        <span className="legend-label">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );

    let propertyElement = (<ul>{
        Object.entries(listOfProperties).map(([property, value]) => {
          if(property !== 'admin' && property !== 'fillColor' && property !== 'borderColor' && property !== 'label'){
            return <li key={property}>{property}: {value}</li>
          } else {
            return null;
          }
        })
      }
      </ul>
    )

    function styleMap(feature) {
        return {
            fillColor: feature.properties.fillColor || "#ff0000",
            fillOpacity: 1,
            color: feature.properties.borderColor || "#000000",
            weight: 2,
        }
    }

    function clickFeature(event) {
        setSelectedFeature(event.target)
    }

    function onEachCountry(country, layer) {
        layer.on({
            click: clickFeature,
        });
        let popupContent = `${country.properties.admin}`;
        if (country.properties && country.properties.popupContent) {
            popupContent += country.properties.popupCoSntent;
        }

        layer.bindPopup(popupContent);
    };

    const renderedMap = (
        <GeoJSON
            ref={geoJsonLayer}
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
                <div id="map-statusbar">
                {
                    mapName
                }
                </div>
            </Box>

            <Box id="mapBox" component="form" style={{ height: "80vh", backgroundColor: background }} noValidate >
                <MapContainer id="mapContainer" style={{ height: "80vh", backgroundColor: background }} key={containerKey} center={[20, 100]} zoom={2}>
                <Recenter bounds={bounds} />
                    {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
                    {
                        store.currentMap ? renderedMap : <div></div>
                    }
                    {myLegend}
                </MapContainer>

                <Box>
                <header>
                    <h2 id='propertiesText'>Current Region's Properties:</h2>
                </header>
                <Box id="boxOfProperties" sx={{ overflowY: "scroll", height: "150px", border: 1 }}>
                    {propertyElement}
                </Box>
            </Box>
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
                <div id="map-statusbar">
                {
                    mapName
                }
                </div>
            </Box>
                            <Box id="mapBox" style={{ height: "80vh", backgroundColor: background }} noValidate >
                                <MapContainer style={{ height: "80vh", backgroundColor: background }} key={containerKey} center={[20, 100]} zoom={2}>
                                    <Recenter bounds={bounds} />
                                    {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
                                    {
                                        store.currentMap ? renderedMap : <div></div>
                                    }
                                    {myLegend}
                                </MapContainer>

                                <Box>
                                    <header>
                                        <h2 id='propertiesText'>Current Region's Properties:</h2>
                                    </header>
                                    <Box id="boxOfProperties" sx={{ overflowY: "scroll", height: "150px", border: 1 }}>
                                        {propertyElement}
                                    </Box>
                                </Box>
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