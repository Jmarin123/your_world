import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { GlobalStoreContext } from '../store'

import { styled } from '@mui/material/styles';
import { RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { Box, InputLabel, MenuItem, FormControl, Select, Button, Modal, Typography, Grid, TextField, IconButton } from '@mui/material';
import {
  Explore, Save, Undo, Redo, Compress, GridView, Merge,
  ColorLens, FormatColorFill, BorderColor, EmojiFlags, Create, Title
} from '@mui/icons-material/';

import Statusbar from './Statusbar';
import Recenter from './Recenter'
import Screenshot from './Screenshot'

import "leaflet/dist/leaflet.css";
import { MapContainer, GeoJSON, TileLayer, FeatureGroup, Polygon } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import * as turf from '@turf/turf';

let mergeFLAG = 0;
let colorFill = "#4CBB17";
let mergeFeatureFlag = null

export default function Map() {
  const { store } = useContext(GlobalStoreContext);
  const [font, setFont] = React.useState("Arial");
  const navigate = useNavigate();
  const [center, setCenter] = useState({ lat: 20, lng: 100 });
  let newMap = JSON.parse(JSON.stringify(store.currentMap.dataFromMap));
  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");
  const [undoFlag, setUndoFlag] = useState(true);
  const [MapLayOutFLAG, setMapLayOutFLAG] = useState(0);
  const [compressionStatus, setCompressionStatus] = useState('normal');
  const [compressValue, setCompressValue] = useState(0)

  const [mergeFeature, setMergeFeature] = useState(null);
  const [mergeFeature_1, setMergeFeature_1] = useState(null);
  const [mergedFlag, setMergedFlag] = useState(false);

  const geoJsonLayer = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null)

  useEffect(() => {
    console.log('State variable changed:', store.currentMap);
    let newCenter = (turf.center(store.currentMap.dataFromMap)).geometry.coordinates
    let newCenterObject = { lat: newCenter[1], lng: newCenter[0] }
    setCenter(newCenterObject)
  }, [store.currentMap]);

  useEffect(() => {
    store.subregion ? setOldName(store.subregion.properties.sovereignt) : setOldName("")
    setNewName("")
  }, [store.subregion]);;

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

  const styleCompress = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 423,
    height: 400,
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

  const handleChange = (event) => {
    setFont(event.target.value);
  };

  //RENAME SUBREGION MODAL AND FUNCTIONS ---------------------------------->START
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
  //RENAME SUBREGION MODAL AND FUNCTIONS------------------------------------------------------>END

  //PERMANENTLY CHANGE MAP COMPRESSION MODAL AND FUNCTIONS------------------>START
  const handleRadioChange = (event) => {
    setCompressionStatus(event.target.value);
  };
  let compressModal = <Modal
    open={store.currentModal === "COMPRESS_MAP"}
  >
    <Grid container sx={styleCompress}>
      <Grid container item >
        <Box sx={top}>
          <Typography id="modal-heading">Compress Map</Typography>
        </Box>
      </Grid>
      <Grid container item>
        <Box>
          <Typography id="modal-text" xs={4} sx={{ textAlign: `center` }}>Are you sure you want to permanently compress your Map?</Typography>
          <Typography id="modal-text" xs={4}>*Once you confirm your changes, you cannot undo it, changes are permanet!</Typography>
          <RadioGroup row value={compressionStatus} onChange={handleRadioChange} sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center' }}>
              <FormControlLabel value="normal" control={<Radio />} label="Normal" labelPlacement="bottom" />
              <FormControlLabel
                value="medium_compressed"
                control={<Radio />}
                label="medium"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="fully_compressed"
                control={<Radio />}
                label="fully"
                labelPlacement="bottom"
              />
            </Box>
          </RadioGroup>
        </Box>
      </Grid>
      <Grid container item sx={buttonBox}>
        <Button id="modal-button" onClick={handleConfirmCompress}>Confirm</Button>
        <Button id="modal-button" onClick={handleCloseCompressModal}>Cancel</Button>
      </Grid>
    </Grid>
  </Modal>
  function handleCloseCompressModal() {
    store.hideModals();
    setMaplayout(newMap ? renderedMap : <div></div>)
  }
  function handleConfirmCompress() {
    if (compressionStatus === "normal") {
      setCompressValue(0)
    } else if (compressionStatus === "medium_compressed") {
      setCompressValue(0.5)
    } else {
      setCompressValue(1)
    }
    store.hideModals();
    //setMaplayout(newMap ? renderedMap : <div></div>)
    //compressFlag = true
    store.compressMap();
  }
  function markCompression() {
    if (!store.compressStatus) {
      setMaplayout(<div></div>)
      store.markCompression()
    }
  }
  //PERMANENTLY CHANGE MAP COMPRESSION MODAL AND FUNCTIONS----------------------------------------->END

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
    setUndoFlag(!undoFlag)
  }

  function handleRedo() {
    store.redo();
    setUndoFlag(!undoFlag)
  }

  async function handleSaveMap() {
    store.updateThumbnail()
  }

  function clickFeature(event) {
    console.log("HEY IT CLICKED HERE");
    console.log(event.target);
    if (mergeFLAG) { // Merge active. Mark region if first, and merge if second. 
      event.target.setStyle({
        color: "#000000",
        fillColor: "#FDE66B",
        fillOpacity: 1,
      });

      if (mergeFeatureFlag === null) {
        setMergeFeature(event.target)
        mergeFeatureFlag = event.target
      }
      else {
        setMergeFeature_1(event.target)
      }

    }
    else { // Merge inactive
      setSelectedFeature(event.target)
    }
  };

  function markSubregion(event) { // for name change
    setMaplayout(<div></div>)
    store.markSubregion(event.target.feature)
  }
  const onEachCountry = (country, layer) => {
    layer.on({
      click: clickFeature,
      dblclick: markSubregion,
    });
    let popupContent = `${country.properties.sovereignt}`;
    if (country.properties && country.properties.popupContent) {
      popupContent += country.properties.popupContent;
    }
    layer.bindPopup(popupContent);
  };
  function colorChange(event) {
    //setColor(event.target.value);
    colorFill = event.target.value
  };

  newMap.features.forEach((feature, index) => {
    newMap.features[index] = turf.flip(feature);
  });

  let renderedMap = <GeoJSON
    ref={geoJsonLayer}
    style={countryStyle}
    data={store.currentMap ? store.currentMap.dataFromMap.features : null}
    onEachFeature={onEachCountry}
  />

  const [maplayout, setMaplayout] = useState(newMap ? renderedMap : <div></div>);

  //THIS IS FOR UNDO/REDO UPDATING
  useEffect(() => {
    console.log("Maplayout changed")
    setMaplayout(<FeatureGroup>
      {newMap && newMap.features.map((feature, index) => {
        if (feature.geometry.type === 'Polygon') {
          return <Polygon key={index} positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} polyName={feature.properties.admin} />;
        } else if (feature.geometry.type === 'MultiPolygon') {
          const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
            <Polygon key={polygonIndex} positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} polyName={feature.properties.admin} />
          ));
          return polygons;
        }
        return null;
      })}
      <EditControl
        position='topright'
        onEdited={handleEditable}
        onDeleted={_onDelete}
      />
    </FeatureGroup>)
    setMapLayOutFLAG(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undoFlag]);

  //THIS IS FOR MAP MODE SWITCHING AKA NAVIGATION
  useEffect(() => {
    if (MapLayOutFLAG === 1) {
      //var options = {tolerance: compressValue, highQuality: false};
      //var simplifiedMap = turf.simplify(newMap, options);
      setMaplayout(<FeatureGroup>
        {newMap && newMap.features.map((feature, index) => {
          if (feature.geometry.type === 'Polygon') {
            return <Polygon key={index} positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} polyName={feature.properties.admin} />;
          } else if (feature.geometry.type === 'MultiPolygon') {
            const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
              <Polygon key={polygonIndex} positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} polyName={feature.properties.admin} />
            ));
            return polygons;
          }
          return null;
        })}
        <EditControl
          position='topright'
          onEdited={handleEditable}
          onDeleted={_onDelete}
        />
      </FeatureGroup>)
    } else {
      setMaplayout(newMap ? renderedMap : <div></div>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MapLayOutFLAG]);

  //THIS IS FOR MAP COMPRESSION
  useEffect(() => {
    let options = { tolerance: compressValue, highQuality: false };
    // eslint-disable-next-line
    newMap = turf.simplify(newMap, options);
    //setNewMap(turf.simplify(newMap, options));
    store.currentMap.dataFromMap = turf.simplify(store.currentMap.dataFromMap, options)
    setMaplayout(<FeatureGroup >
      {newMap && newMap.features.map((feature, index) => {
        if (feature.geometry.type === 'Polygon') {
          return <Polygon key={index} positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} polyName={feature.properties.admin} />;
        } else if (feature.geometry.type === 'MultiPolygon') {
          const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
            <Polygon key={polygonIndex} positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} polyName={feature.properties.admin} />
          ));
          return polygons;
        }
        return null;
      })}
      <EditControl
        position='topright'
        onEdited={handleEditable}
        onDeleted={_onDelete}
      />
    </FeatureGroup>)
    setMapLayOutFLAG(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compressValue]);


  const handleNavigate = (e) => {
    if (MapLayOutFLAG !== 1) {
      setMapLayOutFLAG(1)
    } else {
      setMapLayOutFLAG(0)
    }
  };

  function handleMerge(event) {
    if (MapLayOutFLAG !== 1) {
      if (mergeFLAG > 0 && mergeFeature && mergeFeature_1) {
        setMergedFlag(true)

        let union = turf.union(mergeFeature.feature, mergeFeature_1.feature);

        store.currentMap.dataFromMap.features.forEach((feature, index) => {
          if (store.currentMap.dataFromMap.features[index].properties.admin === mergeFeature.feature.properties.admin) {
            union.properties = JSON.parse(JSON.stringify(store.currentMap.dataFromMap.features[index].properties));
            store.currentMap.dataFromMap.features[index] = union
            console.log("Index is: " + index)
          }
        });

        store.currentMap.dataFromMap.features.forEach((feature, index) => {
          if (store.currentMap.dataFromMap.features[index].properties.admin === mergeFeature_1.feature.properties.admin) {
            (store.currentMap.dataFromMap.features).splice(index, 1)
          }
        });

        setMergeFeature(null)
        setMergeFeature_1(null)
        mergeFeatureFlag = null
        mergeFLAG = 0
      }
      else if (mergeFLAG) {
        setMergeFeature(null)
        setMergeFeature_1(null)
        mergeFeatureFlag = null
        mergeFLAG = 0
      }
      else {
        setSelectedFeature(null)
        mergeFLAG = 1
      }
    } else {
      // setMaplayout()
    }
  }

  // man.
  useEffect(() => {
    if (geoJsonLayer.current && mergedFlag) {
      setMergedFlag(false)
      geoJsonLayer.current.clearLayers().addData(store.currentMap.dataFromMap.features);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMap]);

  useEffect(() => {
    if (geoJsonLayer.current) {
      geoJsonLayer.current.resetStyle()
    }
    if (selectedFeature) {
      selectedFeature.setStyle({
        fillColor: colorFill
      })
    }
  }, [selectedFeature]);

  function _onDelete(e) {
    const layers = e.layers;
    layers.eachLayer(layer => {
      const editedKey = layer.options.myCustomKeyProp;
      let newFeature = layer.toGeoJSON();
      const editedName = layer.options.polyName

      if (editedKey.includes('-')) { //if a '-' is included, this means its a multipolygon -3- 
        //const parts = editedKey.split("-"); //parts = ["index of subregion", "index of subregion in multipolygon"]
        //let index = parseInt(parts[0]);
        //let index2 = parseInt(parts[1]);
        //if((index < lengthOfMap)){
        for (let i = 0; i < store.currentMap.dataFromMap.features.length; i++) {
          if (editedName === store.currentMap.dataFromMap.features[i].properties.admin) {
            let featureFound = store.currentMap.dataFromMap.features[i]
            for (let j = 0; j < featureFound.geometry.coordinates.length; j++) {

              let oldFeature = JSON.parse(JSON.stringify(featureFound));

              let polygon1 = turf.polygon(newFeature.geometry.coordinates);
              let polygon2 = turf.polygon(oldFeature.geometry.coordinates[j]);
              const polygonRounded = turf.truncate(polygon1, { precision: 3 });
              const polygonRounded2 = turf.truncate(polygon2, { precision: 3 });

              if (turf.booleanEqual(polygonRounded, polygonRounded2)) {
                //store.editCurrentMapVertex(editedKey, newFeature.geometry.coordinates, oldFeature.geometry.coordinates);
                console.log("we deleted the multipolygon feature!")
                store.currentMap.dataFromMap.features[i].geometry.coordinates.splice(j, 1);
                store.deleteSubregion();
                break;
              }
            }
          }
        }
      } else { //if NO '-' than this means its a Polygon
        //if((editedKey < lengthOfMap)){
        for (let i = 0; i < store.currentMap.dataFromMap.features.length; i++) {
          if (editedName === store.currentMap.dataFromMap.features[i].properties.admin) {

            let featureFound = store.currentMap.dataFromMap.features[i]
            let oldFeature = JSON.parse(JSON.stringify(featureFound)); //create a deep copy

            let polygon1 = turf.polygon(newFeature.geometry.coordinates);
            let polygon2 = turf.polygon(oldFeature.geometry.coordinates);

            if (turf.booleanEqual(polygon1, polygon2)) {
              console.log("we deleted the feature!")
              //store.editCurrentMapVertex(editedKey, newFeature.geometry.coordinates, oldFeature.geometry.coordinates);
              store.currentMap.dataFromMap.features.splice(i, 1);
              store.deleteSubregion();
              break;
            }
          }
        }
        //}
      }
    });
  }

  const handleEditable = (e) => {

    const layers = e.layers;
    layers.eachLayer(layer => { //ignore dis 4 now .3.

      //let editedLayer = e.layers.getLayers()[0];
      //const editedKey = layer.options.myCustomKeyProp; //gets the special key attached to each <Polygon> to see what country the Poly belongs to in the GEOJSON file
      //layer = turf.flip(layer.toGeoJSON()); //we need to flip the [long, lat] coordinates to [lat, long] FIRST, cause it wont render properly. then convert the layer to a geojson object


      const editedKey = layer.options.myCustomKeyProp;
      let newFeature = layer.toGeoJSON();

      if (editedKey.includes('-')) { //if a '-' is included, this means its a multipolygon -3- 
        const parts = editedKey.split("-"); //parts = ["index of subregion", "index of subregion in multipolygon"]
        let featureFound = store.currentMap.dataFromMap.features[parts[0]]
        let oldFeature = JSON.parse(JSON.stringify(featureFound));

        let polygon1 = turf.polygon(newFeature.geometry.coordinates);
        let polygon2 = turf.polygon(oldFeature.geometry.coordinates[parts[1]]);

        if (!turf.booleanEqual(polygon1, polygon2)) {
          store.editCurrentMapVertex(editedKey, newFeature.geometry.coordinates, oldFeature.geometry.coordinates);
        }
      } else { //if NO '-' than this means its a Polygon
        let featureFound = store.currentMap.dataFromMap.features[editedKey]
        let oldFeature = JSON.parse(JSON.stringify(featureFound)); //create a deep copy

        let polygon1 = turf.polygon(newFeature.geometry.coordinates);
        let polygon2 = turf.polygon(oldFeature.geometry.coordinates);

        if (!turf.booleanEqual(polygon1, polygon2)) {
          store.editCurrentMapVertex(editedKey, newFeature.geometry.coordinates, oldFeature.geometry.coordinates);
        }
      }
    });
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
            <Compress style={{ fontSize: "45px" }} titleAccess="Compress" onClick={markCompression} />
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
            <Merge style={{ fontSize: "45px" }} titleAccess="Merge" onClick={handleMerge} />
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
        <MapContainer style={{ height: "80vh" }} zoom={2} center={center} doubleClickZoom={false}>
          <Recenter lat={center.lat} lng={center.lng} />
          <Screenshot />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {maplayout}
        </MapContainer>
        <input
          type="color"
          value={colorFill}
          onChange={colorChange}
        />
      </Box>

      {modal}
      {compressModal}
      <textarea id="textarea" cols="30" rows="10" placeholder="write here..."></textarea>
    </Box>
  );
}