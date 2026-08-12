import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifySession } from "./features/auth/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import PostComposer from "./components/PostComposer";
import Drafts from "./components/Drafts";
import Posts from "./components/Posts";
import RoleCard from "./components/RoleCard";

function RoleSelection() {
  return (
    <div className="landing">
      <section className="role-section">
        <div className="landing-title">
          <span className="eyebrow">ROLE-BASED ACCESS</span>
          <h1>Welcome</h1>
          <p>Please select your role to login</p>
        </div>
        <div className="role-grid">
          <RoleCard role="Admin" title="Admin Login"
            description="Create, edit and delete all posts. Manage posts created by Editors." />
          <RoleCard role="Editor" title="Editor Login"
            description="Create and edit posts, including Admin posts. Cannot delete posts." />
          <RoleCard role="Viewer" title="Viewer Login"
            description="View all published posts. Editing and deleting are not allowed." />
        </div>
        <section className="rules-panel">
          <h2>Permission Rules</h2>
          <div className="rules-grid">
            <div><strong>Admin</strong><p>Create, edit and delete every post.</p></div>
            <div><strong>Editor</strong><p>Create and edit every post, but cannot delete.</p></div>
            <div><strong>Viewer</strong><p>View published posts only.</p></div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("token")) dispatch(verifySession());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/posts" element={<Posts />} />
      </Route>
      <Route element={<ProtectedRoute roles={["Admin", "Editor"]} />}>
        <Route path="/composer" element={<><Navbar /><main className="page"><PostComposer /></main></>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
