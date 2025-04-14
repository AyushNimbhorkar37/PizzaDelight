import React from "react";
import "../styles/ConfirmationAlert.css";

const ConfirmationAlert = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert">
        <div className="custom-alert-header">
          <h2>Confirmation</h2>
        </div>
        <div className="custom-alert-body">
          <p>{message}</p>
        </div>
        <div className="custom-alert-footer">
          <button className="alert-confirm-btn" onClick={onConfirm}>
            Yes
          </button>
          <button className="alert-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationAlert;
