import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NewComment from "./CommentsNew";
import PostLikeButton from "./PostLikeButton";
import { Link } from "react-router-dom";
import useCsrfToken from '../hooks/useCsrfToken';
import CommentLikeButton from "./CommentLikeButton";
import AlertModal from './AlertModal';
import { useAuthContext } from "../contexts/AuthContext";
import MapComponent from './MapComponent';


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
  console.log("CSRF Token:", csrfToken);


  useEffect(() => {
    const fetchTags = async () => {
      const apiUrl = `http://localhost:8000/content/tags/`;
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
    const apiUrl = `http://localhost:8000/content/posts/${postId}/comments/?page=${currentPage}`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      setComments(data.results.reverse());
      setTotalComments(data.count);
    } else {
      console.error("Failed to fetch comments");
    }
  };
  fetchComments();
}, [postId, commentSuccess, currentPage]);


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


    const deletePost = async (postId) => {
      const apiUrl = `http://localhost:8000/content/posts/${postId}/`;
      const fetchConfig = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken.csrfToken,
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
        "X-CSRFToken": csrfToken.csrfToken,
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }


  function renderPagination() {
    const backendDefinedPageSize = 10;
    const totalPages = Math.ceil(totalComments / backendDefinedPageSize);

    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
        </li>
      );
    }

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item">
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          </li>
          {pages}
          <li className="page-item">
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <div className="container mt-3 mt-md-5">
      <div className="col-12 mb-3" key={post.id}>

      <div className="card">
        <div className="card-body">
          <div>
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column align-items-between justify-content-between">
                <div>
                  <h6 className="card-subtitle text-muted small mb-3">{formatDate(post.created_at)}</h6>
                    <div className="mb-2">
                      {tagsList && post.tags && tagsList.length > 0 && post.tags.map(tagId => {
                        const tagObj = tagsList.find(tag => tag.id === tagId);
                        return (
                          <div key={tagId} className="badge mb-2 me-2">
                            {tagObj ? tagObj.name : 'Unknown Tag'}
                          </div>
                        );
                      })}
                    </div>
                    <Link to={`/profiles/${post.author_id}`}><h6 className="card-subtitle mb-3 text-muted">{post.author_username}</h6></Link>
                    <p className="card-text">{post.content}</p>
                  </div>
                  <div className="d-flex">
                    <PostLikeButton postId={post.id} />
                    <Link to={`#`} className="card-link">Edit</Link>
                    {user && user.id === post.author ? (
                      <a href="#" className="card-link" onClick={() => deletePost(post.id)}>Delete</a>
                      ) : (
                      <>
                        <a id="fakeInput" className="ms-3" data-bs-toggle="modal" data-bs-target="#nodeletemodal" role="button" tabIndex="0">
                          Delete
                        </a>
                        <div className="modal fade" id="nodeletemodal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="nodeletemodalLabel" aria-hidden="true">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                {post.trail && post.trail.name && (
                <div>
                  <MapComponent trail={post.trail} />
                </div>
                )}
              </div>
              </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 card-solid">
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
              { user ? (
                <NewComment postId={postId} setCommentSuccess={setCommentSuccess}commentSuccess={commentSuccess}/>
              ) : (
                <AlertModal message="Please signup or login to comment on this post" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="comments-section">
        <h5>Comments</h5>
        {comments.slice().reverse().map((comment) => (
          <div key={comment.id} className="card mb-3">
            <div className="card-body">
              <h6 className="card-subtitle text-muted small mb-3">{formatDate(comment.created_at)}</h6>
              <Link to={`/profiles/${comment.author_id}`}><h6 className="card-subtitle mb-3 text-muted">{comment.author_username}</h6></Link>
              <p className="card-text">{comment.content}</p>
                <div className="d-flex">
                  <CommentLikeButton postId={comment.post_id} commentId={comment.id} />
                  {user && user.id === comment.author ? (
                    <a href="#" className="card-link" onClick={() => deleteComment(comment.id, postId)}>Delete</a>
                    ) : (
                    <>
                      <a id="fakeInput" className="ms-3" data-bs-toggle="modal" data-bs-target="#nodeletecommentmodal" role="button" tabIndex="0">
                        Delete
                      </a>
                      <div className="modal fade" id="nodeletecommentmodal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="nodeletecommentmodalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                              <AlertModal title="Hello!" message="To delete a comment, make sure you are logged-in and the comment belongs to you" />
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
      {renderPagination()}
    </div>
  );
}

export default ShowPost;
