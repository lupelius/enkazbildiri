import React, { useState, useEffect, useCallback} from 'react';

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
    googleMapsApiKey: "AIzaSyA8N1E6wIQVBNFCoapNIgn4A6qhxxXFqo0"
  })
  const data = [
    { position: {lat: 36.217161, lng: 36.130268}, address: "Altınçay mahallesi 130 sokak TOKİ 9DGA-2 sitesi DGA-2 blok no:2F Antakya Hatay"},
    { position: {lat: 37.570219, lng:  36.912677}, address: "Gayberli, 28011. Sokak, Onikişubat/Kahramanmaraş"},
    { position: {lat: 37.773105, lng:   38.254780}, address: "CUMHURİYET MAH. 25136 SK. N:14B/3 MERKEZ / ADIYAMAN."},
    {position: {lat: 36.240384, lng: 36.173394}, address: "Güzel burç Mahallesi,600 konutlar sitesi 1.blok Antaky"},
    {position: {lat: 37.763685, lng: 38.301935}, address: "Siteler, Atatürk Bv, 02200 Adıyaman Merkez  atatürk bulvarı white star otel"}
    

  ]

  const [map, setMap] = useState(null);
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(data[1]);
  const [selectedPlace, setSelectedPlace] = useState({name: data[1].address, latLng: data[1].position });

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
        { data.map(({address, position}, index) =>
          <Marker key={index} onClick={(args) => pseudoMarkerClick(args, address, position)} position={position} name="1" />
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