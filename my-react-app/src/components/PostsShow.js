import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NewComment from "./CommentsNew";
import { Link } from "react-router-dom";


function ShowPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [commentSuccess, setCommentSuccess] = useState(false);



  // useEffect(() => {
  // const fetchComments = async () => {
  //   const response = await fetch(
  //     `localhost:8000/content/posts/${postId}/comments/`
  //   );
  //   if (response.ok) {
  //     const data = await response.json();
  //     setComments(data);
  //   }
  // }; fetchComments();
  // }, [postId, commentSuccess]);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/content/posts/${postId}`
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
    const apiUrl = `localhost:8000/content/posts/${postId}`;
    const fetchConfig = {
      method: "DELETE",
      headers: {

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
    const apiUrl = `localhost:8000/content/posts/${postId}/comments/${commentId}`;
    const fetchConfig = {
      method: "DELETE",
      headers: {

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

    <div className="container mt-5">
      <div className="col-12 mb-3" key={post.id}>
        <div className="card">
          <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title">{post.title}</h5>
            <h6 className="card-subtitle text-muted small">{formatDate(post.created_at)}</h6>
          </div>
            <h6 className="card-subtitle mb-2 text-muted">{post.author_username}</h6>
            <p className="card-text">{post.content}</p>
            <div>
              <div className="badge bg-secondary me-3">{post.tags}</div>
              <Link to={`#`} className="card-link">Edit</Link>
              <a href="#" className="card-link" onClick={() => deletePost(post.id)}>Delete</a>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">New Comment</h5>
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
              <NewComment postId={postId} setCommentSuccess={setCommentSuccess}commentSuccess={commentSuccess}/>
            </div>
          </div>
        </div>
      </div>




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
                <div className="d-flex">
                  <div
                    className="text-muted clickable"
                    onClick={() => deleteComment(comment.id, comment.post_id)}
                  >
                    Delete
                  </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowPost;
