// components/Modal.jsx
"use client";

import { useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  // Ngăn cuộn trang khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button onClick={onClose} className="modal-close-button">
          Đóng
        </button>
      </div>
    </div>
  );
};

export default Modal;