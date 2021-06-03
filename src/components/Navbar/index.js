import clsx from "clsx";
import React from "react";
import "./Navbar.scss";

function Navbar({ className, children }) {
  return <div className={clsx("navbar", className)}>{children}</div>;
}

export default Navbar;
