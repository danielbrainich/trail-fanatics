import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListPosts from './components/PostsList';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ShowPost from './components/PostsShow';
import HomePage from './components/HomePage';
import SignupForm from './components/Signup';
import LoginForm from './components/Login';
import LogoutButton from "./components/Logout";
import './main.css';

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <div className="d-flex flex-column flex-md-row">
          {/* <nav className="navbar navbar-expand-md d-md-none">
            Whatever is in here will show on a small screen only
          </nav> */}
          <Sidebar />
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/logout" element={<LogoutButton />} />
              <Route path="social" element={<ListPosts />} />
              <Route path="social/posts/:postId" element={<ShowPost />} />
              <Route path="*" element={<div>Route not found</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
