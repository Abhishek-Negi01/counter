import React from "react";

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  label,
  required = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";
  const errorClasses = error
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300";
  const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed" : "";
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1 ">{error}</p>}
    </div>
  );
};

export default Input;
