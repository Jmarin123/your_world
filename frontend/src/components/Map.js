import React from "react";
//Component
import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet';
// import mapData from "./custom.json";
import "leaflet/dist/leaflet.css";
import { GlobalStoreContext } from '../store'
import { useContext, useState} from 'react'
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"

export default function Map() {
  const { store } = useContext(GlobalStoreContext);
  const [color] = useState("#ffff00");
  //setColor


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

  function onEachCountry(country, layer){
    const countryName = country.properties.ADMIN;
    console.log(countryName);
    layer.bindPopup(countryName);

    layer.options.fillOpacity = Math.random(); 

    layer.on({
      click: this.changeCountryColor,
    });
  };

  function colorChange(event){
    this.setState({ color: event.target.value });
  };


  let renderedMap = <GeoJSON
            style={countryStyle}
            data={store.currentMap ? store.currentMap.features : null}
            onEachFeature={onEachCountry}
          />

    return (
      <div>
        <h1 style={{ textAlign: "center" }}>Your World</h1>
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
      </div>
    );
}

// export default Map;