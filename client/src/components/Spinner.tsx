import React from "react";
import ReactSVGSpinner from "react-svg-spinner";

export default function Spinner({ text, fullHeight }) {
  return (
    <div
      className={`flex flex-col items-center ${
        fullHeight ? "h-full justify-center" : "py-20"
      }`}
    >
      <ReactSVGSpinner color="rgba(255,255,255, 0.5)" size="32px" />
      {text && <span className="mt-3">{text}</span>}
    </div>
  );
}
