import React, { useState, useRef } from "react";
import "./Login.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const { login, currentUser } = useAuth();
  const navigate = useNavigate(); // Initialize navigate
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
  
      await login(email, password);
     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      console.log(currentUser)

      switch (currentUser.role) {
        case 10:
          navigate("/master-dashboard"); // Redirect to admin dashboard
          break;
        case 5:
          navigate("/BusinessOwner-dashboard"); // Redirect to business owner dashboard
          break;
        case 1:
          navigate("/Customer-dashboard"); // Redirect to user dashboard
          break;
        default:
          throw new Error("Unknown role.");
      }
    }
     catch (err) {
      setError("Failed to log in. Please check your credentials.");
      console.error(err);
    }
  };



  return (
    <div className="Box">
      <div className="content-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            id="email"
            placeholder="Enter your email"
            ref={emailRef}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            ref={passwordRef}
            required
          />
          <button className="loginbutton" type="submit">
            Login
          </button>
        </form>
        {error && <p className="error-message">{error}</p>} 
      </div>
    </div>
  );
}
