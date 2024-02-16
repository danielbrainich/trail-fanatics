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



useEffect(() => {
  const fetchComments = async () => {
    const apiUrl = `http://localhost:8000/content/posts/${postId}/comments/`
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      setComments(data.reverse());
    } else {
      console.error("Failed to fetch posts");
    }
  };
  fetchComments();
}, [postId, commentSuccess]);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/content/posts/${postId}/`
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

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

    const csrfToken = getCookie('csrftoken');
    console.log("CSRF Token:", csrfToken);

    const deletePost = async (postId) => {
      const apiUrl = `http://localhost:8000/content/posts/${postId}/`;
      const fetchConfig = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
      }
      const response = await fetch(apiUrl, fetchConfig);
      navigate('/social')
    };

  const deleteComment = async (commentId, postId) => {
    const apiUrl = `http://localhost:8000/content/posts/${postId}/comments/${commentId}/`;
    const fetchConfig = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: 'include',
    }

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

  return (

    <div className="container mt-5">
      <div className="col-12 mb-3" key={post.id}>
        <div className="card">
          <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title">{post.title}</h5>
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
        {comments.slice().reverse().map((comment) => (
          <div key={comment.id} className="card mb-3">
            <div className="card-body">
              <p className="card-text">{comment.content}</p>
                <div className="d-flex">
                  <a href="#" className="card-link" onClick={() => deleteComment(comment.id, postId)}>Delete</a>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowPost;
