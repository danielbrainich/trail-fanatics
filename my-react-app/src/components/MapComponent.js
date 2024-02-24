import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const MapComponent = ({ trail }) => {
  const containerStyle = { width: '325px', height: '325px' };
  const defaultCenter = { lat: 37.8117, lng: -122.1815 };

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
        {trail.coordinates && <Marker position={trail.coordinates[0]} />}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
