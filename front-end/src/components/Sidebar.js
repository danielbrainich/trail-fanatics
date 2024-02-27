import { NavLink } from 'react-router-dom';


function Sidebar() {
  return (
    <div className="mt-md-5 col-md-3 col-lg-2 d-md-block pe-md-5">
      <div className="position-sticky">
        <ul className="nav flex-md-column flex-sm-row sidebar-nav">
          <li className="nav-item">
            <NavLink end className="nav-link" to="/social">
              Social
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink end className="nav-link" to="/trails">
              Trails
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink end className="nav-link" to="/about">
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
