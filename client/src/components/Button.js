import React from "react";

// @TODO: Add types, loading state (for now its only the CTA style)

export default function Button({
  styleType = "default", // default | primary
  className,
  ...props
}) {
  const classesByType =
    styleType === "primary"
      ? "bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white"
      : styleType === "default"
      ? "border bg-white border-gray-300 text-gray-700 shadow-sm hover:text-gray-500"
      : "";

  return (
    <button
      className={`h-12 rounded text-lg w-full font-medium focus:outline-none ${classesByType} ${className}`}
      {...props}
    />
  );
}
