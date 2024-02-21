import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import useCsrfToken from '../hooks/useCsrfToken';
import useAuth from '../hooks/useAuth';

const containerStyle = { width: '400px', height: '400px' };
const center = { lat: 37.8117, lng: -122.1815 };
const libraries = ['places'];

function NewTrails() {
  const { user } = useAuth();
  const [mapError, setMapError] = useState(null);
  const csrfToken = useCsrfToken();
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [trailName, setTrailName] = useState('');
  const [trailDescription, setTrailDescription] = useState('');

  useEffect(() => {
    if (loadError) {
      setMapError(loadError);
    }
  }, [loadError]);

  const onMapClick = (e) => {
    setMarkerPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  const resetForm = () => {
    setTrailName('');
    setTrailDescription('');
    setMarkerPosition(null);
  };

  const saveMap = async () => {
    try {
      const apiUrl = 'http://localhost:8000/activities/trails/';
      const response = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken.csrfToken,
        },
        body: JSON.stringify({
          name: trailName,
          description: trailDescription,
          creator: user ? user.id : null,
          coordinates: markerPosition ? [markerPosition] : [],
        }),
      });

      if (response.ok) {
        console.log('Trail saved successfully');
        resetForm();
      } else {
        console.error('Failed to save trail:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving trail:', error);
    }
  };

  if (mapError) {
    return <div>Error loading map: {mapError.message}</div>;
  }

  return isLoaded ? (
    <div className="card w-100 my-3 border-0">
        <h5 className="card-title">New Trail</h5>
        <p className="card-text">Click the map below to place a marker at your trail-head.</p>
        <div className="card-body">
          <div className="mb-3">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              onClick={onMapClick}
              options={{
                mapTypeId: 'roadmap',
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
              }}
            >
              {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="trailName">Trail Name:</label>
            <input
              type="text"
              className="form-control"
              id="trailName"
              value={trailName}
              onChange={(e) => setTrailName(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="trailDescription">Trail Description:</label>
            <textarea
              id="trailDescription"
              className="form-control"
              value={trailDescription}
              onChange={(e) => setTrailDescription(e.target.value)}
              rows="3"
            ></textarea>
          </div>
          <div className="text-end">
              <button className="btn btn-secondary me-2" onClick={resetForm} data-bs-dismiss="modal" type="reset">
                Clear
              </button>
              <button className="btn btn-primary" onClick={saveMap} data-bs-dismiss="modal" type="submit">
                Save Map
              </button>
          </div>
        </div>
    </div>
  ) : <div>Loading...</div>;
}

export default NewTrails;
