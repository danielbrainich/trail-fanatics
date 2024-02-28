import React, { useState, useEffect } from 'react';
import useCsrfToken from '../hooks/useCsrfToken';
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import MapComponent from './MapComponent';

function ListTrails() {
  const [trailSuccess, setTrailSuccess] = useState(false);
  const [savedTrails, setSavedTrails] = useState([]);
  const { user } = useAuthContext();
  const csrfToken = useCsrfToken();


  const fetchSavedTrails = async () => {
    try {
      if (user) {
        const response = await fetch('http://localhost:8000/trails/saved_trails/', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch saved trails');
        }
        const data = await response.json();
        setSavedTrails(data.results);
      }
    } catch (error) {
      console.error('Error fetching saved trails:', error);
    }
  };

  useEffect(() => {
    fetchSavedTrails();
  }, [user]);

  const handleUnsaveTrail = async (trailId) => {
    try {
      const response = await fetch(`http://localhost:8000/trails/saved_trails/${trailId}/`, {
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


  return (
    <div className="container mt-3 mt-md-5">
      <div className="row d-flex align-items-stretch">
        <div className="col-md-7 d-flex flex-column flex-fill">
          <div>
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="saved-trails" role="tabpanel" aria-labelledby="saved-trails-tab">
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
