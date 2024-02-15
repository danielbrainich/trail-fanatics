function FilterPosts({ onFilterChange, tagsList }) {
  return (
    <div className="card w-100 my-3">
      <div className="card-body">
        <h5 className="card-title">Filter Posts</h5>
        <div className="mb-3">
          <label htmlFor="tagFilter" className="form-label">
            Filter by Tag
          </label>
          <select
            id="tagFilter"
            className="form-select"
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option value="">All Tags</option>
            {tagsList.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterPosts;
