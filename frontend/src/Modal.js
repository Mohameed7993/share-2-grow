import React from "react";
import "./CustomModal.css"; // Import your custom styles

export default function CustomModal({ show, onClose, title, children }) {
  if (!show) return null; // Don't render the modal if `show` is false

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div
        className="custom-modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="custom-modal-header">
          <h4>{title}</h4>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="custom-modal-body">{children}</div>
        <div className="custom-modal-footer">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
