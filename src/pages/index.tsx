import React, { useState, useEffect, useCallback} from 'react';
import useGoogleSheets from 'use-google-sheets';

import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsService } from '@react-google-maps/api';

// @ts-ignore
const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const center = {
  lat: 37.575275,
  lng: 36.922821
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_KEY
  })
  
  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.NEXT_PUBLIC_SHEET_KEY,
    sheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
  });

  const localData = [
    { position: {lat: 37.570219, lng:  36.912677}, address: "Gayberli, 28011. Sokak, Onikişubat/Kahramanmaraş"},
    { position: {lat: 36.240384, lng: 36.173394}, address: "Güzel burç Mahallesi,600 konutlar sitesi 1.blok Antaky"},
    { position: {lat: 37.763685, lng: 38.301935}, address: "Siteler, Atatürk Bv, 02200 Adıyaman Merkez  atatürk bulvarı white star otel"},
  ]

  const [map, setMap] = useState(null);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(localData[0]);
  const [selectedPlace, setSelectedPlace] = useState({name: localData[0].address, latLng: localData[0].position });

  useEffect(() => {
    if (!loading && !error) {
      setMap(map);
    }
  }, [loading])

  const onLoad = useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    bounds.extend({lat: 36.217161, lng: 36.130268});
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const onMarkerClick = (marker) => {
      setActiveMarker(marker);
      setShowingInfoWindow(true);
    };

  const onInfoWindowClose = () => {
    setActiveMarker(null);
    setShowingInfoWindow(false);
  };

  const pseudoMarkerClick = (args, address, position) => {
    onMarkerClick(args);
    setSelectedPlace({name: address, latLng: position })
  }

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={9}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        { !loading && !error && data[0].data.map(({address, enlem, boylam}, index) =>
          <Marker 
            key={index} 
            onClick={(args) => pseudoMarkerClick(args, address, {lat: parseFloat(enlem), lng: parseFloat(boylam)})} position={{lat: parseFloat(enlem), lng: parseFloat(boylam)}} 
            name="1"
            icon={{
              url: "https://enkazbildiri.s3.amazonaws.com/enkaz.png", 
              scaledSize: new google.maps.Size(67, 67)
          }}
          />
        )}
        activeMarker ? <InfoWindow
          marker={activeMarker}
          onClose={onInfoWindowClose}
          visible={showingInfoWindow}
          position={activeMarker?.latLng ? activeMarker?.latLng : center}
        >
          <div>
            <h1>Enlem: {selectedPlace?.latLng?.lat} Boylam: {selectedPlace?.latLng?.lng}</h1>
            <h4>{selectedPlace?.name}</h4>
          </div>
        </InfoWindow> : null
        map()
      </GoogleMap>
  ) : <></>
}

export default React.memo(MyComponent)