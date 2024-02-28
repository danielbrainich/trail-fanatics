import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewPostForm from "./PostsNew";
import FilterPosts from "./PostsFilter";
import PostLikeButton from "./PostLikeButton";
import useCsrfToken from '../hooks/useCsrfToken';
import AlertModal from './AlertModal';
import { useAuthContext } from "../contexts/AuthContext";
import MapComponent from './MapComponent';


function ListPosts() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [postSuccess, setPostSuccess] = useState(false);
  const [tagsList, setTagsList] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { user } = useAuthContext();
  const csrfToken = useCsrfToken();
  const [trailSuccess, setTrailSuccess] = useState(false);
  const [savedTrails, setSavedTrails] = useState([]);



  useEffect(() => {
    const fetchPosts = async () => {
      const apiUrl = `http://localhost:8000/content/posts/?page=${currentPage}`;
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.results.reverse());
        setTotalPages(data.totalPages);
      } else {
        console.error("Failed to fetch posts");
      }
    };
    fetchPosts();
  }, [currentPage, postSuccess]);

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
    if (response.ok) {
      setPostSuccess(!postSuccess);
    }
  };

  const handleFilterChange = (selectedTagIds) => {
    setSelectedTags(selectedTagIds);
  };

  useEffect(() => {
    const applyFilter = () => {
      if (selectedTags.length > 0) {
        const newFilteredPosts = posts.filter(post =>
          post.tags.some(tag => selectedTags.includes(tag.toString()))
        );
        setFilteredPosts(newFilteredPosts);
      } else {
        setFilteredPosts(posts);
      }
    };

    applyFilter();
  }, [selectedTags, posts]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  function renderPagination() {
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
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>Next</button>
          </li>
        </ul>
      </nav>
    );
  }

  const handleSaveTrail = async (trailId) => {
    try {
      const response = await fetch(`http://localhost:8000/trails/saved_trails/${trailId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken.csrfToken,
        },
        credentials: 'include',
      });
      if (response.ok) {
        console.log('Trail saved successfully');
        await fetchSavedTrails();
        setTrailSuccess(!trailSuccess);

      } else {
        console.error('Failed to save trail');
      }
    } catch (error) {
      console.error('Error saving trail:', error);
    }
  };

  const fetchSavedTrails = async () => {
    try {
      const response = await fetch('http://localhost:8000/activities/saved_trails/', { credentials: 'include' });
      if (!response.ok) {
        console.error(`Fetch error: ${response.status} ${response.statusText}`);
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      setSavedTrails(data.results);
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  return (
    <div className="container mt-3 mt-md-5">

      <div className="row d-flex align-items-stretch">
        <div className="col-md-7 d-flex flex-fill">
          <div className="card w-100 mb-4 card-solid">
            <div className="card-body">
              <h5 className="card-title">New Post</h5>
              <p className="card-text">Add to the conversation. </p>
              <div className="form-group">
                <div id="fakeInput" className="form-control" data-bs-toggle="modal" data-bs-target="#newpostmodal" role="button" tabIndex="0">
                  What's on your mind?
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="newpostmodal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="newpostmodalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                {user ? (
                  <NewPostForm setPostSuccess={setPostSuccess} postSuccess={postSuccess} setTagsList={setTagsList} tagsList={tagsList} />
                  ) : (
                  <AlertModal title="Hello!" message="Please signup or login to post a new post" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex col-md-5">
          <FilterPosts onFilterChange={handleFilterChange} tagsList={tagsList} />
        </div>
      </div>


      <div className="row">
        {filteredPosts.slice().reverse().map((post) => (
          <div className="col-12 mb-3" key={post.id}>

            <div className="card">
              <div className="card-body">
                <div>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex flex-column align-items-between justify-content-between">
                      <div>
                        <h6 className="card-subtitle text-muted small mb-3">{formatDate(post.created_at)}</h6>
                        <div className="mb-2">
                          {tagsList && post && post.tags && tagsList.length > 0 && post.tags.map(tagId => {
                            const tagObj = tagsList.find(tag => tag.id === tagId);
                              return (
                                <div key={tagId} className="badge mb-2 me-2">
                                    {tagObj ? tagObj.name : 'Unknown Tag'}
                                </div>
                              );
                          })}
                        </div>
                        <Link to={`/profiles/${post.author_id}`}><h6 className="card-subtitle mb-3 text-muted">{post.author_username}</h6></Link>
                        <p className="card-text mb-3">{post.content}</p>
                      </div>
                        <div className="d-flex">
                          <PostLikeButton postId={post.id} />
                          <Link to={`/social/posts/${post.id}`} className="card-link">Comments</Link>
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
                                      <AlertModal title="Hello!" message="To delete a post, make sure you are logged-in and the post belongs to you" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          </div>
                        </div>
                      <div>
                      {post.trail && post.trail.name && (
                        <MapComponent trail={post.trail} />
                        )}
                        <Link to={`/trails/${post.trail.id}`}>Trail Details</Link>
                        <button className="btn btn-primary" onClick={() => handleSaveTrail(post.trail.id)}>Save Trail</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    {renderPagination()}
    </div>
  );
}

export default ListPosts;
