import React from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';

const MapComponent = ({ trail, size }) => {
  const containerStyle = { width: size, height: size };
  const defaultCenter = { lat: 37.8117, lng: -122.1815 };
  const center = trail?.coordinates || defaultCenter;

  return (
    <div className="col-md-auto mx-md-auto p-2">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        options={{
          mapTypeId: 'roadmap',
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {trail?.coordinates && <MarkerF position={trail.coordinates} />}

      </GoogleMap>
    </div>
  );
};

export default MapComponent;
