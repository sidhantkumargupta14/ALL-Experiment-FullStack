import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../features/auth/authSlice";

const credentials = { Admin:["admin","admin123"], Editor:["editor","editor123"], Viewer:["viewer","viewer123"] };

export default function LoginPage() {
  const [params] = useSearchParams();
  const selectedRole = credentials[params.get("role")] ? params.get("role") : "Admin";
  const [username, setUsername] = useState(credentials[selectedRole][0]);
  const [password, setPassword] = useState(credentials[selectedRole][1]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  useEffect(() => {
    setUsername(credentials[selectedRole][0]);
    setPassword(credentials[selectedRole][1]);
  }, [selectedRole]);

  async function submit(e) {
    e.preventDefault();
    const result = await dispatch(login({ username, password }));
    if (login.fulfilled.match(result)) navigate("/dashboard");
  }

  return (
    <div className="auth-page">
      <form className="login-box" onSubmit={submit}>
        <div className={`login-icon ${selectedRole.toLowerCase()}`}>{selectedRole[0]}</div>
        <span className="eyebrow">{selectedRole.toUpperCase()} ACCESS</span>
        <h1>{selectedRole} Login</h1>
        <p>Sign in to access your role-based Post Management System.</p>
        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="error-box">{error}</div>}
        <button className="red-btn full" disabled={loading}>{loading ? "Logging in..." : "Login Now"}</button>
        <button type="button" className="link-btn" onClick={() => navigate("/")}>← Back to roles</button>
      </form>
    </div>
  );
}
