import React, { useState, useEffect } from 'react';
import useCsrfToken from '../hooks/useCsrfToken';
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import MapComponent from './MapComponent';

const DummyTrail = ({ trail }) => (
  <div className="col-xs-12 col-sm-10 col-md-6 col-lg-4">
    <div className="card h-100">
      <div className="card-body d-flex justify-content-center align-items-center">
        <MapComponent trail={trail} size="250px" />
      </div>
      <div className="card-body">
        <h5 className="card-title">{trail.name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{trail.creator}</h6>
        <p className="card-text">{trail.description}</p>
      </div>
    </div>
  </div>
);

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

  const dummyTrail = {
    name: "Canyon Meadow",
    creator: "Daniel",
    description: "Canyon Meadow is a beautiful corner of Redwood Regional Park in the Oakland Hills. Run the Stream Trail some fast and flat running along a beautiful creek. Or take the Chown Trail up to the ridge line for some serious vert on well-maintained single-track. You'll see huge redwoods and lush greenery down in the canyon. And up on the rocky ridge line, you'll get a great view of the bay.",
    coordinates: {
      lat: 37.8142,
      lng: -122.1838
    }
  };


  if (!user) {
    return (
      <div className="container mt-3 mt-md-5">
        <div className="row">
          <div className="col d-flex flex-column">
            <p>Please sign in and save some maps to see them here. Here's a sample map:</p>
              <DummyTrail trail={dummyTrail} />
          </div>
        </div>
      </div>
    );
  }

  if (savedTrails.length === 0) {
    return (
      <div className="container mt-3 mt-md-5">
        <div className="row">
          <div className="col d-flex flex-column">
            <p>You don't have any saved maps. When you save maps from your social feed, you'll see them here. Here's a sample map:</p>
              <DummyTrail trail={dummyTrail} />
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="container mt-3 mt-md-5">
      <div className="row">
      <h5 className="mb-4">My Saved Maps</h5>
        {savedTrails.map((trail, index) => (
          <div key={index} className="col-xs-12 col-sm-10 col-md-6 col-lg-4">
            <div className="card h-100 p-4">
              <div class="mb-4 d-flex align-items-center">
                <MapComponent trail={trail.trail} size="250px" />
              </div>
              <div className="card-body">
                <h5 className="card-title mb-3">{trail.trail.name}</h5>
                <Link to={`/profiles/${trail.trail.creator.id}`}><h6 className="card-subtitle mb-3 text-muted">{trail.trail.creator.username}</h6></Link>
                <p className="card-text mb-4">{trail.trail.description}</p>
                <button className="btn btn-primary" onClick={() => handleUnsaveTrail(trail.trail.id)}>
                  Unsave
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListTrails;
