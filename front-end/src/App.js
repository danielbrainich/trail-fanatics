import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import ListPosts from './components/PostsList';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ShowPost from './components/PostsShow';
import SignupForm from './components/Signup';
import LoginForm from './components/Login';
import Profile from "./components/ProfileShow";
import TrailsList from "./components/TrailsList";
import About from "./components/About";
import GoogleMapsLoader from "./components/GoogleMapsLoader";
import NewTrails from "./components/TrailsNew";

import './main.css';

function App() {


  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="container">
          <div className="d-flex flex-column flex-md-row">
            {/* <nav className="navbar navbar-expand-md d-md-none">
              Whatever is in here will show on a small screen only
            </nav> */}
            <Sidebar />
            <div className="flex-grow-1">
              <Routes>
                <Route path="/" element={<ListPosts />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/profiles/:userId" element={<Profile />} />
                <Route path="social" element={<ListPosts />} />
                <Route path="social/posts/:postId" element={<ShowPost />} />
                <Route path="trails" element={<GoogleMapsLoader><TrailsList /></GoogleMapsLoader>} />
                <Route path="about" element={<About />} />
                <Route path="new-trails" element={<GoogleMapsLoader><NewTrails /></GoogleMapsLoader>} />
                <Route path="*" element={<div>Route not found</div>} />
              </Routes>
            </div>
          </div>
        </div>
      </ AuthProvider>
    </BrowserRouter>
  );
}

export default App;
