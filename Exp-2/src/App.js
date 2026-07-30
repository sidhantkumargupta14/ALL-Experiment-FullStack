import "./App.css";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import SearchBar from "./components/SearchBar";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";

function App() {
  return (
    <div className="App">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <div className="container">
        {/* Analytics Dashboard */}
        <Dashboard />

        {/* Search Posts */}
        <SearchBar />

        {/* Create New Post */}
        <PostForm />

        {/* Display All Posts */}
        <PostList />
      </div>
    </div>
  );
}

export default App;