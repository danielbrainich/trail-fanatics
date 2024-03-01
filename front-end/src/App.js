import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import ListPosts from './components/PostsList';
import Navbar from './components/Navbar';
import ShowPost from './components/PostsShow';
import SignupForm from './components/Signup';
import LoginForm from './components/Login';
import Profile from "./components/ProfileShow";
import TrailsList from "./components/TrailsList";
import About from "./components/About";
import GoogleMapsLoader from "./components/GoogleMapsLoader";
import './main.css';

function App() {


  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<GoogleMapsLoader><ListPosts /></GoogleMapsLoader>} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/profiles/:userId" element={<Profile />} />
            <Route path="/social" element={<GoogleMapsLoader><ListPosts /></GoogleMapsLoader>} />
            <Route path="social/posts/:postId" element={<ShowPost />} />
            <Route path="trails" element={<GoogleMapsLoader><TrailsList /></GoogleMapsLoader>} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<div>Route not found</div>} />
          </Routes>
        </div>
      </ AuthProvider>
    </BrowserRouter>
  );
}

export default App;
