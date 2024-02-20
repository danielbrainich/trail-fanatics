import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewPostForm from "./PostsNew";
import FilterPosts from "./PostsFilter";
import LikeButton from "./PostLikeButton";
import useCsrfToken from '../hooks/useCsrfToken';


function ListPosts() {
  const [posts, setPosts] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false);
  const [tagsList, setTagsList] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);


  useEffect(() => {
    const fetchPosts = async () => {
      const apiUrl = `http://localhost:8000/content/posts/`;
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.reverse());
      } else {
        console.error("Failed to fetch posts");
      }
    };
    fetchPosts();
  }, [postSuccess]);

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
      timeZone: 'UTC',
    }).format(date);
  }

  const csrfToken = useCsrfToken();
  console.log("CSRF Token:", csrfToken);

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

  return (
    <div className="container mt-5">
      {console.log(posts)}
      <div className="row d-flex align-items-stretch">
        <div className="col-md-7 d-flex flex-fill">
          <div className="card w-100 mb-4">
            <div className="card-body">
              <h5 className="card-title">New Post</h5>
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
                <NewPostForm setPostSuccess={setPostSuccess} postSuccess={postSuccess} setTagsList={setTagsList} tagsList={tagsList} />
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
                <div className="d-flex justify-content-between align-items-center">
                  <Link to={`/profiles/${post.author_id}`}><h6 className="card-subtitle mb-2 text-muted">{post.author_username}</h6></Link>
                  <h6 className="card-subtitle text-muted small">{formatDate(post.created_at)}</h6>
                </div>
              <h5 className="card-title">{post.title}</h5>
              <p className="card-text">{post.content}</p>
                <div>
                  <div>
                    {post.tags.map(tagId => {
                        const tagObj = tagsList.find(tag => tag.id === tagId);
                        return (
                            <div key={tagId} className="badge bg-secondary mb-2 me-2">
                                {tagObj ? tagObj.name : 'Unknown Tag'}
                            </div>
                        );
                    })}
                  </div>
                  <LikeButton postId={post.id} />
                  <Link to={`/social/posts/${post.id}`} className="card-link">Comment</Link>
                  <Link to={`#`} className="card-link">Edit</Link>
                  <a href="#" className="card-link" onClick={() => deletePost(post.id)}>Delete</a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListPosts;
