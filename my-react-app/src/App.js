import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListPosts from './components/PostsList';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import './main.css';

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <div class="container">
        <div className="d-flex flex-column flex-md-row">
          {/* <nav className="navbar navbar-expand-md d-md-none">
            Whatever is in here will show on a small screen only
          </nav> */}
          <Sidebar />
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<ListPosts />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
