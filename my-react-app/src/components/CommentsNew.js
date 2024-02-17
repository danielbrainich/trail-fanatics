import { useState, useEffect } from "react";
import useCsrfToken from '../hooks/useCsrfToken';


function NewComment({ postId, setCommentSuccess, commentSuccess }) {
  const [formData, setFormData] = useState({
    content: "",

  });

  const csrfToken = useCsrfToken();
  console.log("CSRF Token:", csrfToken);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiUrl = `http://localhost:8000/content/posts/${postId}/comments/`;

    const fetchConfig = {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: 'include',
    };

    const response = await fetch(apiUrl, fetchConfig);

    if (response.ok) {
      event.target.reset();
      setFormData({
        content: "",

      });
      setCommentSuccess(!commentSuccess);
    }
  };

  const handleChangeInput = (e) => {
    const value = e.target.value;
    const inputName = e.target.name;
    setFormData({
      ...formData,
      [inputName]: value,
    });
  };

  return (
    <div className="card w-100 my-3 border-0">
      <h5 className="card-title">New Comment</h5>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Content</label>
              <textarea
                name="content"
                className="form-control"
                value={formData.content}
                onChange={handleChangeInput}
                placeholder="Write your comment here"
                rows="3"
              ></textarea>
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

export default NewComment;
