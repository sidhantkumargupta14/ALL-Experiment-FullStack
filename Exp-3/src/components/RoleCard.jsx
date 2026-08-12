import { useNavigate } from "react-router-dom";
import { Shield, PenLine, Eye } from "lucide-react";

const icons = { Admin: Shield, Editor: PenLine, Viewer: Eye };

export default function RoleCard({ role, title, description }) {
  const navigate = useNavigate();
  const Icon = icons[role];
  return (
    <div className={`role-card ${role.toLowerCase()}`}>
      <div className={`role-icon ${role.toLowerCase()}`}><Icon size={56} /></div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button className="red-btn" onClick={() => navigate(`/login?role=${role}`)}>
        Login Now <span>→</span>
      </button>
    </div>
  );
}
