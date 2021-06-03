import clsx from "clsx";
import React from "react";
import "./IconButton.scss";
function IconButton({ children, className, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx("iconButton", className)}
    >
      {children}
    </button>
  );
}

export default IconButton;
