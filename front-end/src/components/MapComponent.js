import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const MapComponent = ({ trail }) => {
  const containerStyle = { width: '300px', height: '300px' };
  const defaultCenter = { lat: 37.8117, lng: -122.1815 };
  const center = trail?.coordinates || defaultCenter;

  return (
    <div className="col-md-auto mx-md-auto p-3">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={8}
        options={{
          mapTypeId: 'roadmap',
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {trail?.coordinates && (
          <Marker position={center} />
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
