import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NewComment from "./CommentsNew";
import PostLikeButton from "./PostLikeButton";
import { Link } from "react-router-dom";
import useCsrfToken from "../hooks/useCsrfToken";
import AlertModal from "./AlertModal";
import { useAuthContext } from "../contexts/AuthContext";
import ListComments from "./CommentsList";
import ShowTrail from "./TrailShow";

function ShowPost() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [commentSuccess, setCommentSuccess] = useState(false);
    const [tagsList, setTagsList] = useState([]);
    const { user } = useAuthContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const csrfToken = useCsrfToken();
    const [savedTrails, setSavedTrails] = useState([]);
    const [trailSuccess, setTrailSuccess] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const isProduction = process.env.NODE_ENV === "production";
    const baseUrl = isProduction
        ? ""
        : process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

    const fetchSavedTrails = async () => {

        if (!user) {
            setSavedTrails([]);
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/trails/saved_trails/`, {
                credentials: "include",
            });
            if (!response.ok) {
                console.error(
                    `Fetch error: ${response.status} ${response.statusText}`
                );
                throw new Error(
                    `Network response was not ok: ${response.status}`
                );
            }
            const data = await response.json();
            setSavedTrails(data.results);
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchSavedTrails();
    }, [trailSuccess]);

    useEffect(() => {
        const fetchTags = async () => {
            const apiUrl = `${baseUrl}/content/tags/`;
            const response = await fetch(apiUrl);
            if (response.ok) {
                const tags = await response.json();
                setTagsList(tags);
            } else {
                console.error("Failed to fetch tags");
            }
        };

        fetchTags();
    }, []);

    useEffect(() => {
        const fetchComments = async () => {
            const apiUrl = `${baseUrl}/content/posts/${postId}/comments/?page=${currentPage}`;
            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data.results.reverse());
                    setTotalComments(data.total);
                    setTotalPages(data.total_pages);
                } else {
                    console.error("Failed to fetch comments");
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [postId, commentSuccess, currentPage, totalComments]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(
                    `${baseUrl}/content/posts/${postId}/`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPost(data);
            } catch (error) {
                console.error("Could not fetch the post:", error);
            }
        };

        fetchPost();
    }, [postId]);

    if (!post) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-90">
                <div className="spinner-grow text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const deletePost = async (postId) => {
        const apiUrl = `${baseUrl}/content/posts/${postId}/`;
        const fetchConfig = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken.csrfToken,
            },
            credentials: "include",
        };
        const response = await fetch(apiUrl, fetchConfig);
        navigate("/social");
    };

    const deleteComment = async (commentId, postId) => {
        const apiUrl = `${baseUrl}/content/posts/${postId}/comments/${commentId}/`;
        const fetchConfig = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken.csrfToken,
            },
            credentials: "include",
        };

        try {
            const response = await fetch(apiUrl, fetchConfig);
            if (!response.ok) {
                throw new Error("Error deleting comment");
            }

            setComments((currentComments) =>
                currentComments.filter((comment) => comment.id !== commentId)
            );
        } catch (error) {
            console.error("Could not delete comment:", error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        const hours = date.getHours() % 12 || 12;
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
            .format(date)
            .replace(/(\d+):(\d+)/, `${hours}:$2`);
    }

    function renderPagination() {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li
                    key={i}
                    className={`page-item ${i === currentPage ? "active" : ""}`}
                >
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </button>
                </li>
            );
        }

        return (
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                    </li>
                    {pages}
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        );
    }

    const handleSaveTrail = async (trailId) => {
        try {
            const response = await fetch(
                `${baseUrl}/trails/saved_trails/${trailId}/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken.csrfToken,
                    },
                    credentials: "include",
                }
            );
            if (response.ok) {
                console.log("Trail saved successfully");
                await fetchSavedTrails();
                setTrailSuccess(!trailSuccess);
            } else {
                console.error("Failed to save trail");
            }
        } catch (error) {
            console.error("Error saving trail:", error);
        }
    };

    return (
        <div className="content">
            <div className="container mt-3 mt-md-5">
                <div className="col-12 mb-3" key={post.id}>
                    <div className="card mb-4 p-1 pb-0">
                        <div className="card-body">
                            <div className="row">
                                <div
                                    className={`d-flex flex-column align-items-between justify-content-between ${
                                        post.trail ? "col-lg-8" : "col-12"
                                    }`}
                                >
                                    <div>
                                        <h6 className="card-subtitle text-muted small mb-1">
                                            {formatDate(post.created_at)}
                                        </h6>
                                        <span className="text-muted">by </span>
                                        <Link
                                            to={`/profiles/${post.author_id}`}
                                        >
                                            {post.author_username}
                                        </Link>
                                        <p className="card-text my-3">
                                            {post.content}
                                        </p>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <div className="mb-2">
                                            {tagsList &&
                                                post.tags &&
                                                tagsList.length > 0 &&
                                                post.tags.map((tagId) => {
                                                    const tagObj =
                                                        tagsList.find(
                                                            (tag) =>
                                                                tag.id === tagId
                                                        );
                                                    return (
                                                        <div
                                                            key={tagId}
                                                            className="badge mb-2 me-2"
                                                        >
                                                            {tagObj
                                                                ? tagObj.name
                                                                : "Unknown Tag"}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                        <div>
                                            <PostLikeButton postId={post.id} />
                                            {/* <Link to="#" className="card-link">Edit</Link> */}
                                            {user && user.id === post.author ? (
                                                <button
                                                    className="custom-btn-link ms-3"
                                                    onClick={() =>
                                                        deletePost(post.id)
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
                                                        data-bs-target="#nodeletemodal"
                                                        tabIndex="0"
                                                    >
                                                        Delete
                                                    </button>
                                                    <div
                                                        className="modal fade"
                                                        id="nodeletemodal"
                                                        data-bs-backdrop="static"
                                                        data-bs-keyboard="false"
                                                        tabIndex="-1"
                                                        aria-labelledby="nodeletemodalLabel"
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
                                                                    <AlertModal message="To delete a post, make sure you're logged-in and it's a post you posted" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <ShowTrail post={post} user={user} savedTrails={savedTrails} handleSaveTrail={handleSaveTrail}/>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">New Comment</h5>
                            <div className="form-group">
                                <div
                                    id="fakeInput"
                                    className="form-control"
                                    data-bs-toggle="modal"
                                    data-bs-target="#commentModal"
                                    role="button"
                                    tabIndex="0"
                                >
                                    What's on your mind?
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="modal fade"
                        id="commentModal"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex="-1"
                        aria-labelledby="commentModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5
                                        className="modal-title fs-5"
                                        id="staticBackdropLabel"
                                    >
                                        New Comment
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    {user ? (
                                        <NewComment
                                            postId={postId}
                                            setCommentSuccess={
                                                setCommentSuccess
                                            }
                                            commentSuccess={commentSuccess}
                                        />
                                    ) : (
                                        <AlertModal message="Please signup or login to comment on this post" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <ListComments comments={comments} formatDate={formatDate} user={user} deleteComment={deleteComment} postId={postId} />
                </div>
            </div>
            <div className="pagination-container">{renderPagination()}</div>
        </div>
    );
}

export default ShowPost;
