import clsx from "clsx";
import React from "react";
import "./BlankPaper.scss";
function BlankPaper({ className, children }) {
  return <div className={clsx("blankPaper", className)}>{children}</div>;
}

export default BlankPaper;
