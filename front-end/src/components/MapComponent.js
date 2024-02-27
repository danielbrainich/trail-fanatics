import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const MapComponent = ({ trail }) => {
  const containerStyle = { width: '325px', height: '325px' };
  const defaultCenter = { lat: 37.8117, lng: -122.1815 };
  const center = (trail && trail.coordinates && trail.coordinates.length > 0) ? trail.coordinates[0] : defaultCenter;
  console.log("trail", trail);

  return (
    <div className="col-md-auto mx-md-auto p-3">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={trail.coordinates[0] || defaultCenter}
        zoom={12}
        options={{
          mapTypeId: 'roadmap',
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {trail && trail.coordinates && trail.coordinates.length > 0 && (
          <Marker position={center} />
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
