import { LogOut, LayoutDashboard, FileText, PenSquare, Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <header className={`navbar ${user?.role?.toLowerCase() || ""}`}>
      <div className="brand">
        <div className="brand-mark">{user?.role?.[0]}</div>
        <div><strong>{user?.role} Portal</strong><small>Post Management System</small></div>
      </div>
      <nav>
        <Link to="/dashboard"><LayoutDashboard size={17}/> Dashboard</Link>
        {user?.role !== "Viewer" && <Link to="/composer"><PenSquare size={17}/> Create Post</Link>}
        <Link to="/posts"><Send size={17}/> All Posts</Link>
        <Link to="/drafts"><FileText size={17}/> Drafts</Link>
      </nav>
      <div className="user-area">
        <span className={`role-pill ${user?.role?.toLowerCase()}`}>{user?.role}</span>
        <span className="user-name">{user?.name}</span>
        <button className="icon-btn" onClick={() => { dispatch(logout()); navigate("/"); }}>
          <LogOut size={18}/>
        </button>
      </div>
    </header>
  );
}
