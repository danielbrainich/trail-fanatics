import CommentLikeButton from "./CommentLikeButton";
import { Link } from "react-router-dom";
import AlertModal from "./AlertModal";


function ListComments({ comments, formatDate, user, deleteComment, postId }) {
    return (

    <div className="comments-section">
        <h5 className="mb-4 ms-3">Comments</h5>
        {comments
            .slice()
            .reverse()
            .map((comment) => (
                <div key={comment.id} className="card mb-4 p-1 pb-0">
                    <div className="card-body">
                        <h6 className="card-subtitle text-muted small mb-1">
                            {formatDate(comment.created_at)}
                        </h6>
                        <span className="text-muted">by </span>
                        <Link to={`/profiles/${comment.author_id}`}>
                            {comment.author_username}
                        </Link>
                        <p className="card-text mt-3">{comment.content}</p>
                        <div className="d-flex">
                            <CommentLikeButton
                                postId={comment.post_id}
                                commentId={comment.id}
                            />
                            {user && user.id === comment.author ? (
                                <button
                                    className="card-link custom-btn-link"
                                    onClick={() =>
                                        deleteComment(comment.id, postId)
                                    }
                                >
                                    Delete
                                </button>
                            ) : (
                                <>
                                    <button
                                        id="fakeInput"
                                        className="ms-3 custom-btn-link"
                                        data-bs-toggle="modal"
                                        data-bs-target="#nodeletecommentmodal"
                                        tabIndex="0"
                                    >
                                        Delete
                                    </button>
                                    <div
                                        className="modal fade"
                                        id="nodeletecommentmodal"
                                        data-bs-backdrop="static"
                                        data-bs-keyboard="false"
                                        tabIndex="-1"
                                        aria-labelledby="nodeletecommentmodalLabel"
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
                                                    <AlertModal
                                                        title="Hello!"
                                                        message="To delete a comment, make sure you're logged-in and it's a comment you posted"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
    </div>
    );
}

export default ListComments;
