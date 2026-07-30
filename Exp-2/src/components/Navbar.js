import "../styles/Navbar.css";

function Navbar() {

  return (

    <nav className="navbar">

      <div className="logo">

        Posting Platform

      </div>

      <ul className="menu">

        <li>🏠 Home</li>

        <li>📰 Feed</li>

        <li>🔍 Explore</li>

        <li>🔔 Notifications</li>

        <li>💬 Messages</li>

      </ul>

      <div className="profile">

        👤

      </div>

    </nav>

  );

}

export default Navbar;
