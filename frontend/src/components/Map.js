import React from "react";
//Component
import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet';
// import mapData from "./custom.json";
import "leaflet/dist/leaflet.css";
import { GlobalStoreContext } from '../store'
import { useContext, useState } from 'react'
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Statusbar from './Statusbar';
import ExploreIcon from '@mui/icons-material/Explore';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CompressIcon from '@mui/icons-material/Compress';
import GridViewIcon from '@mui/icons-material/GridView';
import MergeIcon from '@mui/icons-material/Merge';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import CreateIcon from '@mui/icons-material/Create';
import TitleIcon from '@mui/icons-material/Title';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from '@mui/material';

export default function Map() {
  const { store } = useContext(GlobalStoreContext);
  const [color, setColor] = useState("#ffff00");
  const [font, setFont] = React.useState("Arial");

  const handleChange = (event) => {
    setFont(event.target.value);
  };

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

  // function printMesssageToConsole(event){
  //   console.log("Clicked");
  // };

  // function changeCountryColor(event){
  //   event.target.setStyle({
  //     color: "green",
  //     fillColor: color,
  //     fillOpacity: 1,
  //   });
  // };

  function onEachCountry(country, layer) {
    const countryName = country.properties.ADMIN;
    console.log(countryName);
    layer.bindPopup(countryName);

    layer.options.fillOpacity = Math.random();

    layer.on({
      click: this.changeCountryColor,
    });
  };

  function colorChange(event) {
    setColor(event.target.value);
  };


  let renderedMap = <GeoJSON
    style={countryStyle}
    data={store.currentMap ? store.currentMap.features : null}
    onEachFeature={onEachCountry}
  />

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
            sx={{flex: "1 0 50%", marginBottom: "10px"}}
            >
              <ExploreIcon style={{ fontSize: "45px"}} titleAccess="Navigate" />
            </StyledIconButton>

            <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{flex: "1 0 50%", marginBottom: "10px"}}
            >
              <SaveIcon style={{ fontSize: "45px"}} titleAccess="Save"/>
            </StyledIconButton>

            <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{flex: "1 0 50%", marginBottom: "10px"}}
            >
              <UndoIcon style={{ fontSize: "45px"}} titleAccess="Undo"/>
            </StyledIconButton>

            <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{flex: "1 0 50%", marginBottom: "10px"}}
            >
              <RedoIcon style={{  fontSize: "45px"}} titleAccess="Redo" />
            </StyledIconButton>

            <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{flex: "1 0 50%", marginBottom: "10px"}}
            >
              <CompressIcon style={{  fontSize: "45px"}} titleAccess="Compress"/>
            </StyledIconButton>

            <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{flex: "1 0 50%", marginBottom: "10px"}}
            >
              <GridViewIcon style={{fontSize: "45px"}} titleAccess="Split" />
            </StyledIconButton>

            <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{flex: "1 0 50%", marginBottom: "10px"}}
            >
              <MergeIcon style={{ fontSize: "45px"}} titleAccess="Merge"/>
            </StyledIconButton>

            <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{flex: "1 0 50%", marginBottom: "10px"}}
            >
              <ColorLensIcon style={{ fontSize: "45px"}} titleAccess="Color Subregion"/>
            </StyledIconButton>

            <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{flex: "1 0 50%", marginBottom: "10px"}}
            >
              <FormatColorFillIcon style={{ fontSize: "45px"}} titleAccess="Color Background"/>
            </StyledIconButton>

            <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{flex: "1 0 50%", marginBottom: "10px"}}
            >
              <BorderColorIcon style={{fontSize: "45px"}} titleAccess="Color Border" />
            </StyledIconButton>

            <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{flex: "1 0 50%", marginBottom: "10px"}}
            >
              <EmojiFlagsIcon style={{fontSize: "45px"}} titleAccess="Edit Legends"/>
            </StyledIconButton>

            <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{flex: "1 0 50%", marginBottom: "10px"}}
            >
              <CreateIcon style={{fontSize: "45px"}} titleAccess="Edit Text"/>
            </StyledIconButton>

            <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{marginBottom: "10px"}}
            >
              <TitleIcon style={{fontSize: "45px", float: "left"}} titleAccess="Insert Text"/>
            </StyledIconButton>
        </Box>
        <div id="edit-line2"></div>
        <br />
        <FormControl variant="standard" sx={{ 
          m: 1, 
          minWidth: 120,
          '& > :not(style)': {backgroundColor: "#D9D9D9", marginTop: '0.75%'},
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
      <Button id="publishButton" type="submit" sx={{textTransform: `none`}}>
        <p id="text">Publish</p>
      </Button>
      </Box>





    <Box id="statusBoxEdit">
      <Statusbar />
    </Box>

    <Box id="mapBoxEdit" component="form" noValidate >
      <MapContainer style={{ height: "80vh" }} zoom={2} center={[20, 100]}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {
          store.currentMap ? renderedMap : <div></div>
        }
        <FeatureGroup>
          <EditControl
            position='topright'
          />
        </FeatureGroup>
      </MapContainer>
      <input
        type="color"
        value={color}
        onChange={colorChange}
      />
      </Box>
    </Box>
  );
}

// export default Map;