import React, { Component } from "react";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import mapData from "./custom.json";
import "leaflet/dist/leaflet.css";
import { GlobalStoreContext } from '../store'
import { useContext, useState } from 'react'

export default function Map() {
  const { store } = useContext(GlobalStoreContext);
  const [color, setColor] = useState("#ffff00");


  // colors = ["green", "blue", "yellow", "orange", "grey"];

  // componentDidMount() {
  //   console.log(mapData);
  // }

  const countryStyle = {
    fillColor: "red",
    fillOpacity: 1,
    color: "black",
    weight: 2,
  };

  function printMesssageToConsole(event){
    console.log("Clicked");
  };

  function changeCountryColor(event){
    event.target.setStyle({
      color: "green",
      fillColor: color,
      fillOpacity: 1,
    });
  };

  function onEachCountry(country, layer){
    const countryName = country.properties.ADMIN;
    console.log(countryName);
    layer.bindPopup(countryName);

    layer.options.fillOpacity = Math.random(); //0-1 (0.1, 0.2, 0.3)
    // const colorIndex = Math.floor(Math.random() * this.colors.length);
    // layer.options.fillColor = this.colors[colorIndex]; //0

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