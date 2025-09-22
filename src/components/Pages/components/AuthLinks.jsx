import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const AuthLinks = () => {
  const { isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <>
        <Link className="btn btn-outline" to="/profile">
          Profile
        </Link>
        <button
          className="btn btn-outline"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </>
    );
  }

  // Not authenticated: hide Login on /login, hide Sign Up on /signup
  return (
    <>
      {pathname !== "/login" && (
        <Link className="btn btn-outline" to="/login">
          Login
        </Link>
      )}
      {pathname !== "/signup" && (
        <Link className="btn btn-outline" to="/signup">
          Sign Up
        </Link>
      )}
    </>
  );
};

export default AuthLinks;
