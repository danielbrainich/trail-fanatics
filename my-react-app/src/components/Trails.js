import React, { useRef, useEffect, useState } from 'react';
import useCsrfToken from '../hooks/useCsrfToken';
import useAuth from '../hooks/useAuth';
import NewTrails from './TrailsNew';


function ListTrails() {
  const [trailSuccess, setTrailSuccess] = useState(false);

return (
  <div className="container mt-5">
      <div className="row d-flex align-items-stretch">
        <div className="col-md-7 d-flex flex-fill">
          <div className="card w-100 mb-4">
            <div className="card-body">
              <h5 className="card-title">Add a Trail</h5>
              <p className="card-text">Add to the conversation. </p>
              <div className="form-group">
                <div id="fakeInput" className="form-control" data-bs-toggle="modal" data-bs-target="#staticBackdrop" role="button" tabIndex="0">
                  What's on your mind?
                </div>
              </div>
            </div>
          </div>

          <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <NewTrails setTrailSuccess={setTrailSuccess} trailSuccess={trailSuccess} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
);
}

export default ListTrails;
