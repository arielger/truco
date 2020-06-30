import React from "react";
import Spinner from "react-svg-spinner";

// @TODO: Add types, loading state (for now its only the CTA style)

type Props = {
  styleType?: "default" | "primary";
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  children: string;
  [x: string]: any; // Type rest of params (spread params)
};

export default function Button({
  styleType = "default",
  className,
  isLoading = false,
  disabled = false,
  children,
  ...props
}: Props) {
  const classesByType = (isLoading: boolean, disabled: boolean) =>
    styleType === "primary"
      ? `${
          isLoading
            ? "bg-blue-400"
            : disabled
            ? "bg-gray-500"
            : "bg-blue-500 hover:bg-blue-400 focus:bg-blue-400"
        } text-white`
      : styleType === "default"
      ? "border bg-white border-gray-300 text-gray-700 shadow-sm hover:text-gray-500"
      : "";

  return (
    <button
      className={`
        flex justify-center items-center h-12 rounded text-lg w-full font-medium focus:outline-none transition-colors duration-200
        ${classesByType(isLoading, disabled)}
        ${isLoading ? "cursor-default pointer-events-none" : ""}
        ${disabled ? "cursor-not-allowed" : ""}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {isLoading && (
        <div className="mr-2">
          <Spinner thickness={2} color="currentColor" speed="slow" />
        </div>
      )}
      {children}
    </button>
  );
}
