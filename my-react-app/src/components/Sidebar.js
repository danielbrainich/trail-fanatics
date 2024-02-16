
function Sidebar({ isOpen }) {
  return (
      <div className={`mt-5 col-md-3 col-lg-2 d-md-block sidebar ${isOpen ? '' : 'collapse'}`} id="sidebarMenu">
        <div className="position-sticky pt-3">
          <ul className="nav flex-column sidebar-nav">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Social
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Trails
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Races
              </a>
            </li>
          </ul>
        </div>
      </div>
  );
}

export default Sidebar;
