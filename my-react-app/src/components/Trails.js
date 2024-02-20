import React, { useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = { width: '400px', height: '400px' };
const center = { lat: -34.397, lng: 150.644 };
const libraries = ["drawing"];

function MyMap() {
  console.log("keykey", process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });
  const mapRef = useRef(null);
  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: window.google.maps.drawing.OverlayType.POLYLINE,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ['polyline']
        },
        polylineOptions: {
          strokeColor: '#ff0000',
          strokeWeight: 2,
          clickable: false,
          editable: true,
          zIndex: 1
        }
      });
      drawingManager.setMap(mapRef.current);
    }
  }, [isLoaded]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
    >
      {/* Map content */}
    </GoogleMap>
  ) : <div>Loading...</div>;
}

export default MyMap;
