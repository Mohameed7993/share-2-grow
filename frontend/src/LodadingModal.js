import React from "react";
import "./LoadingModal.css";

const LoadingModal = ({ show }) => {
  if (!show) return null;

  return (
    <div className="loading-modal-overlay">
      <div className="loading-modal-container">
        <div className="loading-spinner"></div>
        <p>Creating your account...</p>
      </div>
    </div>
  );
};

export default LoadingModal;
