import React, { Component } from "react";
import { MapContainer, GeoJSON } from 'react-leaflet';
import mapData from "./custom.json";
import "leaflet/dist/leaflet.css";
import { TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"

class Map extends Component {

  state = { color: "#ffff00" };
  colors = ["green", "blue", "yellow", "orange", "grey"];
  componentDidMount() {
    console.log(mapData);
  }

  countryStyle = {
    fillColor: "red",
    fillOpacity: 1,
    color: "black",
    weight: 2,
  };

  printMesssageToConsole = (event) => {
    console.log("Clicked");
  };

  changeCountryColor = (event) => {
    event.target.setStyle({
      color: "green",
      fillColor: this.state.color,
      fillOpacity: 1,
    });
  };

  onEachCountry = (country, layer) => {
    const countryName = country.properties.ADMIN;
    console.log(countryName);
    layer.bindPopup(countryName);

    layer.options.fillOpacity = Math.random(); 

    layer.on({
      click: this.changeCountryColor,
    });
  };

  colorChange = (event) => {
    this.setState({ color: event.target.value });
  };


  render() {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>Your World</h1>
        <MapContainer style={{ height: "80vh" }} zoom={2} center={[20, 100]}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GeoJSON
            style={this.countryStyle}
            data={mapData.features}
            onEachFeature={this.onEachCountry}
          />
          <FeatureGroup>
          <EditControl
            position='topright'
            onEdited={this._onEditPath}
            onCreated={this._onCreate}
            onDeleted={this._onDeleted}
            draw={{
              rectangle: false
            }}
          />

        </FeatureGroup>
        </MapContainer>
        <input
          type="color"
          value={this.state.color}
          onChange={this.colorChange}
        />
      </div>
    );
  }
}

export default Map;