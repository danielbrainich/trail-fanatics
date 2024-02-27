import { NavLink } from 'react-router-dom';

function Sidebar() {
  const activeStyle = {
    backgroundColor: 'var(--quaternary-color)',
  };

  return (
    <div className="mt-md-5 col-md-3 col-lg-2 d-md-block pe-md-5">
      <div className="position-sticky">
        <ul className="nav flex-md-column flex-sm-row sidebar-nav">
          <li className="nav-item">
            <NavLink className="nav-link" to="/social" style={({ isActive }) => isActive ? activeStyle : undefined}>
              Social
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/trails" style={({ isActive }) => isActive ? activeStyle : undefined}>
              Trails
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/about" style={({ isActive }) => isActive ? activeStyle : undefined}>
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
