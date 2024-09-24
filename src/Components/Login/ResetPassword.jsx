import React, { useState } from "react";
import { auth } from "../../firebase"; // Import Firebase auth
import { sendPasswordResetEmail } from "firebase/auth";

import './Login.css'

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
      setEmail("")
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="reset-container">
      <h2>Reset Password</h2>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <form onSubmit={handleResetPassword}>
        <div  className="input-place">

        <input
        className="input-place"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        />
        </div>
        <button className="send-button" type="submit">Send Reset Email</button>
      </form>
    </div>
  );
};

export default ResetPassword;
