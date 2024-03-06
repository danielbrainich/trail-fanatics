import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ListPosts from './components/PostsList';
import Navbar from './components/Navbar';
import ShowPost from './components/PostsShow';
import Profile from "./components/ProfileShow";
import TrailsList from "./components/TrailsList";
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
            <Route path="/profiles/:userId" element={<Profile />} />
            <Route path="/social" element={<GoogleMapsLoader><ListPosts /></GoogleMapsLoader>} />
            <Route path="/posts/:postId" element={<ShowPost />} />
            <Route path="trails" element={<GoogleMapsLoader><TrailsList /></GoogleMapsLoader>} />
            <Route path="*" element={<div>Route not found</div>} />
          </Routes>
        </div>
      </ AuthProvider>
    </BrowserRouter>
  );
}

export default App;
