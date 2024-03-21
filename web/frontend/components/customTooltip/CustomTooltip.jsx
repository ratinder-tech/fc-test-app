import React, { useState } from "react";
import "./style.css"; // Include your CSS file for styling

export const CustomTooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return (
    <div
      className="custom-tooltip"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && text && <div className="tooltip-text">{text}</div>}
    </div>
  );
};
