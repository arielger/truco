import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Alert({
  icon,
  message,
  type, // warning | error,
  className,
}) {
  const classesByType = {
    warning: "bg-orange-500",
    error: "bg-red-700",
  };
  return (
    <div
      className={`${className} ${classesByType[type]} flex items-center text-white rounded h-10 px-4 whitespace-no-wrap`}
    >
      <FontAwesomeIcon icon={icon} className="mr-3" />
      <span className="text-white font-medium text-sm">{message}</span>
    </div>
  );
}
