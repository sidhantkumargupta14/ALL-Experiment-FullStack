import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FileText, Send, ShieldCheck, Users } from "lucide-react";
import Navbar from "./Navbar";
import { fetchDrafts } from "../features/drafts/draftsSlice";
import { fetchPosts } from "../features/posts/postsSlice";
import { selectDraftCount, selectPostCount, selectPlatformStats } from "../features/selectors";

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const draftCount = useSelector(selectDraftCount);
  const postCount = useSelector(selectPostCount);
  const platformStats = useSelector(selectPlatformStats);

  useEffect(() => {
    dispatch(fetchDrafts());
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <main className="page">
        <section className="hero">
          <div>
            <span className="eyebrow">WELCOME BACK</span>
            <h1>{user?.name}</h1>
            <p>You are logged in as <strong>{user?.role}</strong>. Manage posts, drafts and platform content from one place.</p>
          </div>
          {user?.role !== "Viewer" && <Link className="red-btn" to="/composer">Create Post</Link>}
        </section>

        <section className="stats-grid">
          <div className="stat-card"><FileText/><span>Drafts</span><strong>{draftCount}</strong></div>
          <div className="stat-card"><Send/><span>Published Posts</span><strong>{postCount}</strong></div>
          <div className="stat-card"><ShieldCheck/><span>Your Role</span><strong>{user?.role}</strong></div>
          <div className="stat-card"><Users/><span>Platforms Used</span><strong>{Object.keys(platformStats).length}</strong></div>
        </section>

        <section className="panel">
          <h2>Access Summary</h2>
          <div className="permission-grid">
            <div><b>Admin</b><span>Full CRUD, publishing, delete posts and manage all drafts.</span></div>
            <div><b>Editor</b><span>Create, edit, delete own drafts and publish posts.</span></div>
            <div><b>Viewer</b><span>Read-only access to dashboard, drafts and published posts.</span></div>
          </div>
        </section>
      </main>
    </>
  );
}
