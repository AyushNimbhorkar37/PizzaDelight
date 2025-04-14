import React, { useEffect, useRef } from 'react';
import '../styles/CustomAlert.css'; 

const CustomAlert = ({ title = "Alert", message, onClose, autoCloseDelay = null }) => {
  const alertRef = useRef();

  useEffect(() => {
    function handleOutsideClick(event) {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        onClose();
      }
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (autoCloseDelay) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoCloseDelay, onClose]);

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert" ref={alertRef} role="alertdialog" aria-modal="true">
        <div className="custom-alert-header">
          <h2>{title}</h2>
        </div>
        <div className="custom-alert-body">
        <p dangerouslySetInnerHTML={{ __html: message }}></p>
        </div>
        <div className="custom-alert-footer">
          <button className="alert-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
