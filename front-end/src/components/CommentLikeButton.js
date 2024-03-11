import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import useCsrfToken from "../hooks/useCsrfToken";
import { useAuthContext } from "../contexts/AuthContext";
import AlertModal from "./AlertModal";

function CommentLikeButton({ commentId, postId }) {
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const { user } = useAuthContext();
    const isProduction = process.env.NODE_ENV === "production";
    const baseUrl = isProduction
        ? ""
        : process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

    useEffect(() => {
        const fetchLikeStatus = async () => {
            const response = await fetch(
                `${baseUrl}/content/posts/${postId}/comments/${commentId}/check-comment-like/`,
                {
                    credentials: "include",
                }
            );
            if (response.ok) {
                const data = await response.json();
                setLiked(data.liked);
                if (data.liked) {
                    setLikeId(data.likeId);
                }
            }
        };

        fetchLikeStatus();
    }, [commentId, postId]);

    useEffect(() => {
        const fetchLikeCount = async () => {
            const response = await fetch(
                `${baseUrl}/content/posts/${postId}/comments/${commentId}/`,
                {
                    credentials: "include",
                }
            );
            if (response.ok) {
                const data = await response.json();
                setLikeCount(data.like_count);
            }
        };

        fetchLikeCount();
    }, [commentId, liked, postId]);

    const csrfToken = useCsrfToken();

    const toggleLike = async () => {
        if (!liked) {
            try {
                const response = await fetch(
                    `${baseUrl}/content/posts/${postId}/comments/${commentId}/comment-likes/`,
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
                    const data = await response.json();
                    setLikeId(data.id);
                    setLiked(true);
                } else {
                    console.error("Failed to create like");
                }
            } catch (error) {
                console.error("Error creating like:", error);
            }
        } else {
            try {
                if (likeId) {
                    const response = await fetch(
                        `${baseUrl}/content/posts/${postId}/comments/${commentId}/comment-likes/${likeId}/`,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRFToken": csrfToken.csrfToken,
                            },
                            credentials: "include",
                        }
                    );

                    if (response.ok) {
                        setLiked(false);
                        setLikeId(null);
                    } else {
                        console.error("Failed to delete like");
                    }
                }
            } catch (error) {
                console.error("Error deleting like:", error);
            }
        }
    };

    return (
        <>
            {user ? (
                <button
                    className="like-button me-2"
                    onClick={toggleLike}
                    style={{ border: "none", background: "transparent" }}
                >
                    <FontAwesomeIcon
                        icon={liked ? fasHeart : farHeart}
                        className={liked ? "heart-icon liked" : "heart-icon"}
                        size="1x"
                    />
                    <span className="ms-2 heart-count">{likeCount}</span>
                </button>
            ) : (
                <>
                    <button
                        className="like-button me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#noLikeCommentModal"
                        tabIndex="0"
                        style={{ border: "none", background: "transparent" }}
                    >
                        <FontAwesomeIcon
                            icon={liked ? fasHeart : farHeart}
                            className={
                                liked ? "heart-icon liked" : "heart-icon"
                            }
                            size="1x"
                        />
                        <span className="ms-2 heart-count">{likeCount}</span>
                    </button>

                    <div
                        className="modal fade"
                        id="noLikeCommentModal"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex="-1"
                        aria-labelledby="noLikeCommentModalLabel"
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
                                    <AlertModal message="Please signup or login to like this comment" />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default CommentLikeButton;
