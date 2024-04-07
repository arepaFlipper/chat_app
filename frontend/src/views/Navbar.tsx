import { useContext } from 'react';
import { jwtDecode } from "jwt-decode";
import AuthContext from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa'; // Import the GitHub icon

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");

  let user_id; // Declare user_id variable

  if (token) {
    const decoded: { user_id: number } = jwtDecode(token);
    user_id = decoded.user_id; // Assign decoded user_id to user_id variable
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img style={{ width: "120px", padding: "6px" }} src="/logo.png" alt="" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              {token === null &&
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                </>
              }

              {token !== null &&
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/todo">Todo</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/inbox">Inbox</Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={logoutUser} style={{ cursor: "pointer" }}>Logout</a>
                  </li>
                </>
              }

              {/* Add the GitHub icon linked to the repository */}
              <li className="nav-item">
                <a className="nav-link" href="https://github.com/arepaflipper/chat_app">
                  <FaGithub />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;

