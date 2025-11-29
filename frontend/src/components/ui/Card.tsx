import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = ({ className = "", ...props }: CardProps) => {
  return (
    <div
      {...props}
      className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}
    />
  );
};

export default Card;
