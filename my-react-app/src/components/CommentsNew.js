import { useState, useEffect } from "react";
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";
import { jwtDecode } from "jwt-decode";

function NewCommentForm({ postId, setCommentSuccess, commentSuccess }) {
  const { token } = useAuthContext();
  const [formData, setFormData] = useState({
    content: "",
    pic_url: "",
  });

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("current user id", decodedToken.account.id);
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiUrl = `${process.env.REACT_APP_API_HOST}/posts/${postId}/comments`;

    const fetchConfig = {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(apiUrl, fetchConfig);

    if (response.ok) {
      event.target.reset();
      setFormData({
        content: "",
        pic_url: "",
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
    <div className="card w-100 my-3">
      <div className="card-body">
        <h5>Add a Comment</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              name="content"
              className="form-control"
              value={formData.content}
              onChange={handleChangeInput}
              placeholder="Write your comment here"
              rows="3"
            ></textarea>
          </div>
          <div className="mb-3">
            <input
              name="pic_url"
              type="text"
              className="form-control"
              value={formData.pic_url}
              onChange={handleChangeInput}
              placeholder="Image URL (optional)"
            />
          </div>
          <div className="text-end">
            <button className="btn btn-primary" type="submit">
              Submit Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewCommentForm;
