import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="mt-md-5 col-md-3 col-lg-2 d-md-block">
      <div className="position-sticky">
      <ul className="nav flex-md-column flex-sm-row sidebar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/social">
              Social
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/trails">
              Trails
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">
              About
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
