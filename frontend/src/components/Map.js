import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { GlobalStoreContext } from '../store'

import { styled } from '@mui/material/styles';
import { Box, InputLabel, MenuItem, FormControl, Select, Button, Modal, Typography, Grid, TextField, IconButton } from '@mui/material';
import { Explore, Save, Undo, Redo, Compress, GridView, Merge, 
  ColorLens, FormatColorFill, BorderColor, EmojiFlags, Create, Title } from '@mui/icons-material/';

import Statusbar from './Statusbar';

import "leaflet/dist/leaflet.css";
import { MapContainer, GeoJSON, TileLayer, FeatureGroup, Polygon } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import * as turf from '@turf/turf';
import html2canvas from 'html2canvas';

// import { featureCollection, bbox, point } from '@turf/turf';
let MapLayOutFLAG = 0;

export default function Map() {
  const { store } = useContext(GlobalStoreContext);
  const [color, setColor] = useState("#ffff00");
  const [font, setFont] = React.useState("Arial");
  const navigate = useNavigate();
  const featureGroupRef = React.useRef();
  const [center] = useState([20, 100]);
  //for new map editing
  const newMap = JSON.parse(JSON.stringify(store.currentMap.dataFromMap));

  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    console.log('State variable changed:', store.currentMap);
  }, [store.currentMap]);

  useEffect(() => {
    store.subregion ? setOldName(store.subregion.properties.sovereignt) : setOldName("")
    setNewName("")
  }, [store.subregion]);

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

  // function findCenter() {
  //   console.log('Component mounted');
  //   console.log(store.currentMap)
  //   // handleSaveMap();
  //   let centerPoint = [20,100]
  //   if(store.currentMap){
  //     const [minX, minY, maxX, maxY] = bbox(store.currentMap.dataFromMap);
  //     centerPoint = [(minX + maxX) / 2, (minY + maxY) / 2];
  //     console.log(centerPoint);
  //   }
  //   setCenter(centerPoint)
  //   return centerPoint
  // }

  const handleChange = (event) => {
    setFont(event.target.value);
  };

  function handleConfirmRename() {
    store.changeSubregionName(newName);
    setMaplayout(newMap ? renderedMap : <div></div>)
  }

  function handleCloseModal(event) {
      store.hideModals();
      setMaplayout(newMap ? renderedMap : <div></div>)
  }

  function handleUpdateName(event) {
      setNewName(event.target.value)
  }

  let modal = <Modal
  open={store.currentModal === "RENAME_SUBREGION"}
>
  <Grid container sx={style}>
      <Grid container item >
          <Box sx={top}>
              <Typography id="modal-heading">Rename Subregion</Typography>
          </Box>
      </Grid>
      <Grid container item>
          <Box>
              <Typography id="modal-text" xs={4}>Name: </Typography>
              <TextField id="modal-textfield" xs={12} 
                  placeholder={oldName} value={newName} onChange={handleUpdateName}></TextField>
          </Box>
      </Grid>
      <Grid container item sx={buttonBox}>
          <Button id="modal-button" onClick={handleConfirmRename}>Confirm</Button>
          <Button id="modal-button" onClick={handleCloseModal}>Cancel</Button>
      </Grid>
  </Grid>
</Modal>

  let StyledIconButton = styled(IconButton)({
    color: "black",
    '&:hover': {
      opacity: 1,
      transition: "color 0.7s, transform 0.7s",
      transform: 'scale(1.1)',
      color: '#FDE66B'
    }
  });

  const countryStyle = {
    fillColor: "red",
    fillOpacity: 1,
    color: "black",
    weight: 2,
  };

  function handlePublishMap() {
    let newMap = store.currentMap;
    console.log("TRYNNA PUBLISH AS THIS NEW MAP!", newMap);
    newMap.publish.isPublished = true;
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    newMap.publish.publishedDate = today;
    store.currentMap = newMap;

    store.updateMap(newMap);
    navigate("/home");
  }

  function handleUndo() {
    store.undo();
   
    if (MapLayOutFLAG === 1) {
      MapLayOutFLAG = 1
      setMaplayout(<FeatureGroup ref={featureGroupRef}  >
        {newMap && newMap.features.map((feature, index) => {
          if (feature.geometry.type === 'Polygon') {
            return <Polygon key={index} positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} />;
          } else if (feature.geometry.type === 'MultiPolygon') {
            const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
              <Polygon key={polygonIndex} positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} />
            ));
            return polygons;
          }
          return null;
        })}
        <EditControl
          position='topright'
          onEdited={handleEditable}
        />
      </FeatureGroup>)
    } else {
      MapLayOutFLAG = 0
      setMaplayout(newMap ? renderedMap : <div></div>)
    }
  }

  function handleRedo() {
    store.redo();

    if (MapLayOutFLAG === 1) {
      MapLayOutFLAG = 1
      setMaplayout(<FeatureGroup ref={featureGroupRef}  >
        {newMap && newMap.features.map((feature, index) => {
          if (feature.geometry.type === 'Polygon') {
            return <Polygon key={index} positions={feature.geometry.coordinates[0]} myCustomKeyProp={feature.properties.admin} />;
          } else if (feature.geometry.type === 'MultiPolygon') {
            const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
              <Polygon key={polygonIndex} positions={polygonCoords[0]} myCustomKeyProp={feature.properties.admin + "-" + polygonIndex} />
            ));
            return polygons;
          }
          return null;
        })}
        <EditControl
          position='topright'
          onEdited={handleEditable}
        />
      </FeatureGroup>)
    } else {
      MapLayOutFLAG = 0
      setMaplayout(newMap ? renderedMap : <div></div>)
    }
  }

  async function handleSaveMap() {
    // const element = featureGroupRef.current;
    // const canvas = await html2canvas(element);

    // const data = canvas.toDataURL('image/jpg');
    // const link = document.createElement('a');

    // if (typeof link.download === 'string') {
    //   link.href = data;
    //   link.download = 'image.jpg';

    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // } else {
    //   window.open(data);
    // }
    /////////////////////
    let mapContainer = document.getElementById("mapContainer");
    // let renderingArea = document.getElementById("renderingArea");
    html2canvas(mapContainer, {
      useCORS: true,
      width: mapContainer.offsetWidth,
      height: mapContainer.offsetHeight,
    }).then(function (canvas) {
      const imageData = canvas.toDataURL()
      store.currentMap.image = imageData;
      store.updateCurrentMap();

      // renderingArea.appendChild(canvas);
    });

  }

  function changeCountryColor(event) {
    event.target.setStyle({
      color: "#000000",
      fillColor: "#64ec4c",
      fillOpacity: 1,
    });
  };

  function markSubregion(event) { // for name change
    setMaplayout(<div></div>)
    store.markSubregion(event.target.feature)
  }

  const onEachCountry = (country, layer) => {
    // layer.options.fillOpacity = Math.random();

    layer.on({
      click: changeCountryColor,
      dblclick: markSubregion,
    });

    let popupContent = country.properties.sovereignt;
    if (country.properties && country.properties.popupContent) {
      popupContent += country.properties.popupContent;
    }
    layer.bindPopup(popupContent);
  };

  function colorChange(event) {
    setColor(event.target.value);
  };

  newMap.features.forEach((feature, index) => {
    newMap.features[index] = turf.flip(feature);
  });

  let renderedMap = <GeoJSON
    style={countryStyle}
    data={store.currentMap ? store.currentMap.dataFromMap.features : null}
    //data={newMap ? newMap.features : null}
    onEachFeature={onEachCountry}
  />

  const [maplayout, setMaplayout] = useState(newMap ? renderedMap : <div></div>);

  const handleNavigate = (e) => {
    if (MapLayOutFLAG !== 1) {
      MapLayOutFLAG = 1
      setMaplayout(<FeatureGroup ref={featureGroupRef}  >
        {newMap && newMap.features.map((feature, index) => {
          if (feature.geometry.type === 'Polygon') {
            return <Polygon key={index} positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} />;
          } else if (feature.geometry.type === 'MultiPolygon') {
            const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
              <Polygon key={polygonIndex} positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} />
            ));
            return polygons;
          }
          return null;
        })}
        <EditControl
          position='topright'
          onEdited={handleEditable}
        />
      </FeatureGroup>)
    } else {
      MapLayOutFLAG = 0
      setMaplayout(newMap ? renderedMap : <div></div>)
    }
  };

  const handleEditable = (e) => {
    //const layers = e.layers;
    //layers.eachLayer(layer => { //ignore dis 4 now .3.

    let editedLayer = e.layers.getLayers()[0];
    //console.log(editedLayer);
    const editedKey = editedLayer.options.myCustomKeyProp; //gets the special key attached to each <Polygon> to see what country the Poly belongs to in the GEOJSON file
    //layer = turf.flip(layer.toGeoJSON()); //we need to flip the [long, lat] coordinates to [lat, long] FIRST, cause it wont render properly. then convert the layer to a geojson object

    let layer = editedLayer.toGeoJSON();
    // store.currentMap.dataFromMap.features.forEach((feature) => { //loop through the features of the store.currentMap to find the feature that is edited
    //   if (editedKey.includes('-')) { //if a '-' is included, this means its a multipolygon -3- 
    //     const parts = editedKey.split("-"); //parts = ["CountryName", "index_location_of_multipolygon"]
    //     if (feature.properties.admin === parts[0]) { //if the country name matches the custom key, this is the feature we are editing
    //       let copiedFeature = JSON.parse(JSON.stringify(feature));
    //       store.editCurrentMapVertex(editedKey, layer, copiedFeature);
    //     }
    //   } else { //if NO '-' than this means its a Polygon
    //     if (feature.properties.admin === editedKey) { //if the country name matches the custom key, this is the feature we are editing
    //       let copiedFeature = JSON.parse(JSON.stringify(feature));
    //       store.editCurrentMapVertex(editedKey, layer, copiedFeature);
    //     }
    //   }

    if (editedKey.includes('-')) { //if a '-' is included, this means its a multipolygon -3- 
      const parts = editedKey.split("-"); //parts = ["CountryName", "index_location_of_multipolygon"]
        let featureFound = store.currentMap.dataFromMap.features[parts[0]]
        let copiedFeature = JSON.parse(JSON.stringify(featureFound));
        store.editCurrentMapVertex(editedKey, layer, copiedFeature);
    } else { //if NO '-' than this means its a Polygon
        let featureFound = store.currentMap.dataFromMap.features[editedKey]
        let copiedFeature = JSON.parse(JSON.stringify(featureFound));
        store.editCurrentMapVertex(editedKey, layer, copiedFeature);
    }

      //ignore this is before undo/redo:
      // if(editedKey.includes('-')){ //if a '-' is included, this means its a multipolygon -3- 
      //   const parts = editedKey.split("-"); //parts = ["CountryName", "index_location_of_multipolygon"]
      //   if(feature.properties.admin === parts[0]){ //if the country name matches the custom key, this is the feature we are editing
      //     for(let i = 0; i < feature.geometry.coordinates.length; i++) { //loop thru the feature's coordinates until we find the correct polygon in the array of the multipolygon's coordinates
      //       if(i === parseInt(parts[1])){ //see if the index of the feature is equal to "index_location_of_multipolygon"
      //         feature.geometry.coordinates[i] = layer.geometry.coordinates //set the entire array of new coordinates to the original feature's coordinates so now its fully updated for the specific polygon in the MultiPolygon
      //       }
      //     }        
      //   }
      // } else { //if NO '-' than this means its a Polygon
      //   if(feature.properties.admin === editedKey){ //if the country name matches the custom key, this is the feature we are editing
      //     feature.geometry.coordinates = layer.geometry.coordinates //set the entire array of new coordinates to the original feature's coordinates so now its fully updated for the one Polygon       
      //   }
      // }
    //});

    //store.editMapVertex(store.currentMap); //Finally, once the map is updated, we set it to the store so that its rerendered
    //});
  };

  return (
    <Box sx={{ flexGrow: 1 }} id="homePageBackground">

      <Box id="editBox">
        <p id='map-edit-title'>Edit Panel</p>
        <div id="edit-line"></div>
        <Box id="editPanel">
          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
          >
            <Explore style={{ fontSize: "45px" }} titleAccess="Navigate" onClick={handleNavigate} />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
            onClick={() => handleSaveMap()}
          >
            <Save style={{ fontSize: "45px" }} titleAccess="Save" />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
          >
            <Undo style={{ fontSize: "45px" }} titleAccess="Undo" onClick={handleUndo} />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
          >
            <Redo style={{ fontSize: "45px" }} titleAccess="Redo" onClick={handleRedo} />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
          >
            <Compress style={{ fontSize: "45px" }} titleAccess="Compress" />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
          >
            <GridView style={{ fontSize: "45px" }} titleAccess="Split" />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
          >
            <Merge style={{ fontSize: "45px" }} titleAccess="Merge" />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
          >
            <ColorLens style={{ fontSize: "45px" }} titleAccess="Color Subregion" />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
          >
            <FormatColorFill style={{ fontSize: "45px" }} titleAccess="Color Background" />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
          >
            <BorderColor style={{ fontSize: "45px" }} titleAccess="Color Border" />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
          >
            <EmojiFlags style={{ fontSize: "45px" }} titleAccess="Edit Legends" />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
          >
            <Create style={{ fontSize: "45px" }} titleAccess="Edit Text" />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ marginBottom: "10px" }}
          >
            <Title style={{ fontSize: "45px", float: "left" }} titleAccess="Insert Text" />
          </StyledIconButton>
        </Box>
        <div id="edit-line2"></div>
        <br />
        <FormControl variant="standard" sx={{
          m: 1,
          minWidth: 120,
          '& > :not(style)': { backgroundColor: "#D9D9D9", marginTop: '0.75%' },
          "& .css-m5hdmq-MuiInputBase-root-MuiInput-root-MuiSelect-root:after": {
            borderColor: '#FDE66B'
          },
          "& label.Mui-focused": {
            color: '#756060' //purple
          },
        }}>
          <InputLabel id="demo-simple-select-standard-label">Font</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={font}
            onChange={handleChange}
            label="Font"
            defaultValue={font}
          >
            <MenuItem value={"Arial"}>Arial</MenuItem>
            <MenuItem value={"New Times Roman"}>New Times Roman</MenuItem>
            <MenuItem value={"Comic Sans"}>Comic Sans</MenuItem>
          </Select>
        </FormControl>
        <div id="edit-line3"></div>
        <br />
        <Button id="publishButton"
          type="submit"
          sx={{ textTransform: `none` }}
          onClick={() => handlePublishMap()}
        >
          <p id="text">Publish</p>
        </Button>
      </Box>

      <Box id="statusBoxEdit">
        <Statusbar />
      </Box>

      <Box id="mapBoxEdit" component="form" noValidate >
        <div id="mapContainer">
          <MapContainer style={{ height: "80vh" }} zoom={2} center={center}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {maplayout}
          </MapContainer>
        </div>
        <input
          type="color"
          value={color}
          onChange={colorChange}
        />
      </Box>
      {/* <div id="renderingArea"></div> */}
      {modal}
    </Box>
  );
}

// export default Map;