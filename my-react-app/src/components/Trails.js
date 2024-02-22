import React, { useRef, useEffect, useState } from 'react';
import useCsrfToken from '../hooks/useCsrfToken';
import useAuth from '../hooks/useAuth';
import NewTrails from './TrailsNew';


function ListTrails() {
  const [trailSuccess, setTrailSuccess] = useState(false);

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
                  <NewTrails setTrailSuccess={setTrailSuccess} trailSuccess={trailSuccess} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="my-trails-tab" data-bs-toggle="tab" data-bs-target="#my-trails-tab-pane" type="button" role="tab" aria-controls="my-trails-tab-pane" aria-selected="true">My Trails</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="saved-trails-tab" data-bs-toggle="tab" data-bs-target="#saved-trails-tab-pane" type="button" role="tab" aria-controls="saved-trails-tab-pane" aria-selected="false">Saved Trails</button>
              </li>
            </ul>
            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade show active" id="my-trails-tab-pane" role="tabpanel" aria-labelledby="my-trails-tab" tabindex="0">
                <div>This is where all of my trails will live</div>
              </div>
              <div class="tab-pane fade" id="saved-trails-tab-pane" role="tabpanel" aria-labelledby="saved-trails-tab" tabindex="0">
                <div>This is where everyone else's information will live</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
);
}

export default ListTrails;
