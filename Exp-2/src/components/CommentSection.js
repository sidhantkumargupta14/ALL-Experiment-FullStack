import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addComment,
  deleteComment,
  startEditingComment,
  cancelEditingComment,
  updateComment,
} from "../features/comments/commentsSlice";

import "../styles/Comment.css";

function CommentSection({ postId }) {
  const dispatch = useDispatch();

  const comments = useSelector((state) =>
    state.comments.comments.filter(
      (comment) => comment.postId === postId
    )
  );

  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (author.trim() === "" || text.trim() === "") {
      alert("Please enter your name and comment.");
      return;
    }

    dispatch(
      addComment({
        postId,
        author,
        text,
      })
    );

    setAuthor("");
    setText("");
  };

  return (
    <div className="comment-section">

      <h4>Comments ({comments.length})</h4>

      <input
        type="text"
        placeholder="Your Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <textarea
        rows="3"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="comment-btn"
        onClick={handleSubmit}
      >
        Add Comment
      </button>

      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
        />
      ))}
    </div>
  );
}

function CommentItem({ comment }) {
  const dispatch = useDispatch();

  const [editText, setEditText] = useState(comment.text);

  return (
    <div className="comment-card">

      <div className="comment-avatar">
        {comment.author.charAt(0).toUpperCase()}
      </div>

      <div className="comment-content">

        <strong>{comment.author}</strong>

        <small>{comment.date}</small>

        {comment.editing ? (
          <>
            <textarea
              rows="2"
              value={editText}
              onChange={(e) =>
                setEditText(e.target.value)
              }
            />

            <div className="comment-buttons">

              <button
                className="save-btn"
                onClick={() =>
                  dispatch(
                    updateComment({
                      id: comment.id,
                      text: editText,
                    })
                  )
                }
              >
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  dispatch(
                    cancelEditingComment(comment.id)
                  )
                }
              >
                Cancel
              </button>

            </div>
          </>
        ) : (
          <>
            <p>{comment.text}</p>

            <div className="comment-buttons">

              <button
                onClick={() =>
                  dispatch(
                    startEditingComment(comment.id)
                  )
                }
              >
                ✏ Edit
              </button>

              <button
                onClick={() =>
                  dispatch(deleteComment(comment.id))
                }
              >
                🗑 Delete
              </button>

            </div>
          </>
        )}

      </div>

    </div>
  );
}

export default CommentSection;