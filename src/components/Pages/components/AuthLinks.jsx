import React from "react";
import { Link } from "react-router-dom";

const AuthLinks = () => {
  return (
    <>
      <Link className="btn btn-outline" to="/login">
        Login
      </Link>
      <Link className="btn btn-outline" to="/signup">
        Sign Up
      </Link>
    </>
  );
};

export default AuthLinks;
