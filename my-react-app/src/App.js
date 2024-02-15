import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewPosts from "./components/PostsNew";
import ListPosts from './components/PostsList';

function App() {
  return (
    <BrowserRouter>
      <ListPosts />
    </BrowserRouter>
  );
}

export default App;
