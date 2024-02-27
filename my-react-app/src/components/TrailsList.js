import React, { useState, useEffect } from 'react';
import useCsrfToken from '../hooks/useCsrfToken';
import { Link } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import NewTrails from './TrailsNew';
import AlertModal from './AlertModal';
import { useAuthContext } from "../contexts/AuthContext";
import MapComponent from './MapComponent';

function ListTrails() {
  const [trailSuccess, setTrailSuccess] = useState(false);
  const [myTrails, setMyTrails] = useState([]);
  const [otherTrails, setOtherTrails] = useState([]);
  const [savedTrails, setSavedTrails] = useState([]);
  const { user } = useAuthContext();
  const csrfToken = useCsrfToken();


  useEffect(() => {
    if (user) {
      const fetchTrails = async () => {
        await fetchMyTrails();
        await fetchOtherTrails();
        await fetchSavedTrails();
      };
      fetchTrails();
    }
  }, [user, trailSuccess]);

  const fetchAPI = async (url, options = {}) => {
    try {
      const response = await fetch(url, { ...options, credentials: 'include' });
      if (!response.ok) {
        console.error(`Fetch error: ${response.status} ${response.statusText}`);
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  const fetchMyTrails = async () => {
    const data = await fetchAPI('http://localhost:8000/activities/trails/');
    setMyTrails(data.filter(trail => trail.creator.id === user.id));
  };

  const fetchOtherTrails = async () => {
    const data = await fetchAPI('http://localhost:8000/activities/trails/');
    setOtherTrails(data.filter(trail => trail.creator.id !== user.id));
  };


  const fetchSavedTrails = async () => {
    const data = await fetchAPI('http://localhost:8000/activities/saved_trails/', { credentials: 'include' });
    setSavedTrails(data);
  };


  const handleSaveTrail = async (trailId) => {
    try {
      const response = await fetch(`http://localhost:8000/activities/saved_trails/${trailId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken.csrfToken,
        },
        credentials: 'include',
      });
      if (response.ok) {
        console.log('Trail saved successfully');
        await fetchSavedTrails();
        setTrailSuccess(!trailSuccess);

      } else {
        console.error('Failed to save trail');
      }
    } catch (error) {
      console.error('Error saving trail:', error);
    }
  };

  const handleUnsaveTrail = async (trailId) => {
    try {
      const response = await fetch(`http://localhost:8000/activities/saved_trails/${trailId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken.csrfToken,
        },
        credentials: 'include',
      });
      if (response.ok) {
        console.log('Trail unsaved successfully');
        await fetchSavedTrails();
        setTrailSuccess(!trailSuccess);

      } else {
        console.error('Failed to unsave trail');
      }
    } catch (error) {
      console.error('Error unsaving trail:', error);
    }
  };

  const handleDeleteTrail = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/activities/trails/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken.csrfToken,
        },
        credentials: 'include',
      });
      if (response.ok) {
        const updatedTrails = myTrails.filter(trail => trail.id !== id);
        setMyTrails(updatedTrails);
      } else {
        console.error('Failed to delete trail');
      }
    } catch (error) {
      console.error('Error deleting trail:', error);
    }
  };

  return (
    <div className="container mt-3 mt-md-5">
      <div className="row d-flex align-items-stretch">
        <div className="col-md-7 d-flex flex-column flex-fill">
          <div>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button className="nav-link active" id="my-trails-tab" data-bs-toggle="tab" data-bs-target="#my-trails" type="button" role="tab" aria-controls="my-trails" aria-selected="true">My Trails</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link" id="other-trails-tab" data-bs-toggle="tab" data-bs-target="#other-trails" type="button" role="tab" aria-controls="other-trails" aria-selected="false">Trails Near Me</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link" id="saved-trails-tab" data-bs-toggle="tab" data-bs-target="#saved-trails" type="button" role="tab" aria-controls="saved-trails" aria-selected="false">Saved Trails</button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="my-trails" role="tabpanel" aria-labelledby="my-trails-tab">
                <div className="d-flex my-4">
                  <button type="button" className="btn btn-primary new-trail-button" data-bs-toggle="modal" data-bs-target="#addTrailModal">
                    + New Trail
                  </button>
                </div>
                <div className="modal fade" id="addTrailModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addTrailModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        {user ? (
                          <NewTrails setTrailSuccess={setTrailSuccess} />
                        ) : (
                          <AlertModal title="Hello!" feature="create a new trail" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {myTrails.map((trail, index) => (
                  <div key={index} className="my-4">
                    <div className="card">
                      <div className="row g-0">
                        <div className="col-md-auto mx-md-auto p-3 d-flex justify-content-center">
                          <MapComponent trail={trail} />
                        </div>
                        <div className="col-md">
                          <div className="card-body">
                            <h5 className="card-title">{trail.name}</h5>
                            <Link to={`/profiles/${trail.creator.id}`}><h6 className="card-subtitle mb-2 text-muted">{trail.creator.username}</h6></Link>
                            <p className="card-text">{trail.description}</p>
                            <button className="btn btn-primary" onClick={() => handleDeleteTrail(trail.id, trail.creator.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="tab-pane fade" id="other-trails" role="tabpanel" aria-labelledby="other-trails-tab">
              {otherTrails.map((trail, index) => (
                  <div key={index} className="my-4">
                    <div className="card">
                      <div className="row g-0">
                        <div className="col-md-auto mx-md-auto p-3">
                          <MapComponent trail={trail} />
                        </div>
                        <div className="col-md">
                          <div className="card-body">
                            <h5 className="card-title">{trail.name}</h5>
                            <Link to={`/profiles/${trail.creator.id}`}><h6 className="card-subtitle mb-2 text-muted">{trail.creator.username}</h6></Link>
                            <p className="card-text">{trail.description}</p>
                            {trail.is_saved ? (
                            <button className="btn btn-tertiary" disabled>
                              Save
                            </button>
                            ) : (
                            <button className="btn btn-primary" onClick={() => handleSaveTrail(trail.id)}>
                              Save
                            </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="tab-pane fade" id="saved-trails" role="tabpanel" aria-labelledby="saved-trails-tab">
                {savedTrails.map((trail, index) => (
                  <div key={index} className="my-4">
                    <div className="card">
                      <div className="row g-0">
                        <div className="col-md-auto mx-md-auto p-3">
                          <MapComponent trail={trail.trail} />
                        </div>
                        <div className="col-md">
                          <div className="card-body">
                            <h5 className="card-title">{trail.trail.name}</h5>
                            <Link to={`/profiles/${trail.trail.creator.id}`}><h6 className="card-subtitle mb-2 text-muted">{trail.trail.creator.username}</h6></Link>
                            <p className="card-text">{trail.trail.description}</p>
                            <button className="btn btn-primary" onClick={() => handleUnsaveTrail(trail.trail.id)}>
                              Unsave
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListTrails;
