import clsx from "clsx";
import React, { useEffect, useState } from "react";

import "./PhoneInput.scss";
function PhoneInput({ className, onValChange }) {
  const [ccode, setCcode] = useState("+98");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    onValChange({ ccode, phone });
  }, [phone, ccode]);
  return (
    <div className={clsx("phoneInput", className)}>
      <select
        className="phoneInput__ccode"
        value={ccode}
        onChange={(e) => setCcode(e.target.value)}
      >
        <option value="+98">Iran(+98)</option>
      </select>
      <input
        maxLength={"10"}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="phoneInput__phone"
        type="phone"
        placeholder="Enter your phone"
      />
    </div>
  );
}

export default PhoneInput;
