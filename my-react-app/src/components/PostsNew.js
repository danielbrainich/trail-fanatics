import { useState, useEffect } from "react";

function NewPosts({ setPostSuccess, postSuccess, setTagsList, tagsList}) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
  });

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiUrl = `http://localhost:8000/content/posts/`;

    const fetchConfig = {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: 'include',
    };

  console.log(formData);
  console.log(JSON.stringify(formData));

    const response = await fetch(apiUrl, fetchConfig);

    if (response.ok) {
      event.target.reset();
      setFormData({
        title: "",
        content: "",
        tags: [],
      });
      setPostSuccess(!postSuccess)
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    if (name === "tags") {
      setFormData({
        ...formData,
        [name]: [value],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="card w-100 my-3 border-0">
      <h5 className="card-title">New Post</h5>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              name="title"
              type="text"
              className="form-control"
              onChange={handleChangeInput}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Content</label>
            <textarea
              name="content"
              className="form-control"
              onChange={handleChangeInput}
              rows="4"
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Tags</label>
            <select
              name="tags"
              className="form-select"
              onChange={handleChangeInput}
              value={formData.tags[0] || ''}
            >
              <option value="">Select a tag</option>
              {console.log("TAGS", tagsList)}
              {tagsList && tagsList.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-end">
            <button className="btn btn-secondary me-2" type="reset">
              Clear
            </button>
            <button className="btn btn-primary" type="submit">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPosts;
