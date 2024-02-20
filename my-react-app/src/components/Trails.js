import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = { width: '400px', height: '400px' };
const center = { lat: -34.397, lng: 150.644 };
const libraries = ["drawing"];

function MyMap() {
  const [mapError, setMapError] = useState(null);
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });
  const mapRef = useRef(null);
  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (loadError) {
      setMapError(loadError);
    }
    if (isLoaded && mapRef.current) {
      // Your map initialization code here
    }
  }, [isLoaded, loadError]);

  if (mapError) {
    return <div>Error loading map: {mapError.message}</div>;
  }

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
