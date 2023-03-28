import React, { useState, useCallback } from 'react';
import { withGoogleMap, GoogleMap, Polygon, useJsApiLoader } from '@react-google-maps/api';
import customGeoJSON from './custom.json';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: -28, lng: 137
};

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: '' // API KEY NEEDED TO RENDER MAP
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    map.data.addGeoJson(customGeoJSON);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Polygon
        paths={customGeoJSON.features[0].geometry.coordinates[0]}
        options={{
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        }}
      />
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(Map)