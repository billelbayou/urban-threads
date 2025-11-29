import React from "react";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = ({ className = "", ...props }: CardContentProps) => {
  return (
    <div
      {...props}
      className={`p-6 ${className}`}
    />
  );
};

export default CardContent;
