import { useState } from "react";
import useCsrfToken from '../hooks/useCsrfToken';
import useAuth from '../hooks/useAuth';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = { width: '300px', height: '300px' };
const center = { lat: 37.8117, lng: -122.1815 };

function NewPosts({ setPostSuccess, postSuccess, setTagsList, tagsList}) {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction ? '' : process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    content: "",
    tags: [],
    author: user ? user.id : null,
    trailName: '',
    trailDescription: '',
    trailCoordinates: null,
  });
  const {csrfToken, updateCsrfToken} = useCsrfToken();
  const [markerPosition, setMarkerPosition] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const onMapClick = (e) => {
    setMarkerPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
    setFormData({
      ...formData,
      trailCoordinates: { lat: e.latLng.lat(), lng: e.latLng.lng() },
    });
  };

  const resetForm = () => {
    setFormData({
      content: "",
      tags: [],
      trailName: "",
      trailDescription: "",
      trailCoordinates: null,
    });
    setMarkerPosition(null);
    setShowMap(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { trailName, trailDescription, trailCoordinates, ...postFields } = formData;

    const payload = {
      post: postFields,
    };

    if (showMap && trailName && trailDescription && trailCoordinates) {
      payload.trail = {
        name: trailName,
        description: trailDescription,
        coordinates: trailCoordinates,
      };
    }

    const apiUrl = `${baseUrl}/content/posts/`;

    if (!csrfToken) {
      await updateCsrfToken();
    }
    const fetchConfig = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: 'include',
    };
    const response = await fetch(apiUrl, fetchConfig);

    if (response.ok) {
      event.target.reset();
      setFormData({
        content: "",
        tags: [],
        author: user ? user.id : null,
        trailName: '',
        trailDescription: '',
        trailCoordinates: null,
      });
      setPostSuccess(!postSuccess);
    } else {
      console.error('Failed to create post');
    }
  };

  const handleChangeInput = (e) => {
    const { name, options } = e.target;

    if (name === "tags") {
      const selectedTags = Array.from(options).filter(option => option.selected).map(option => option.value);
      setFormData({
        ...formData,
        [name]: selectedTags,
      });
    } else {
      setFormData({
        ...formData,
        [name]: e.target.value,
      });
    }
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setFormData(prevFormData => {
      const isTagSelected = prevFormData.tags.includes(value);

      if (isChecked && !isTagSelected) {
        return { ...prevFormData, tags: [...prevFormData.tags, value] };
      } else if (!isChecked && isTagSelected) {
        return { ...prevFormData, tags: prevFormData.tags.filter(tagId => tagId !== value) };
      } else {
        return prevFormData;
      }
    });
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <div className="card w-100 my-3 border-0">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tags</label>
            <div className="checkbox-grid mb-4">
              {tagsList && tagsList.map((tag) => (
              <div key={tag.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={tag.id}
                  id={`tag-${tag.id}`}
                  onChange={handleCheckboxChange}
                  checked={formData.tags.includes(tag.id.toString())}
                />
              <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
              {tag.name}
              </label>
            </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="form-label">Content</label>
            <textarea
              name="content"
              className="form-control"
              value={formData.content}
              onChange={handleChangeInput}
              rows="4"
            ></textarea>
          </div>

        <div className="mb-2 form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        id="showMapToggle"
        checked={showMap}
        onChange={(e) => setShowMap(e.target.checked)}
      />
      <label className="form-check-label" htmlFor="showMapToggle">Add a Map</label>
    </div>

    {showMap && isLoaded && !loadError && (
      <>
      <div className="mb-3">Click on the map to place a marker at the trail-head.</div>
      <div className="mb-4" style={{ height: "300px", width: "300px" }}>
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
      <div className="mb-4">
        <label htmlFor="trailName" className="form-label">Map Name</label>
        <input
          type="text"
          className="form-control"
          id="trailName"
          name="trailName"
          value={formData.trailName}
          onChange={handleChangeInput}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="trailDescription" className="form-label">Map Description</label>
        <textarea
          className="form-control"
          id="trailDescription"
          name="trailDescription"
          rows="3"
          value={formData.trailDescription}
          onChange={handleChangeInput}
        ></textarea>
      </div>
      </>
    )}
        </div>
          <div className="text-end">
          <button
              className="btn btn-outline-primary me-2"
              type="button"
              onClick={resetForm}
            >
              Reset
            </button>
            <button className="btn btn-primary" data-bs-dismiss="modal" type="submit">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPosts;
