import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import useCsrfToken from '../hooks/useCsrfToken';
import useAuth from '../hooks/useAuth';

const containerStyle = { width: '400px', height: '400px' };
const center = { lat: 37.8117, lng: -122.1815 };
const libraries = ['places'];

function NewTrails( {setTrailSuccess, trailSuccess} ) {
  const { user } = useAuth();
  const csrfToken = useCsrfToken();
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [formData, setFormData] = useState({
    trailName: '',
    trailDescription: '',
  });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapError, setMapError] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      trailName: '',
      trailDescription: '',
    });
    setMarkerPosition(null);
  };

  const saveMap = async () => {
    if (!markerPosition) {
      console.error('No coordinates selected for the trail.');
      return;
    }
    const trailData = {
      name: formData.trailName,
      description: formData.trailDescription,
      creator: user ? user.id : null,
      coordinates: [markerPosition],
    };

    try {
      const apiUrl = 'http://localhost:8000/activities/my_trails/';
      const response = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken.csrfToken,
        },
        body: JSON.stringify(trailData),
      });

      if (response.ok) {
        console.log('Trail saved successfully');
        resetForm();
        setTrailSuccess(!trailSuccess);
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
              name="trailName"
              value={formData.trailName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="trailDescription">Trail Description:</label>
            <textarea
              id="trailDescription"
              className="form-control"
              name="trailDescription"
              value={formData.trailDescription}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          <div className="text-end">
              <button className="btn btn-secondary me-2" data-bs-dismiss="modal" onClick={resetForm} type="button">
                Clear
              </button>
              <button className="btn btn-primary" data-bs-dismiss="modal" onClick={saveMap} type="button">
                Save Trail
              </button>
          </div>
        </div>
    </div>
  ) : <div>Loading...</div>;
}

export default NewTrails;
