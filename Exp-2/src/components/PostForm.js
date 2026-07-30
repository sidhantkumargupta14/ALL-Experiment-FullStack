import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../features/posts/postsSlice";
import "../styles/Post.css";

function PostForm() {

  const dispatch = useDispatch();

  const [author, setAuthor] = useState("");

  const [platform, setPlatform] = useState("LinkedIn");

  const [content, setContent] = useState("");

  const maxCharacters = 280;

  const handleSubmit = (e) => {

    e.preventDefault();

    if (
      author.trim() === "" ||
      content.trim() === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    dispatch(
      addPost({
        author,
        platform,
        content,
      })
    );

    setAuthor("");
    setPlatform("LinkedIn");
    setContent("");
  };

  return (

    <div className="post-form-card">

      <h2>Create Post</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Your Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >

          <option>LinkedIn</option>

          <option>Facebook</option>

          <option>Instagram</option>

          <option>X (Twitter)</option>

        </select>

        <textarea
          rows="6"
          placeholder="What's on your mind?"
          maxLength={maxCharacters}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="counter">

          {content.length}/{maxCharacters}

        </div>

        <button type="submit">

          Publish Post

        </button>

      </form>

    </div>

  );

}

export default PostForm;