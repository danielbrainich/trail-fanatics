import { useState, useEffect } from "react";

function FilterPosts({ onFilterChange, tagsList }) {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setSelectedTags(prevSelectedTags => {
      if (isChecked) {
        return [...prevSelectedTags, value];
      } else {
        return prevSelectedTags.filter(tagId => tagId !== value);
      }
    });
  };

  useEffect(() => {
    onFilterChange(selectedTags);
  }, [selectedTags, onFilterChange]);

  return (
    <div className="card w-100 mb-4">
      <div className="card-body">
        <h5 className="card-title">Filter Posts</h5>
        <div>
          <label className="form-label mb-3">
            Filter by Tag
          </label>
          {tagsList && tagsList.map((tag) => (
            <div key={tag.id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`tag-${tag.id}`}
                value={tag.id}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={`tag-${tag.id}`} className="form-check-label">
                {tag.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterPosts;
