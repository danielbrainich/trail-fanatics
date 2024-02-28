
function AlertModal({ title, message }) {
    return (
        <div className="card w-100 my-3 border-0">
            <h5 className="card-title ms-3">{title}</h5>
            <div className="card-body">
                <p className="card-text">{message}.</p>
                <div className="text-end">
                    <button className="btn btn-primary me-2" data-bs-dismiss="modal" type="reset">
                    Got it!
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AlertModal;
