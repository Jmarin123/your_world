import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { GlobalStoreContext } from '../store'

import { styled } from '@mui/material/styles';
import { RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { Box, MenuItem, FormControl, Select, Button, Modal, Typography, Grid, TextField, IconButton } from '@mui/material';
import TouchAppSharpIcon from '@mui/icons-material/TouchAppSharp';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import {
  Explore, Save, Undo, Redo, Compress, GridView, Merge,
  ColorLens, FormatColorFill, BorderColor, Title,
} from '@mui/icons-material/';

import SaveAsOutlined from '@mui/icons-material/SaveAsOutlined';

import Recenter from './Recenter'
import Screenshot from './Screenshot'

import "leaflet/dist/leaflet.css";
import { MapContainer, GeoJSON, FeatureGroup, Polygon, TileLayer, Circle, Marker, Tooltip } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import * as turf from '@turf/turf';
import { ChromePicker } from 'react-color'

import L from 'leaflet';

let mergeFlag = 0;
let colorFlag = 0;
let borderFlag = 0;
// let backgroundFlag = 0;
let mergeFeatureFlag = null
let splitArray = [];

//GLOBAL VARIABLES FOR SELECTION A SUBREGION
let selectFeatureFlag = null
let selectHIGHLIGHTFLAG = 0;
let regionToEdit = null;
let drawFlag = true

//GLOBAL VARIABLES FOR MERGING TWO REGIONS
let firstMerge = null;
let secondMerge = null;

export default function Map() {
  const { store } = useContext(GlobalStoreContext);
  // const [font, setFont] = React.useState("Arial");
  const navigate = useNavigate();
  const [bounds, setBounds] = useState(null);
  let newMap = JSON.parse(JSON.stringify(store.currentMap.dataFromMap));
  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");
  const [propertyKey, setPropertyKey] = useState("");
  const [propertyValue, setProperyValue] = useState("");
  const [undoFlag, setUndoFlag] = useState(-1);
  const [MapLayOutFLAG, setMapLayOutFLAG] = useState(0);
  const [compressionStatus, setCompressionStatus] = useState('normal');
  const [compressValue, setCompressValue] = useState(-1)
  const [splitFlag, setSplitFlag] = useState(-1);

  const [mergeFeature, setMergeFeature] = useState(null);
  const [mergeFeature_1, setMergeFeature_1] = useState(null);
  const [mergedFlag, setMergedFlag] = useState(false);

  const [colorFill, setColorFill] = useState("#4CBB17");
  const [background, setBackground] = useState(newMap.background);
  const [containerKey, setContainerKey] = useState(0);

  const [selectSubregion, setSelectSubregion] = useState(null);
  const [selectFLAG, setSelectFLAG] = useState(0);

  const geoJsonLayer = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [listOfProperties, setListOfProperties] = useState({});
  
  const [tileLayerOn, setTileLayerOn] = useState(false);

  useEffect(() => {
    console.log('State variable changed:', store.currentMap);
    // let newCenter = (turf.center(store.currentMap.dataFromMap)).geometry.coordinates
    // let newCenterObject = { lat: newCenter[1], lng: newCenter[0] }
    // setCenter(newCenterObject)
    mergeFlag = 0;
    colorFlag = 0;
    borderFlag = 0;
    // backgroundFlag = 0;
    mergeFeatureFlag = null
    if (store.currentMap && store.currentMap.markers) {
      setMarkers(store.currentMap.markers);
    }
  }, [store.currentMap]);

  useEffect(() => {
    console.log('State variable changed:', geoJsonLayer.current);
    if (geoJsonLayer.current) {
      if (geoJsonLayer.current.getBounds() !== null) {
        setBounds(geoJsonLayer.current.getBounds())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoJsonLayer.current]);

  useEffect(() => {
    store.subregion ? setOldName(store.subregion.properties.admin) : setOldName("")
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

  const styleProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 600,
    bgcolor: '#ECF2FF',
    borderRadius: 1,
    boxShadow: 16,
    p: 4,
  };

  const removePropertyStyle = {
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    fontSize: "15px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "red",
    border: "none",
    outline: "none",
    cursor: "pointer",
    marginLeft: "auto",
    marginRight: "5px",
  }

  const top = {
    position: 'absolute',
    width: "100%",
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

  const addPropertyButtonStyle = {
    backgroundColor: "green",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 0px 5px black",
    cursor: "pointer",
    marginRight: "auto",
    marginLeft: "auto"
  };

  const plusSignStyle = {
    color: "black",
    fontSize: "30px",
    fontWeight: "bold",
    lineHeight: 0,
  };

  const buttonBox = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const handleToggleTileLayer = (index) => {
    setTileLayerOn(!tileLayerOn)
    if(tileLayerOn) {
      setToggleLayerButton(<MapRoundedIcon style={{ fontSize: "45px" }} titleAccess="Toggle Layer" />)
    } else {
      setToggleLayerButton(<MapRoundedIcon style={{ fontSize: "45px", color: "#FDE66B" }} titleAccess="Toggle Layer" />)
    }
  };


  // LEGEND-------------------------------------------------------------------->START
  const [legendItems, setLegendItems] = useState([]);
  console.log("store.legendColor", store.legendColor);
  useEffect(() => {
    if (store.currentMap && store.currentMap.dataFromMap && store.currentMap.dataFromMap.features) {
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

      setLegendItems(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.legendColor]);

  useEffect(() => {
    if (store.currentMap && store.currentMap.dataFromMap && store.currentMap.dataFromMap.features) {
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

      setLegendItems(items);
    }
  }, [store.currentMap]);

  const handleLabelDoubleClick = (index) => {
    const updatedItems = [...legendItems];
    const legendItem = updatedItems[index];
    legendItem.isEditing = true;

    setLegendItems(updatedItems);
  };

  const handleLabelChange = (event, index) => {
    const newLabel = event.target.value;

    setLegendItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].label = newLabel;

      // Update the feature.properties.label
      const { dataFromMap } = store.currentMap;

      const legendItem = updatedItems[index];
      // const feature = dataFromMap.features.find(
      //   (feature) => feature.properties.fillColor === legendItem.color
      // );

      // if (feature) {
      //   feature.properties.label = newLabel;
      // }

      dataFromMap.features.forEach((feature) => {
        if (feature.properties.fillColor === legendItem.color) {
          feature.properties.label = newLabel;
        }
      });

      return updatedItems;
    });
  };


  const handleLabelBlur = (index) => {
    const updatedItems = [...legendItems];
    const legendItem = updatedItems[index];
    legendItem.isEditing = false;

    setLegendItems(updatedItems);
  };

  let myLegend = (
    <div className="legend">
      {legendItems.map((item, index) => (
        <div key={index} className="legend-item">
          <span className="legend-color" style={{ backgroundColor: item.color }}></span>
          {item.isEditing ? (
            <input
              type="text"
              value={item.label}
              onChange={(event) => handleLabelChange(event, index)}
              onBlur={() => handleLabelBlur(index)}
              autoFocus
            />
          ) : (
            <span className="legend-label" onDoubleClick={() => handleLabelDoubleClick(index)}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );



  // LEGEND-------------------------------------------------------------------->END


  // TEXT MARKER-------------------------------------------------------------------->START
  const [markers, setMarkers] = useState([]);
  const [selectedFont, setSelectedFont] = useState('Arial, sans-serif');

  const fontOptions = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' },
    { label: 'Courier New', value: 'Courier New, monospace' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Impact', value: 'Impact, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
  ];

  const handleMarkerDragEnd = (markerIndex, event) => {
    const { lat, lng } = event.target.getLatLng();
    const updatedMarkers = [...markers];
    updatedMarkers[markerIndex] = { ...updatedMarkers[markerIndex], lat, lng };
    setMarkers(updatedMarkers);
  };

  const handleChangeFont = (event) => {
    const { value } = event.target;
    setSelectedFont(value);
  };

  const handleInputChange = (markerIndex, event) => {
    const { value } = event.target;
    const updatedMarkers = [...markers];
    updatedMarkers[markerIndex] = { ...updatedMarkers[markerIndex], value, font: selectedFont };
    setMarkers(updatedMarkers);
  };

  const handleAddMarker = () => {
    let newCoordinates = [];
    if (store.currentMap) {
      if (store.currentMap.dataFromMap.features[0].geometry.type === "MultiPolygon") {
        newCoordinates = [
          store.currentMap.dataFromMap.features[0].geometry.coordinates[0][0][0][1] + 1,
          store.currentMap.dataFromMap.features[0].geometry.coordinates[0][0][0][0] + 1,
        ];
      } else if (store.currentMap.dataFromMap.features[0].geometry.type === "Polygon") {
        newCoordinates = [
          store.currentMap.dataFromMap.features[0].geometry.coordinates[0][0][1] + 1,
          store.currentMap.dataFromMap.features[0].geometry.coordinates[0][0][0] + 1,
        ];
      }

    }
    const newMarker = { lat: newCoordinates[0], lng: newCoordinates[1], value: "" };
    setMarkers([...markers, newMarker]);
    // console.log(markers);
  };

  const handleSaveMarker = () => {
    console.log(markers);
    console.log(store.currentMap);
    // store.saveMarkers(markers);

    const updatedMarkers = markers.map(marker => ({
      lat: marker.lat,
      lng: marker.lng,
      value: marker.value,
      font: marker.font
    }));

    store.saveMarkers(updatedMarkers);
    store.setLegendColor();
  };

  const circleIcon = L.divIcon({
    className: "circle-icon",
    iconSize: [12, 12],
  });

  let textMarker = markers.map((marker, index) => (
    <Marker
      key={index}
      draggable={true}
      position={[marker.lat, marker.lng]}
      eventHandlers={{
        dragend: (event) => handleMarkerDragEnd(index, event),
      }}
      icon={circleIcon} // Use the custom circle icon
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
          value={marker.value}
          onChange={(event) => handleInputChange(index, event)}
          style={{ fontFamily: marker.font }}
          className="transparent-input"
        />
      </Tooltip>
    </Marker>
  ))

  // TEXT MARKER-------------------------------------------------------------------->END

  // COLORING -------------------------------------------------------------------->START

  function handleColorSubregion() {
    setSelectedFeature(null)
    setMergeFeature(null)
    setMergeFeature_1(null)
    mergeFlag = 0;
    borderFlag = 0;
    // backgroundFlag = 0;
    mergeFeatureFlag = null
    setMergeButton(<Merge style={{ fontSize: "45px" }} titleAccess="Merge" onClick={handleMerge} />)
    setSelectButton(<TouchAppSharpIcon style={{ fontSize: "45px" }} titleAccess="Select Region" onClick={handleSelect} />)
    setColorBorderButton(<BorderColor style={{ fontSize: "45px" }} titleAccess="Color Border" />)
    setSelectSubregion(null)
    selectFeatureFlag = null
    setSelectFLAG(0)

    colorFlag = !colorFlag
    if (colorFlag) {
      setColorSubregionButton(<ColorLens style={{ fontSize: "45px", color: "#FDE66B" }} titleAccess="Color Subregion" />)
    } else {
      setColorSubregionButton(<ColorLens style={{ fontSize: "45px" }} titleAccess="Color Subregion" />)
    }
  }

  function handleColorBorder() {
    setSelectedFeature(null)
    setMergeFeature(null)
    setMergeFeature_1(null)
    mergeFlag = 0;
    colorFlag = 0;
    // backgroundFlag = 0;
    mergeFeatureFlag = null
    setColorSubregionButton(<ColorLens style={{ fontSize: "45px" }} titleAccess="Color Subregion" />)
    setMergeButton(<Merge style={{ fontSize: "45px" }} titleAccess="Merge" onClick={handleMerge} />)
    setSelectButton(<TouchAppSharpIcon style={{ fontSize: "45px" }} titleAccess="Select Region" onClick={handleSelect} />)
    setSelectSubregion(null)
    selectFeatureFlag = null
    setSelectFLAG(0)

    borderFlag = !borderFlag
    if (borderFlag) {
      setColorBorderButton(<BorderColor style={{ fontSize: "45px", color: "#FDE66B" }} titleAccess="Color Border" />)
    } else {
      setColorBorderButton(<BorderColor style={{ fontSize: "45px" }} titleAccess="Color Border" />)
    }
  }

  function handleColorBackground() {
    setSelectedFeature(null)
    setMergeFeature(null)
    setMergeFeature_1(null)
    mergeFlag = 0;
    colorFlag = 0;
    mergeFeatureFlag = null
    borderFlag = 0;
    setColorSubregionButton(<ColorLens style={{ fontSize: "45px" }} titleAccess="Color Subregion" />)
    setMergeButton(<Merge style={{ fontSize: "45px" }} titleAccess="Merge" onClick={handleMerge} />)
    setSelectButton(<TouchAppSharpIcon style={{ fontSize: "45px" }} titleAccess="Select Region" onClick={handleSelect} />)
    setColorBorderButton(<BorderColor style={{ fontSize: "45px" }} titleAccess="Color Border" />)
    setSelectSubregion(null)
    selectFeatureFlag = null
    setSelectFLAG(0)

    store.currentMap.dataFromMap.background = colorFill
    setBackground(colorFill)
    setContainerKey(containerKey + 1)
  }

  // COLORING -------------------------------------------------------------------->END

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
          <Typography id="modal-text" xs={4} sx={{ textAlign: `center` }}>Are you sure you want to compress your map?</Typography>
          <Typography id="modal-text" xs={4} sx={{ textAlign: `center` }}>Once you confirm your changes, you cannot undo them. Changes are permanent once saved!</Typography>
          <RadioGroup row value={compressionStatus} onChange={handleRadioChange} sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center' }}>
              <FormControlLabel value="normal" control={<Radio />} label="Slightly" labelPlacement="bottom" />
              <FormControlLabel
                value="medium_compressed"
                control={<Radio />}
                label="Moderately"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="fully_compressed"
                control={<Radio />}
                label="Fully"
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
    if(!store.currentMap.compressionFlag){
      setSplitButton(<GridView style={{ fontSize: "45px" }} titleAccess="Split" onClick={handleSplit} />)
      if (!store.compressStatus) {
        setMaplayout(<div></div>)
        store.markCompression()
      }
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

  function styleMap(feature) {
    return {
      fillColor: feature.properties.fillColor || "#ff0000",
      fillOpacity: 1,
      color: feature.properties.borderColor || "#000000",
      weight: 2,
    }
  }

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

  function handleExportImage() {
    store.toggleExportImage();
  }

  function handleUndo() {
    store.undo();
    if (store.addedRegion) {
      store.revertAddedRegion();
      if (MapLayOutFLAG === 0) {
        setMapLayOutFLAG(1)
      } else {
        setMapLayOutFLAG(0)
      }
    }
    else if (undoFlag === -1) {
      setUndoFlag(true)
    } else {
      setUndoFlag(!undoFlag)
    }
    setSplitButton(<GridView style={{ fontSize: "45px" }} titleAccess="Split" onClick={handleSplit} />)
  }

  function handleRedo() {
    store.redo();
    if (undoFlag === -1) {
      setUndoFlag(true)
    } else {
      setUndoFlag(!undoFlag)
    }
    setSplitButton(<GridView style={{ fontSize: "45px" }} titleAccess="Split" onClick={handleSplit} />)
  }

  async function handleSaveMap() {
    store.updateThumbnail();
  }

  function useCbStable(cb) {
    const cbRef = useRef(cb);
    cbRef.current = cb;
    const cbRefStable = useCallback((...args) => {
      return cbRef.current(...args);
    }, []);
    return cbRefStable;
  }
  const stableClickFeature = useCbStable(clickFeature);

  function clickFeature(event) {
    if (mergeFlag) { // Merge active. Mark region if first, and merge if second. 
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
    } else if (selectFLAG) {
      if (selectFeatureFlag === null) {
        event.target.setStyle({
          color: "#3388FF",
          fillColor: "#3388FF",
          fillOpacity: 0.75,
        });

        //deep copy the feature to later edit
        let copied = JSON.parse(JSON.stringify(event.target.feature));
        //set the region by setting it to a global variable bc for some reason the state variable resets to null in here...lol
        setSelectSubregion(copied)
        selectFeatureFlag = copied
      } else if (event.target.feature.properties.admin === regionToEdit.properties.admin) { //deselect the selected region
        geoJsonLayer.current.resetStyle();

        setSelectSubregion(null)
        selectFeatureFlag = null
        //selectFLAG = 0
      } else {
        //Reset the color then re-select the new subregion
        geoJsonLayer.current.resetStyle();
        event.target.setStyle({
          color: "#3388FF",
          fillColor: "#3388FF",
          fillOpacity: 0.75,
        });
        let copied = JSON.parse(JSON.stringify(event.target.feature));
        setSelectSubregion(copied)
        selectFeatureFlag = copied
      }
    }
    else if (colorFlag) {
      event.target.setStyle({
        fillColor: colorFill,
      });
      event.target.feature.properties.fillColor = colorFill

    }
    else if (borderFlag) {
      event.target.setStyle({
        color: colorFill,
      });
      event.target.feature.properties.borderColor = colorFill
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
      click: stableClickFeature,
      dblclick: markSubregion,
    });
    let popupContent = `${country.properties.admin}`;
    if (country.properties && country.properties.popupContent) {
      popupContent += country.properties.popupContent;
    }
    layer.bindPopup(popupContent);

    if (selectSubregion) {
      if (country.properties.admin === selectSubregion.properties.admin) {
        layer.setStyle({
          color: "#3388FF",
          fillColor: "#3388FF",
          fillOpacity: 0.75,
        })
      }
    }
  };

  newMap.features.forEach((feature, index) => {
    newMap.features[index] = turf.flip(feature);
  });

  let renderedMap = <GeoJSON
    ref={geoJsonLayer}
    style={styleMap}
    data={store.currentMap ? store.currentMap.dataFromMap.features : null}
    onEachFeature={onEachCountry}
  />

  const [maplayout, setMaplayout] = useState(newMap ? renderedMap : <div></div>);

  //THIS IS FOR SELECTING TO MERGE 1ST REGION
  useEffect(() => {
    firstMerge = mergeFeature
  }, [mergeFeature]);

  //THIS IS FOR SELECTING TO MERGE 1ST REGION
  useEffect(() => {
    secondMerge = mergeFeature_1
  }, [mergeFeature_1]);

  //THIS IS FOR SELECTING A SUBREGION
  useEffect(() => {
    if (selectSubregion === null && geoJsonLayer.current) {
      geoJsonLayer.current.resetStyle();
      regionToEdit = null;
      drawFlag = true;
    } else {
      let copied = JSON.parse(JSON.stringify(selectSubregion));
      regionToEdit = copied;
      drawFlag = false;
    }
  }, [selectSubregion]);

  //THIS IS FOR SELECTING A SUBREGION
  useEffect(() => {
    if (selectFLAG === 0) {
      selectFeatureFlag = null
      selectHIGHLIGHTFLAG = 0
    } else {
      selectHIGHLIGHTFLAG = 1
    }
  }, [selectFLAG]);

  //THIS IS FOR UNDO/REDO UPDATING
  useEffect(() => {
    console.log("Maplayout changed")
    if (undoFlag !== -1) {
      splitArray.length = 0
      setMaplayout(<FeatureGroup>
        {newMap && newMap.features.map((feature, index) => {
          if (feature.geometry.type === 'Polygon') {
            return <Polygon key={Math.random()} positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} polyName={feature.properties.admin} />;
          } else if (feature.geometry.type === 'MultiPolygon') {
            const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
              <Polygon key={Math.random()} positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} polyName={feature.properties.admin} />
            ));
            return polygons;
          }
          return null;
        })}
        {/* <EditControl
          position='topright'
          onEdited={handleEditable}
          onDeleted={_onDelete}
          onCreated={_onCreated}
          draw={{
            polyline: false,
            circle: false,
            rectangle: false,
            marker: true,
            circlemarker: false
          }}
        /> */}

      </FeatureGroup>)
      //setMapLayOutFLAG(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undoFlag]);

  //THIS IS FOR MAP MODE SWITCHING AKA NAVIGATION
  useEffect(() => {
    if (selectSubregion) {
      drawFlag = false
    } else {
      drawFlag = true
    }

    if (compressValue !== -1 && MapLayOutFLAG === 1) {
      let options = { tolerance: compressValue, highQuality: false };
      // eslint-disable-next-line
      newMap = turf.simplify(newMap, options);
      //setNewMap(turf.simplify(newMap, options));
      store.currentMap.dataFromMap = turf.simplify(store.currentMap.dataFromMap, options)
      setMaplayout(<FeatureGroup >
        {newMap && newMap.features.map((feature, index) => {
          if (feature.geometry.type === 'Polygon') {
            return <Polygon key={Math.random()} positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} polyName={feature.properties.admin} />;
          } else if (feature.geometry.type === 'MultiPolygon') {
            const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
              <Polygon key={Math.random()} positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} polyName={feature.properties.admin} />
            ));
            return polygons;
          }
          return null;
        })}
      </FeatureGroup>)
      setCompressValue(-1)
    } else if (MapLayOutFLAG === 1) {
      splitArray.length = 0
      setMaplayout(<div>
        <FeatureGroup>
          {newMap && newMap.features.map((feature, index) => {
            if (regionToEdit) {
              if (feature.properties.admin !== regionToEdit.properties.admin) {
                if (feature.geometry.type === 'Polygon') {
                  console.log("WHY ARENT U SHOWING UP")
                  return <Polygon key={Math.random()} pathOptions={{
                    fillColor: '#CCDAED',
                    fillOpacity: 0.85, // Set the fill opacity
                    color: '#3388FF',
                    opacity: 0.4, // Set the border opacity
                  }}
                    positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} polyName={feature.properties.admin} />;
                } else if (feature.geometry.type === 'MultiPolygon') {
                  const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
                    <Polygon key={Math.random()} pathOptions={{
                      fillColor: '#CCDAED',
                      fillOpacity: 0.8, // Set the fill opacity
                      color: '#3388FF',
                      opacity: 0.4, // Set the border opacity
                    }}
                      positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} polyName={feature.properties.admin} />
                  ));
                  return polygons;
                }
              }
            } else {
              if (feature.geometry.type === 'Polygon') {
                return <Polygon key={Math.random()} pathOptions={{
                  fillColor: '#CCDAED',
                  fillOpacity: 0.8, // Set the fill opacity
                  color: '#3388FF',
                  opacity: 0.5, // Set the border opacity
                }}
                  positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} polyName={feature.properties.admin} />;
              } else if (feature.geometry.type === 'MultiPolygon') {
                const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
                  <Polygon key={Math.random()} pathOptions={{
                    fillColor: '#CCDAED',
                    fillOpacity: 0.8, // Set the fill opacity
                    color: '#3388FF',
                    opacity: 0.5, // Set the border opacity
                  }}
                    positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} polyName={feature.properties.admin} />
                ));
                return polygons;
              }
            }
            return null;
          })}
        </FeatureGroup>


        <FeatureGroup>
          {newMap && newMap.features.map((feature, index) => {
            if (regionToEdit) {
              if (feature.properties.admin === regionToEdit.properties.admin) {
                if (feature.geometry.type === 'Polygon') {
                  return <Polygon key={Math.random()} positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} polyName={feature.properties.admin} />;
                } else if (feature.geometry.type === 'MultiPolygon') {
                  const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
                    <Polygon key={Math.random()} positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} polyName={feature.properties.admin} />
                  ));
                  return polygons;
                }
              }
            }
            return null;
          })}

          <EditControl
            position='topright'
            onEdited={handleEditable}
            onDeleted={_onDelete}
            onCreated={_onCreated}
            draw={{
              polyline: false,
              circle: false,
              rectangle: false,
              marker: false,
              circlemarker: false,
              polygon: drawFlag
            }}
          />
        </FeatureGroup>
      </div>)
    } else {
      splitArray.length = 0
      setMaplayout(newMap ? renderedMap : <div></div>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MapLayOutFLAG]);

  //THIS IS FOR MAP COMPRESSION
  useEffect(() => {
    if (compressValue !== -1) {
      splitArray.length = 0
      store.setCompressionFlag();
      setMapLayOutFLAG(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compressValue]);

  //THIS IS FOR POLYGON/SUBREGION SPLITTING
  useEffect(() => {
    if (splitFlag > -1) {
      setMaplayout(<div>
        <FeatureGroup>
          {newMap && newMap.features.map((feature, index) => {
            if (regionToEdit) {
              if (feature.properties.admin !== regionToEdit.properties.admin) {
                if (feature.geometry.type === 'Polygon') {
                  console.log("WHY ARENT U SHOWING UP")
                  return <Polygon key={Math.random()} pathOptions={{
                    fillColor: '#CCDAED',
                    fillOpacity: 0.7, // Set the fill opacity
                    color: '#3388FF',
                    opacity: 0.3, // Set the border opacity
                  }}
                    positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} polyName={feature.properties.admin} />;
                } else if (feature.geometry.type === 'MultiPolygon') {
                  const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
                    <Polygon key={Math.random()} pathOptions={{
                      fillColor: '#CCDAED',
                      fillOpacity: 0.7, // Set the fill opacity
                      color: '#3388FF',
                      opacity: 0.3, // Set the border opacity
                    }}
                      positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} polyName={feature.properties.admin} />
                  ));
                  return polygons;
                }
              }
            } else {
              if (feature.geometry.type === 'Polygon') {
                return <Polygon key={Math.random()} pathOptions={{
                  fillColor: '#CCDAED',
                  fillOpacity: 0.7, // Set the fill opacity
                  color: '#3388FF',
                  opacity: 0.3, // Set the border opacity
                }}
                  positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} polyName={feature.properties.admin} />;
              } else if (feature.geometry.type === 'MultiPolygon') {
                const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
                  <Polygon key={Math.random()} pathOptions={{
                    fillColor: '#CCDAED',
                    fillOpacity: 0.7, // Set the fill opacity
                    color: '#3388FF',
                    opacity: 0.3, // Set the border opacity
                  }}
                    positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} polyName={feature.properties.admin} />
                ));
                return polygons;
              }
            }
            return null;
          })}

        </FeatureGroup>

        <FeatureGroup>
          {newMap && newMap.features.map((feature, index) => {
            if (regionToEdit) {
              if (feature.properties.admin === regionToEdit.properties.admin) {
                if (feature.geometry.type === 'Polygon') {
                  let circles = []
                  circles.push(<Polygon key={index} positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} polyName={feature.properties.admin} />)
                  for (let i = 0; i < feature.geometry.coordinates[0].length; i++) {
                    circles.push(<Circle
                      key={Math.random()}
                      center={feature.geometry.coordinates[0][i]}
                      pathOptions={{ fillColor: 'black', color: 'black', fillOpacity: 1 }}
                      radius={10}
                      eventHandlers={{ click: eventHandlers }}
                      ifMultiPolygon={false}
                      circleCustomProp={index}
                      circleCustomCoordProp={i}>
                    </Circle>)
                  }
                  return circles;
                  //return <Polygon key={Math.random()} positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} />;
                } else if (feature.geometry.type === 'MultiPolygon') {
                  let circles = []
                  feature.geometry.coordinates.map((polygonCoords, polygonIndex) => {
                    circles.push(<Polygon key={Math.random()} positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} polyName={feature.properties.admin} />)
                    let multiArray = polygonCoords[0]
                    for (let i = 0; i < multiArray.length; i++) {
                      circles.push(<Circle
                        key={Math.random()}
                        center={multiArray[i]}
                        pathOptions={{ fillColor: 'black', color: 'black', fillOpacity: 1 }}
                        radius={10000}
                        eventHandlers={{ click: eventHandlers }}
                        ifMultiPolygon={true}
                        circleCustomProp={index + "-" + polygonIndex}
                        circleCustomCoordProp={i}>
                      </Circle>)
                    }
                    return polygonCoords;
                  });
                  return circles;
                }
              }
            }
            return null;
          })}
        </FeatureGroup>
      </div>)
    } else if (splitFlag === -2) {
      splitArray.length = 0
      setMaplayout(<div>
        <FeatureGroup>
          {newMap && newMap.features.map((feature, index) => {
            if (regionToEdit) {
              if (feature.properties.admin !== regionToEdit.properties.admin) {
                if (feature.geometry.type === 'Polygon') {
                  console.log("WHY ARENT U SHOWING UP")
                  return <Polygon key={Math.random()} pathOptions={{
                    fillColor: '#CCDAED',
                    fillOpacity: 0.85, // Set the fill opacity
                    color: '#3388FF',
                    opacity: 0, // Set the border opacity
                  }}
                    positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} polyName={feature.properties.admin} />;
                } else if (feature.geometry.type === 'MultiPolygon') {
                  const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
                    <Polygon key={Math.random()} pathOptions={{
                      fillColor: '#CCDAED',
                      fillOpacity: 0.8, // Set the fill opacity
                      color: '#3388FF',
                      opacity: 0, // Set the border opacity
                    }}
                      positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} polyName={feature.properties.admin} />
                  ));
                  return polygons;
                }
              }
            } else {
              if (feature.geometry.type === 'Polygon') {
                return <Polygon key={Math.random()} pathOptions={{
                  fillColor: '#CCDAED',
                  fillOpacity: 0.8, // Set the fill opacity
                  color: '#3388FF',
                  opacity: 0.5, // Set the border opacity
                }}
                  positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} polyName={feature.properties.admin} />;
              } else if (feature.geometry.type === 'MultiPolygon') {
                const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
                  <Polygon key={Math.random()} pathOptions={{
                    fillColor: '#CCDAED',
                    fillOpacity: 0.8, // Set the fill opacity
                    color: '#3388FF',
                    opacity: 0.5, // Set the border opacity
                  }}
                    positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} polyName={feature.properties.admin} />
                ));
                return polygons;
              }
            }
            return null;
          })}

        </FeatureGroup>

        <FeatureGroup>
          {newMap && newMap.features.map((feature, index) => {
            if (regionToEdit) {
              if (feature.properties.admin === regionToEdit.properties.admin) {
                if (feature.geometry.type === 'Polygon') {
                  return <Polygon key={Math.random()} positions={feature.geometry.coordinates[0]} myCustomKeyProp={index + ""} />;
                } else if (feature.geometry.type === 'MultiPolygon') {
                  const polygons = feature.geometry.coordinates.map((polygonCoords, polygonIndex) => (
                    <Polygon key={polygonIndex} positions={polygonCoords[0]} myCustomKeyProp={index + "-" + polygonIndex} />
                  ));
                  return polygons;
                }
              }
            }
            return null;
          })}
          <EditControl
            position='topright'
            onEdited={handleEditable}
            onDeleted={_onDelete}
            onCreated={_onCreated}
            draw={{
              polyline: false,
              circle: false,
              rectangle: false,
              marker: false,
              polygon: drawFlag
            }}
          />
        </FeatureGroup>
      </div>
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splitFlag]);

  const handleNavigate = (e) => {
    setSplitButton(<GridView style={{ fontSize: "45px" }} titleAccess="Split" onClick={handleSplit} />)
    if (MapLayOutFLAG !== 1) {
      setMapLayOutFLAG(1)
    } else {
      setMapLayOutFLAG(0)
    }
  };

  function handleMerge(event) {
    if (MapLayOutFLAG !== 1) {
      console.log(mergeFeature)
      console.log(mergeFeature_1)
      if (mergeFlag > 0 && firstMerge && secondMerge) {
        setMergedFlag(true)


        const bufferDistance = 0.1; // adjust this value as needed
        const bufferedPolygon1 = turf.buffer(firstMerge.feature, bufferDistance);
        const bufferedPolygon2 = turf.buffer(secondMerge.feature, bufferDistance);

        let union = turf.union(bufferedPolygon1, bufferedPolygon2);
        let index1;
        let index2;
        for (let i = 0; i < store.currentMap.dataFromMap.features.length; i++) {
          let currentFeature = store.currentMap.dataFromMap.features[i]
          if (currentFeature.properties.admin === firstMerge.feature.properties.admin) {
            index1 = i;
          }
          if (currentFeature.properties.admin === secondMerge.feature.properties.admin) {
            index2 = i;
          }
        }

        let keys = [index1, index2]
        let copiedUnion = JSON.parse(JSON.stringify(union));
        let copiedFeature1 = JSON.parse(JSON.stringify(firstMerge.feature));
        let copiedFeature2 = JSON.parse(JSON.stringify(secondMerge.feature));
        store.mergeCurrentRegions(keys, copiedUnion, copiedFeature1, copiedFeature2)

        setMergeFeature(null)
        setMergeFeature_1(null)
        mergeFeatureFlag = null
        mergeFlag = 0
        setMergeButton(<Merge style={{ fontSize: "45px" }} titleAccess="Merge" onClick={handleMerge} />)
      }
      else if (mergeFlag) {
        setMergeFeature(null)
        setMergeFeature_1(null)
        mergeFeatureFlag = null
        mergeFlag = 0
        setMergeButton(<Merge style={{ fontSize: "45px" }} titleAccess="Merge" onClick={handleMerge} />)
        //geoJsonLayer.current.resetStyle();
      }
      else {
        setSelectedFeature(null)
        borderFlag = 0;
        colorFlag = 0;
        // backgroundFlag = 0;

        mergeFlag = 1
        setColorSubregionButton(<ColorLens style={{ fontSize: "45px" }} titleAccess="Color Subregion" />)
        setMergeButton(<Merge style={{ fontSize: "45px", color: "#FDE66B" }} titleAccess="Merge" onClick={handleMerge} />)
        setSelectSubregion(null)
        selectFeatureFlag = null
        setSelectFLAG(0)
        setSelectButton(<TouchAppSharpIcon style={{ fontSize: "45px" }} titleAccess="Select Region" onClick={handleSelect} />)
        setColorBorderButton(<BorderColor style={{ fontSize: "45px" }} titleAccess="Color Border" />)
        //selectFLAG = 0
      }
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
        fillColor: "#4CBB17"
      })
      setListOfProperties(selectedFeature.feature.properties)
    } else {
      setListOfProperties({});
    }
  }, [selectedFeature]);

  //FUNCTION FOR REMOVING A SUBREGION
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
                let keys = [i, j]
                // store.currentMap.dataFromMap.features[i].geometry.coordinates.splice(j, 1);
                store.deleteCurrentRegion(keys, oldFeature);
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
              let keys = [i]
              //store.currentMap.dataFromMap.features.splice(i, 1);
              store.deleteCurrentRegion(keys, oldFeature);
              break;
            }
          }
        }
        //}
      }
    });
  }

  //FUNCTION FOR ADDING A NEW SUBREGION
  function _onCreated(e) {
    let newFeature = e.layer.toGeoJSON()
    let index = store.currentMap.dataFromMap.features.length
    let name = "NewRegion-" + index
    newFeature.properties.admin = name
    newFeature.properties.sovereignt = name
    newFeature.properties.myCustomKeyProp = index

    let copiedRegion = JSON.parse(JSON.stringify(newFeature));
    store.addCurrentRegion(copiedRegion);
    setMapLayOutFLAG(0)
  }

  //FUNCTION FOR EDITING VERTICES
  const handleEditable = (e) => {

    const layers = e.layers;
    layers.eachLayer(layer => { //ignore dis 4 now .3.

      //let editedLayer = e.layers.getLayers()[0];
      //const editedKey = layer.options.myCustomKeyProp; //gets the special key attached to each <Polygon> to see what country the Poly belongs to in the GEOJSON file
      //layer = turf.flip(layer.toGeoJSON()); //we need to flip the [long, lat] coordinates to [lat, long] FIRST, cause it wont render properly. then convert the layer to a geojson object

      let editedKey;
      if (layer.options.myCustomKeyProp) {
        editedKey = layer.options.myCustomKeyProp;
      } else {
        editedKey = (store.currentMap.dataFromMap.features.length - 1) + ""
      }
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

  //FUNCTIONS FOR SPLITTING REGIONS
  const handleSplit = () => {
    if (regionToEdit) {
      if (splitArray.length === 2 && splitArray[0][3] === splitArray[1][3] && splitArray[0][0] === splitArray[1][0]) { //check if array is full, then if both vertices are the same type(Poly or Multi) then check both vertices belong to the same Polygon
        let ver1 = splitArray[0] //[14, 2, {x,y}, T/F]
        let ver2 = splitArray[1] //[14, 4, {x,y}, T/F]

        if (!ver1[3]) { //splitting a regular polygon
          let i1 = ver1[1]
          let i2 = ver2[1]
          if (i1 > i2) {
            i2 = ver1[1]
            i1 = ver2[1]
          }
          let featureFound = store.currentMap.dataFromMap.features[ver1[0]]
          const oldFeature = JSON.parse(JSON.stringify(featureFound)); //create a deep copy

          let vertex1 = store.currentMap.dataFromMap.features[ver1[0]].geometry.coordinates[0][ver1[1]]
          let vertex2 = store.currentMap.dataFromMap.features[ver1[0]].geometry.coordinates[0][ver2[1]]

          let line = turf.lineString([vertex1, vertex2]);
          let intersects = turf.lineIntersect(line, featureFound);
          let noOfIntersects = intersects.features.length

          const isP1Inside = turf.booleanPointInPolygon(vertex1, featureFound);
          const isP2Inside = turf.booleanPointInPolygon(vertex2, featureFound);
          console.log(noOfIntersects)
          console.log(isP1Inside + " " + isP2Inside)
          if (noOfIntersects <= 2) {
            const slicedFeatureArray = featureFound.geometry.coordinates[0].slice(i1, (i2 + 1)); // [3, 4, 5]
            let repeatCoord = slicedFeatureArray[0]
            slicedFeatureArray.push(repeatCoord)

            if (slicedFeatureArray.length > 3) {

              const copiedArray = JSON.parse(JSON.stringify(splitArray)); //DEEP COPY ARRAY SO NO ISSUES OCCUR FOR REDO
              store.splitCurrentRegion(copiedArray, oldFeature) //SEND SPLIT INTO TRANSACTION STACK!!!

              splitArray.length = 0
              setSplitButton(<GridView style={{ fontSize: "45px" }} titleAccess="Split" onClick={handleSplit} />)
              if (MapLayOutFLAG !== 1) {
                setMapLayOutFLAG(1)
              } else {
                setMapLayOutFLAG(0)
              }
            }
          } else {
            splitArray.length = 0
            setSplitButton(<GridView style={{ fontSize: "45px" }} titleAccess="Split" onClick={handleSplit} />)
            setSplitFlag(Math.random())
          }
        } else { //splitting a poly from a multipolygon, //[8-3, 2, {x,y}, T/F] ------------------------------------------------->
          console.log("MULTI POLY ENTERED HERE")
          let i1 = ver1[1]
          let parts1 = ver1[0].split("-"); //parts = ["index of subregion", "index of subregion in multipolygon"]
          let indexPoly1 = parseInt(parts1[0]);
          let indexCoordPoly1 = parseInt(parts1[1]);
          let i2 = ver2[1]

          if (i1 > i2) {
            i2 = ver1[1]
            i1 = ver2[1]
          }
          let featureFound = store.currentMap.dataFromMap.features[indexPoly1]
          let oldFeature = JSON.parse(JSON.stringify(featureFound)); //create a deep copy

          let vertex1 = featureFound.geometry.coordinates[indexCoordPoly1][0][ver1[1]]
          let vertex2 = featureFound.geometry.coordinates[indexCoordPoly1][0][ver2[1]]

          let line = turf.lineString([vertex1, vertex2]);
          let intersects = turf.lineIntersect(line, featureFound);
          let noOfIntersects = intersects.features.length
          console.log(noOfIntersects)
          if (noOfIntersects <= 2) {

            const slicedFeatureArray = featureFound.geometry.coordinates[indexCoordPoly1][0].slice(i1, (i2 + 1)); // [3, 4, 5]
            let repeatCoord = slicedFeatureArray[0]
            slicedFeatureArray.push(repeatCoord)

            if (slicedFeatureArray.length > 3) {


              // let slicedFeature = turf.polygon([slicedFeatureArray]);
              // let index = store.currentMap.dataFromMap.features.length
              // let name = "NewRegion-" + index
              // slicedFeature.properties.admin = name
              // slicedFeature.properties.sovereignt = name
              // store.currentMap.dataFromMap.features[indexPoly1].geometry.coordinates[indexCoordPoly1][0].splice(i1 + 1, i2 - i1 - 1)
              // store.currentMap.dataFromMap.features.push(slicedFeature)

              const copiedArray = JSON.parse(JSON.stringify(splitArray)); //DEEP COPY ARRAY SO NO ISSUES OCCUR FOR REDO
              store.splitCurrentRegion(copiedArray, oldFeature) //SEND SPLIT INTO TRANSACTION STACK!!!

              splitArray.length = 0

              setSplitButton(<GridView style={{ fontSize: "45px" }} titleAccess="Split" onClick={handleSplit} />)
              if (MapLayOutFLAG !== 1) {
                setMapLayOutFLAG(1)
              } else {
                setMapLayOutFLAG(0)
              }
            }
          } else {
            splitArray.length = 0
            setSplitButton(<GridView style={{ fontSize: "45px" }} titleAccess="Split" onClick={handleSplit} />)
            setSplitFlag(Math.random())
          }
        }
      } else {
        splitArray.length = 0
        setSplitButton(<GridView style={{ fontSize: "45px" }} titleAccess="Split" onClick={handleSplit} />)
        setSplitFlag(Math.random())
      }
    }
  }

  //FUNCTION FOR SELECTING A SUBREGION TO LATER EDIT
  function handleSelect(event) {
    if (MapLayOutFLAG !== 1) {
      if (selectHIGHLIGHTFLAG) {

        setSelectButton(<TouchAppSharpIcon style={{ fontSize: "45px" }} titleAccess="Select Region" onClick={handleSelect} />)
        setSelectSubregion(null)
        selectFeatureFlag = null
        setSelectFLAG(0)
        //selectFLAG = 0
      } else {
        setSelectButton(<TouchAppSharpIcon style={{ fontSize: "45px", color: "#FDE66B" }} titleAccess="Select Region" onClick={handleSelect} />)
        setSelectedFeature(null)
        setSelectFLAG(1)
        //selectFLAG = 1

        setMergeFeature(null)
        setMergeFeature_1(null)
        mergeFeatureFlag = null
        mergeFlag = 0
        setMergeButton(<Merge style={{ fontSize: "45px" }} titleAccess="Merge" onClick={handleMerge} />)
        colorFlag = 0
        setColorSubregionButton(<ColorLens style={{ fontSize: "45px" }} titleAccess="Color Subregion" />)
        borderFlag = 0;
        setColorBorderButton(<BorderColor style={{ fontSize: "45px" }} titleAccess="Color Border" />)
        if (geoJsonLayer.current) {
          geoJsonLayer.current.resetStyle();
        }
      }
    }
  }

  //CALLBACK WHEN A USER CLICKS THE CIRCLE FOR SPLITING
  const eventHandlers = (e) => {
    if (splitArray.length < 2) { //we select the vertices to be merged
      let removed = false
      let featureIndex = e.target.options.circleCustomProp
      let coordIndex = e.target.options.circleCustomCoordProp
      let multiFlag = e.target.options.ifMultiPolygon
      if (splitArray.length === 1) {
        let ver1 = splitArray[0] //[14, 2, {x,y}]
        if (ver1[0] === featureIndex && ver1[1] === coordIndex) {
          splitArray.splice(0, 1)
          e.target.setStyle({ color: 'black', fillColor: 'black' });
          removed = true
        }
      }
      if (!removed) {
        let coord = e.target.getLatLng()
        let vertex = [featureIndex, coordIndex, coord, multiFlag] //0-1-2-3
        splitArray.push(vertex)
        e.target.setStyle({ color: 'red', fillColor: 'red' });
      }
    } else if (splitArray.length === 2) {
      //get key and index to check if the same circle was clicked so we remove it from the array
      let ver1 = splitArray[0] //[14, 2, {x,y}]
      let ver2 = splitArray[1] //[14, 4, {x,y}]
      let featureIndex = e.target.options.circleCustomProp
      let coordIndex = e.target.options.circleCustomCoordProp

      if (ver1[0] === featureIndex && ver1[1] === coordIndex) { //REMOVE THE 1ST SELECTED RED VERTEX
        splitArray.splice(0, 1)
        e.target.setStyle({ color: 'black', fillColor: 'black' });
      }
      if (splitArray.length === 2) { //REMOVE THE 2ND SELECTED RED VERTEX
        if (ver2[0] === featureIndex && ver2[1] === coordIndex) {
          splitArray.splice(1, 1)
          e.target.setStyle({ color: 'black', fillColor: 'black' });
        }
      }
    }

    //IF ARRAY IS FULL THAN WE CHANGE THE SPLIT BUTTON COLOR TO YELLOW TO INDICATE TO THE USER TO CLICK AGAIN TO SPLIT
    if (splitArray.length === 2) {
      setSplitButton(<GridView style={{ fontSize: "45px", color: "#FDE66B" }} titleAccess="Split" onClick={handleSplit} />)
    } else {
      setSplitButton(<GridView style={{ fontSize: "45px" }} titleAccess="Split" onClick={handleSplit} />)
    }
  };

  const [splitButton, setSplitButton] = useState(<GridView style={{ fontSize: "45px" }} titleAccess="Split" onClick={handleSplit} />)
  const [selectButton, setSelectButton] = useState(<TouchAppSharpIcon style={{ fontSize: "45px" }} titleAccess="Select Region" onClick={handleSelect} />)
  const [mergeButton, setMergeButton] = useState(<Merge style={{ fontSize: "45px" }} titleAccess="Merge" onClick={handleMerge} />)
  const [colorSubregionButton, setColorSubregionButton] = useState(<ColorLens style={{ fontSize: "45px" }} titleAccess="Color Subregion" />)
  const [colorBorderButton, setColorBorderButton] = useState(<BorderColor style={{ fontSize: "45px" }} titleAccess="Color Border" />)
  const [toggleLayerButton, setToggleLayerButton] = useState(<MapRoundedIcon style={{ fontSize: "45px" }} titleAccess="Toggle Layer" />)


  const openPropertyModal = () => {
    store.startModifyProperty();
  }
  const handleDeleteProperty = (key) => {
    const { [key]: value, ...newProps } = listOfProperties;
    setListOfProperties(newProps);
    //setCards(newCards);
  }
  const handleUpdateKeyProperty = (event) => {
    setPropertyKey(event.target.value);
  }

  const handleUpdateValueProperty = (event) => {
    setProperyValue(event.target.value);
  }

  const addProperty = () => {
    if(propertyKey !== 'admin' && propertyKey !== 'fillColor' && propertyKey !== 'borderColor' && propertyKey !== 'label' && propertyKey !== "") {
      let temp = listOfProperties;
      temp[propertyKey] = propertyValue;
      setListOfProperties(temp)
      setPropertyKey("");
      setProperyValue("");
    } else {
      setPropertyKey("");
      setProperyValue("");
    }
  }

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
  let cardProperties = Object.entries(listOfProperties).map(([property, value]) => {
    if(property !== 'admin' && property !== 'fillColor' && property !== 'borderColor' && property !== 'label'){
      return <div key={property} className="card" style={{ display: "flex", flexDirection: "row", margin: "20px", justifyContent: "space-between", backgroundColor: "#d6bfbf", borderRadius: "30px", alignItems: "center" }}>
        <div className="card-header" style={{ margin: "0px 20px" }}>Property: {property}</div>
        <div className="card-body">Value: {value}</div>
        <button style={removePropertyStyle} onClick={() => handleDeleteProperty(property)} type='button'>x</button>
      </div>
    } else {
      return null;
    }
  });

  let buttonIfProperty = null;
  if (selectedFeature) {
    buttonIfProperty = (
      <button id="addPropertyButton" style={addPropertyButtonStyle} type="button" onClick={openPropertyModal}>
        <span style={plusSignStyle}>+</span>
      </button>
    )
  }
  const handleCloseProperty = () => {
    setPropertyKey("");
    setProperyValue("");
    store.hideModals();
    setMaplayout(newMap ? renderedMap : <div></div>);
  }

  const handleConfirmProperty = () => {
    let temp = selectedFeature;
    temp.feature.properties = listOfProperties;
    setSelectedFeature(temp);
    setPropertyKey("");
    setProperyValue("");
    store.hideModals();
    setMaplayout(newMap ? renderedMap : <div></div>);
  }

  let customPropertiesModal = <Modal
    open={store.currentModal === "PROPERTIES"}
  >
    <Grid container sx={styleProperties}>
      <Grid container item >
        <Box sx={top}>
          <Typography id="modal-heading">Add Or Remove Property</Typography>
        </Box>
      </Grid>
      <Grid container item>
        <Box sx={{ width: "100%" }}>
          <Typography id="modal-text" xs={4}>Properties: </Typography>
          <div style={{ overflowY: "scroll", height: "200px", width: "100%" }}>
            {cardProperties}
          </div>
        </Box>
      </Grid>
      <Grid container item>
        <Box sx={{ display: "flex", flexFlow: "row", alignItems: "center" }}>
          <Typography id="modal-text">Add Properties: </Typography>
          <TextField id="modal-textfield-propertykey" label="Key" fullWidth={true}
            value={propertyKey} onChange={handleUpdateKeyProperty} size="medium" sx={{ flex: 1, minWidth: "0" }} />
          <TextField id="modal-textfield-propertyvalue" label="Value"
            value={propertyValue} onChange={handleUpdateValueProperty} size="medium" sx={{ flex: 1, minWidth: "0" }} />
          <button style={addPropertyButtonStyle} type="button" onClick={addProperty}>
            <span style={plusSignStyle}>+</span>
          </button>
        </Box>
      </Grid>
      <Grid container item sx={buttonBox}>
        <Button id="modal-button" onClick={handleConfirmProperty}>Confirm</Button>
        <Button id="modal-button" onClick={handleCloseProperty}>Cancel</Button>
      </Grid>
      <h6>Disclaimer: Property changes cannot be reverted</h6>
    </Grid>
  </Modal>

  // ------------ Color Picker Related

  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  function handleColorClick() {
    setColorPickerOpen(!colorPickerOpen)
  };

  function handleColorClose() {
    setColorPickerOpen(false)
  };

  function handleColorChange(color) {
    setColorFill(color.hex)
  };

  const styles = {
    color: {
      width: '36px',
      height: '14px',
      borderRadius: '2px',
      background: colorFill,
    },
    swatch: {
      padding: '5px',
      background: '#fff',
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: 'pointer',
    },
    popover: {
      position: 'absolute',
      zIndex: '2',
    },
    cover: {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
  };

  // ------------ Color Picker End

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

          <div id="edit-line4"></div>

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
            {splitButton}
            {/* <GridView style={{ fontSize: "45px" }} titleAccess="Split" /> */}
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
          >
            {mergeButton}
            {/* <Merge style={{ fontSize: "45px" }} titleAccess="Merge" onClick={handleMerge} /> */}
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
          >
            {selectButton}
            {/* <TouchAppSharpIcon style={{ fontSize: "45px" }} titleAccess="Select Region"  onClick={handleSelect} /> */}
          </StyledIconButton>

          <div id="edit-line5"></div>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
            onClick={() => handleColorSubregion()}
          >
            {colorSubregionButton}
            {/* <ColorLens style={{ fontSize: "45px" }} titleAccess="Color Subregion" /> */}
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
            onClick={() => handleColorBackground()}
          >
            <FormatColorFill style={{ fontSize: "45px" }} titleAccess="Color Background" />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
            onClick={() => handleColorBorder()}
          >
            {colorBorderButton}
            {/* <BorderColor style={{ fontSize: "45px" }} titleAccess="Color Border" /> */}
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
            onClick={handleToggleTileLayer}
          >
            {toggleLayerButton}
            {/* <Public style={{ fontSize: "45px" }} titleAccess="Insert Text" /> */}
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
            onClick={handleSaveMarker}
          >
            <SaveAsOutlined style={{ fontSize: "45px" }} titleAccess="Save Text" />
          </StyledIconButton>

          <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ flex: "1 0 50%", marginBottom: "10px" }}
            onClick={handleAddMarker}

          >
            <Title style={{ fontSize: "45px" }} titleAccess="Insert Text" />
          </StyledIconButton>

        </Box>
        <div id="edit-line2"></div>
        <br />
        <FormControl
          variant="standard"
          sx={{
            m: 1,
            minWidth: 120,
            '& > :not(style)': { backgroundColor: "#D9D9D9", marginTop: '0.75%' },
            "& .css-m5hdmq-MuiInputBase-root-MuiInput-root-MuiSelect-root:after": {
              borderColor: '#FDE66B'
            },
            "& label.Mui-focused": {
              color: '#756060' //purple
            },
          }}
        >
          {/* <InputLabel id="demo-simple-select-standard-label">Font</InputLabel> */}
          {/* <label htmlFor="demo-simple-select-standard">Font</label> */}
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={selectedFont}
            onChange={handleChangeFont}
            label="Font"
            defaultValue={selectedFont}
          >
            {fontOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
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

        <br />

        <Button id="exportImageButton"
          type="submit"
          sx={{ textTransform: `none` }}
          onClick={() => handleExportImage()}
        >
          <p id="export-image-text">Export Image</p>
        </Button>

      </Box>

      <Box id="statusBoxEdit">
        <div id="map-statusbar">
          {
            store ? store.currentMap.name : ""
          }
        </div>
      </Box>

      <Box id="mapBoxEdit" style={{ height: "80vh", backgroundColor: background }}  noValidate >
        <MapContainer style={{ height: "80vh", backgroundColor: background }} key={containerKey} doubleClickZoom={false}>
          <Recenter bounds={bounds} />
          <Screenshot />
          {tileLayerOn ? <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> : <div></div>}
          {maplayout}
          {textMarker}
          {myLegend}
        </MapContainer>

        <Box>
          <div style={styles.swatch} onClick={handleColorClick}>
            <div style={styles.color} />
          </div>
          {colorPickerOpen ? <div style={styles.popover}>
            <div style={styles.cover} onClick={handleColorClose} />
            <ChromePicker disableAlpha={true} color={colorFill} onChange={handleColorChange} />
          </div> : null}
        </Box>

        <Box>
          <header>
            <h2>Current Region's Properties:</h2>
          </header>
          <Box id="boxOfProperties" sx={{ overflowY: "scroll", height: "150px", border: 1 }}>
            {propertyElement}
          </Box>
          {buttonIfProperty}
        </Box>
      </Box>
      {modal}
      {compressModal}
      {customPropertiesModal}
    </Box>
  );
}