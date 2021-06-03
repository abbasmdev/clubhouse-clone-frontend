import clsx from "clsx";
import React from "react";
import "./Avatar.scss";
function Avatar({ className, src, onClick }) {
  return (
    <div onClick={onClick} className={clsx("avatar", className)}>
      <img src={src} alt="" />
    </div>
  );
}

export default Avatar;
