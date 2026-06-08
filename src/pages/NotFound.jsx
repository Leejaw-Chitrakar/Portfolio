import React from "react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="container section fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        textAlign: "center",
        gap: "1.5rem",
      }}
    >
      <h1 className="gradient-text" style={{ fontSize: "6rem", lineHeight: 1, margin: 0 }}>
        404
      </h1>
      <p style={{ fontSize: "1.25rem", opacity: 0.75 }}>
        Oops! Page not found.
      </p>
      <NavLink to="/" className="btn btn-primary">
        Go Home
      </NavLink>
    </div>
  );
};

export default NotFound;
