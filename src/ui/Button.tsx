import React, { ButtonHTMLAttributes } from "react";

const Button = ({
  children,
  style,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      style={{
        ...style,
        borderRadius: 20,
        padding: "12px 24px",
        background: "#39115b",
        color: "white",
        borderStyle: "hidden",
        fontFamily: "inherit",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};

export default Button;
