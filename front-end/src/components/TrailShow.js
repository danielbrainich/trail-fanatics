import MapComponent from "./MapComponent";
import AlertModal from "./AlertModal";

function ShowTrail({ post, user, savedTrails, handleSaveTrail }) {
    if (!post.trail || !post.trail.name) {
        return null;
    }

    return (
        <div className="d-flex col-lg-4 justify-content-lg-end">
            <div
                className="d-flex flex-column mt-3 mt-lg-0"
                style={{
                    width: "270px",
                }}
            >
                <MapComponent trail={post.trail} size="250px" />
                <div className="d-flex justify-content-between align-items-center mt-1 mx-2">
                    <div className="w-50 me-2">
                        <button
                            type="button"
                            className="btn btn-primary btn-sm w-100"
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop"
                        >
                            Map Details
                        </button>
                    </div>

                    <div
                        className="modal fade"
                        id="staticBackdrop"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex="-1"
                        aria-labelledby="staticBackdropLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5
                                        className="modal-title fs-5"
                                        id="staticBackdropLabel"
                                    >
                                        Map Details
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body m-3">
                                    <div className="mb-3 d-flex align-items-center">
                                        <MapComponent
                                            trail={post.trail}
                                            size="350px"
                                        />
                                    </div>
                                    <h4 className="mb-3">{post.trail.name}</h4>
                                    <p className="card-text mb-3">
                                        {post.trail.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-50 ms-2">
                        <div>
                            {user ? (
                                savedTrails.some(
                                    (savedTrail) =>
                                        savedTrail.trail.id === post.trail.id
                                ) ? (
                                    <button
                                        className="btn btn-tertiary btn-sm w-100"
                                        disabled
                                    >
                                        Map Saved
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary btn-sm w-100"
                                        onClick={() =>
                                            handleSaveTrail(post.trail.id)
                                        }
                                    >
                                        Save Map
                                    </button>
                                )
                            ) : (
                                <div key={post.trail.id}>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm w-100"
                                        data-bs-toggle="modal"
                                        data-bs-target="#saveTrailModal"
                                    >
                                        Save Map
                                    </button>
                                    <div
                                        className="modal fade"
                                        id="saveTrailModal"
                                        data-bs-backdrop="static"
                                        data-bs-keyboard="false"
                                        tabIndex="-1"
                                        aria-labelledby="saveTrailModalLabel"
                                        aria-hidden="true"
                                    >
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        data-bs-dismiss="modal"
                                                        aria-label="Close"
                                                    ></button>
                                                </div>
                                                <div className="modal-body">
                                                    <AlertModal message="Please signup or login to save a trail" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowTrail;
