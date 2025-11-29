import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "danger";
}

const Button = ({ variant = "default", className = "", ...props }: ButtonProps) => {
  const variants = {
    default: "bg-black text-white hover:bg-black/80",
    outline: "border border-gray-300 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium transition ${variants[variant]} ${className}`}
    />
  );
};

export default Button;
