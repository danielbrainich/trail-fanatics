import { useState, useEffect } from "react";
import useCsrfToken from '../hooks/useCsrfToken';
import useAuth from '../hooks/useAuth';


function NewPosts({ setPostSuccess, postSuccess, setTagsList, tagsList}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    author: user ? user.id : null,
  });

const csrfToken = useCsrfToken();

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
        author: user ? user.id : null,
      });
      setPostSuccess(!postSuccess)
    }
  };

  const handleChangeInput = (e) => {
    const { name, options } = e.target;

    if (name === "tags") {
      const selectedTags = Array.from(options).filter(option => option.selected).map(option => option.value);
      setFormData({
        ...formData,
        [name]: selectedTags,
      });
    } else {
      setFormData({
        ...formData,
        [name]: e.target.value,
      });
    }
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setFormData(prevFormData => {
      const isTagSelected = prevFormData.tags.includes(value);

      if (isChecked && !isTagSelected) {
        return { ...prevFormData, tags: [...prevFormData.tags, value] };
      } else if (!isChecked && isTagSelected) {
        return { ...prevFormData, tags: prevFormData.tags.filter(tagId => tagId !== value) };
      } else {
        return prevFormData;
      }
    });
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
          <div className="checkbox-grid">
          {tagsList && tagsList.map((tag) => (
            <div key={tag.id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={tag.id}
                id={`tag-${tag.id}`}
                onChange={handleCheckboxChange}
                checked={formData.tags.includes(tag.id.toString())}
              />
              <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                {tag.name}
              </label>
            </div>
          ))}
        </div>
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
