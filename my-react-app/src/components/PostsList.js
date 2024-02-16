import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewPostForm from "./PostsNew";
import FilterPosts from "./PostsFilter";

function ListPosts() {
  const [posts, setPosts] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false);
  const [filterTag, setFilterTag] = useState("");
  const [tagsList, setTagsList] = useState("");

  useEffect(() => {
    const getData = async () => {
      const apiUrl = `${process.env.REACT_APP_API_HOST}/content/posts/`;
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.reverse());
      } else {
        console.error("Failed to fetch posts");
      }
    };
    getData();
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

  const deletePost = async (postId) => {
    const apiUrl = `${process.env.REACT_APP_API_HOST}/posts/${postId}`;
    const fetchConfig = {
      method: "DELETE",
    };
    const response = await fetch(apiUrl, fetchConfig);
    if (response.ok) {
      setPostSuccess(!postSuccess);
    }
  };

  const filteredPosts = filterTag
    ? posts.filter((post) => post.tags.includes(filterTag))
    : posts;

  return (
    <div className="container mt-5">
      <div className="row d-flex align-items-stretch">
        <div className="col-md-7">

          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">New Post</h5>
              <p class="card-text">Add to the conversation. </p>
              <div class="form-group">
                <div id="fakeInput" class="form-control" data-bs-toggle="modal" data-bs-target="#staticBackdrop" role="button" tabindex="0">
                  What's on your mind?
                </div>
              </div>
            </div>
          </div>

          <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <NewPostForm setPostSuccess={setPostSuccess} postSuccess={postSuccess} setTagsList={setTagsList} tagsList={tagsList} />
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="d-flex col-md-5">
        <FilterPosts onFilterChange={setFilterTag} setTagsList={setTagsList} tagsList={tagsList} />
        </div>
      </div>
      <div className="row">
      {filteredPosts.slice().reverse().map((post) => (
        <div className="col-12 mb-3" key={post.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{post.author_username}</h6>
                <p className="card-text">{post.content}</p>
                <div className="badge bg-secondary">{post.tags}</div>
                <Link to={`/posts/edit/${post.id}`} className="card-link">Edit</Link>
                <a href="#" className="card-link" onClick={() => deletePost(post.id)}>Delete</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListPosts;
