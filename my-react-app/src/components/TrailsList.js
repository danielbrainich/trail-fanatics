import React, { useRef, useEffect, useState } from 'react';
import useCsrfToken from '../hooks/useCsrfToken';
import useAuth from '../hooks/useAuth';
import NewTrails from './TrailsNew';
import AlertModal from './AlertModal';
import { useAuthContext } from '../contexts/AuthContext';


function ListTrails() {
  const [trailSuccess, setTrailSuccess] = useState(false);
  const [myTrails, setMyTrails] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      fetchMyTrails();
    }
  }, [user]);

  const fetchMyTrails = async () => {
    try {
      const apiUrl = 'http://localhost:8000/activities/trails/';
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setMyTrails(data);
      } else {
        console.error('Failed to fetch my trails');
      }
    } catch (error) {
      console.error('Error fetching my trails:', error);
    }
  };

return (
  <div className="container mt-3 mt-md-5">
      <div className="row d-flex align-items-stretch">
        <div className="col-md-7 d-flex flex-column flex-fill">

          <div>
            <div className="d-flex mb-4">
              <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Add New Trail
              </button>
            </div>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    {user ? (
                      <NewTrails setTrailSuccess={setTrailSuccess} trailSuccess={trailSuccess} />
                    ) : (
                      <AlertModal title="Hello!" feature="create a new trail" />
                    )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button className="nav-link active" id="my-trails-tab" data-bs-toggle="tab" data-bs-target="#my-trails-tab-pane" type="button" role="tab" aria-controls="my-trails-tab-pane" aria-selected="true">My Trails</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className="nav-link" id="saved-trails-tab" data-bs-toggle="tab" data-bs-target="#saved-trails-tab-pane" type="button" role="tab" aria-controls="saved-trails-tab-pane" aria-selected="false">Saved Trails</button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="my-trails-tab-pane" role="tabpanel" aria-labelledby="my-trails-tab" tabIndex="0">
                <div className="mt-3">
                  {myTrails.map((trail, index) => (
                      <div key={index}>{trail.name}</div>
                    ))}
                </div>
              </div>
              <div className="tab-pane fade" id="saved-trails-tab-pane" role="tabpanel" aria-labelledby="saved-trails-tab" tabIndex="0">
              <div className="mt-3">This is where everyone else's trails will live</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
);
}

export default ListTrails;
