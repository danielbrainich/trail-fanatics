import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { jwtDecode } from "jwt-decode";
import NewCommentForm from "./NewCommentForm";

function ShowPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const { token } = useToken();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [commentSuccess, setCommentSuccess] = useState(false);



  useEffect(() => {

  const getComments = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_HOST}/posts/${postId}/comments`
    );
    if (response.ok) {
      const data = await response.json();
      setComments(data);
    }
  }; getComments();
  }, [postId, commentSuccess]);


  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/posts/${postId}`
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
    return <div>Post loading...</div>;
  }

  const deletePost = async (postId) => {
    const apiUrl = `${process.env.REACT_APP_API_HOST}/posts/${postId}`;
    const fetchConfig = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(apiUrl, fetchConfig);
      if (!response.ok) {
        throw new Error("Error deleting post");
      }
      navigate("/posts");
    } catch (error) {
      console.error("Could not delete post:", error);
    }
  };

  const deleteComment = async (commentId, postId) => {
    const apiUrl = `${process.env.REACT_APP_API_HOST}/posts/${postId}/comments/${commentId}`;
    const fetchConfig = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    const options = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleTimeString(undefined, options);
  }

  return (
    <div>
      <div className="card mt-5 px-2">
        <div className="row g-0">
          <div className={post.pic_url ? "col-sm-12 col-lg-8" : "col-12"}>
            <div className="card-body d-flex flex-column justify-content-between h-100">
              <div>
                <div className="text-muted">{post.author_username}</div>
                <div className="text-muted">{formatTime(post.created_on)}</div>
                <div className="text-muted mb-2">
                  {formatDate(post.created_on)}
                </div>
                <div className="badge bg-secondary mb-2">{post.tag}</div>
                <p className="card-text">{post.content}</p>
              </div>
              <div className="mt-2">
                <div className="d-flex justify-content-around">
                  <div className="text-muted">Like</div>
                  {decodedToken &&
                    post.author_id === decodedToken.account.id && (
                      <div
                        className="text-muted clickable"
                        onClick={() => deletePost(post.id)}
                      >
                        Delete
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
          {post.pic_url && (
            <div className="col-sm-12 col-lg-4">
              <img
                src={post.pic_url}
                className="p-4"
                alt={post.content}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          )}
        </div>
      </div>
      <NewCommentForm
        postId={postId}
        setCommentSuccess={setCommentSuccess}
        commentSuccess={commentSuccess}
      />
      <div className="comments-section">
        <h5>Comments</h5>
        {comments.map((comment) => (
          <div key={comment.id} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">
                  <div className="text-muted">{comment.author_id}</div>
                  <div className="text-muted">
                    {formatTime(comment.created_on)}
                  </div>
                  <div className="text-muted mb-2">
                    {formatDate(comment.created_on)}
                  </div>
                </span>
              </div>
              {comment.pic_url && (
                <img
                  src={comment.pic_url}
                  alt="Comment"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    marginBottom: "1rem",
                  }}
                />
              )}
              <p className="card-text">{comment.content}</p>
              {decodedToken &&
                comment.author_id === decodedToken.account.id && (
                  <div className="d-flex">
                    <div
                      className="text-muted clickable"
                      onClick={() => deleteComment(comment.id, comment.post_id)}
                    >
                      Delete
                    </div>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowPost;

// a
