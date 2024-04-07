import React from "react";

function PopupModal({ message, onClose }) {
  return (
    <div className="popup-modal">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default PopupModal;