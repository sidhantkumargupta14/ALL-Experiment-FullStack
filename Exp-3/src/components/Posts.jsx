import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import { fetchPosts, updatePost, deletePost } from "../features/posts/postsSlice";
import { selectPosts } from "../features/selectors";

const LIMITS = { Facebook:63206, Instagram:2200, LinkedIn:3000, X:280 };

export default function Posts() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const posts = useSelector(selectPosts);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => { dispatch(fetchPosts()); }, [dispatch]);

  async function saveEdit(e, post) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = form.get("title");
    const content = form.get("content");
    const platforms = form.getAll("platforms");
    if (!platforms.length) return setMessage("Select at least one platform.");
    const limit = Math.min(...platforms.map(x => LIMITS[x]));
    if (content.length > limit) return setMessage(`Content exceeds ${limit} characters.`);
    const result = await dispatch(updatePost({ id:post.id, title, content, platforms }));
    if (updatePost.fulfilled.match(result)) { setEditingId(null); setMessage("Post updated successfully."); }
    else setMessage(result.payload || "Could not update post.");
  }

  async function remove(id) {
    if (!window.confirm("Delete this post?")) return;
    const result = await dispatch(deletePost(id));
    setMessage(deletePost.fulfilled.match(result) ? "Post deleted successfully." : result.payload);
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="section-head page-title">
          <div><span className="eyebrow">PUBLISHED CONTENT</span><h1>All Published Posts</h1></div>
          <span className="count-badge">{posts.length} posts</span>
        </div>
        {message && <div className="success-box">{message}</div>}
        <div className="draft-grid">
          {posts.map(post => (
            <article className="draft-card" key={post.id}>
              {editingId === post.id ? (
                <form onSubmit={e => saveEdit(e, post)}>
                  <label>Post Title</label><input name="title" defaultValue={post.title} />
                  <label>Content</label><textarea name="content" defaultValue={post.content} rows="7" />
                  <label>Platforms</label>
                  <div className="checkbox-platforms">
                    {Object.keys(LIMITS).map(platform => (
                      <label className="check-item" key={platform}>
                        <input type="checkbox" name="platforms" value={platform} defaultChecked={post.platforms.includes(platform)} />
                        {platform}
                      </label>
                    ))}
                  </div>
                  <div className="actions">
                    <button className="red-btn">Save Changes</button>
                    <button type="button" className="secondary-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="draft-top"><h3>{post.title}</h3><span className="published">PUBLISHED</span></div>
                  <p>{post.content}</p>
                  <div className="tag-row">{post.platforms.map(x => <span key={x}>{x}</span>)}</div>
                  <small>Created by: <strong>{post.authorRole || "User"}</strong> • {new Date(post.createdAt).toLocaleString()}</small>
                  <div className="actions">
                    {(user?.role === "Admin" || user?.role === "Editor") && <button className="secondary-btn" onClick={() => setEditingId(post.id)}>Edit</button>}
                    {user?.role === "Admin" && <button className="danger-btn" onClick={() => remove(post.id)}>Delete</button>}
                  </div>
                  <div className="permission-note">
                    {user?.role === "Admin" && "Admin: Edit or delete any post."}
                    {user?.role === "Editor" && "Editor: Edit any post, but cannot delete posts."}
                    {user?.role === "Viewer" && "Viewer: View only."}
                  </div>
                </>
              )}
            </article>
          ))}
          {!posts.length && <div className="empty panel">No published posts yet.</div>}
        </div>
      </main>
    </>
  );
}
